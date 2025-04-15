import { confirm } from '@inquirer/prompts';
import { ethers } from 'ethers';
import { TransactionResponse } from 'fuels';
import { groupBy } from 'lodash-es';
import { stringify as yamlStringify } from 'yaml';

import { ProxyAdmin__factory } from '@hyperlane-xyz/core';
import { buildArtifact as coreBuildArtifact } from '@hyperlane-xyz/core/buildArtifact.js';
import { ChainAddresses } from '@hyperlane-xyz/registry';
import {
  AggregationIsmConfig,
  AnnotatedEV5Transaction,
  ChainMap,
  ChainName,
  ChainSubmissionStrategy,
  ChainSubmissionStrategySchema,
  ContractVerifier,
  DestinationGas,
  EvmERC20WarpModule,
  EvmERC20WarpRouteReader,
  EvmHookModule,
  EvmIsmModule,
  ExplorerLicenseType,
  FuelHookModule,
  FuelIsmModule,
  FuelSRC20WarpModule,
  HookConfig,
  HypERC20Deployer,
  HypERC20Factories,
  HypERC721Deployer,
  HypERC721Factories,
  HypTokenRouterConfig,
  HyperlaneContracts,
  HyperlaneContractsMap,
  HyperlaneProxyFactoryDeployer,
  IsmConfig,
  IsmType,
  MultiProvider,
  MultisigIsmConfig,
  OpStackIsmConfig,
  PausableIsmConfig,
  RemoteRouters,
  RoutingIsmConfig,
  SubmissionStrategy,
  TOKEN_TYPE_TO_STANDARD,
  TOKEN_TYPE_TO_STANDARD_FUEL,
  TokenFactories,
  TrustedRelayerIsmConfig,
  TxSubmitterBuilder,
  TxSubmitterType,
  WarpCoreConfig,
  WarpCoreConfigSchema,
  WarpRouteDeployConfig,
  WarpRouteDeployConfigSchema,
  attachContractsMap,
  connectContractsMap,
  getTokenConnectionId,
  hypERC20factories,
  isCollateralTokenConfig,
  isFuelTokenType,
  isTokenMetadata,
} from '@hyperlane-xyz/sdk';
import {
  Address,
  ProtocolType,
  addressToBytes32,
  assert,
  objFilter,
  objKeys,
  objMap,
  promiseObjAll,
  retryAsync,
} from '@hyperlane-xyz/utils';

import { readWarpRouteDeployConfig } from '../config/warp.js';
import { MINIMUM_WARP_DEPLOY_GAS } from '../consts.js';
import { requestAndSaveApiKeys } from '../context/context.js';
import { WriteCommandContext } from '../context/types.js';
import { log, logBlue, logGray, logGreen, logTable } from '../logger.js';
import { getSubmitterBuilder } from '../submit/submit.js';
import {
  indentYamlOrJson,
  isFile,
  readYamlOrJson,
  runFileSelectionStep,
  writeYamlOrJson,
} from '../utils/files.js';

import {
  completeDeploy,
  prepareDeploy,
  runPreflightChecksForChains,
} from './utils.js';

interface DeployParams {
  context: WriteCommandContext;
  warpDeployConfig: WarpRouteDeployConfig;
}

interface WarpApplyParams extends DeployParams {
  warpCoreConfig: WarpCoreConfig;
  strategyUrl?: string;
  receiptsDir: string;
}

export async function runWarpRouteDeploy({
  context,
  warpRouteDeploymentConfigPath,
}: {
  context: WriteCommandContext;
  warpRouteDeploymentConfigPath?: string;
}) {
  const { skipConfirmation, chainMetadata, registry } = context;

  if (
    !warpRouteDeploymentConfigPath ||
    !isFile(warpRouteDeploymentConfigPath)
  ) {
    if (skipConfirmation)
      throw new Error('Warp route deployment config required');
    warpRouteDeploymentConfigPath = await runFileSelectionStep(
      './configs',
      'Warp route deployment config',
      'warp',
    );
  } else {
    log(
      `Using warp route deployment config at ${warpRouteDeploymentConfigPath}`,
    );
  }
  const warpRouteConfig = await readWarpRouteDeployConfig(
    warpRouteDeploymentConfigPath,
    context,
  );

  const chains = Object.keys(warpRouteConfig);

  let apiKeys: ChainMap<string> = {};
  if (!skipConfirmation)
    apiKeys = await requestAndSaveApiKeys(chains, chainMetadata, registry);

  const deploymentParams = {
    context,
    warpDeployConfig: warpRouteConfig,
  };

  await runDeployPlanStep(deploymentParams);

  // Only Ethereum and Fuel chains are supported for now
  const protocols = new Set(
    chains.map((chain) => {
      const protocol = chainMetadata[chain].protocol;
      if (protocol !== ProtocolType.Ethereum && protocol !== ProtocolType.Fuel)
        throw new Error(`Unsupported protocol ${protocol} `);

      return protocol;
    }),
  );

  const evmParams: {
    context: WriteCommandContext;
    warpDeployConfig: WarpRouteDeployConfig;
  } = { context, warpDeployConfig: {} };
  const fuelParams: {
    context: WriteCommandContext;
    warpDeployConfig: WarpRouteDeployConfig;
  } = { context, warpDeployConfig: {} };

  for (const [chain, config] of Object.entries(warpRouteConfig)) {
    if (chainMetadata[chain].protocol === ProtocolType.Ethereum) {
      evmParams.warpDeployConfig[chain] = config;
    } else if (chainMetadata[chain].protocol === ProtocolType.Fuel) {
      fuelParams.warpDeployConfig[chain] = config;
    }
  }

  await runPreflightChecksForChains({
    context,
    chains,
    minGas: MINIMUM_WARP_DEPLOY_GAS,
  });

  const initialBalances = await prepareDeploy(context, null, chains);

  const [evmDeployments, fuelDeployments] = await Promise.all([
    protocols.has(ProtocolType.Ethereum)
      ? executeDeploy(evmParams, apiKeys)
      : undefined,
    protocols.has(ProtocolType.Fuel)
      ? executeFuelDeploy(fuelParams)
      : undefined,
  ]);

  const [evmConfig, fuelConfig] = await Promise.all([
    evmDeployments ? getWarpCoreConfig(evmParams, evmDeployments) : undefined,
    fuelDeployments
      ? getFuelWarpCoreConfig(fuelParams, fuelDeployments)
      : undefined,
  ]);

  if (evmConfig && fuelConfig) {
    await connectInterProtocolDeployments(evmConfig, fuelConfig, context);
  }

  // Merge the configs
  const warpCoreConfig: WarpCoreConfig = { tokens: [] };
  if (evmConfig && fuelConfig) {
    warpCoreConfig.options = evmConfig.options;
    for (const token of evmConfig.tokens.concat(fuelConfig.tokens)) {
      warpCoreConfig.tokens.push(token);
    }
  } else if (evmConfig) {
    warpCoreConfig.options = evmConfig.options;
    for (const token of evmConfig.tokens) {
      warpCoreConfig.tokens.push(token);
    }
  } else if (fuelConfig) {
    for (const token of fuelConfig.tokens) {
      warpCoreConfig.tokens.push(token);
    }
  }

  fullyConnectTokens(warpCoreConfig);

  await writeDeploymentArtifacts(warpCoreConfig, context);

  if (protocols.has(ProtocolType.Ethereum))
    await completeDeploy(context, 'warp', initialBalances, null, chains!);
}

