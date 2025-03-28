import {
  useAccount,
  useChain,
  useConnect,
  useConnectors,
  useDisconnect,
  useIsConnected,
  useNetwork,
  useWallet,
} from '@fuel-wallet/react';
import {
  ScriptTransactionRequest,
  TransactionResult,
  WalletLocked,
} from 'fuels';
import { useCallback, useMemo } from 'react';
import { TransactionReceipt } from 'viem';

import {
  ChainName,
  MultiProtocolProvider,
  ProviderType,
  TypedTransactionReceipt,
  WarpTypedTransaction,
} from '@hyperlane-xyz/sdk';
import {
  ProtocolType, //  assert,
  sleep,
} from '@hyperlane-xyz/utils';

import { widgetLogger } from '../logger.js';

import {
  AccountInfo,
  ActiveChainInfo,
  ChainAddress,
  ChainTransactionFns,
  WalletDetails,
} from './types.js';
import { getChainsForProtocol } from './utils.js';

const logger = widgetLogger.child({
  module: 'widgets/walletIntegrations/fuel',
});

export function useFuelAccount(
  multiProvider: MultiProtocolProvider,
): AccountInfo {
  const { account } = useAccount();
  const { isConnected } = useIsConnected();

  return useMemo<AccountInfo>(() => {
    const addresses: Array<ChainAddress> = [];
    if (account) {
      const fuelChains = getChainsForProtocol(multiProvider, ProtocolType.Fuel);
      fuelChains.forEach((chain) => {
        addresses.push({ address: account, chainName: chain.name });
      });
    }

    return {
      protocol: ProtocolType.Fuel,
      addresses,
      publicKey: undefined,
      isReady: !!isConnected,
    };
  }, [account, isConnected, multiProvider]);
}

export function useFuelWalletDetails(): WalletDetails {
  const { connectors } = useConnectors();
  const fallbackLogoUrl =
    'https://lh3.googleusercontent.com/ijHTW6G_oiJd7Dy4U_Lc4SLHQ_MaKj1XK2vbaqSMakuAVoOC1wCSRneovRrdxLxyfuN4lsPOYoNeMFL0RsUR_afivg=s120';
  const fallbackName = 'Fuel Wallet';

  return useMemo(() => {
    if (connectors && connectors.length > 0) {
      const connector = connectors[0];
      // logger.warn(connector.metadata?.image);

      const name = connector.metadata?.name || fallbackName;
      const logoUrl = fallbackLogoUrl;

      return {
        name,
        logoUrl,
      };
    }

    // Default fallback
    return {
      name: fallbackName,
      logoUrl: fallbackLogoUrl,
    };
  }, [connectors]);
}

export function useFuelConnectFn(): () => void {
  const { connect } = useConnect();
  const { connectors } = useConnectors();

  return useCallback(() => {
    if (!connectors || connectors.length === 0) {
      logger.warn(
        'No Fuel wallet connectors found. Please install a Fuel wallet extension.',
      );
      return;
    }

    // Find the first available Fuel wallet connector
    const fuelConnector = connectors.find(
      (c) =>
        c.name === 'Fuel Wallet' ||
        c.name === 'Fuelet Wallet' ||
        c.name.toLowerCase().includes('fuel'),
    );

    if (fuelConnector) {
      return connect(fuelConnector.name);
    } else {
      // If no specific Fuel connector found, use the first available
      return connect(connectors[0].name);
    }
  }, [connect, connectors]);
}

export function useFuelDisconnectFn(): () => Promise<void> {
  const { disconnect } = useDisconnect();
  return useCallback(async () => {
    await disconnect();
  }, [disconnect]);
}

export function useFuelActiveChain(
  _multiProvider: MultiProtocolProvider,
): ActiveChainInfo {
  const { network } = useNetwork();
  const { isConnected } = useIsConnected();
  const { chain } = useChain();

  // logger.warn('Chain in useFuelActiveChain:', chain);
  // logger.warn('Network in useFuelActiveChain:', network);
  return useMemo<ActiveChainInfo>(
    () => ({
      chainDisplayName: chain?.name,
      chainName: network ? network.chainName : 'fueltestnet',
      // multiProvider.tryGetChainMetadata(network.chainId)?.name,
      isConnected: !!isConnected,
    }),
    [chain, isConnected, network],
  );
}

