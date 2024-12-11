import { HexString, assert, pollAsync } from '@hyperlane-xyz/utils';

import { BaseFuelAdapter } from '../../app/MultiProtocolApp.js';
import {
  DispatchEventOutput,
  DispatchIdEventOutput,
  Mailbox,
} from '../../fuel-types/Mailbox.js';
import {
  ProviderType,
  TypedTransactionReceipt,
} from '../../providers/ProviderType.js';
import { ChainName } from '../../types.js';

import { ICoreAdapter } from './types.js';

export class FuelCoreAdapter extends BaseFuelAdapter implements ICoreAdapter {
  private mailbox: Mailbox | undefined;

  extractMessageIds(
    fuelLogs: TypedTransactionReceipt,
  ): Array<{ messageId: HexString; destination: ChainName }> {
    assert(
      fuelLogs.type === ProviderType.Fuels,
      `Unsupported provider type for FuelCoreAdapter ${fuelLogs.type}`,
    );

    const dispatchIdEvents = fuelLogs.receipt.filter((log) =>
      this.isDispatchIdEventOutput(log),
    );
    const dispatchEvents = fuelLogs.receipt.filter((log) =>
      this.isDispatchEventOutput(log),
    );

    assert(
      dispatchIdEvents.length === dispatchEvents.length,
      'Mismatched dispatch and dispatch id events',
    );
    const result: Array<{ messageId: string; destination: ChainName }> = [];
    for (let i = 0; i < dispatchIdEvents.length; i++) {
      const messageId = dispatchIdEvents[i].message_id;
      const destinationDomain = dispatchEvents[i].destination_domain;
      assert(messageId, 'No message id attribute found in dispatch event');
      assert(
        destinationDomain,
        'No destination attribute found in dispatch event',
      );
      result.push({
        messageId,
        destination: this.multiProvider.getChainName(destinationDomain),
      });
    }
    return result;
  }

  isDispatchEventOutput(value: any): value is DispatchEventOutput {
    return (
      typeof value === 'object' &&
      value !== null &&
      typeof value.sender === 'string' &&
      typeof value.destination_domain === 'number' &&
      typeof value.recipient_address === 'string'
    );
  }

  isDispatchIdEventOutput(value: any): value is DispatchIdEventOutput {
    return (
      typeof value === 'object' &&
      value !== null &&
      typeof value.message_id === 'string'
    );
  }

  async getMailboxInstance(): Promise<Mailbox> {
    if (this.mailbox) return Promise.resolve(this.mailbox);

    const provider = await this.multiProvider.getFuelProvider(this.chainName);
    this.mailbox = new Mailbox(this.addresses.mailbox, provider);
    return this.mailbox;
  }

  async isMessageDelivered(messageId: HexString): Promise<boolean> {
    const mailbox = await this.getMailboxInstance();
    return (await mailbox.functions.delivered(messageId).simulate()).value;
  }

  async pollMessageDelivery(
    messageId: HexString,
    delayMs?: number,
    maxAttempts?: number,
  ): Promise<boolean> {
    await pollAsync(
      async () => {
        this.logger.debug(`Checking if message ${messageId} was delivered`);
        const delivered = await this.isMessageDelivered(messageId);
        assert(delivered, `Message ${messageId} not yet delivered`);
        this.logger.info(`Message ${messageId} was delivered`);
        return true;
      },
      delayMs,
      maxAttempts,
    );
    return true;
  }

  waitForMessageProcessed(
    messageId: HexString,
    _destination: ChainName,
    delayMs?: number,
    maxAttempts?: number,
  ): Promise<boolean> {
    return this.pollMessageDelivery(messageId, delayMs, maxAttempts);
  }
}