async function connectInterProtocolDeployments(
  evmConfig: WarpCoreConfig,
  fuelConfig: WarpCoreConfig,
  context: WriteCommandContext,
) {
  logGreen('Connecting inter-protocol deployments...');
  await Promise.all([
    connectRoutersToFuel(fuelConfig, evmConfig, context),
    connectRoutersToEVM(evmConfig, fuelConfig, context),
  ]);
}

async function connectRoutersToEVM(
  evmConfig: WarpCoreConfig,
  fuelConfig: WarpCoreConfig,
  context: WriteCommandContext,
) {
  const { multiProvider } = context;
  const abi = ['function enrollRemoteRouter(uint32,bytes32)'];

  for (const token of evmConfig.tokens) {
    const { chainName, addressOrDenom } = token;
    const evmSigner = multiProvider.getSigner(chainName);
    const warpRoute = new ethers.Contract(addressOrDenom!, abi, evmSigner);

    for (const fuelToken of fuelConfig.tokens) {
      const { chainName: fuelChainName, addressOrDenom: fuelAddress } =
        fuelToken;
      logGreen(`Connecting ${chainName} to ${fuelChainName}...`);

      const chainId = multiProvider.getChainId(fuelChainName);
      const gasEstimate = await warpRoute.estimateGas.enrollRemoteRouter(
        chainId,
        fuelAddress,
      );

      const tx = await warpRoute.enrollRemoteRouter(chainId, fuelAddress, {
        gasLimit: gasEstimate.mul(12).div(10), // Adding 20% buffer to estimated gas
      });
      await tx.wait();
    }
  }
}

async function connectRoutersToFuel(
  fuelConfig: WarpCoreConfig,
  evmConfig: WarpCoreConfig,
  context: WriteCommandContext,
) {
  const { multiProtocolProvider, chainMetadata } = context;

  const routerData = evmConfig.tokens.map((token) => ({
    chainName: token.chainName,
    protocol: chainMetadata[token.chainName].protocol,
    address: addressToBytes32(token.addressOrDenom!),
    decimals: token.decimals,
  }));

  for (const { addressOrDenom, chainName } of fuelConfig.tokens) {
    logGreen(
      `Connecting ${chainName} to ${routerData.reduce(
        (acc, { chainName }) => acc + `${chainName} `,
        '',
      )}...`,
    );
    await FuelSRC20WarpModule.connectRouterFromData(
      addressOrDenom!,
      chainName,
      multiProtocolProvider,
      routerData,
    );
  }
}

async function runDeployPlanStep({ context, warpDeployConfig }: DeployParams) {
  const { skipConfirmation } = context;

  displayWarpDeployPlan(warpDeployConfig);

  if (skipConfirmation || context.isDryRun) return;

  const isConfirmed = await confirm({
    message: 'Is this deployment plan correct?',
  });
  if (!isConfirmed) throw new Error('Deployment cancelled');
}

async function executeFuelDeploy(params: DeployParams) {
  logBlue('Beginning deployment...');

  const { warpDeployConfig, context } = params;
  const { multiProtocolProvider } = context;

  const modifiedConfig = await resolveWarpIsmAndHookFuel(
    warpDeployConfig,
    context,
  );
  const res = await FuelSRC20WarpModule.deployWithRetry(
    multiProtocolProvider,
    modifiedConfig,
  );
  logGreen('✅ FuelVM Warp contract deployments complete');
  return res;
}

async function executeDeploy(
  params: DeployParams,
  apiKeys: ChainMap<string>,
): Promise<HyperlaneContractsMap<HypERC20Factories | HypERC721Factories>> {
  logBlue('🚀 All systems ready, captain! Beginning deployment...');

  const {
    warpDeployConfig,
    context: { multiProvider, isDryRun, dryRunChain },
  } = params;

  const deployer = warpDeployConfig.isNft
    ? new HypERC721Deployer(multiProvider)
    : new HypERC20Deployer(multiProvider); // TODO: replace with EvmERC20WarpModule

  const config: WarpRouteDeployConfig =
    isDryRun && dryRunChain
      ? { [dryRunChain]: warpDeployConfig[dryRunChain] }
      : warpDeployConfig;

  const contractVerifier = new ContractVerifier(
    multiProvider,
    apiKeys,
    coreBuildArtifact,
    ExplorerLicenseType.MIT,
  );

  const ismFactoryDeployer = new HyperlaneProxyFactoryDeployer(
    multiProvider,
    contractVerifier,
  );

  // For each chain in WarpRouteConfig, deploy each Ism Factory, if it's not in the registry
  // Then return a modified config with the ism and/or hook address as a string
  const modifiedConfig = await resolveWarpIsmAndHook(
    config,
    params.context,
    ismFactoryDeployer,
    contractVerifier,
  );

  const deployedContracts = await deployer.deploy(modifiedConfig);

  logGreen('✅ EVM Warp contract deployments complete');
  return deployedContracts;
}

