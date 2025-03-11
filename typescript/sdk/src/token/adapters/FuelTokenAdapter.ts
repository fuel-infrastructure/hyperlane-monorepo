import { hexZeroPad } from 'ethers/lib/utils.js';
import {
  BN,
  Provider,
  TransactionRequest,
  Wallet,
  WalletUnlocked,
} from 'fuels';

import { Address, Domain, Numberish, ProtocolType } from '@hyperlane-xyz/utils';

import { BaseFuelAdapter } from '../../app/MultiProtocolApp.js';
import { Mailbox } from '../../fuel-types/Mailbox.js';
import { ProtocolFee } from '../../fuel-types/ProtocolFee.js';
// import { Src20Test } from '../../fuel-types/Src20Test.js';
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
    const baseAssetId = await provider.getBaseAssetId();
    const balance = await provider.getBalance(address.toString(), baseAssetId);
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
  protected signer!: WalletUnlocked;

  constructor(
    public readonly chainName: ChainName,
    public readonly multiProvider: MultiProtocolProvider,
    public readonly addresses: { token?: Address; warpRouter: Address },
  ) {
    super(chainName, multiProvider, addresses);
  }

  async initializeWithSigner(signer: WalletUnlocked) {
    this.signer = signer;
  }

  async initialize() {
    this.provider = await this.getProvider();
    this.signer = (await this.multiProvider.tryGetSigner(
      ProtocolType.Fuel,
      this.chainName,
    )) as unknown as WalletUnlocked;
    this.contract = new WarpRoute(this.addresses.warpRouter, this.signer);
  }

  async sendAssetToContract(weiAmountOrId: Numberish): Promise<boolean> {
    await this.initialize();

    const fund_res = await (
      await this.signer.transferToContract(
        this.addresses.warpRouter,
        new BN(weiAmountOrId.toString()),
        this.addresses.token ?? '',
      )
    ).waitForResult();

    return fund_res.isStatusSuccess;
  }

  async isApproveRequired(): Promise<boolean> {
    return false;
  }

  async getBaseAssetId(): Promise<string> {
    await this.initialize();
    return this.provider.getBaseAssetId();
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

    const baseAssetId = await this.provider.getBaseAssetId();
    const tx = this.contract.functions
      .transfer_remote(destination, recipient, new BN(weiAmountOrId.toString()))
      .callParams({
        forward: {
          amount: gasPayment.toString(),
          assetId: baseAssetId,
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
    const base_asset = await this.provider.getBaseAssetId();

    const quoteGasPayment = await this.contract.functions
      .quote_gas_payment(destination)
      .txParams({ gasLimit: 300000 })
      .get();
    return {
      amount: BigInt(quoteGasPayment.value.toString()),
      addressOrDenom: base_asset,
    };
  }

  async getMetadata(): Promise<TokenMetadata> {
    await this.initialize();
    const Metadata = await this.contract.functions.get_token_info().get();
    return convertTokenInfoToMetadata(Metadata.value as TokenMetadataOutput);
  }

  async getBalance(address: Address): Promise<bigint> {
    await this.initialize();
    let token = this.addresses.token?.toString();

    if (!token) {
      token = await this.provider.getBaseAssetId();
    }

    let balance = new BN(0);
    if (address == this.addresses.warpRouter) {
      balance = await this.provider.getContractBalance(
        address.toString(),
        token,
      );
    } else {
      balance = await this.provider.getBalance(address.toString(), token);
    }

    return BigInt(balance.toString());
  }

  async getTotalSupply(): Promise<bigint | undefined> {
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
  async sendAssetToContract(_weiAmountOrId: Numberish): Promise<boolean> {
    return true;
  }

  async populateTransferRemoteTx({
    weiAmountOrId,
    destination,
    recipient,
    interchainGas,
  }: TransferRemoteParams): Promise<TransactionRequest> {
    await this.initialize();
    let gasPayment: bigint = 0n;
    const baseAssetId = await this.provider.getBaseAssetId();

    if (!interchainGas) {
      gasPayment = (await this.quoteTransferRemoteGas(destination)).amount;
    }

    const totalPayment = gasPayment + BigInt(weiAmountOrId.toString());
    let recipientB256 = recipient;
    if (recipient.length === 42 && recipient.startsWith('0x')) {
      recipientB256 = hexZeroPad(recipient, 32);
    }

    const mailbox = await this.contract.functions.get_mailbox().get();
    const hook = await this.contract.functions.get_hook().get();
    const tx = this.contract.functions
      .transfer_remote(
        destination,
        recipientB256,
        new BN(weiAmountOrId.toString()),
      )
      .callParams({
        forward: {
          amount: totalPayment.toString(),
          assetId: baseAssetId,
        },
        gasLimit: 300000,
      })
      .addContracts([
        new Mailbox(mailbox.value.bits, this.signer),
        new ProtocolFee(hook.value.bits, this.signer),
      ])
      .getTransactionRequest();
    return tx;
  }
}

// Interacts with Hyp Collateral Fuel token
export class FuelHypCollateralAdapter extends BaseFuelHypTokenAdapter {
  async getTokenId(): Promise<string> {
    if (this.addresses.token) {
      return this.addresses.token?.toString();
    } else {
      return (
        await this.contract.functions.get_token_info().get()
      ).value.asset_id.bits.toString();
    }
  }

  async getBalance(address: Address): Promise<bigint> {
    await this.initialize();

    const token = await this.getTokenId();

    const balance =
      address == this.addresses.warpRouter
        ? await this.provider.getContractBalance(address.toString(), token) // For asset recieve
        : await this.provider.getBalance(address.toString(), token); //For asset sending
    return BigInt(balance.toString());
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

    const baseAssetId = await this.provider.getBaseAssetId();

    let recipientB256 = recipient;
    if (recipient.length === 42 && recipient.startsWith('0x')) {
      recipientB256 = hexZeroPad(recipient, 32);
    }

    await this.sendAssetToContract(weiAmountOrId);

    const mailbox = await this.contract.functions.get_mailbox().get();
    const hook = await this.contract.functions.get_hook().get();

    const tx = await this.contract.functions
      .transfer_remote(
        destination,
        recipientB256,
        new BN(weiAmountOrId.toString()),
      )
      .txParams({ variableOutputs: 5 })
      .callParams({
        forward: {
          amount: gasPayment.toString(),
          assetId: baseAssetId,
        },
        gasLimit: 300000,
      })
      .addContracts([
        new Mailbox(mailbox.value.bits, this.signer),
        new ProtocolFee(hook.value.bits, this.signer),
      ])
      .getTransactionRequest();
    return tx;
  }

  async getTotalSupply(): Promise<bigint | undefined> {
    const metadata = await this.getMetadata();
    return BigInt(metadata.totalSupply.toString());
  }

  populateApproveTx(_params: TransferParams): Promise<TransactionRequest> {
    throw new Error('Method not implemented.');
  }
}

// Interacts with Hyp Synthetic Fuel token
export class FuelHypSyntheticAdapter extends BaseFuelHypTokenAdapter {
  async getTokenId(): Promise<string> {
    if (this.addresses.token) {
      return this.addresses.token?.toString();
    } else {
      return (
        await this.contract.functions.get_token_info().get()
      ).value.asset_id.bits.toString();
    }
  }

  async getBalance(address: Address): Promise<bigint> {
    await this.initialize();
    const token = await this.getTokenId();

    const balance =
      address == this.addresses.warpRouter
        ? await this.provider.getContractBalance(address.toString(), token) // For asset recieve
        : await this.provider.getBalance(address.toString(), token); //For asset sending
    return BigInt(balance.toString());
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
      const gasRes = await this.quoteTransferRemoteGas(destination);
      gasPayment = gasRes.amount;
    }

    let recipientB256 = recipient;
    if (recipient.length === 42 && recipient.startsWith('0x')) {
      recipientB256 = hexZeroPad(recipient, 32);
    }

    const baseAssetId = await this.provider.getBaseAssetId();
    const mailbox = await this.contract.functions.get_mailbox().get();
    const hook = await this.contract.functions.get_hook().get();

    await this.sendAssetToContract(weiAmountOrId);

    const tx = await this.contract.functions
      .transfer_remote(
        destination,
        recipientB256,
        new BN(weiAmountOrId.toString()),
      )
      .callParams({
        forward: {
          amount: gasPayment.toString(),
          assetId: baseAssetId,
        },
        gasLimit: 3000000,
      })
      .addContracts([
        new Mailbox(mailbox.value.bits, this.signer),
        new ProtocolFee(hook.value.bits, this.signer),
      ])
      .getTransactionRequest();
    return tx;
  }

  async getBridgedSupply(): Promise<bigint | undefined> {
    const metadata = await this.getMetadata();
    return BigInt(metadata.totalSupply.toString());
  }
}

// Helpers
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
