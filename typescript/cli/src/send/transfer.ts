import { TransactionReceipt } from '@ethersproject/providers';
import { BigNumber } from 'ethers';
import {
  Address,
  ScriptTransactionRequest,
  TransactionResult,
  WalletUnlocked,
} from 'fuels';
import { stringify as yamlStringify } from 'yaml';

import {
  ChainName,
  DispatchedMessage,
  HyperlaneCore,
  HyperlaneRelayer,
  MultiProtocolProvider,
  MultiProvider,
  ProviderType,
  Token,
  TokenAmount,
  WarpCore,
  WarpCoreConfig, // FuelCoreAdapter,
} from '@hyperlane-xyz/sdk';
import {
  ProtocolType,
  parseWarpRouteMessage,
  timeout,
} from '@hyperlane-xyz/utils';

import { EXPLORER_URL, MINIMUM_TEST_SEND_GAS } from '../consts.js';
import { WriteCommandContext } from '../context/types.js';
import { runPreflightChecksForChains } from '../deploy/utils.js';
import { log, logBlue, logGreen, logRed } from '../logger.js';
import { indentYamlOrJson } from '../utils/files.js';
import { stubMerkleTreeConfig } from '../utils/relay.js';
import { runTokenSelectionStep } from '../utils/tokens.js';

export const WarpSendLogs = {
  SUCCESS: 'Transfer was self-relayed!',
};

export async function sendTestTransfer({
  context,
  warpCoreConfig,
  chains,
  amount,
  recipient,
  timeoutSec,
  skipWaitForDelivery,
  selfRelay,
}: {
  context: WriteCommandContext;
  warpCoreConfig: WarpCoreConfig;
  chains: ChainName[];
  amount: string;
  recipient?: string;
  timeoutSec: number;
  skipWaitForDelivery: boolean;
  selfRelay?: boolean;
}) {
  await runPreflightChecksForChains({
    context,
    chains,
    minGas: MINIMUM_TEST_SEND_GAS,
  });

  const { multiProvider } = context;

  for (let i = 0; i < chains.length; i++) {
    const origin = chains[i];
    const destination = chains[i + 1];

    const originProtocol = multiProvider.getProtocol(origin);

    if (destination) {
      logBlue(`Sending a message from ${origin} to ${destination}`);

      if (originProtocol === ProtocolType.Fuel) {
        await timeout(
          executeFuelDelivery({
            context,
            origin,
            destination,
            warpCoreConfig,
            amount,
            recipient,
            skipWaitForDelivery,
            selfRelay,
          }),
          timeoutSec * 1000,
          'Timed out waiting for messages to be delivered',
        );
      } else {
        await timeout(
          executeDelivery({
            context,
            origin,
            destination,
            warpCoreConfig,
            amount,
            recipient,
            skipWaitForDelivery,
            selfRelay,
          }),
          timeoutSec * 1000,
          'Timed out waiting for messages to be delivered',
        );
      }
    }
  }

  async function executeDelivery({
    context,
    origin,
    destination,
    warpCoreConfig,
    amount,
    recipient,
    skipWaitForDelivery,
    selfRelay,
  }: {
    context: WriteCommandContext;
    origin: ChainName;
    destination: ChainName;
    warpCoreConfig: WarpCoreConfig;
    amount: string;
    recipient?: string;
    skipWaitForDelivery: boolean;
    selfRelay?: boolean;
  }) {
    const { multiProvider, registry, multiProtocolProvider } = context;

    const signer = multiProvider.getSigner(origin);
    const signerAddress = await signer.getAddress();

    const destinationProtocol = multiProvider.getProtocol(destination);
    let recipientSigner;
    let recipientAddress: string;

    const isDestinationFuel = destinationProtocol === ProtocolType.Fuel;

    if (isDestinationFuel) {
      recipientSigner = (await multiProtocolProvider.tryGetSigner(
        ProtocolType.Fuel,
        destination,
      )) as unknown as WalletUnlocked;
      recipientAddress = await recipientSigner.address.toString();
    } else {
      recipientSigner = multiProvider.getSigner(destination);
      recipientAddress = await recipientSigner.getAddress();
    }

    recipient ||= recipientAddress;

    const chainAddresses = await registry.getAddresses();
    const core = HyperlaneCore.fromAddressesMap(chainAddresses, multiProvider);

    const provider = multiProvider.getProvider(origin);
    const connectedSigner = signer.connect(provider);

    let warpCore;
    if (isDestinationFuel) {
      warpCore = await WarpCore.FromConfigWithFuel(
        MultiProtocolProvider.fromMultiProvider(multiProvider),
        warpCoreConfig,
        recipientSigner as WalletUnlocked,
        origin,
      );
    } else {
      warpCore = WarpCore.FromConfig(
        MultiProtocolProvider.fromMultiProvider(multiProvider),
        warpCoreConfig,
      );
    }

    let token: Token;
    const tokensForRoute = warpCore.getTokensForRoute(origin, destination);
    if (tokensForRoute.length === 0) {
      logRed(`No Warp Routes found from ${origin} to ${destination}`);
      throw new Error('Error finding warp route');
    } else if (tokensForRoute.length === 1) {
      token = tokensForRoute[0];
    } else {
      logBlue(`Please select a token from the Warp config`);
      const routerAddress = await runTokenSelectionStep(tokensForRoute);
      token = warpCore.findToken(origin, routerAddress)!;
    }

    const errors = await warpCore.validateTransfer({
      originTokenAmount: token.amount(amount),
      destination,
      recipient,
      sender: signerAddress,
    });
    if (errors) {
      logRed('Error validating transfer', JSON.stringify(errors));
      throw new Error('Error validating transfer');
    }

    // TODO: override hook address for self-relay
    const transferTxs = await warpCore.getTransferRemoteTxs({
      originTokenAmount: new TokenAmount(amount, token),
      destination,
      sender: signerAddress,
      recipient,
    });

    const txReceipts = [];
    for (const tx of transferTxs) {
      if (tx.type === ProviderType.EthersV5) {
        const txResponse = await connectedSigner.sendTransaction(
          tx.transaction,
        );
        const txReceipt = await multiProvider.handleTx(origin, txResponse);
        txReceipts.push(txReceipt);
      }
    }
    const transferTxReceipt = txReceipts[txReceipts.length - 1];
    const messageIndex: number = 0;
    const message: DispatchedMessage =
      HyperlaneCore.getDispatchedMessages(transferTxReceipt)[messageIndex];

    const parsed = parseWarpRouteMessage(message.parsed.body);

    logBlue(
      `Sent transfer from sender (${signerAddress}) on ${origin} to recipient (${recipient}) on ${destination}.`,
    );
    logBlue(`Message ID: ${message.id}`);
    logBlue(`Explorer Link: ${EXPLORER_URL}/message/${message.id}`);
    log(`Message:\n${indentYamlOrJson(yamlStringify(message, null, 2), 4)}`);
    log(`Body:\n${indentYamlOrJson(yamlStringify(parsed, null, 2), 4)}`);

    if (selfRelay) {
      const relayer = new HyperlaneRelayer({ core });
      const mailbox = chainAddresses[destination].mailbox;

      const hookAddress = await core.getSenderHookAddress(message);

      const merkleAddress = chainAddresses[origin].merkleTreeHook;
      logBlue('merkle tree adress', merkleAddress);
      stubMerkleTreeConfig(relayer, origin, hookAddress, merkleAddress);

      log('Attempting self-relay of transfer...');
      isDestinationFuel
        ? await relayer.relayMessageToFuel(
            transferTxReceipt,
            messageIndex,
            message,
            multiProtocolProvider,
            mailbox,
          )
        : await relayer.relayMessage(transferTxReceipt, messageIndex, message);
      logGreen(WarpSendLogs.SUCCESS);
      return;
    }

    if (skipWaitForDelivery) return;

    // Max wait 10 minutes
    if (isDestinationFuel) {
      const mailbox = chainAddresses[destination].mailbox;
      await core.waitForMessageProcessedOnFuel(
        transferTxReceipt,
        mailbox,
        multiProtocolProvider,
        10000,
        60,
      );
    } else {
      await core.waitForMessageProcessed(transferTxReceipt, 10000, 60);
    }
    logGreen(`Transfer sent to ${destination} chain!`);
  }
}

