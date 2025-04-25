import { hexZeroPad } from 'ethers/lib/utils.js';
import {
  BN,
  Address as FuelAddress,
  Provider,
  Script,
  TransactionRequest,
  Wallet,
  WalletLocked,
  WalletUnlocked,
} from 'fuels';

import { Address, Domain, Numberish, ProtocolType } from '@hyperlane-xyz/utils';

import { BaseFuelAdapter } from '../../app/MultiProtocolApp.js';
import { Mailbox } from '../../fuel-types/Mailbox.js';
import { TokenMetadataOutput, WarpRoute } from '../../fuel-types/WarpRoute.js';
import { WrMulticall } from '../../fuel-types/WrMulticall.js';
import { WrMulticallFactory } from '../../fuel-types/WrMulticallFactory.js';
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
  protected signer!: WalletLocked | WalletUnlocked;

  constructor(
    public readonly chainName: ChainName,
    public readonly multiProvider: MultiProtocolProvider,
    public readonly addresses: { token?: Address; warpRouter: Address },
  ) {
    super(chainName, multiProvider, addresses);
  }

  async initialize() {
    this.provider = await this.getProvider();
    this.signer = (await this.multiProvider.tryGetSigner(
      ProtocolType.Fuel,
      this.chainName,
    )) as unknown as WalletLocked | WalletUnlocked;
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
    let gasPayment: bigint = interchainGas?.amount ?? 0n;
    if (!interchainGas) {
      const gasRes = await this.quoteTransferRemoteGas(destination);
      gasPayment = gasRes.amount;
    }

    let recipientB256 = recipient;
    if (recipient.length === 42 && recipient.startsWith('0x')) {
      recipientB256 = hexZeroPad(recipient, 32);
    }

    const baseAssetId = await this.getBaseAssetId();
    const mailbox = await this.contract.functions.get_mailbox().get();

    const multicallScript = new Script(
      WrMulticallFactory.bytecode,
      WrMulticall.abi,
      this.signer,
    );

    const amount = this.getTransferAmount(gasPayment, BigInt(weiAmountOrId));
    const request = await multicallScript.functions
      .main(
        this.addresses.warpRouter,
        mailbox.value,
        destination,
        recipientB256,
        BigInt(weiAmountOrId),
        this.addresses.token,
        amount,
      )
      .addContracts([new Mailbox(mailbox.value.bits, this.signer)])
      .getTransactionRequest();

    const txCost = await this.signer.getTransactionCost(request, {
      quantities: [
        {
          assetId: this.addresses.token!,
          amount: new BN(weiAmountOrId.toString()),
        },
        {
          assetId: baseAssetId,
          amount: new BN(amount.toString()),
        },
      ],
    });
    const { gasUsed, missingContractIds, outputVariables, maxFee } = txCost;

    missingContractIds.forEach((contractId: string) => {
      request.addContractInputAndOutput(new FuelAddress(contractId));
    });

    request.addVariableOutputs(outputVariables);

    request.gasLimit = gasUsed;
    request.maxFee = maxFee;

    await this.signer.fund(request, txCost);
    return request;
  }

  async getRouterAddress(domain: Domain): Promise<Buffer> {
    await this.initialize();
    const remoteRouter = await this.contract.functions.router(domain).get();
    if (!remoteRouter.value) throw new Error(`No router found for ${domain}`);
    return Buffer.from(remoteRouter.value.replace(/^0x/, ''), 'hex');
  }

  async quoteTransferRemoteGas(
    destination: Domain,
  ): Promise<InterchainGasQuote> {
    await this.initialize();
    const base_asset = await this.getBaseAssetId();
    const mailbox = await this.contract.functions.get_mailbox().get();

    const quoteGasPayment = await this.contract.functions
      .quote_gas_payment(destination)
      .addContracts([new Mailbox(mailbox.value.bits, this.signer)])
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
      token = await this.getBaseAssetId();
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

  async getRemoteRouterDecimals(router_address: string): Promise<number> {
    await this.initialize();
    const decimals = (
      await this.contract.functions.remote_router_decimals(router_address).get()
    ).value;
    return decimals;
  }

  async populateTransferTx(
    _params: TransferParams,
  ): Promise<TransactionRequest> {
    throw new Error('Method not implemented.');
  }

  populateApproveTx(_params: TransferParams): Promise<TransactionRequest> {
    throw new Error('Method not implemented.');
  }

  async isAmountCausingPrecisionLoss(
    weiAmountOrId: Numberish,
    destination: Domain,
    fromFuel: boolean = true,
  ): Promise<{ remainder: number; decimalDiff: number }> {
    const fuelDecimals = (await this.getMetadata()).decimals;
    if (!fuelDecimals) {
      throw new Error('Token info not found');
    }

    const remoteRouter = await this.getRouterAddress(destination);
    const remoteRouterB256 = '0x' + remoteRouter.toString('hex');
    const remoteDecimals = await this.getRemoteRouterDecimals(remoteRouterB256);

    const decimalDiff = fromFuel
      ? fuelDecimals - remoteDecimals // Fuel → other chain
      : remoteDecimals - fuelDecimals; // Other chain → Fuel

    if (decimalDiff <= 0) return { remainder: 0, decimalDiff };

    const divisor = Number(10 ** decimalDiff);
    return { remainder: Number(weiAmountOrId) % divisor, decimalDiff };
  }

  protected getTransferAmount(gasPayment: bigint, _amount: bigint): bigint {
    return gasPayment;
  }

  async isAmountConvertibleBetweenChains(
    amount: Numberish,
    destination: Domain,
    fromFuel: boolean = true,
  ): Promise<boolean> {
    const fuelDecimals = (await this.getMetadata()).decimals;
    if (!fuelDecimals) return false;

    const remoteRouter = await this.getRouterAddress(destination);
    const remoteRouterB256 = '0x' + remoteRouter.toString('hex');
    const remoteDecimals = await this.getRemoteRouterDecimals(remoteRouterB256);

    const decimalDiff = fromFuel
      ? fuelDecimals - remoteDecimals // Fuel → other chain
      : remoteDecimals - fuelDecimals; // Other chain → Fuel

    //means given amount will be multiplied to comply with remote chains higher decimals
    if (decimalDiff <= 0) return true;

    //u64 difference limit
    if (decimalDiff >= 19) return false;

    //if amount is greater than 10^decimalDiff,
    //means can be divided to comply with remote chains lower decimals
    return BigInt(amount) >= BigInt(10 ** decimalDiff);
  }
}

