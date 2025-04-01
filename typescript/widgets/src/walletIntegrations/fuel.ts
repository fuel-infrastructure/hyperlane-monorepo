import { TransactionReceipt } from '@ethersproject/providers';
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
import { BigNumber } from 'ethers';
import {
  ScriptTransactionRequest,
  TransactionResult,
  WalletLocked,
} from 'fuels';
import { useCallback, useMemo } from 'react';

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
  const fallbackName = 'Fuel Wallet';

  return useMemo(() => {
    if (connectors && connectors.length > 0) {
      const connector = connectors[0];

      const name = connector.name || fallbackName;
      const logoUrl = FALLBACK_LOGO;

      return {
        name,
        logoUrl,
      };
    }

    return {
      fallbackName,
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
      chainName: _chainName,
      activeChainName: _activeChainName,
    }: {
      tx: WarpTypedTransaction;
      chainName: ChainName;
      activeChainName?: ChainName;
    }) => {
      if (!wallet) throw new Error('Fuel wallet not connected');
      if (tx.type !== ProviderType.Fuels) {
        throw new Error(`Invalid Fuel provider type ${tx.type}`);
      }

      const transactionRequest: ScriptTransactionRequest =
        await buildTransactionRequest(wallet, tx);

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
            fuelReceipt.receipts ?? [],
          );
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

const FALLBACK_LOGO =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzU0IiBoZWlnaHQ9IjM1NCIgdmlld0JveD0iMCAwIDM1NCAzNTQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgY2xpcC1wYXRoPSJ1cmwoI2EpIj48cGF0aCBkPSJNMjMuNDg2IDBBMjMuNDggMjMuNDggMCAwIDAgMCAyMy40ODJ2MzI5LjY4NWgyOTIuMjY4YTM3LjMgMzcuMyAwIDAgMCAyNi4zODktMTAuOTIybDIzLjY4MS0yMy42NzFhMzcuMyAzNy4zIDAgMCAwIDEwLjkyMS0yNi4zNjZWMHoiIGZpbGw9IiMwMEY1OEMiLz48cGF0aCBkPSJNNTcuMjU1IDQ1LjQwN2gxNzMuMzc5TDExNS43NTkgMTYwLjI2YTE1LjIxIDE1LjIxIDAgMCAxLTI0LjQ5NS00LjI1TDQ2Ljc1OSA2MS45MzVhMTEuNTczIDExLjU3MyAwIDAgMSAxMC40OTYtMTYuNTI4TTQ1LjQxNyAzMDcuNzQxVjE5Ni4wMDVhMTAuNzk1IDEwLjc5NSAwIDAgMSAxMC43OTYtMTAuNzkyaDExMS43NzN6bTE1MS4wNi0xNTEuMDFhMjcuMjYgMjcuMjYgMCAwIDEtMTkuMjY5IDcuOTc3aC0zN0wyNTEuNTU1IDUzLjM4NGEyNy4yNyAyNy4yNyAwIDAgMSAxOS4yNjktNy45NzdoMzd6IiBmaWxsPSIjMDAwIi8+PC9nPjxkZWZzPjxjbGlwUGF0aCBpZD0iYSI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTAgMGgzNTMuMjQxdjM1My4yNDFIMHoiLz48L2NsaXBQYXRoPjwvZGVmcz48L3N2Zz4=';
