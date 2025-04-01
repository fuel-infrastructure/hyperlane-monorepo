import { ethers } from 'ethers';
import { Provider as FuelProvider, WalletLocked, WalletUnlocked } from 'fuels';
import { Logger } from 'pino';

import {
  Address,
  HexString,
  ProtocolMap,
  ProtocolType,
  objFilter,
  objMap,
  pick,
  rootLogger,
} from '@hyperlane-xyz/utils';

import { multiProtocolTestChainMetadata } from '../consts/testChains.js';
import { ChainMetadataManager } from '../metadata/ChainMetadataManager.js';
import type { ChainMetadata } from '../metadata/chainMetadataTypes.js';
import type { ChainMap, ChainName, ChainNameOrId } from '../types.js';

import { MultiProvider, MultiProviderOptions } from './MultiProvider.js';
import {
  CosmJsProvider,
  CosmJsWasmProvider,
  EthersV5Provider,
  FuelsProvider,
  PROTOCOL_TO_DEFAULT_PROVIDER_TYPE,
  ProviderMap,
  ProviderType,
  SolanaWeb3Provider,
  TypedProvider,
  TypedTransaction,
  ViemProvider,
} from './ProviderType.js';
import {
  ProviderBuilderMap,
  defaultProviderBuilderMap,
} from './providerBuilders.js';
import {
  TransactionFeeEstimate,
  estimateTransactionFee,
} from './transactionFeeEstimators.js';

export interface MultiProtocolProviderOptions {
  logger?: Logger;
  providers?: ChainMap<ProviderMap<TypedProvider>>;
  signers?: ProtocolMap<ethers.Wallet | WalletUnlocked | WalletLocked>;
  providerBuilders?: Partial<ProviderBuilderMap>;
}

/**
 * A version of MultiProvider that can support different
 * provider types across different protocol types.
 *
 * This uses a different interface for provider/signer related methods
 * so it isn't strictly backwards compatible with MultiProvider.
 *
 * Unlike MultiProvider, this class does not support signer/signing methods (yet).
 * @typeParam MetaExt - Extra metadata fields for chains (such as contract addresses)
 */
export class MultiProtocolProvider<
  MetaExt = {},
