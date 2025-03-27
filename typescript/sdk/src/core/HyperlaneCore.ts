import { TransactionReceipt } from '@ethersproject/providers';
import { ethers } from 'ethers';
import { TransactionResult } from 'fuels';
import type { TransactionReceipt as ViemTxReceipt } from 'viem';

import {
  IMessageRecipient,
  IMessageRecipient__factory,
  MailboxClient__factory,
  Mailbox__factory,
} from '@hyperlane-xyz/core';
import {
  Address,
  AddressBytes32,
  ParsedMessage,
  ProtocolType,
  addBufferToGasLimit,
  addressToBytes32,
  assert,
  bytes32ToAddress,
  isZeroishAddress,
  messageId,
  objFilter,
  objMap,
  parseMessage,
  pollAsync,
  promiseObjAll,
} from '@hyperlane-xyz/utils';

import { HyperlaneApp } from '../app/HyperlaneApp.js';
import { appFromAddressesMapHelper } from '../contracts/contracts.js';
import {
  HyperlaneAddressesMap,
  HyperlaneContracts,
} from '../contracts/types.js';
import { DerivedHookConfig, EvmHookReader } from '../hook/EvmHookReader.js';
import { DerivedIsmConfig, EvmIsmReader } from '../ism/EvmIsmReader.js';
import { MultiProtocolProvider } from '../providers/MultiProtocolProvider.js';
import { MultiProvider } from '../providers/MultiProvider.js';
import { RouterConfig } from '../router/types.js';
import { ChainMap, ChainName, OwnableConfig } from '../types.js';
import { findMatchingLogEvents } from '../utils/logUtils.js';

import { FuelCoreAdapter } from './adapters/FuelCoreAdapter.js';
import { CoreFactories, coreFactories } from './contracts.js';
import { DispatchEvent } from './events.js';
import { DispatchedMessage } from './types.js';

// If no metadata is provided, ensure we provide a default of 0x0001.
// We set to 0x0001 instead of 0x0 to ensure it does not break on zksync.
const DEFAULT_METADATA = '0x0001';

export class HyperlaneCore extends HyperlaneApp<CoreFactories> {
  static fromAddressesMap(
    addressesMap: HyperlaneAddressesMap<any>,
    multiProvider: MultiProvider,
  ): HyperlaneCore {
    const helper = appFromAddressesMapHelper(
      addressesMap,
      coreFactories,
      multiProvider,
    );
    return new HyperlaneCore(helper.contractsMap, helper.multiProvider);
  }

  getRouterConfig = (
    owners: Address | ChainMap<OwnableConfig>,
  ): ChainMap<RouterConfig> => {
    // filter for EVM chains
    const evmContractsMap = objFilter(
      this.contractsMap,
      (chainName, _): _ is HyperlaneContracts<CoreFactories> =>
        this.multiProvider.getProtocol(chainName) === ProtocolType.Ethereum,
    );

    // get config
    const config = objMap(
      evmContractsMap,
      (chain, contracts): RouterConfig => ({
        mailbox: contracts.mailbox.address,
        owner: typeof owners === 'string' ? owners : owners[chain].owner,
        ownerOverrides:
          typeof owners === 'string' ? undefined : owners[chain].ownerOverrides,
      }),
    );

    return config;
  };

  quoteGasPayment = (
    origin: ChainName,
    destination: ChainName,
    recipient: AddressBytes32,
    body: string,
    metadata?: string,
    hook?: Address,
  ): Promise<ethers.BigNumber> => {
    const destinationId = this.multiProvider.getDomainId(destination);
    return this.contractsMap[origin].mailbox[
      'quoteDispatch(uint32,bytes32,bytes,bytes,address)'
    ](
      destinationId,
      recipient,
      body,
      metadata || DEFAULT_METADATA,
      hook || ethers.constants.AddressZero,
    );
  };

  getDestination(message: DispatchedMessage): ChainName {
    return this.multiProvider.getChainName(message.parsed.destination);
  }

  getOrigin(message: DispatchedMessage): ChainName {
    return this.multiProvider.getChainName(message.parsed.origin);
  }

  async getRecipientIsmAddress(message: DispatchedMessage): Promise<Address> {
    const destinationMailbox = this.contractsMap[this.getDestination(message)];
    const ethAddress = bytes32ToAddress(message.parsed.recipient);
    return destinationMailbox.mailbox.recipientIsm(ethAddress);
  }