async function writeDeploymentArtifacts(
  warpCoreConfig: WarpCoreConfig,
  context: WriteCommandContext,
) {
  if (!context.isDryRun) {
    log('Writing deployment artifacts...');
    await context.registry.addWarpRoute(warpCoreConfig);
  }
  log(indentYamlOrJson(yamlStringify(warpCoreConfig, null, 2), 4));
}

async function resolveWarpIsmAndHookFuel(
  warpConfig: WarpRouteDeployConfig,
  context: WriteCommandContext,
  ismFactoryDeployer?: HyperlaneProxyFactoryDeployer,
  contractVerifier?: ContractVerifier,
): Promise<WarpRouteDeployConfig> {
  const entries = Object.entries(warpConfig);
  const result: Record<string, any> = {};

  for (const [chain, config] of entries) {
    const chainAddresses = await context.registry.getChainAddresses(chain);

    if (!chainAddresses) {
      throw `Registry factory addresses not found for ${chain}.`;
    }

    config.interchainSecurityModule = await createWarpIsm({
      chain,
      chainAddresses,
      context,
      contractVerifier,
      ismFactoryDeployer,
      warpConfig: config,
    });

    config.hook = await createWarpHook({
      chain,
      chainAddresses,
      context,
      contractVerifier,
      ismFactoryDeployer,
      warpConfig: config,
    });

    result[chain] = config;
  }

  return result;
}

async function resolveWarpIsmAndHook(
  warpConfig: WarpRouteDeployConfig,
  context: WriteCommandContext,
  ismFactoryDeployer?: HyperlaneProxyFactoryDeployer,
  contractVerifier?: ContractVerifier,
): Promise<WarpRouteDeployConfig> {
  return promiseObjAll(
    objMap(warpConfig, async (chain, config) => {
      const chainAddresses = await context.registry.getChainAddresses(chain);

      if (!chainAddresses) {
        throw `Registry factory addresses not found for ${chain}.`;
      }

      config.interchainSecurityModule = await createWarpIsm({
        chain,
        chainAddresses,
        context,
        contractVerifier,
        ismFactoryDeployer,
        warpConfig: config,
      }); // TODO write test

      config.hook = await createWarpHook({
        chain,
        chainAddresses,
        context,
        contractVerifier,
        ismFactoryDeployer,
        warpConfig: config,
      });
      return config;
    }),
  );
}

/**
 * Deploys the Warp ISM for a given config
 *
 * @returns The deployed ism address
 */
async function createWarpIsm({
  chain,
  chainAddresses,
  context,
  contractVerifier,
  warpConfig,
}: {
  chain: string;
  chainAddresses: Record<string, string>;
  context: WriteCommandContext;
  contractVerifier?: ContractVerifier;
  warpConfig: HypTokenRouterConfig;
  ismFactoryDeployer?: HyperlaneProxyFactoryDeployer;
}): Promise<IsmConfig | undefined> {
  const { interchainSecurityModule } = warpConfig;
  if (
    !interchainSecurityModule ||
    typeof interchainSecurityModule === 'string'
  ) {
    logGray(
      `Config Ism is ${
        !interchainSecurityModule ? 'empty' : interchainSecurityModule
      }, skipping deployment.`,
    );
    return interchainSecurityModule;
  }

  logBlue(`Loading registry factory addresses for ${chain}...`);

  logGray(
    `Creating ${interchainSecurityModule.type} ISM for token on ${chain} chain...`,
  );

  logGreen(
    `Finished creating ${interchainSecurityModule.type} ISM for token on ${chain} chain.`,
  );
  const protocol = context.chainMetadata[chain].protocol;

  return protocol === ProtocolType.Ethereum
    ? createEvmWarpIsm(
        chainAddresses,
        context,
        chain,
        interchainSecurityModule,
        contractVerifier,
      )
    : createFuelWarpIsm(
        chain,
        context,
        interchainSecurityModule,
        chainAddresses.mailbox,
      );
}

async function createFuelWarpIsm(
  chain: string,
  { multiProtocolProvider }: WriteCommandContext,
  interchainSecurityModule: IsmConfig,
  mailbox: string,
) {
  return FuelIsmModule.deployWithRetry(
    multiProtocolProvider,
    chain,
    interchainSecurityModule,
    mailbox,
  );
}

async function createEvmWarpIsm(
  chainAddresses: Record<string, string>,
  context: WriteCommandContext,
  chain: string,
  interchainSecurityModule: IsmConfig,
  contractVerifier?: ContractVerifier,
) {
  const {
    mailbox,
    domainRoutingIsmFactory,
    staticAggregationHookFactory,
    staticAggregationIsmFactory,
    staticMerkleRootMultisigIsmFactory,
    staticMessageIdMultisigIsmFactory,
    staticMerkleRootWeightedMultisigIsmFactory,
    staticMessageIdWeightedMultisigIsmFactory,
  } = chainAddresses;
  const evmIsmModule = await EvmIsmModule.create({
    chain,
    mailbox,
    multiProvider: context.multiProvider,
    proxyFactoryFactories: {
      domainRoutingIsmFactory,
      staticAggregationHookFactory,
      staticAggregationIsmFactory,
      staticMerkleRootMultisigIsmFactory,
      staticMessageIdMultisigIsmFactory,
      staticMerkleRootWeightedMultisigIsmFactory,
      staticMessageIdWeightedMultisigIsmFactory,
    },
    config: interchainSecurityModule,
    contractVerifier,
  });
  return evmIsmModule.serialize().deployedIsm;
}