> extends ChainMetadataManager<MetaExt> {
  // Chain name -> provider type -> provider
  protected readonly providers: ChainMap<ProviderMap<TypedProvider>>;
  // Protocol  -> signer
  protected readonly signers: ProtocolMap<
    ethers.Wallet | WalletUnlocked | WalletLocked
  >;
  protected readonly providerBuilders: Partial<ProviderBuilderMap>;
  public readonly logger: Logger;

  constructor(
    chainMetadata: ChainMap<ChainMetadata<MetaExt>>,
    protected readonly options: MultiProtocolProviderOptions = {},
  ) {
    super(chainMetadata, options);
    this.logger =
      options?.logger ||
      rootLogger.child({
        module: 'MultiProtocolProvider',
      });
    this.providers = options.providers || {};
    this.signers = options.signers || {};
    this.providerBuilders =
      options.providerBuilders || defaultProviderBuilderMap;
  }

  static fromMultiProvider<MetaExt = {}>(
    mp: MultiProvider<MetaExt>,
    options: MultiProtocolProviderOptions = {},
  ): MultiProtocolProvider<MetaExt> {
    const newMp = new MultiProtocolProvider<MetaExt>(mp.metadata, options);

    const typedProviders = objMap(mp.providers, (_, provider) => ({
      type: ProviderType.EthersV5,
      provider,
    })) as ChainMap<TypedProvider>;

    newMp.setProviders(typedProviders);
    return newMp;
  }

  toMultiProvider(options?: MultiProviderOptions): MultiProvider<MetaExt> {
    const newMp = new MultiProvider<MetaExt>(this.metadata, options);

    const providers = objMap(
      this.providers,
      (_, typeToProviders) => typeToProviders[ProviderType.EthersV5]?.provider,
    ) as ChainMap<EthersV5Provider['provider'] | undefined>;

    const filteredProviders = objFilter(
      providers,
      (_, p): p is EthersV5Provider['provider'] => !!p,
    ) as ChainMap<EthersV5Provider['provider']>;

    newMp.setProviders(filteredProviders);
    return newMp;
  }

  override extendChainMetadata<NewExt = {}>(
    additionalMetadata: ChainMap<NewExt>,
  ): MultiProtocolProvider<MetaExt & NewExt> {
    const newMetadata = super.extendChainMetadata(additionalMetadata).metadata;
    const newMp = new MultiProtocolProvider(newMetadata, {
      ...this.options,
      providers: this.providers,
    });
    return newMp;
  }

  /**
   * Get an Ethers signer for a given chain name or domain id
   * If signer is not yet connected, it will be connected
   * @throws if chain's metadata or signer has not been set
   */
  async getSigner(
    protocol: ProtocolType,
    chain: ChainNameOrId,
  ): Promise<ethers.Wallet | WalletUnlocked | WalletLocked> {
    const signer = await this.tryGetSigner(protocol, chain);
    if (!signer) throw new Error(`No chain signer set for ${protocol}`);
    return signer;
  }

  /**
   * Get a signer for a given protocol
   * If signer is not yet connected, it will be connected
   */
  async tryGetSigner(
    protocol: ProtocolType,
    chainNameOrId: ChainNameOrId,
  ): Promise<ethers.Wallet | WalletUnlocked | WalletLocked | null> {
    const signer = this.signers[protocol];
    if (!signer) return null;

    if (signer instanceof ethers.Wallet) {
      if (signer.provider) return signer;
      // Auto-connect the signer for convenience
      const provider = this.tryGetProvider(chainNameOrId);
      if (provider instanceof ethers.providers.Provider) {
        return provider ? signer.connect(provider) : signer;
      }
    }
    if (signer instanceof WalletLocked || signer instanceof WalletUnlocked) {
      const provider = await this.getFuelProvider(chainNameOrId);
      if (provider instanceof FuelProvider) {
        signer.connect(provider);
        return signer;
      }
    }
    return null;
  }

  async setFuelSigner(
    chainNameOrId: ChainNameOrId,
    signer: WalletUnlocked | WalletLocked,
  ): Promise<void> {
    const chainName = this.tryGetChainName(chainNameOrId);
    if (!chainName) {
      throw new Error(`Chain ${chainNameOrId} not found in metadata`);
    }

    const typedProvider = this.tryGetProvider(chainName, ProviderType.Fuels);
    if (typedProvider && typedProvider.type === ProviderType.Fuels) {
      signer.connect(await typedProvider.provider);
    }

    this.signers[ProtocolType.Fuel] = signer;
  }

  tryGetProvider(
    chainNameOrId: ChainNameOrId,
    type?: ProviderType,
  ): TypedProvider | null {
    const metadata = this.tryGetChainMetadata(chainNameOrId);
    if (!metadata) return null;
    const { protocol, name, chainId, rpcUrls } = metadata;
    type = type || PROTOCOL_TO_DEFAULT_PROVIDER_TYPE[protocol];
    if (!type) return null;

    if (this.providers[name]?.[type]) return this.providers[name][type]!;

    const builder = this.providerBuilders[type];
    if (!rpcUrls.length || !builder) return null;

    const provider = builder(rpcUrls, chainId);
    this.providers[name] ||= {};
    this.providers[name][type] = provider;
    return provider;
  }

  getProvider(
    chainNameOrId: ChainNameOrId,
    type?: ProviderType,
  ): TypedProvider {
    const provider = this.tryGetProvider(chainNameOrId, type);
    if (!provider)
      throw new Error(`No provider available for ${chainNameOrId}`);
    return provider;
  }

  protected getSpecificProvider<T>(
    chainNameOrId: ChainNameOrId,
    type: ProviderType,
  ): T {
    const provider = this.getProvider(chainNameOrId, type);
    if (provider.type !== type)
      throw new Error(
        `Invalid provider type, expected ${type} but found ${provider.type}`,
      );
    return provider.provider as T;
  }

  getEthersV5Provider(
    chainNameOrId: ChainNameOrId,
  ): EthersV5Provider['provider'] {
    return this.getSpecificProvider<EthersV5Provider['provider']>(
      chainNameOrId,
      ProviderType.EthersV5,
    );
  }

  getViemProvider(chainNameOrId: ChainNameOrId): ViemProvider['provider'] {
    return this.getSpecificProvider<ViemProvider['provider']>(
      chainNameOrId,
      ProviderType.Viem,
    );
  }

  getSolanaWeb3Provider(
    chainNameOrId: ChainNameOrId,
  ): SolanaWeb3Provider['provider'] {
    return this.getSpecificProvider<SolanaWeb3Provider['provider']>(
      chainNameOrId,
      ProviderType.SolanaWeb3,
    );
  }

  getCosmJsProvider(chainNameOrId: ChainNameOrId): CosmJsProvider['provider'] {
    return this.getSpecificProvider<CosmJsProvider['provider']>(
      chainNameOrId,
      ProviderType.CosmJs,
    );
  }

  getFuelProvider(chainNameOrId: ChainNameOrId): FuelsProvider['provider'] {
    return this.getSpecificProvider<FuelsProvider['provider']>(
      chainNameOrId,
      ProviderType.Fuels,
    );
  }

  getCosmJsWasmProvider(
    chainNameOrId: ChainNameOrId,
  ): CosmJsWasmProvider['provider'] {
    return this.getSpecificProvider<CosmJsWasmProvider['provider']>(
      chainNameOrId,
      ProviderType.CosmJsWasm,
    );
  }

  setProvider(
    chainNameOrId: ChainNameOrId,
    provider: TypedProvider,
  ): TypedProvider {
    const chainName = this.getChainName(chainNameOrId);
    this.providers[chainName] ||= {};
    this.providers[chainName][provider.type] = provider;
    return provider;
  }

  setProviders(providers: ChainMap<TypedProvider>): void {
    for (const chain of Object.keys(providers)) {
      this.setProvider(chain, providers[chain]);
    }
  }

  estimateTransactionFee({
    chainNameOrId,
    transaction,
    sender,
    senderPubKey,
  }: {
    chainNameOrId: ChainNameOrId;
    transaction: TypedTransaction;
    sender: Address;
    senderPubKey?: HexString;
  }): Promise<TransactionFeeEstimate> {
    const provider = this.getProvider(chainNameOrId, transaction.type);
    const chainMetadata = this.getChainMetadata(chainNameOrId);
    return estimateTransactionFee({
      transaction,
      provider,
      chainMetadata,
      sender,
      senderPubKey,
    });
  }

  override intersect(
    chains: ChainName[],
    throwIfNotSubset = false,
  ): {
    intersection: ChainName[];
    result: MultiProtocolProvider<MetaExt>;
  } {
    const { intersection, result } = super.intersect(chains, throwIfNotSubset);
    const multiProvider = new MultiProtocolProvider(result.metadata, {
      ...this.options,
      providers: pick(this.providers, intersection),
    });
    return { intersection, result: multiProvider };
  }

  /**
   * Creates a MultiProvider for test networks
   */
  static createTestMultiProtocolProvider<MetaExt = {}>(
    metadata = multiProtocolTestChainMetadata,
    providers: Partial<Record<ProtocolType, TypedProvider>> = {},
  ): MultiProtocolProvider<MetaExt> {
    const mp = new MultiProtocolProvider(metadata);
    const providerMap: ChainMap<TypedProvider> = {};
    for (const [protocol, provider] of Object.entries(providers)) {
      const chains = Object.values(metadata).filter(
        (m) => m.protocol === protocol,
      );
      chains.forEach((c) => (providerMap[c.name] = provider));
    }
    mp.setProviders(providerMap);
    return mp as MultiProtocolProvider<MetaExt>;
  }
}