async function getSignerAndSignerAddress(
  multiProtocolProvider: MultiProtocolProvider,
  multiProvider: MultiProvider,
  chain: ChainName,
) {
  const protocol = multiProvider.getProtocol(chain);
  if (protocol === ProtocolType.Fuel) {
    const signer = (await multiProtocolProvider.getSigner(
      protocol,
      chain,
    )) as WalletUnlocked;

    return {
      protocol,
      signer,
      signerAddress: signer.address.toString(),
    };
  } else {
    const signer = multiProvider.getSigner(chain);
    const signerAddress = await signer.getAddress();
    return {
      protocol,
      signer,
      signerAddress,
    };
  }
}

// TODO delete
function fuelTxToEvmReceipt(
  fuelTx: TransactionResult<any>,
  from: string,
  to: string,
): TransactionReceipt {
  const gasUsed = fuelTx.gasUsed
    ? BigNumber.from(fuelTx.gasUsed.toString().replace(/^0x/, ''))
    : BigNumber.from(0);

  const tip = fuelTx.tip
    ? BigNumber.from(fuelTx.tip.toString().replace(/^0x/, ''))
    : BigNumber.from(0);

  return {
    to,
    from,
    contractAddress: fuelTx.id,
    transactionIndex: 0,
    gasUsed: gasUsed,
    logsBloom: '0x',
    blockHash: fuelTx.blockId!,
    transactionHash: fuelTx.id,
    logs: [],
    blockNumber: 0,
    confirmations: 0,
    cumulativeGasUsed: gasUsed,
    effectiveGasPrice: tip,
    byzantium: true,
    type: 0,
  };
}

