import { BN, Provider, TransactionRequest, Wallet } from 'fuels';

import { Address, Domain, Numberish } from '@hyperlane-xyz/utils';

import { BaseFuelAdapter } from '../../app/MultiProtocolApp.js';
import { TokenMetadataOutput, WarpRoute } from '../../fuel-types/WarpRoute.js';
import { MultiProtocolProvider } from '../../providers/MultiProtocolProvider.js';
import { ChainName } from '../../types.js';
import { TokenMetadata } from '../types.js';

import {
  IHypTokenAdapter,
  ITokenAdapter,
  InterchainGasQuote,
  TransferParams,
  TransferRemoteParams,
} from './ITokenAdapter.js';

// Interacts with Native Fuel token
export class FuelNativeTokenAdapter
  extends BaseFuelAdapter
  implements ITokenAdapter<TransactionRequest>
{
  constructor(
    public readonly chainName: ChainName,
    public readonly multiProvider: MultiProtocolProvider,
    public readonly addresses: { token: Address },
  ) {
    super(chainName, multiProvider, addresses);
  }

  async getBalance(address: Address): Promise<bigint> {
    const provider = await this.getProvider();
    const wallet = Wallet.fromAddress(address, provider);
    const balance = await wallet.getBalance(this.addresses.token);
    return BigInt(balance.toString());
  }

  async getMetadata(): Promise<TokenMetadata> {
    throw new Error('Metadata retrieval not implemented for Fuel tokens');
  }

  async getMinimumTransferAmount(_recipient: Address): Promise<bigint> {
    return 0n;
  }

  async isApproveRequired(
    _owner: Address,
    _spender: Address,
    _weiAmountOrId: Numberish,
  ): Promise<boolean> {
    return false;
  }

  async populateApproveTx(
    _params: TransferParams,
  ): Promise<TransactionRequest> {
    throw new Error('Approve not required for Fuel tokens');
  }

  async populateTransferTx({
    weiAmountOrId,
    recipient,
  }: TransferParams): Promise<TransactionRequest> {
    const provider = await this.getProvider();
    const wallet = Wallet.fromAddress(this.addresses.token, provider);
    const tx = wallet.createTransfer(recipient, weiAmountOrId.toString());
    return tx;
  }

  async getTotalSupply(): Promise<bigint | undefined> {
    return undefined;
  }
}

export class BaseFuelHypTokenAdapter
  extends BaseFuelAdapter
  implements IHypTokenAdapter<TransactionRequest>
{
  protected contract!: WarpRoute;
  protected provider!: Provider;

  constructor(
    public readonly chainName: ChainName,
    public readonly multiProvider: MultiProtocolProvider,
    public readonly addresses: { token: Address; warpRouter: Address },
  ) {
    super(chainName, multiProvider, addresses);
  }

  async initialize() {
    this.provider = await this.getProvider();
    this.contract = new WarpRoute(this.addresses.warpRouter, this.provider);
  }

  async isApproveRequired(): Promise<boolean> {
    return false;
  }

  async populateTransferRemoteTx({
    weiAmountOrId,
    destination,
    recipient,
    interchainGas,
  }: TransferRemoteParams): Promise<TransactionRequest> {
    await this.initialize();
    let gasPayment: bigint = 0n;
    if (!interchainGas) {
      gasPayment = (await this.quoteTransferRemoteGas(destination)).amount;
    }

    const tx = this.contract.functions
      .transfer_remote(destination, recipient, new BN(weiAmountOrId.toString()))
      .callParams({
        forward: {
          amount: gasPayment.toString(),
          assetId: this.provider.getBaseAssetId(),
        },
      })
      .getTransactionRequest();

    return tx;
  }

  async getRouterAddress(domain: Domain): Promise<Buffer> {
    await this.initialize();
    const remoteRouter = await this.contract.functions.router(domain).get();
    if (!remoteRouter.value) throw new Error(`No router found for ${domain}`);
    return Buffer.from(remoteRouter.value.toString(), 'hex');
  }

  async quoteTransferRemoteGas(
    destination: Domain,
  ): Promise<InterchainGasQuote> {
    await this.initialize();
    const quoteGasPayment = await this.contract.functions
      .quote_gas_payment(destination)
      .get();
    return {
      amount: BigInt(quoteGasPayment.value.toString()),
      addressOrDenom: this.addresses.token,
    };
  }

  async getBalance(address: Address): Promise<bigint> {
    await this.initialize();
    const wallet = Wallet.fromAddress(address, this.provider);
    const balance = await wallet.getBalance(this.addresses.token);
    return BigInt(balance.toString());
  }

  async getTotalSupply(): Promise<bigint | undefined> {
    throw new Error('Method not implemented.');
  }

  async getMetadata(): Promise<TokenMetadata> {
    throw new Error('Method not implemented.');
  }

  async getBridgedSupply(): Promise<bigint | undefined> {
    throw new Error('Method not implemented.');
  }

  async getDomains(): Promise<Domain[]> {
    const domains = await this.contract.functions.all_domains().get();
    return domains.value as Domain[];
  }
  async getAllRouters(): Promise<Array<{ domain: Domain; address: Buffer }>> {
    const domains = await this.contract.functions.all_domains().get();
    const domainsArray = domains.value as Domain[];

    const routers = await Promise.all(
      domainsArray.map(async (domain) => ({
        domain,
        address: await this.getRouterAddress(domain),
      })),
    );

    return routers;
  }
  async getMinimumTransferAmount(_recipient: Address): Promise<bigint> {
    return 0n;
  }
  async populateTransferTx(
    _params: TransferParams,
  ): Promise<TransactionRequest> {
    throw new Error('Method not implemented.');
  }
  populateApproveTx(_params: TransferParams): Promise<TransactionRequest> {
    throw new Error('Method not implemented.');
  }
}

