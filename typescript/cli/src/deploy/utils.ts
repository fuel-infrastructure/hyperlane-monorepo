import { confirm } from '@inquirer/prompts';
import { BigNumber, ethers } from 'ethers';
import 'fuels';

import {
  ChainMap,
  ChainMetadata,
  ChainName,
  IsmConfig,
  MultisigConfig,
  getLocalProvider,
} from '@hyperlane-xyz/sdk';
import { Address, ProtocolType } from '@hyperlane-xyz/utils';

import { parseIsmConfig } from '../config/ism.js';
import { CommandContext, WriteCommandContext } from '../context/types.js';
import {
  log,
  logBlue,
  logGray,
  logGreen,
  logPink,
  logTable,
} from '../logger.js';
import { nativeBalancesAreSufficient } from '../utils/balances.js';
import { ENV } from '../utils/env.js';
import { assertSigner } from '../utils/keys.js';

import { completeDryRun } from './dry-run.js';

export async function runPreflightChecksForChains({
  context,
  chains,
  minGas,
  chainsToGasCheck,
}: {
  context: WriteCommandContext;
  chains: ChainName[];
  minGas: string;
  // Chains for which to assert a native balance
  // Defaults to all chains if not specified
  chainsToGasCheck?: ChainName[];
}) {
  log('Running pre-flight checks for chains...');
  const { multiProvider, multiProtocolProvider } = context;

  if (!chains?.length) throw new Error('Empty chain selection');
  for (const chain of chains) {
    const chainProtocol = context.chainMetadata[chain].protocol;
    switch (chainProtocol) {
      case ProtocolType.Ethereum: {
        const metadata = multiProvider.tryGetChainMetadata(chain);
        if (!metadata) throw new Error(`No chain config found for ${chain}`);
        if (metadata.protocol !== ProtocolType.Ethereum)
          throw new Error('Invalid metadata protocol');
        const signer = multiProvider.getSigner(chain);
        assertSigner(signer);
        logGreen(`✅ ${chain} signer is valid`);

        break;
      }
      case ProtocolType.Fuel: {
        const metadata = multiProtocolProvider?.tryGetChainMetadata(chain);
        if (!metadata) throw new Error(`No chain config found for ${chain}`);
        if (metadata.protocol !== ProtocolType.Fuel)
          throw new Error('Invalid metadata protocol');

        const signer = await multiProtocolProvider?.getSigner(
          chainProtocol,
          chain,
        );
        logGreen(`signer type: ${typeof signer}`);
        if (signer) assertSigner(signer);
        logGreen(`✅ ${chain} signer is valid`);

        break;
      }
      default:
        throw new Error(`Unsupported protocol: ${chainProtocol}`);
    }
  }
  logGreen('✅ Chains are valid');

  await nativeBalancesAreSufficient(
    multiProvider,
    chainsToGasCheck ?? chains,
    minGas,
  );
}

export async function runDeployPlanStep({
  context,
  chain,
}: {
  context: WriteCommandContext;
  chain: ChainName;
}) {
  const {
    chainMetadata: chainMetadataMap,
    multiProvider,
    skipConfirmation,
  } = context;

  const address = await multiProvider.getSigner(chain).getAddress();

  logBlue('\nDeployment plan');
  logGray('===============');
  log(`Transaction signer and owner of new contracts: ${address}`);
  log(`Deploying core contracts to network: ${chain}`);
  const transformedChainMetadata = transformChainMetadataForDisplay(
    chainMetadataMap[chain],
  );
  logTable(transformedChainMetadata);
  log(
    `Note: There are several contracts required for each chain, but contracts in your provided registries will be skipped.`,
  );

  if (skipConfirmation) return;
  await confirmExistingMailbox(context, chain);
  const isConfirmed = await confirm({
    message: 'Is this deployment plan correct?',
  });
  if (!isConfirmed) throw new Error('Deployment cancelled');
}