  async getRecipientIsmAddressFuel(
    message: DispatchedMessage,
  ): Promise<Address> {
    const destinationMailbox = this.contractsMap[this.getDestination(message)];
    const ethAddress = bytes32ToAddress(message.parsed.recipient);
    return destinationMailbox.mailbox.recipientIsm(ethAddress);
  }

  async getHookAddress(message: DispatchedMessage): Promise<Address> {
    const destinationMailbox = this.contractsMap[this.getOrigin(message)];
    /* TODO: requiredHook() account for here: https://github.com/hyperlane-xyz/hyperlane-monorepo/pull/3693 */
    return destinationMailbox.mailbox.defaultHook();
  }

  async getRecipientIsmConfig(
    message: DispatchedMessage,
  ): Promise<DerivedIsmConfig> {
    const destinationChain = this.getDestination(message);
    const ismReader = new EvmIsmReader(this.multiProvider, destinationChain);
    const address = await this.getRecipientIsmAddress(message);
    return ismReader.deriveIsmConfig(address);
  }

  async getHookConfig(message: DispatchedMessage): Promise<DerivedHookConfig> {
    const originChain = this.getOrigin(message);
    const hookReader = new EvmHookReader(this.multiProvider, originChain);
    const address = await this.getHookAddress(message);
    return hookReader.deriveHookConfig(address);
  }

  async sendMessage(
    origin: ChainName,
    destination: ChainName,
    recipient: Address,
    body: string,
    hook?: Address,
    metadata?: string,
  ): Promise<{ dispatchTx: TransactionReceipt; message: DispatchedMessage }> {
    const mailbox = this.getContracts(origin).mailbox;
    const destinationDomain = this.multiProvider.getDomainId(destination);
    const recipientBytes32 = addressToBytes32(recipient);
    const quote = await this.quoteGasPayment(
      origin,
      destination,
      recipientBytes32,
      body,
      metadata,
      hook,
    );

    const dispatchParams = [
      destinationDomain,
      recipientBytes32,
      body,
      metadata || DEFAULT_METADATA,
      hook || ethers.constants.AddressZero,
    ] as const;

    const estimateGas = await mailbox.estimateGas[
      'dispatch(uint32,bytes32,bytes,bytes,address)'
    ](...dispatchParams, { value: quote });

    const dispatchTx = await this.multiProvider.handleTx(
      origin,
      mailbox['dispatch(uint32,bytes32,bytes,bytes,address)'](
        ...dispatchParams,
        {
          ...this.multiProvider.getTransactionOverrides(origin),
          value: quote,
          gasLimit: addBufferToGasLimit(estimateGas),
        },
      ),
    );

    return {
      dispatchTx,
      message: this.getDispatchedMessages(dispatchTx)[0],
    };
  }

  onDispatch(
    handler: (
      message: DispatchedMessage,
      event: DispatchEvent,
    ) => Promise<void>,
    chains = Object.keys(this.contractsMap),
  ): {
    removeHandler: (chains?: ChainName[]) => void;
  } {
    chains.map((originChain) => {
      const mailbox = this.contractsMap[originChain].mailbox;
      this.logger.debug(`Listening for dispatch on ${originChain}`);
      mailbox.on<DispatchEvent>(
        mailbox.filters.Dispatch(),
        (_sender, _destination, _recipient, message, event) => {
          const dispatched = HyperlaneCore.parseDispatchedMessage(message);

          // add human readable chain names
          dispatched.parsed.originChain = this.getOrigin(dispatched);
          dispatched.parsed.destinationChain = this.getDestination(dispatched);

          this.logger.info(
            `Observed message ${dispatched.id} on ${originChain} to ${dispatched.parsed.destinationChain}`,
          );
          return handler(dispatched, event);
        },
      );
    });

    return {
      removeHandler: (removeChains) =>
        (removeChains ?? chains).map((originChain) => {
          this.contractsMap[originChain].mailbox.removeAllListeners('Dispatch');
          this.logger.debug(`Stopped listening for dispatch on ${originChain}`);
        }),
    };
  }

  getDefaults(): Promise<ChainMap<{ ism: Address; hook: Address }>> {
    return promiseObjAll(
      objMap(this.contractsMap, async (_, contracts) => ({
        ism: await contracts.mailbox.defaultIsm(),
        hook: await contracts.mailbox.defaultHook(),
      })),
    );
  }

