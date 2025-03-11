import { Provider, TransactionRequest, WalletUnlocked } from 'fuels';

import { Address, HexString, ProtocolType } from '@hyperlane-xyz/utils';

import { BaseFuelAdapter } from '../../app/MultiProtocolApp.js';
import { ContractIdInput, Mailbox } from '../../fuel-types/Mailbox.js';
import { WarpRoute } from '../../fuel-types/WarpRoute.js';
import { MultiProtocolProvider } from '../../providers/MultiProtocolProvider.js';
import { TypedTransactionReceipt } from '../../providers/ProviderType.js';
import { ChainName } from '../../types.js';
import { DispatchedMessage } from '../types.js';

import { ICoreAdapter } from './types.js';

export class FuelCoreAdapter extends BaseFuelAdapter implements ICoreAdapter {
  protected mailbox!: Mailbox;
  protected provider!: Provider;
  protected signer!: WalletUnlocked;

  constructor(
    public readonly chainName: ChainName,
    public readonly multiProvider: MultiProtocolProvider,
    public readonly addresses: { mailbox: Address },
  ) {
    super(chainName, multiProvider, addresses);
  }

  async initialize() {
    this.provider = await this.getProvider();
    this.signer = (await this.multiProvider.tryGetSigner(
      ProtocolType.Fuel,
      this.chainName,
    )) as WalletUnlocked;

    this.mailbox = new Mailbox(this.addresses.mailbox, this.signer);
  }

  private getMailbox(): Mailbox {
    if (!this.mailbox) {
      throw new Error('Mailbox not initialized. Call initialize() first.');
    }
    return this.mailbox;
  }

  async defaultHook(): Promise<string> {
    await this.initialize();
    const mailbox = this.getMailbox();
    const result = await mailbox.functions.default_hook().get();
    return result.value.bits;
  }

  async defaultIsm(): Promise<string> {
    await this.initialize();
    const mailbox = this.getMailbox();
    const result = await mailbox.functions.default_ism().get();
    return result.value.bits;
  }

  async requiredHook(): Promise<string> {
    await this.initialize();
    const mailbox = this.getMailbox();
    const result = await mailbox.functions.required_hook().get();
    return result.value.bits;
  }

  async nonce(): Promise<number> {
    await this.initialize();
    const mailbox = this.getMailbox();
    const result = await mailbox.functions.nonce().get();
    return result.value;
  }

  async latestDispatchedId(): Promise<string> {
    await this.initialize();
    const mailbox = this.getMailbox();
    const result = await mailbox.functions.latest_dispatched_id().get();
    return result.value;
  }

  async owner(): Promise<string> {
    await this.initialize();
    const mailbox = this.getMailbox();
    const result = await mailbox.functions.owner().get();
    return result.value.toString();
  }

  async delivered(id: string): Promise<boolean> {
    await this.initialize();
    const result = await this.mailbox.functions.delivered(id).get();
    return result.value;
  }

  async setDefaultHook(address: string): Promise<TransactionRequest> {
    await this.initialize();
    const contractIdInput: ContractIdInput = { bits: address };
    return this.mailbox.functions
      .set_default_hook(contractIdInput)
      .getTransactionRequest();
  }

  async setDefaultIsm(address: string): Promise<TransactionRequest> {
    await this.initialize();
    const contractIdInput: ContractIdInput = { bits: address };
    return this.mailbox.functions
      .set_default_ism(contractIdInput)
      .getTransactionRequest();
  }

  async setRequiredHook(address: string): Promise<TransactionRequest> {
    await this.initialize();
    const contractIdInput: ContractIdInput = { bits: address };
    return this.mailbox.functions
      .set_required_hook(contractIdInput)
      .getTransactionRequest();
  }

  async process(
    metadata: string,
    message: DispatchedMessage,
  ): Promise<boolean> {
    await this.initialize();

    const textEncoder = new TextEncoder();
    const metadataBytes = textEncoder.encode(metadata);
    let messageBytes: Uint8Array;
    if (message.message.startsWith('0x')) {
      messageBytes = Buffer.from(message.message.slice(2), 'hex');
    } else {
      messageBytes = new TextEncoder().encode(message.message);
    }

    const wr = new WarpRoute(message.parsed.recipient, this.signer);

    const delivered = await (
      await this.mailbox.functions
        .process(metadataBytes, messageBytes)
        .addContracts([wr])
        .call()
    ).waitForResult();
    return delivered.transactionResult.isStatusSuccess;
  }

  extractMessageIds(
    _sourceTx: TypedTransactionReceipt,
  ): Array<{ messageId: string; destination: ChainName }> {
    throw new Error('Method not implemented.');
  }

  async waitForMessageProcessed(
    _messageId: HexString,
    _destination: ChainName,
    _delayMs?: number,
    _maxAttempts?: number,
  ): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