async function createWarpHook({
  chain,
  chainAddresses,
  context,
  contractVerifier,
  warpConfig,
}: {
  chain: string;
  chainAddresses: Record<string, string>;
  context: WriteCommandContext;
  contractVerifier?: ContractVerifier;
  warpConfig: HypTokenRouterConfig;
  ismFactoryDeployer?: HyperlaneProxyFactoryDeployer;
}): Promise<HookConfig | undefined> {
  const { hook } = warpConfig;

  if (!hook || typeof hook === 'string') {
    logGray(`Config Hook is ${!hook ? 'empty' : hook}, skipping deployment.`);
    return hook;
  }

  logBlue(`Loading registry factory addresses for ${chain}...`);

  logGray(`Creating ${hook.type} Hook for token on ${chain} chain...`);

  const protocol = context.chainMetadata[chain].protocol;

  const deployedHook =
    protocol === ProtocolType.Ethereum
      ? createEvmWarpHook(
          chainAddresses,
          context,
          chain,
          hook,
          warpConfig,
          contractVerifier,
        )
      : createFuelWarpHook(chain, context, hook, chainAddresses.mailbox);

  logGreen(`Finished creating ${hook.type} Hook for token on ${chain} chain.`);
  return deployedHook;
}

async function createEvmWarpHook(
  chainAddresses: Record<string, string>,
  context: WriteCommandContext,
  chain: string,
  hook: HookConfig,
  warpConfig: HypTokenRouterConfig,
  contractVerifier?: ContractVerifier,
) {
  const {
    mailbox,
    domainRoutingIsmFactory,
    staticAggregationHookFactory,
    staticAggregationIsmFactory,
    staticMerkleRootMultisigIsmFactory,
    staticMessageIdMultisigIsmFactory,
    staticMerkleRootWeightedMultisigIsmFactory,
    staticMessageIdWeightedMultisigIsmFactory,
  } = chainAddresses;
  const proxyFactoryFactories = {
    domainRoutingIsmFactory,
    staticAggregationHookFactory,
    staticAggregationIsmFactory,
    staticMerkleRootMultisigIsmFactory,
    staticMessageIdMultisigIsmFactory,
    staticMerkleRootWeightedMultisigIsmFactory,
    staticMessageIdWeightedMultisigIsmFactory,
  };

  // If config.proxyadmin.address exists, then use that. otherwise deploy a new proxyAdmin
  const proxyAdminAddress: Address =
    warpConfig.proxyAdmin?.address ??
    (
      await context.multiProvider.handleDeploy(
        chain,
        new ProxyAdmin__factory(),
        [],
      )
    ).address;

  const evmHookModule = await EvmHookModule.create({
    chain,
    multiProvider: context.multiProvider,
    coreAddresses: {
      mailbox,
      proxyAdmin: proxyAdminAddress,
    },
    config: hook,
    contractVerifier,
    proxyFactoryFactories,
  });
  return evmHookModule.serialize().deployedHook;
}

async function createFuelWarpHook(
  chain: string,
  { multiProtocolProvider }: WriteCommandContext,
  hook: HookConfig,
  mailbox: string,
) {
  return FuelHookModule.deployWithRetry(
    multiProtocolProvider,
    chain,
    hook,
    mailbox,
  );
}

async function getFuelWarpCoreConfig(
  { context: { multiProtocolProvider } }: DeployParams,
  warpRouteDeployments: Record<
    string,
    { contractId: string; config: HypTokenRouterConfig }
  >,
): Promise<WarpCoreConfig> {
  const warpCoreConfig: WarpCoreConfig = { tokens: [] };

  const tokenMetadata = await FuelSRC20WarpModule.deriveTokenMetadata(
    multiProtocolProvider,
    // warpDeployConfig,
    warpRouteDeployments,
  );
  assert(
    tokenMetadata && isTokenMetadata(tokenMetadata),
    'Missing required token metadata',
  );

  const { decimals, symbol, name } = tokenMetadata;
  assert(decimals, 'Missing decimals on token metadata');

  generateFuelTokenConfigs(
    warpCoreConfig,
    warpRouteDeployments,
    symbol,
    name,
    decimals,
  );

  return warpCoreConfig;
}

async function getWarpCoreConfig(
  { warpDeployConfig, context }: DeployParams,
  contracts: HyperlaneContractsMap<TokenFactories>,
): Promise<WarpCoreConfig> {
  const warpCoreConfig: WarpCoreConfig = { tokens: [] };

  // TODO: replace with warp read
  const tokenMetadata = await HypERC20Deployer.deriveTokenMetadata(
    context.multiProvider,
    warpDeployConfig,
  );
  assert(
    tokenMetadata && isTokenMetadata(tokenMetadata),
    'Missing required token metadata',
  );
  const { decimals, symbol, name } = tokenMetadata;
  assert(decimals, 'Missing decimals on token metadata');

  generateTokenConfigs(
    warpCoreConfig,
    warpDeployConfig,
    contracts,
    symbol,
    name,
    decimals,
  );

  return warpCoreConfig;
}

function generateFuelTokenConfigs(
  warpCoreConfig: WarpCoreConfig,
  warpRouteDeployments: Record<
    string,
    { contractId: string; config: HypTokenRouterConfig }
  >,
  symbol: string,
  name: string,
  decimals: number,
) {
  for (const [chain, { contractId, config }] of Object.entries(
    warpRouteDeployments,
  )) {
    const collateralAddressOrDenom = isCollateralTokenConfig(config)
      ? config.token // gets set in the above deriveTokenMetadata()
      : undefined;
    if (!isFuelTokenType(config.type))
      throw new Error('Unsupported Fuel token type');

    warpCoreConfig.tokens.push({
      chainName: chain,
      standard: TOKEN_TYPE_TO_STANDARD_FUEL[config.type],
      decimals,
      symbol,
      name,
      addressOrDenom: contractId,
      collateralAddressOrDenom,
    });
  }
}