  getIsm(
    destinationChain: ChainName,
    recipientAddress: Address,
  ): Promise<Address> {
    const destinationMailbox = this.contractsMap[destinationChain];
    return destinationMailbox.mailbox.recipientIsm(recipientAddress);
  }

  protected getRecipient(message: DispatchedMessage): IMessageRecipient {
    return IMessageRecipient__factory.connect(
      bytes32ToAddress(message.parsed.recipient),
      this.multiProvider.getProvider(this.getDestination(message)),
    );
  }

  async estimateHandle(message: DispatchedMessage): Promise<string> {
    return (
      await this.getRecipient(message).estimateGas.handle(
        message.parsed.origin,
        message.parsed.sender,
        message.parsed.body,
        { from: this.getAddresses(this.getDestination(message)).mailbox },
      )
    ).toString();
  }

  deliver(
    message: DispatchedMessage,
    ismMetadata: string,
  ): Promise<ethers.ContractReceipt> {
    const destinationChain = this.getDestination(message);
    const txOverrides =
      this.multiProvider.getTransactionOverrides(destinationChain);
    return this.multiProvider.handleTx(
      destinationChain,
      this.getContracts(destinationChain).mailbox.process(
        ismMetadata,
        message.message,
        { ...txOverrides },
      ),
    );
  }

  async getHook(
    originChain: ChainName,
    senderAddress: Address,
  ): Promise<Address> {
    const provider = this.multiProvider.getProvider(originChain);
    try {
      const client = MailboxClient__factory.connect(senderAddress, provider);
      const hook = await client.hook();
      if (!isZeroishAddress(hook)) {
        return hook;
      }
    } catch (e) {
      this.logger.debug(`MailboxClient hook not found for ${senderAddress}`);
      this.logger.trace({ e });
    }

    const originMailbox = this.contractsMap[originChain].mailbox;
    return originMailbox.defaultHook();
  }

  async getHookFuel(
    originChain: ChainName,
    mailboxAddress: Address,
    multiProtocolProvider: MultiProtocolProvider,
  ): Promise<Address> {
    const originMailbox = new FuelCoreAdapter(
      originChain,
      multiProtocolProvider,
      {
        mailbox: mailboxAddress,
      },
    );
    const hook = await originMailbox.defaultHook();
    return hook;
  }

  isDelivered(message: DispatchedMessage): Promise<boolean> {
    const destinationChain = this.getDestination(message);
    return this.getContracts(destinationChain).mailbox.delivered(message.id);
  }

  async getSenderHookAddress(message: DispatchedMessage): Promise<Address> {
    const originChain = this.getOrigin(message);
    const senderAddress = bytes32ToAddress(message.parsed.sender);
    return this.getHook(originChain, senderAddress);
  }

  async getSenderHookAddressFuel(
    message: DispatchedMessage,
    mailboxAddress: string,
    multiProtocolProvider: MultiProtocolProvider,
  ): Promise<Address> {
    const originChain = this.getOrigin(message);
    return this.getHookFuel(originChain, mailboxAddress, multiProtocolProvider);
  }

  async getProcessedReceipt(
    message: DispatchedMessage,
  ): Promise<ethers.ContractReceipt> {
    const destinationChain = this.getDestination(message);
    const mailbox = this.getContracts(destinationChain).mailbox;

    const processedBlock = await mailbox.processedAt(message.id);
    const events = await mailbox.queryFilter(
      mailbox.filters.ProcessId(message.id),
      processedBlock,
      processedBlock,
    );

    assert(
      events.length === 1,
      `Expected exactly one process event, got ${events.length}`,
    );
    const processedEvent = events[0];
    return processedEvent.getTransactionReceipt();
  }

  protected waitForProcessReceipt(
    message: DispatchedMessage,
  ): Promise<ethers.ContractReceipt> {
    const id = messageId(message.message);
    const destinationChain = this.getDestination(message);
    const mailbox = this.contractsMap[destinationChain].mailbox;
    const filter = mailbox.filters.ProcessId(id);

    return new Promise<ethers.ContractReceipt>((resolve, reject) => {
      mailbox.once(filter, (emittedId, event) => {
        if (id !== emittedId) {
          reject(`Expected message id ${id} but got ${emittedId}`);
        }
        resolve(
          this.multiProvider.handleTx(destinationChain, event.getTransaction()),
        );
      });
    });
  }