export function useFuelTransactionFns(
  multiProvider: MultiProtocolProvider,
): ChainTransactionFns {
  const { wallet } = useWallet();
  // const { network } = useNetwork();

  const onSwitchNetwork = useCallback(
    async (chainName: ChainName) => {
      if (!wallet?.switchNetwork) {
        throw new Error('Fuel wallet does not support switching networks');
      }
      const chainId = multiProvider.getChainMetadata(chainName).chainId;
      await wallet.switchNetwork(chainId);
      // Some wallets need a brief pause after switch
      await sleep(2000);
    },
    [wallet, multiProvider],
  );

  const onSendTx = useCallback(
    async ({
      tx,
      chainName,
      activeChainName,
    }: {
      tx: WarpTypedTransaction;
      chainName: ChainName;
      activeChainName?: ChainName;
    }) => {
      if (!wallet) throw new Error('Fuel wallet not connected');
      if (tx.type !== ProviderType.Fuels) {
        throw new Error(`Invalid Fuel provider type ${tx.type}`);
      }

      // if (activeChainName && activeChainName !== chainName) {
      //   await onSwitchNetwork(chainName);
      //   throw new Error(`Invalid activeChainName, not equal to ${chainName}`);
      // }

      // // Verify chain after switch
      // const chainId = multiProvider.getChainMetadata(chainName).chainId;
      // assert(
      //   network?.chainId === chainId,
      //   `Wallet not on chain ${chainName} (ChainMismatchError) - {activeChainName}`,
      // );

      logger.warn(
        `Sending tx on chain ${activeChainName ?? 'activeChainName undefined'}`,
      );
      logger.warn(`Sending tx on chain ${chainName}`);
      const transactionRequest = await buildTransactionRequest(wallet, tx);

      return {
        hash: transactionRequest.flag.transactionId ?? '',
        confirm: async (): Promise<TypedTransactionReceipt> => {
          const response = await wallet.sendTransaction(transactionRequest);
          const receipt: TransactionReceipt[] = [];
          const fuelReceipt = await response.waitForResult();
          const evmCompatibleReciept = fuelTxToEvmReceipt(
            fuelReceipt,
            wallet.address.toString(),
            wallet.address.toString(),
          );
          logger.warn('evmCompatibleReciept: ', evmCompatibleReciept);
          receipt.push(evmCompatibleReciept);
          return {
            type: ProviderType.Fuels,
            receipt,
          };
        },
      };
    },
    [wallet],
  );

  return { sendTransaction: onSendTx, switchNetwork: onSwitchNetwork };
}

async function buildTransactionRequest(
  wallet: WalletLocked,
  transferTx: WarpTypedTransaction,
) {
  if (transferTx.type !== ProviderType.Fuels) {
    throw Error('transferTx.type not equal to ProviderType.Fuels');
  }
  const request = new ScriptTransactionRequest(transferTx.transaction);

  const cost = await wallet.getTransactionCost(request);
  request.addVariableOutputs(cost.outputVariables);
  request.gasLimit = cost.gasUsed;
  request.maxFee = cost.maxFee;

  await wallet.fund(request, cost);
  return request;
}

function fuelTxToEvmReceipt(
  fuelTx: TransactionResult<any>,
  from: string,
  to: string,
): TransactionReceipt {
  const gasUsed = fuelTx.gasUsed
    ? BigInt(fuelTx.gasUsed.toString().replace(/^0x/, ''))
    : BigInt(0);

  const tip = fuelTx.tip
    ? BigInt(fuelTx.tip.toString().replace(/^0x/, ''))
    : BigInt(0);

  return {
    to: `0x${to}`,
    from: `0x${from}`,
    contractAddress: `0x${fuelTx.id}`,
    transactionIndex: 0,
    gasUsed: gasUsed,
    logsBloom: '0x',
    blockHash: `0x${fuelTx.blockId || '0'}`,
    transactionHash: `0x${fuelTx.id || '0'}`,
    logs: [],
    blockNumber: BigInt(fuelTx.blockId?.toString() || 0),
    cumulativeGasUsed: gasUsed,
    effectiveGasPrice: tip,
    type: '0',
    status: fuelTx.isStatusSuccess ? 'success' : 'reverted',
  };
}