/**
 * Creates token configs.
 */
function generateTokenConfigs(
  warpCoreConfig: WarpCoreConfig,
  warpDeployConfig: WarpRouteDeployConfig,
  contracts: HyperlaneContractsMap<TokenFactories>,
  symbol: string,
  name: string,
  decimals: number,
): void {
  for (const [chainName, contract] of Object.entries(contracts)) {
    const config = warpDeployConfig[chainName];
    const collateralAddressOrDenom = isCollateralTokenConfig(config)
      ? config.token // gets set in the above deriveTokenMetadata()
      : undefined;

    warpCoreConfig.tokens.push({
      chainName,
      standard: TOKEN_TYPE_TO_STANDARD[config.type],
      decimals,
      symbol,
      name,
      addressOrDenom:
        contract[warpDeployConfig[chainName].type as keyof TokenFactories]
          .address,
      collateralAddressOrDenom,
    });
  }
}

/**
 * Adds connections between tokens.
 *
 * Creates full interconnectivity between all tokens across different protocols
 * while avoiding duplicate connections.
 */
function fullyConnectTokens(warpCoreConfig: WarpCoreConfig): void {
  for (const token1 of warpCoreConfig.tokens) {
    for (const token2 of warpCoreConfig.tokens) {
      if (
        token1.chainName === token2.chainName &&
        token1.addressOrDenom === token2.addressOrDenom
      )
        continue;

      token1.connections ||= [];

      const protocol: ProtocolType = token2.standard?.startsWith('Fuel')
        ? ProtocolType.Fuel
        : ProtocolType.Ethereum;

      const connectionId = getTokenConnectionId(
        protocol,
        token2.chainName,
        token2.addressOrDenom!,
      );

      const connectionExists = token1.connections.some(
        (connection) => connection.token === connectionId,
      );

      if (!connectionExists) token1.connections.push({ token: connectionId });
    }
  }
}

export async function runWarpRouteApply(
  params: WarpApplyParams,
): Promise<void> {
  const {
    warpDeployConfig,
    warpCoreConfig,
    context: { chainMetadata },
  } = params;

  WarpRouteDeployConfigSchema.parse(warpDeployConfig);
  WarpCoreConfigSchema.parse(warpCoreConfig);

  const chains = Object.keys(warpDeployConfig);
  const protocols = new Set(
    chains.map((chain) => chainMetadata[chain].protocol),
  );
  if (protocols.size > 1)
    throw new Error('Only single protocol updates are supported for now');

  const singleProtocol = protocols.values().next().value;

  logGreen('repo deploy config');
  for (const [chain, config] of Object.entries(warpDeployConfig)) {
    logGreen(chain, JSON.stringify(config));
  }
  logGreen('registry core config');
  for (const [chain, config] of Object.entries(warpCoreConfig)) {
    logGreen(chain, JSON.stringify(config));
  }

  if (singleProtocol === ProtocolType.Fuel) return runFuelWarpApply(params);
  else return runEVMWarpApply(params);
}

async function runFuelWarpApply(params: WarpApplyParams) {
  const { warpDeployConfig, warpCoreConfig } = params;

  const warpCoreConfigByChain = Object.fromEntries(
    warpCoreConfig.tokens.map((token) => [token.chainName, token]),
  );

  const transactions = await updateExistingFuelWarpRoute(
    params,
    warpDeployConfig,
    warpCoreConfigByChain,
  );
  if (transactions.length == 0)
    return logGreen(`Warp config is the same as target. No updates applied.`);

  await writeFuelApplyTransactions(params, transactions);
}

async function runEVMWarpApply(params: WarpApplyParams) {
  const { warpDeployConfig, warpCoreConfig, context } = params;
  const { chainMetadata, skipConfirmation } = context;

  const warpCoreConfigByChain = Object.fromEntries(
    warpCoreConfig.tokens.map((token) => [token.chainName, token]),
  );

  const chains = Object.keys(warpDeployConfig);

  let apiKeys: ChainMap<string> = {};
  if (!skipConfirmation)
    apiKeys = await requestAndSaveApiKeys(
      chains,
      chainMetadata,
      context.registry,
    );

  const transactions: AnnotatedEV5Transaction[] = [
    ...(await extendWarpRoute(
      params,
      apiKeys,
      warpDeployConfig,
      warpCoreConfigByChain,
    )),
    ...(await updateExistingWarpRoute(
      params,
      apiKeys,
      warpDeployConfig,
      warpCoreConfigByChain,
    )),
  ];
  if (transactions.length == 0)
    return logGreen(`Warp config is the same as target. No updates needed.`);

  await submitWarpApplyTransactions(params, groupBy(transactions, 'chainId'));
}

async function extendWarpRoute(
  params: WarpApplyParams,
  apiKeys: ChainMap<string>,
  warpDeployConfig: WarpRouteDeployConfig,
  warpCoreConfigByChain: ChainMap<WarpCoreConfig['tokens'][number]>,
) {
  const { multiProvider } = params.context;
  const warpCoreChains = Object.keys(warpCoreConfigByChain);

  // Split between the existing and additional config
  const existingConfigs: WarpRouteDeployConfig = objFilter(
    warpDeployConfig,
    (chain, _config): _config is any => warpCoreChains.includes(chain),
  );

  let extendedConfigs: WarpRouteDeployConfig = objFilter(
    warpDeployConfig,
    (chain, _config): _config is any => !warpCoreChains.includes(chain),
  );

  const extendedChains = Object.keys(extendedConfigs);
  if (extendedChains.length === 0) return [];

  logBlue(`Extending Warp Route to ${extendedChains.join(', ')}`);

  extendedConfigs = await deriveMetadataFromExisting(
    multiProvider,
    existingConfigs,
    extendedConfigs,
  );

  const newDeployedContracts = await executeDeploy(
    {
      context: params.context,
      warpDeployConfig: extendedConfigs,
    },
    apiKeys,
  );

  const mergedRouters = mergeAllRouters(
    multiProvider,
    existingConfigs,
    newDeployedContracts,
    warpCoreConfigByChain,
  );

  const updatedWarpCoreConfig = await getWarpCoreConfig(params, mergedRouters);
  WarpCoreConfigSchema.parse(updatedWarpCoreConfig);
  await writeDeploymentArtifacts(updatedWarpCoreConfig, params.context);

  return enrollRemoteRouters(params, mergedRouters);
}