  async waitForMessageIdProcessed(
    messageId: string,
    destination: ChainName,
    delayMs?: number,
    maxAttempts?: number,
  ): Promise<true> {
    await pollAsync(
      async () => {
        this.logger.debug(`Checking if message ${messageId} was processed`);
        const mailbox = this.contractsMap[destination].mailbox;
        const delivered = await mailbox.delivered(messageId);
        if (delivered) {
          this.logger.info(`Message ${messageId} was processed`);
          return true;
        } else {
          throw new Error(`Message ${messageId} not yet processed`);
        }
      },
      delayMs,
      maxAttempts,
    );
    return true;
  }

  async waitForMessageIdProcessedFuel(
    messageId: string,
    destination: ChainName,
    mailboxAddress: string,
    multiProtocolProvider: MultiProtocolProvider,
    delayMs?: number,
    maxAttempts?: number,
  ): Promise<true> {
    await pollAsync(
      async () => {
        this.logger.debug(`Checking if message ${messageId} was processed`);
        const mailbox = new FuelCoreAdapter(
          destination,
          multiProtocolProvider,
          {
            mailbox: mailboxAddress,
          },
        );
        const delivered = await mailbox.delivered(messageId);
        if (delivered) {
          this.logger.info(`Message ${messageId} was processed`);
          return true;
        } else {
          throw new Error(`Message ${messageId} not yet processed`);
        }
      },
      delayMs,
      maxAttempts,
    );
    return true;
  }

  waitForMessageProcessing(
    sourceTx: ethers.ContractReceipt | ViemTxReceipt,
  ): Promise<ethers.ContractReceipt[]> {
    const messages = HyperlaneCore.getDispatchedMessages(sourceTx);
    return Promise.all(messages.map((msg) => this.waitForProcessReceipt(msg)));
  }

  // TODO consider renaming this, all the waitForMessage* methods are confusing
  async waitForMessageProcessed(
    sourceTx: ethers.ContractReceipt | ViemTxReceipt,
    delay?: number,
    maxAttempts?: number,
  ): Promise<void> {
    const messages = HyperlaneCore.getDispatchedMessages(sourceTx);
    await Promise.all(
      messages.map((msg) =>
        this.waitForMessageIdProcessed(
          msg.id,
          this.getDestination(msg),
          delay,
          maxAttempts,
        ),
      ),
    );
    this.logger.info(
      `All messages processed for tx ${sourceTx.transactionHash}`,
    );
  }

  async waitForMessageDispatchedFromFuelProcessed(
    messages: [DispatchedMessage],
    sourceTx: ethers.ContractReceipt | ViemTxReceipt,
    delay?: number,
    maxAttempts?: number,
  ): Promise<void> {
    const originChainName = this.getOrigin(messages[0]);
    const originChainId = this.multiProvider.getChainId(originChainName);
    const destinationChainName = this.getDestination(messages[0]);
    const sender = messages[0].parsed.sender;

    const msg_id = await this.getProcessedMessages(
      originChainId.toString(),
      destinationChainName,
      sender,
    );
    this.logger.warn(
      'msg_id on remote mailbox',
      JSON.stringify(msg_id, null, 4),
    );

    await Promise.all(
      messages.map((msg) =>
        this.waitForMessageIdProcessed(
          msg_id,
          this.getDestination(msg),
          delay,
          maxAttempts,
        ),
      ),
    );
    this.logger.info(
      `All messages processed for tx ${sourceTx.transactionHash}`,
    );
  }

  async waitForMessageProcessedOnFuel(
    sourceTx: ethers.ContractReceipt | ViemTxReceipt,
    mailboxAddress: string,
    multiProtocolProvider: MultiProtocolProvider,
    delay?: number,
    maxAttempts?: number,
  ): Promise<void> {
    const messages = HyperlaneCore.getDispatchedMessages(sourceTx);
    await Promise.all(
      messages.map((msg) =>
        this.waitForMessageIdProcessedFuel(
          msg.id,
          this.getDestination(msg),
          mailboxAddress,
          multiProtocolProvider,
          delay,
          maxAttempts,
        ),
      ),
    );
    this.logger.debug(
      `All messages processed for tx ${sourceTx.transactionHash}`,
    );
  }

  // Redundant with static method but keeping for backwards compatibility
  getDispatchedMessages(
    sourceTx: TransactionReceipt | ViemTxReceipt,
  ): DispatchedMessage[] {
    const messages = HyperlaneCore.getDispatchedMessages(sourceTx);
    return messages.map(({ parsed, ...other }) => {
      const originChain =
        this.multiProvider.tryGetChainName(parsed.origin) ?? undefined;
      const destinationChain =
        this.multiProvider.tryGetChainName(parsed.destination) ?? undefined;
      return { parsed: { ...parsed, originChain, destinationChain }, ...other };
    });
  }

