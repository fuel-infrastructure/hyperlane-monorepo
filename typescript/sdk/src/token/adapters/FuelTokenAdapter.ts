/* eslint-disable no-console */
import { hexZeroPad } from 'ethers/lib/utils.js';
import { BN, Provider, TransactionRequest, Wallet } from 'fuels';

import { Address, Domain, Numberish } from '@hyperlane-xyz/utils';

import { BaseFuelAdapter } from '../../app/MultiProtocolApp.js';
import { Mailbox } from '../../fuel-types/Mailbox.js';
import { TokenMetadataOutput, WarpRoute } from '../../fuel-types/WarpRoute.js';
import { AggregationIsm } from '../../fuel-types/index.js';
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
    console.log('getBalance from FuelNativeTokenAdapter');
    const provider = await this.getProvider();
    const balance = await provider.getBalance(
      address.toString(),
      this.addresses.token,
    );
    console.log('balance from FuelNativeTokenAdapter', balance);
    console.log('balance.toString() from FuelNativeTokenAdapter', BigInt(balance.toString() ));
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
    public readonly addresses: { token?: Address; warpRouter: Address },
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
    const quoteGasPayment = await this.contract.functions
      .quote_gas_payment(destination)
      .get();
    return {
      amount: BigInt(quoteGasPayment.value.toString()),
      addressOrDenom: this.addresses.token,
    };
  }

  async getMetadata(): Promise<TokenMetadata> {
    await this.initialize();
    const Metadata = await this.contract.functions.get_token_info().get();
    return convertTokenInfoToMetadata(Metadata.value as TokenMetadataOutput);
  }

  async getBalance(address: Address): Promise<bigint> {
    await this.initialize();
    console.log('getBalance from BaseFuelHypTokenAdapter');
    try {
      let token = this.addresses.token?.toString();
      console.log('this.addresses.token', token);

      if(token == undefined) {
        //const metadata = (await this.contract.functions.get_token_info().simulate()).value.asset_id.bits.toString()
        const test =  (await this.contract.functions.get_token_info().simulate());
        console.log("test output: ", test);
        const wait = test.callResult.receipts.length;
        console.log(wait);
        console.log(test.value.asset_id.bits.toString())
        token = test.value.asset_id.bits.toString();
      }
        
      const balance = await this.provider.getBalance(address.toString(), token);
      console.log('balance is called from BaseFuelHypTokenAdapter', balance);
      console.log('balance.toString() is called from BaseFuelHypTokenAdapter', BigInt(balance.toString()));
      return BigInt(balance.toString());
    } catch (error) {
      console.error('Error getting balance:', (error as Error).message, "cause: ", (error as Error).cause );
      throw error;
    }
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
    const baseAssetId = await this.provider.getBaseAssetId();

    let recipientB256 = recipient;
    if (recipient.length === 42 && recipient.startsWith('0x')) {
      recipientB256 = hexZeroPad(recipient, 32);
    }

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
      })
      .addContracts([
        new Mailbox(
          '0x8c625a7c909d1a888eef48eb61bf4707ba927f00d23eca698dfa8ec286392156',
          this.provider,
        ),
        new AggregationIsm(
          '0xf0a7d1817c16ed31f0477239e9cf7c198ac452f15acd2f32122fe4d55ce61d66',
          this.provider,
        ),
      ])
      .getTransactionRequest();
    return tx;
  }
}

// Interacts with Hyp Collateral Fuel token
export class FuelHypCollateralAdapter extends BaseFuelHypTokenAdapter {
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