async function updateExistingFuelWarpRoute(
  params: WarpApplyParams,
  warpDeployConfig: WarpRouteDeployConfig,
  warpCoreConfigByChain: ChainMap<WarpCoreConfig['tokens'][number]>,
) {
  logBlue('Updating deployed Fuel Warp Routes');
  const { multiProtocolProvider } = params.context;

  const receipts: TransactionResponse[] = [];

  await promiseObjAll(
    objMap(warpDeployConfig, async (chain, config) => {
      await retryAsync(async () => {
        logGray(`Update existing warp route for chain ${chain}`);
        const deployedConfig = warpCoreConfigByChain[chain];
        if (!deployedConfig)
          return logGray(
            `Missing artifacts for ${chain}. Probably new deployment. Skipping update...`,
          );
        const deployedTokenRoute = deployedConfig.addressOrDenom!;

        const results = await FuelSRC20WarpModule.update(
          multiProtocolProvider,
          deployedTokenRoute,
          chain,
          config,
        );
        receipts.push(...results);
      }, 1); // TODO remove
    }),
  );

  return receipts;
}

async function updateExistingWarpRoute(
  params: WarpApplyParams,
  apiKeys: ChainMap<string>,
  warpDeployConfig: WarpRouteDeployConfig,
  warpCoreConfigByChain: ChainMap<WarpCoreConfig['tokens'][number]>,
) {
  logBlue('Updating deployed Warp Routes');
  const { multiProvider, registry } = params.context;
  const registryAddresses =
    (await registry.getAddresses()) as ChainMap<ChainAddresses>;
  const contractVerifier = new ContractVerifier(
    multiProvider,
    apiKeys,
    coreBuildArtifact,
    ExplorerLicenseType.MIT,
  );
  const transactions: AnnotatedEV5Transaction[] = [];

  await promiseObjAll(
    objMap(warpDeployConfig, async (chain, config) => {
      await retryAsync(async () => {
        logGray(`Update existing warp route for chain ${chain}`);
        const deployedConfig = warpCoreConfigByChain[chain];
        if (!deployedConfig)
          return logGray(
            `Missing artifacts for ${chain}. Probably new deployment. Skipping update...`,
          );

        const deployedTokenRoute = deployedConfig.addressOrDenom!;
        const {
          domainRoutingIsmFactory,
          staticMerkleRootMultisigIsmFactory,
          staticMessageIdMultisigIsmFactory,
          staticAggregationIsmFactory,
          staticAggregationHookFactory,
          staticMerkleRootWeightedMultisigIsmFactory,
          staticMessageIdWeightedMultisigIsmFactory,
        } = registryAddresses[chain];

        const evmERC20WarpModule = new EvmERC20WarpModule(
          multiProvider,
          {
            config,
            chain,
            addresses: {
              deployedTokenRoute,
              staticMerkleRootMultisigIsmFactory,
              staticMessageIdMultisigIsmFactory,
              staticAggregationIsmFactory,
              staticAggregationHookFactory,
              domainRoutingIsmFactory,
              staticMerkleRootWeightedMultisigIsmFactory,
              staticMessageIdWeightedMultisigIsmFactory,
            },
          },
          contractVerifier,
        );
        transactions.push(...(await evmERC20WarpModule.update(config)));
      });
    }),
  );
  return transactions;
}

/**
 * Retrieves a chain submission strategy from the provided filepath.
 * @param submissionStrategyFilepath a filepath to the submission strategy file
 * @returns a formatted submission strategy
 */
export function readChainSubmissionStrategy(
  submissionStrategyFilepath: string,
): ChainSubmissionStrategy {
  const submissionStrategyFileContent = readYamlOrJson(
    submissionStrategyFilepath.trim(),
  );
  return ChainSubmissionStrategySchema.parse(submissionStrategyFileContent);
}

/**
 * Derives token metadata from existing config and merges it with extended config.
 * @returns The merged Warp route deployment config with token metadata.
 */
async function deriveMetadataFromExisting(
  multiProvider: MultiProvider,
  existingConfigs: WarpRouteDeployConfig,
  extendedConfigs: WarpRouteDeployConfig,
): Promise<WarpRouteDeployConfig> {
  const existingTokenMetadata = await HypERC20Deployer.deriveTokenMetadata(
    multiProvider,
    existingConfigs,
  );
  return objMap(extendedConfigs, (_chain, extendedConfig) => {
    return {
      ...existingTokenMetadata,
      ...extendedConfig,
    };
  });
}

/**
 * Merges existing router configs with newly deployed router contracts.
 */
function mergeAllRouters(
  multiProvider: MultiProvider,
  existingConfigs: WarpRouteDeployConfig,
  deployedContractsMap: HyperlaneContractsMap<
    HypERC20Factories | HypERC721Factories
  >,
  warpCoreConfigByChain: ChainMap<WarpCoreConfig['tokens'][number]>,
) {
  const existingContractAddresses = objMap(
    existingConfigs,
    (chain, config) => ({
      [config.type]: warpCoreConfigByChain[chain].addressOrDenom!,
    }),
  );
  return {
    ...connectContractsMap(
      attachContractsMap(existingContractAddresses, hypERC20factories),
      multiProvider,
    ),
    ...deployedContractsMap,
  } as HyperlaneContractsMap<HypERC20Factories>;
}

