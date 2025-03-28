import {
  useAccount,
  useConnect,
  useDisconnect,
  useIsConnected,
  useNetwork,
  useWallet,
} from '@fuel-wallet/react';
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
      publicKey: undefined,
      isReady: !!isConnected,
    };
  }, [account, isConnected, multiProvider]);
}

export function useFuelWalletDetails(): WalletDetails {
  const { wallet } = useWallet();

  return useMemo<WalletDetails>(
    () => ({
      name: wallet?.name || 'Fuel Wallet',
      logoUrl: wallet?.icon,
    }),
    [wallet],
  );
}

export function useFuelConnectFn(): () => void {
  const { connect } = useConnect();
  return useCallback(() => connect(), [connect]);
}

export function useFuelDisconnectFn(): () => Promise<void> {
  const { disconnect } = useDisconnect();
  return useCallback(async () => {
    await disconnect();
  }, [disconnect]);
}

export function useFuelActiveChain(
  multiProvider: MultiProtocolProvider,
): ActiveChainInfo {
  const { network } = useNetwork();
  const { isConnected } = useIsConnected();

  return useMemo<ActiveChainInfo>(
    () => ({
      chainDisplayName: network?.name,
      chainName: network
        ? multiProvider.tryGetChainMetadata(network.chainId)?.name
        : undefined,
      isConnected: !!isConnected,
    }),
    [network, isConnected, multiProvider],
  );
}

export function useFuelTransactionFns(
  multiProvider: MultiProtocolProvider,
): ChainTransactionFns {
  const { wallet } = useWallet();
  const { network } = useNetwork();

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

      if (activeChainName && activeChainName !== chainName) {
        await onSwitchNetwork(chainName);
      }

      // Verify chain after switch
      const chainId = multiProvider.getChainMetadata(chainName).chainId;
      assert(
        network?.chainId === chainId,
        `Wallet not on chain ${chainName} (ChainMismatchError)`,
      );

      logger.debug(`Sending tx on chain ${chainName}`);
      const response = await wallet.sendTransaction(tx.transaction);

      const confirm = async (): Promise<TypedTransactionReceipt> => {
        const receipt = await response.wait();
        return {
          type: ProviderType.Fuels,
          receipt,
        };
      };

      return { hash: response.hash, confirm };
    },
    [wallet, network, onSwitchNetwork, multiProvider],
  );

  return { sendTransaction: onSendTx, switchNetwork: onSwitchNetwork };
}