// Interacts with Hyp Native Fuel token
export class FuelHypNativeAdapter extends BaseFuelHypTokenAdapter {
  protected async getTokenId(): Promise<string> {
    return this.getBaseAssetId();
  }

  protected getTransferAmount(gasPayment: bigint, amount: bigint): bigint {
    return gasPayment + amount;
  }

  // Override for native tokens - which don't require asset sending before transfer
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
    let gasPayment: bigint = interchainGas?.amount ?? 0n;
    if (!interchainGas) {
      const gasRes = await this.quoteTransferRemoteGas(destination);
      gasPayment = gasRes.amount;
    }

    const totalPayment = gasPayment + BigInt(weiAmountOrId);
    let recipientB256 = recipient;
    if (recipient.length === 42 && recipient.startsWith('0x')) {
      recipientB256 = hexZeroPad(recipient, 32);
    }

    const mailbox = await this.contract.functions.get_mailbox().get();
    const baseAssetId = await this.getBaseAssetId();

    const tx = await this.contract.functions
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
      })
      .addContracts([new Mailbox(mailbox.value.bits, this.signer)])
      .getTransactionRequest();
    return tx;
  }
}

// Interacts with Hyp Collateral Fuel token
export class FuelHypCollateralAdapter extends BaseFuelHypTokenAdapter {
  // Collateral token uses base implementation for everything except total supply
  async getTotalSupply(): Promise<bigint | undefined> {
    const metadata = await this.getMetadata();
    return BigInt(metadata.totalSupply.toString());
  }
}

// Interacts with Hyp Synthetic Fuel token
export class FuelHypSyntheticAdapter extends BaseFuelHypTokenAdapter {
  async initialize() {
    this.provider = await this.getProvider();
    this.signer = (await this.multiProvider.tryGetSigner(
      ProtocolType.Fuel,
      this.chainName,
    )) as unknown as WalletLocked | WalletUnlocked;
    this.contract = new WarpRoute(this.addresses.warpRouter, this.signer);
    this.addresses.token = await (
      await this.contract.functions.get_token_info().get()
    ).value.asset_id.bits.toString();
  }

  async getBridgedSupply(): Promise<bigint | undefined> {
    const metadata = await this.getMetadata();
    return BigInt(metadata.totalSupply.toString());
  }

  async getTokenId(): Promise<string> {
    if (this.addresses.token) {
      return this.addresses.token?.toString();
    } else {
      return (
        await this.contract.functions.get_token_info().get()
      ).value.asset_id.bits.toString();
    }
  }

  async sendAssetToContract(weiAmountOrId: Numberish): Promise<boolean> {
    await this.initialize();

    let tokenAddress = '';
    if (!this.addresses.token) {
      tokenAddress = await this.getTokenId();
    }

    const fund_res = await (
      await this.signer.transferToContract(
        this.addresses.warpRouter,
        new BN(weiAmountOrId.toString()),
        this.addresses.token ?? tokenAddress,
      )
    ).waitForResult();

    return fund_res.isStatusSuccess;
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