/**
 * Enroll all deployed routers with each other.
 *
 * @param deployedContractsMap - A map of deployed Hyperlane contracts by chain.
 * @param multiProvider - A MultiProvider instance to interact with multiple chains.
 */
async function enrollRemoteRouters(
  params: WarpApplyParams,
  deployedContractsMap: HyperlaneContractsMap<HypERC20Factories>,
): Promise<AnnotatedEV5Transaction[]> {
  logBlue(`Enrolling deployed routers with each other...`);
  const { multiProvider, registry } = params.context;
  const registryAddresses = await registry.getAddresses();
  const deployedRoutersAddresses: ChainMap<Address> = objMap(
    deployedContractsMap,
    (_, contracts) => getRouter(contracts).address,
  );
  const deployedDestinationGas: DestinationGas = await populateDestinationGas(
    multiProvider,
    params.warpDeployConfig,
    deployedContractsMap,
  );

  const deployedChains = Object.keys(deployedRoutersAddresses);
  const transactions: AnnotatedEV5Transaction[] = [];
  await promiseObjAll(
    objMap(deployedContractsMap, async (chain, contracts) => {
      await retryAsync(async () => {
        const router = getRouter(contracts); // Assume deployedContract always has 1 value
        const deployedTokenRoute = router.address;
        // Mutate the config.remoteRouters by setting it to all other routers to update
        const warpRouteReader = new EvmERC20WarpRouteReader(
          multiProvider,
          chain,
        );
        const mutatedWarpRouteConfig =
          await warpRouteReader.deriveWarpRouteConfig(deployedTokenRoute);
        const {
          domainRoutingIsmFactory,
          staticMerkleRootMultisigIsmFactory,
          staticMessageIdMultisigIsmFactory,
          staticAggregationIsmFactory,
          staticAggregationHookFactory,
          staticMerkleRootWeightedMultisigIsmFactory,
          staticMessageIdWeightedMultisigIsmFactory,
        } = registryAddresses[chain];

        const evmERC20WarpModule = new EvmERC20WarpModule(multiProvider, {
          config: mutatedWarpRouteConfig,
          chain,
          addresses: {
            deployedTokenRoute,
            staticMerkleRootMultisigIsmFactory,
            staticMessageIdMultisigIsmFactory,
            staticAggregationIsmFactory,
            staticAggregationHookFactory,
            domainRoutingIsmFactory,
            staticMerkleRootWeightedMultisigIsmFactory,
            staticMessageIdWeightedMultisigIsmFactory,
          },
        });

        const otherChains = multiProvider
          .getRemoteChains(chain)
          .filter((c) => deployedChains.includes(c));

        mutatedWarpRouteConfig.remoteRouters =
          otherChains.reduce<RemoteRouters>((remoteRouters, otherChain) => {
            remoteRouters[multiProvider.getDomainId(otherChain)] = {
              address: deployedRoutersAddresses[otherChain],
            };
            return remoteRouters;
          }, {});

        mutatedWarpRouteConfig.destinationGas =
          otherChains.reduce<DestinationGas>((destinationGas, otherChain) => {
            const otherChainDomain = multiProvider.getDomainId(otherChain);
            destinationGas[otherChainDomain] =
              deployedDestinationGas[otherChainDomain];
            return destinationGas;
          }, {});

        const mutatedConfigTxs: AnnotatedEV5Transaction[] =
          await evmERC20WarpModule.update(mutatedWarpRouteConfig);

        if (mutatedConfigTxs.length == 0)
          return logGreen(
            `Warp config on ${chain} is the same as target. No updates needed.`,
          );
        transactions.push(...mutatedConfigTxs);
      });
    }),
  );

  return transactions;
}

/**
 * Populates the destination gas amounts for each chain using warpConfig.gas OR querying other router's destinationGas
 */
async function populateDestinationGas(
  multiProvider: MultiProvider,
  warpDeployConfig: WarpRouteDeployConfig,
  deployedContractsMap: HyperlaneContractsMap<HypERC20Factories>,
): Promise<DestinationGas> {
  const destinationGas: DestinationGas = {};
  const deployedChains = Object.keys(deployedContractsMap);
  await promiseObjAll(
    objMap(deployedContractsMap, async (chain, contracts) => {
      await retryAsync(async () => {
        const router = getRouter(contracts);

        const otherChains = multiProvider
          .getRemoteChains(chain)
          .filter((c) => deployedChains.includes(c));

        for (const otherChain of otherChains) {
          const otherDomain = multiProvider.getDomainId(otherChain);
          if (!destinationGas[otherDomain])
            destinationGas[otherDomain] =
              warpDeployConfig[otherChain].gas?.toString() ||
              (await router.destinationGas(otherDomain)).toString();
        }
      });
    }),
  );
  return destinationGas;
}

function getRouter(contracts: HyperlaneContracts<HypERC20Factories>) {
  for (const key of objKeys(hypERC20factories)) {
    if (contracts[key]) return contracts[key];
  }
  throw new Error('No matching contract found.');
}

function displayWarpDeployPlan(deployConfig: WarpRouteDeployConfig) {
  logBlue('\nWarp Route Deployment Plan');
  logGray('==========================');
  log(`📋 Token Standard: ${deployConfig.isNft ? 'ERC721' : 'ERC20'}`);

  const { transformedDeployConfig, transformedIsmConfigs } =
    transformDeployConfigForDisplay(deployConfig);

  log('📋 Warp Route Config:');
  logTable(transformedDeployConfig);
  objMap(transformedIsmConfigs, (chain, ismConfigs) => {
    log(`📋 ${chain} ISM Config(s):`);
    ismConfigs.forEach((ismConfig) => {
      logTable(ismConfig);
    });
  });
}