async function confirmExistingMailbox(
  context: CommandContext,
  chain: ChainName,
) {
  const addresses = await context.registry.getChainAddresses(chain);
  if (addresses?.mailbox) {
    const isConfirmed = await confirm({
      message: `Mailbox already exists at ${addresses.mailbox}. Are you sure you want to deploy a new mailbox and overwrite existing registry artifacts?`,
      default: false,
    });

    if (!isConfirmed) {
      throw Error('Deployment cancelled');
    }
  }
}

// from parsed types
export function isISMConfig(
  config: ChainMap<MultisigConfig> | ChainMap<IsmConfig>,
): boolean {
  return Object.values(config).some((c) => 'type' in c);
}

// directly from filepath
export function isZODISMConfig(filepath: string): boolean {
  return parseIsmConfig(filepath).success;
}

export async function prepareDeploy(
  context: WriteCommandContext,
  userAddress: Address | null,
  chains: ChainName[],
): Promise<Record<string, BigNumber>> {
  const { multiProvider, isDryRun, multiProtocolProvider } = context;
  const initialBalances: Record<string, BigNumber> = {};

  await Promise.all(
    chains.map(async (chain: ChainName) => {
      const chainProtocol = context.chainMetadata[chain].protocol;

      switch (chainProtocol) {
        case ProtocolType.Ethereum: {
          const provider = isDryRun
            ? getLocalProvider(ENV.ANVIL_IP_ADDR, ENV.ANVIL_PORT)
            : multiProvider.getProvider(chain);

          const address =
            userAddress ?? (await multiProvider.getSigner(chain).getAddress());
          const currentBalance = await provider.getBalance(address);
          initialBalances[chain] = currentBalance;

          break;
        }
        case ProtocolType.Fuel: {
          const provider = await multiProtocolProvider.getFuelProvider(chain);
          const address =
            userAddress ??
            (await multiProtocolProvider.getSigner(chainProtocol, chain))
              .address;
          const baseAsset = provider.getBaseAssetId();
          const currentBalance = await provider.getBalance(address, baseAsset);
          initialBalances[chain] = BigNumber.from(currentBalance.toString());
          break;
        }
        default:
          throw new Error(`Unsupported protocol: ${chainProtocol}`);
      }
    }),
  );
  return initialBalances;
}

export async function completeDeploy(
  context: WriteCommandContext,
  command: string,
  initialBalances: Record<string, BigNumber>,
  userAddress: Address | null,
  chains: ChainName[],
) {
  const { multiProvider, isDryRun } = context;
  if (chains.length > 0) logPink(`⛽️ Gas Usage Statistics`);
  for (const chain of chains) {
    const provider = isDryRun
      ? getLocalProvider(ENV.ANVIL_IP_ADDR, ENV.ANVIL_PORT)
      : multiProvider.getProvider(chain);
    const address =
      userAddress ?? (await multiProvider.getSigner(chain).getAddress());
    const currentBalance = await provider.getBalance(address);
    const balanceDelta = initialBalances[chain].sub(currentBalance);
    if (isDryRun && balanceDelta.lt(0)) break;
    logPink(
      `\t- Gas required for ${command} ${
        isDryRun ? 'dry-run' : 'deploy'
      } on ${chain}: ${ethers.utils.formatEther(balanceDelta)} ${
        multiProvider.getChainMetadata(chain).nativeToken?.symbol ?? 'ETH'
      }`,
    );
  }

  if (isDryRun) await completeDryRun(command);
}

function transformChainMetadataForDisplay(chainMetadata: ChainMetadata) {
  return {
    Name: chainMetadata.name,
    'Display Name': chainMetadata.displayName,
    'Chain ID': chainMetadata.chainId,
    'Domain ID': chainMetadata.domainId,
    Protocol: chainMetadata.protocol,
    'JSON RPC URL': chainMetadata.rpcUrls[0].http,
    'Native Token: Symbol': chainMetadata.nativeToken?.symbol,
    'Native Token: Name': chainMetadata.nativeToken?.name,
    'Native Token: Decimals': chainMetadata.nativeToken?.decimals,
  };
}