// Interacts with Hyp Native Fuel token
export class FuelHypNativeAdapter extends BaseFuelHypTokenAdapter {
  async populateTransferRemoteTx({
    weiAmountOrId,
    destination,
    recipient,
    interchainGas,
  }: TransferRemoteParams): Promise<TransactionRequest> {
    await this.initialize();
    let gasPayment: bigint = 0n;
    if (!interchainGas) {
      gasPayment = (await this.quoteTransferRemoteGas(destination)).amount;
    }

    const totalPayment = gasPayment + BigInt(weiAmountOrId.toString());
    const tx = this.contract.functions
      .transfer_remote(destination, recipient, new BN(weiAmountOrId.toString()))
      .callParams({
        forward: {
          amount: totalPayment.toString(),
          assetId: this.provider.getBaseAssetId(),
        },
      })
      .getTransactionRequest();

    return tx;
  }

  async populateTransferTx({
    weiAmountOrId,
    recipient,
  }: TransferParams): Promise<TransactionRequest> {
    const provider = await this.getProvider();
    const wallet = Wallet.fromAddress(this.addresses.token, provider);
    const tx = wallet.createTransfer(recipient, weiAmountOrId.toString());
    return tx;
  }
}

// Interacts with Hyp Collateral Fuel token
export class FuelHypCollateralAdapter extends BaseFuelHypTokenAdapter {
  async getTotalSupply(): Promise<bigint | undefined> {
    const metadata = await this.getMetadata();
    return BigInt(metadata.totalSupply.toString());
  }

  async getMetadata(): Promise<TokenMetadata> {
    await this.initialize();
    const Metadata = await this.contract.functions.get_token_info().get();
    return convertTokenInfoToMetadata(Metadata.value as TokenMetadataOutput);
  }

  async populateTransferTx({
    weiAmountOrId,
    recipient,
  }: TransferParams): Promise<TransactionRequest> {
    const provider = await this.getProvider();
    const wallet = Wallet.fromAddress(this.addresses.token, provider);
    const tx = wallet.createTransfer(recipient, weiAmountOrId.toString());
    return tx;
  }
  populateApproveTx(_params: TransferParams): Promise<TransactionRequest> {
    throw new Error('Method not implemented.');
  }
}

// Interacts with Hyp Synthetic Fuel token
export class FuelHypSyntheticAdapter extends BaseFuelHypTokenAdapter {
  async getMetadata(): Promise<TokenMetadata> {
    await this.initialize();
    const Metadata = await this.contract.functions.get_token_info().get();
    return convertTokenInfoToMetadata(Metadata.value as TokenMetadataOutput);
  }

  async getBridgedSupply(): Promise<bigint | undefined> {
    const metadata = await this.getMetadata();
    return BigInt(metadata.totalSupply.toString());
  }
}

const convertTokenInfoToMetadata = (
  info: TokenMetadataOutput,
): TokenMetadata => {
  return {
    symbol: info.symbol,
    name: info.name,
    totalSupply: info.total_supply.toString(),
    decimals: info.decimals,
    isNft: false,
  };
};