/* only used for transformIsmForDisplay type-sense */
type IsmDisplayConfig =
  | RoutingIsmConfig // type, owner, ownerOverrides, domain
  | AggregationIsmConfig // type, modules, threshold
  | MultisigIsmConfig // type, validators, threshold
  | OpStackIsmConfig // type, origin, nativeBridge
  | PausableIsmConfig // type, owner, paused, ownerOverrides
  | TrustedRelayerIsmConfig; // type, relayer

function transformDeployConfigForDisplay(deployConfig: WarpRouteDeployConfig) {
  const transformedIsmConfigs: Record<ChainName, any[]> = {};
  const transformedDeployConfig = objMap(deployConfig, (chain, config) => {
    if (config.interchainSecurityModule)
      transformedIsmConfigs[chain] = transformIsmConfigForDisplay(
        config.interchainSecurityModule as IsmDisplayConfig,
      );

    return {
      'NFT?': config.isNft ?? false,
      Type: config.type,
      Owner: config.owner,
      Mailbox: config.mailbox,
      'ISM Config(s)': config.interchainSecurityModule
        ? 'See table(s) below.'
        : 'No ISM config(s) specified.',
    };
  });

  return {
    transformedDeployConfig,
    transformedIsmConfigs,
  };
}

function transformIsmConfigForDisplay(ismConfig: IsmDisplayConfig): any[] {
  const ismConfigs: any[] = [];
  switch (ismConfig.type) {
    case IsmType.AGGREGATION:
      ismConfigs.push({
        Type: ismConfig.type,
        Threshold: ismConfig.threshold,
        Modules: 'See table(s) below.',
      });
      ismConfig.modules.forEach((module) => {
        ismConfigs.push(
          ...transformIsmConfigForDisplay(module as IsmDisplayConfig),
        );
      });
      return ismConfigs;
    case IsmType.ROUTING:
      return [
        {
          Type: ismConfig.type,
          Owner: ismConfig.owner,
          'Owner Overrides': ismConfig.ownerOverrides ?? 'Undefined',
          Domains: 'See warp config for domain specification.',
        },
      ];
    case IsmType.FALLBACK_ROUTING:
      return [
        {
          Type: ismConfig.type,
          Owner: ismConfig.owner,
          'Owner Overrides': ismConfig.ownerOverrides ?? 'Undefined',
          Domains: 'See warp config for domain specification.',
        },
      ];
    case IsmType.MERKLE_ROOT_MULTISIG:
      return [
        {
          Type: ismConfig.type,
          Validators: ismConfig.validators,
          Threshold: ismConfig.threshold,
        },
      ];
    case IsmType.MESSAGE_ID_MULTISIG:
      return [
        {
          Type: ismConfig.type,
          Validators: ismConfig.validators,
          Threshold: ismConfig.threshold,
        },
      ];
    case IsmType.OP_STACK:
      return [
        {
          Type: ismConfig.type,
          Origin: ismConfig.origin,
          'Native Bridge': ismConfig.nativeBridge,
        },
      ];
    case IsmType.PAUSABLE:
      return [
        {
          Type: ismConfig.type,
          Owner: ismConfig.owner,
          'Paused ?': ismConfig.paused,
          'Owner Overrides': ismConfig.ownerOverrides ?? 'Undefined',
        },
      ];
    case IsmType.TRUSTED_RELAYER:
      return [
        {
          Type: ismConfig.type,
          Relayer: ismConfig.relayer,
        },
      ];
    default:
      return [ismConfig];
  }
}

/**
 * Submits a set of transactions to the specified chain and outputs transaction receipts
 */
async function submitWarpApplyTransactions(
  params: WarpApplyParams,
  chainTransactions: Record<string, AnnotatedEV5Transaction[]>,
): Promise<void> {
  // Create mapping of chain ID to chain name for all chains in warpDeployConfig
  const chains = Object.keys(params.warpDeployConfig);
  const chainIdToName = Object.fromEntries(
    chains.map((chain) => [
      params.context.multiProvider.getChainId(chain),
      chain,
    ]),
  );

  await promiseObjAll(
    objMap(chainTransactions, async (chainId, transactions) => {
      await retryAsync(
        async () => {
          const chain = chainIdToName[chainId];
          const submitter: TxSubmitterBuilder<ProtocolType> =
            await getWarpApplySubmitter({
              chain,
              context: params.context,
              strategyUrl: params.strategyUrl,
            });
          const transactionReceipts = await submitter.submit(...transactions);
          if (transactionReceipts) {
            const receiptPath = `${params.receiptsDir}/${chain}-${
              submitter.txSubmitterType
            }-${Date.now()}-receipts.json`;
            writeYamlOrJson(receiptPath, transactionReceipts);
            logGreen(
              `Transactions receipts successfully written to ${receiptPath}`,
            );
          }
        },
        5, // attempts
        100, // baseRetryMs
      );
    }),
  );
}

/**
 * Writes Fuel transaction summaries to a file.
 */
async function writeFuelApplyTransactions(
  params: WarpApplyParams,
  transactions: TransactionResponse[],
) {
  const receiptPath = `${params.receiptsDir}/fuel-${Date.now()}-receipts.json`;
  const summaries = await Promise.all(
    transactions.map((txn) => txn.getTransactionSummary()),
  );
  writeYamlOrJson(receiptPath, summaries);
  logGreen(`Transaction summaries successfully written to ${receiptPath}`);
}

/**
 * Helper function to get warp apply specific submitter.
 *
 * @returns the warp apply submitter
 */
async function getWarpApplySubmitter({
  chain,
  context,
  strategyUrl,
}: {
  chain: ChainName;
  context: WriteCommandContext;
  strategyUrl?: string;
}): Promise<TxSubmitterBuilder<ProtocolType>> {
  const { multiProvider } = context;

  const submissionStrategy: SubmissionStrategy = strategyUrl
    ? readChainSubmissionStrategy(strategyUrl)[chain]
    : {
        submitter: {
          chain,
          type: TxSubmitterType.JSON_RPC,
        },
      };

  return getSubmitterBuilder<ProtocolType>({
    submissionStrategy,
    multiProvider,
  });
}
