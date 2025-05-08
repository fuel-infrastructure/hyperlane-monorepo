import { TransactionReceipt } from '@ethersproject/providers';
import {
  useAccount,
  useChain,
  useConnect,
  useConnectors,
  useCurrentConnector,
  useDisconnect,
  useIsConnected,
  useSelectNetwork,
  useWallet,
} from '@fuels/react';
import { BigNumber } from 'ethers';
import { TransactionResult } from 'fuels';
import { useCallback, useMemo } from 'react';

import {
  ChainName,
  MultiProtocolProvider,
  ProviderType,
  TypedTransactionReceipt,
  WarpTypedTransaction,
} from '@hyperlane-xyz/sdk';
import { ProtocolType, assert, sleep } from '@hyperlane-xyz/utils';

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
      isReady: !!isConnected,
    };
  }, [account, isConnected, multiProvider]);
}

export function useFuelWalletDetails(): WalletDetails {
  const { currentConnector } = useCurrentConnector();

  const name = currentConnector?.name;
  const logoUrl =
    typeof currentConnector?.metadata?.image === 'string'
      ? currentConnector.metadata.image
      : currentConnector?.metadata.image?.light;

  return useMemo<WalletDetails>(
    () => ({
      name,
      logoUrl,
    }),
    [name, logoUrl],
  );
}

export function useFuelConnectFn(): () => void {
  const { connect } = useConnect();
  const { connectors } = useConnectors();

  return useCallback(() => {
    if (!connectors || connectors.length === 0) {
      throw new Error(
        'No Fuel wallet connectors found. Please install a Fuel wallet extension.',
      );
    }
    const fuelConnector = connectors.find((c) => c.name === 'Fuel Wallet');
    return connect(fuelConnector?.name || connectors[0].name);
  }, [connect, connectors]);
}

export function useFuelDisconnectFn(): () => Promise<void> {
  const { disconnect } = useDisconnect();
  return useCallback(async () => {
    await disconnect();
  }, [disconnect]);
}

export function useFuelActiveChain(multiProvider) {
  const { isConnected } = useIsConnected();
  const { chain } = useChain();
  const { wallet } = useWallet();
  const TESTNET_NAME = 'fueltestnet';
  const MAINNET_NAME = 'fuelignition';
  const testnetProvider =
    multiProvider.getChainMetadata(TESTNET_NAME).rpcUrls[0].http;

  return useMemo<ActiveChainInfo>(() => {
    if (!isConnected || !wallet) return {};
    return {
      chainDisplayName: chain?.name,
      chainName:
        wallet.provider.url == testnetProvider ? TESTNET_NAME : MAINNET_NAME,
      isConnected,
    };
  }, [chain, isConnected, wallet, testnetProvider]);
}
export function useFuelTransactionFns(
  multiProvider: MultiProtocolProvider,
): ChainTransactionFns {
  const { wallet } = useWallet();
  const { selectNetwork } = useSelectNetwork();

  const onSwitchNetwork = useCallback(
    async (chainName: ChainName) => {
      if (!selectNetwork) {
        throw new Error('Fuel wallet does not support switching networks');
      }
      const chainMetadata = multiProvider.getChainMetadata(chainName);
      const url = chainMetadata.rpcUrls[0].http;
      await wallet?.provider.connect(url);
      await sleep(5000);
    },
    [multiProvider, selectNetwork, wallet],
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

      logger.debug('Checking wallet current chain');
      if (activeChainName && activeChainName !== chainName) {
        await onSwitchNetwork(chainName);
      }

      const chainMetadata = multiProvider.getChainMetadata(chainName);
      assert(
        wallet.provider &&
          wallet.provider.url === chainMetadata.rpcUrls[0].http,
        `Wallet on ${activeChainName} not on chain ${chainName} (ChainMismatchError)`,
      );

      return {
        hash: '',
        confirm: async (): Promise<TypedTransactionReceipt> => {
          const receipt: TransactionReceipt[] = [];
          const txResult = await (
            await wallet.sendTransaction(tx.transaction)
          ).waitForResult();
          const evmCompatibleReceipt = fuelTxToEvmReceipt(
            txResult,
            wallet.address.toString(),
            wallet.address.toString(),
            txResult.receipts ?? [],
          );
          receipt.push(evmCompatibleReceipt);
          return {
            type: ProviderType.Fuels,
            receipt,
          };
        },
      };
    },
    [wallet, onSwitchNetwork, multiProvider],
  );

  return { sendTransaction: onSendTx, switchNetwork: onSwitchNetwork };
}

function fuelTxToEvmReceipt(
  fuelTx: TransactionResult<any>,
  from: string,
  to: string,
  logs: any[],
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
    logs,
    blockNumber: 0,
    confirmations: 0,
    cumulativeGasUsed: gasUsed,
    effectiveGasPrice: tip,
    byzantium: true,
    type: 0,
  };
}