async function executeFuelDelivery({
  context,
  origin,
  destination,
  warpCoreConfig,
  amount,
  recipient,
  skipWaitForDelivery,
  selfRelay,
}: {
  context: WriteCommandContext;
  origin: ChainName;
  destination: ChainName;
  warpCoreConfig: WarpCoreConfig;
  amount: string;
  recipient?: string;
  skipWaitForDelivery: boolean;
  selfRelay?: boolean;
}) {
  const { multiProvider, registry, multiProtocolProvider } = context;

  const {
    signer,
    signerAddress: signerAddress,
    protocol: _originProtocol,
  } = await getSignerAndSignerAddress(
    multiProtocolProvider,
    multiProvider,
    origin,
  );
  if (!(signer instanceof WalletUnlocked)) {
    throw new Error("Signer isn't compatible with Fuel Network");
  }

  const {
    signer: _recipientSigner,
    signerAddress: recipientAddress,
    protocol: _destinationProtocol,
  } = await getSignerAndSignerAddress(
    multiProtocolProvider,
    multiProvider,
    destination,
  );

  recipient ||= recipientAddress;

  const chainAddresses = await registry.getAddresses();

  const core = HyperlaneCore.fromAddressesMap(chainAddresses, multiProvider);

  const warpCore = await WarpCore.FromConfigWithFuel(
    MultiProtocolProvider.fromMultiProvider(multiProvider),
    warpCoreConfig,
    signer,
    origin,
  );

  let token: Token;

  const tokensForRoute = warpCore.getTokensForRoute(origin, destination);
  if (tokensForRoute.length === 0) {
    logRed(`No Warp Routes found from ${origin} to ${destination}`);
    throw new Error('Error finding warp route');
  } else if (tokensForRoute.length === 1) {
    token = tokensForRoute[0];
  } else {
    logBlue(`Please select a token from the Warp config`);
    const routerAddress = await runTokenSelectionStep(tokensForRoute);
    token = warpCore.findToken(origin, routerAddress)!;
  }

  const errors = await warpCore.validateTransfer({
    originTokenAmount: token.amount(amount),
    destination,
    recipient,
    sender: signerAddress.toString(),
  });
  if (errors) {
    logRed('Error validating transfer', JSON.stringify(errors));
    throw new Error('Error validating transfer');
  }

  const [transferTxn] = await warpCore.getTransferRemoteTxs({
    originTokenAmount: new TokenAmount(amount, token),
    destination,
    sender: signerAddress.toString(),
    recipient,
  });

  if (transferTxn.type !== ProviderType.Fuels)
    throw new Error('Invalid transfer transaction');

  const request = new ScriptTransactionRequest(transferTxn.transaction);
  const txCost = await signer.getTransactionCost(request);
  const { gasUsed, missingContractIds, outputVariables, maxFee } = txCost;

  missingContractIds.forEach((contractId: string) => {
    request.addContractInputAndOutput(new Address(contractId));
  });

  request.addVariableOutputs(outputVariables);

  request.gasLimit = gasUsed;
  request.maxFee = maxFee;

  await signer.fund(request, txCost);
  const txResult = await (
    await signer.sendTransaction(request)
  ).waitForResult();

  const message = HyperlaneCore.getDispatchedMessagesFromFuel(txResult);

  logBlue(
    `Sent transfer from sender (${signerAddress}) on ${origin} to recipient (${recipient}) on ${destination}.`,
  );
  logBlue(`Message ID: ${message.id}`);
  log(`Message:\n${indentYamlOrJson(yamlStringify(message, null, 2), 4)}`);
  const parsed = parseWarpRouteMessage(message.parsed.body);
  log(`Body:\n${indentYamlOrJson(yamlStringify(parsed, null, 2), 4)}`);

  const evmCompatibleReciept = fuelTxToEvmReceipt(
    txResult,
    signer.address.toString(),
    token.addressOrDenom,
  );
  const mailbox = chainAddresses[origin].mailbox;

  if (selfRelay) {
    const relayer = new HyperlaneRelayer({ core });
    const hookAddress = await core.getSenderHookAddressFuel(
      message,
      mailbox,
      multiProtocolProvider,
    );

    const merkleAddress = chainAddresses[origin].merkleTreeHook;
    stubMerkleTreeConfig(relayer, origin, hookAddress, merkleAddress);

    log('Attempting self-relay of transfer...');
    await relayer.relayMessageFromFuel(
      evmCompatibleReciept,
      0,
      message,
      mailbox,
      multiProtocolProvider,
    );
    logGreen(WarpSendLogs.SUCCESS);
    return;
  }

  if (skipWaitForDelivery) return;

  // Max wait 10 minutes
  await core.waitForMessageDispatchedFromFuelProcessed(
    [message],
    txResult.id,
    5000,
    100,
  );
  logGreen(`Transfer sent to ${destination} chain!`);
}