  async getDispatchTx(
    originChain: ChainName,
    messageId: string,
    blockNumber?: number,
  ): Promise<TransactionReceipt> {
    const mailbox = this.contractsMap[originChain].mailbox;
    const filter = mailbox.filters.DispatchId(messageId);

    const { fromBlock, toBlock } = blockNumber
      ? { toBlock: blockNumber, fromBlock: blockNumber }
      : await this.multiProvider.getLatestBlockRange(originChain);

    const matching = await mailbox.queryFilter(filter, fromBlock, toBlock);
    if (matching.length === 0) {
      throw new Error(`No dispatch event found for message ${messageId}`);
    }

    assert(matching.length === 1, 'Multiple dispatch events found');
    const event = matching[0]; // only 1 event per message ID
    return event.getTransactionReceipt();
  }

  static parseDispatchedMessage(message: string): DispatchedMessage {
    const parsed = parseMessage(message);
    const id = messageId(message);
    return { id, message, parsed };
  }

  static getDispatchedMessages(
    sourceTx: TransactionReceipt | ViemTxReceipt,
  ): DispatchedMessage[] {
    const mailbox = Mailbox__factory.createInterface();
    const dispatchLogs = findMatchingLogEvents(
      sourceTx.logs,
      mailbox,
      'Dispatch',
    );
    return dispatchLogs.map((log) => {
      const message = log.args['message'];
      const parsed = parseMessage(message);
      const id = messageId(message);
      return { id, message, parsed };
    });
  }

  async getProcessedMessages(
    origin: string,
    destination: ChainName,
    sender: Address,
  ): Promise<string> {
    const mailbox = this.contractsMap[destination].mailbox;
    const filter = mailbox.filters.Process(origin, sender);
    const filter2 = mailbox.filters.ProcessId();

    const { fromBlock, toBlock } = await this.multiProvider.getLatestBlockRange(
      destination,
    );
    const messageRecieved = await mailbox.queryFilter(
      filter,
      fromBlock,
      toBlock,
    );
    const checkFrom = messageRecieved[0].blockHash;

    const messageProcessed = await mailbox.queryFilter(filter2, checkFrom);
    const messageId = messageProcessed[0].topics[1];
    return messageId;
  }

  /**
   * Extract dispatched messages from Fuel transaction results
   * @param fuelTxResult The Fuel transaction result
   * @returns Array of dispatched messages
   */
  static getDispatchedMessagesFromFuel(
    fuelTx: TransactionResult<any>,
    origin: number,
    sender: string,
    recipientRoute: string,
    amount: string,
  ): DispatchedMessage {
    const messageId = fuelTx.id;

    if (!messageId) {
      throw new Error('No message ID found in Fuel transaction logs');
    }

    // last log from fuel WR contains destination domain, recipient_user and amount
    const destinationLog: any = fuelTx.logs?.[fuelTx.logs?.length - 1];

    if (!destinationLog) {
      throw new Error(
        'No destination/recipient information found in Fuel transaction logs',
      );
    }

    const destination = destinationLog.destination;
    const recipient = destinationLog.recipient;

    const recipientBytes = ethers.utils.hexZeroPad(recipient, 32);
    const amountBytes = ethers.utils.hexZeroPad(`0x${amount.toString()}`, 32);

    const body = ethers.utils.hexConcat([recipientBytes, amountBytes]);

    const parsed: ParsedMessage = {
      version: 3,
      nonce: 0, //TODO: Check here
      origin,
      sender,
      destination,
      recipient: recipientRoute,
      body,
    };

    const versionHex = ethers.utils.hexZeroPad(
      `0x${parsed.version.toString(16)}`,
      1,
    );
    const nonceHex = ethers.utils.hexZeroPad(
      `0x${parsed.nonce.toString(16)}`,
      4,
    );
    const senderHex = ethers.utils.hexZeroPad(sender, 32);
    const destinationHex = ethers.utils.hexZeroPad(
      `0x${destination.toString(16)}`,
      4,
    );

    const message = ethers.utils.hexConcat([
      versionHex,
      nonceHex,
      senderHex,
      destinationHex,
      recipientBytes,
      amountBytes,
    ]);

    return { id: messageId, message, parsed };
  }
}
