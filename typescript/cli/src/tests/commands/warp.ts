import { $, ProcessPromise } from 'zx';

import {
  ChainName,
  HypTokenRouterConfig,
  TokenType,
  WarpRouteDeployConfig,
  WarpRouteDeployConfigSchema,
} from '@hyperlane-xyz/sdk';
import { Address } from '@hyperlane-xyz/utils';

import { readYamlOrJson } from '../../utils/files.js';

import { ANVIL_KEY, REGISTRY_PATH, getDeployedWarpAddress } from './helpers.js';

$.verbose = true;

/**
 * Deploys the Warp route to the specified chain using the provided config.
 * If the init is a multi protocol route, we will not pass the --key flag.
 * Instead the owner needs to be specified for each chain.
 */
export function hyperlaneWarpInit(
  warpCorePath: string,
  fuelKey?: string,
): ProcessPromise {
  // Two dimensional array for readability
  const args = [
    ['workspace', '@hyperlane-xyz/cli'],
    ['run', 'hyperlane', 'warp', 'init'],
    ['--registry', REGISTRY_PATH],
    ['--out', warpCorePath],
    ['--verbosity', 'debug'],
    ['--yes'],
  ];

  if (fuelKey) {
    const keys = `fuel:${fuelKey},ethereum:${ANVIL_KEY}`;
    args.push(['--keys', keys]);
  } else {
    args.push(['--key', ANVIL_KEY]);
  }

  return $`yarn ${args.flat()}`;
}

/**
 * Deploys the Warp route to the specified chain using the provided config.
 */
export function hyperlaneWarpDeployRaw({
  warpCorePath,
  hypKey,
  skipConfirmationPrompts = false,
  privateKey,
  keys,
}: {
  warpCorePath?: string;
  hypKey?: string;
  skipConfirmationPrompts?: boolean;
  privateKey?: string;
  keys?: string;
}): ProcessPromise {
  // Two dimensional array for readability
  const args = [
    ['workspace', '@hyperlane-xyz/cli'],
    ['run', 'hyperlane', 'warp', 'deploy'],
    ['--registry', REGISTRY_PATH],
    ['--verbosity', 'debug'],
  ];

  // Conditionally add optional arguments
  if (warpCorePath) args.push(['--config', warpCorePath]);
  if (privateKey) args.push(['--key', privateKey]);
  if (skipConfirmationPrompts) args.push(['--yes']);
  if (keys) args.push(['--keys', keys]);

  return $`${hypKey ? `HYP_KEY=${hypKey} ` : ''}yarn ${args.flat()}`;
}

/**
 * Deploys the Warp route to the specified chain using the provided config.
 */
export function hyperlaneWarpDeploy(
  warpCorePath: string,
  fuelKey?: string,
): ProcessPromise {
  return fuelKey
    ? hyperlaneWarpDeployRaw({
        keys: `fuel:${fuelKey},ethereum:${ANVIL_KEY}`,
        privateKey: ANVIL_KEY,
        warpCorePath: warpCorePath,
        skipConfirmationPrompts: true,
      })
    : hyperlaneWarpDeployRaw({
        privateKey: ANVIL_KEY,
        warpCorePath: warpCorePath,
        skipConfirmationPrompts: true,
      });
}

/**
 * Applies updates to the Warp route config.
 */
export async function hyperlaneWarpApply(
  warpDeployPath: string,
  warpCorePath: string,
  strategyUrl = '',
) {
  return $`yarn workspace @hyperlane-xyz/cli run hyperlane warp apply \
        --registry ${REGISTRY_PATH} \
        --config ${warpDeployPath} \
        --warp ${warpCorePath} \
        --key ${ANVIL_KEY} \
        --verbosity debug \
        --strategy ${strategyUrl} \
        --yes`;
}

export function hyperlaneWarpReadRaw({
  chain,
  warpAddress,
  outputPath,
  privateKey,
  symbol,
  fuelKey,
}: {
  chain?: string;
  symbol?: string;
  privateKey?: string;
  warpAddress?: string;
  outputPath?: string;
  fuelKey?: string;
}): ProcessPromise {
  // Two dimensional array for readability
  const args = [
    ['workspace', '@hyperlane-xyz/cli'],
    ['run', 'hyperlane', 'warp', 'read'],
    ['--registry', REGISTRY_PATH],
    ['--verbosity', 'debug'],
  ];

  // Conditionally add optional arguments
  if (warpAddress) args.push(['--address', warpAddress]);
  if (chain) args.push(['--chain', chain]);
  if (symbol) args.push(['--symbol', symbol]);
  if (fuelKey && privateKey) {
    args.push(['--keys', `fuel:${fuelKey},ethereum:${privateKey}`]);
    args.push(['--key', privateKey]);
  } else if (privateKey) args.push(['--key', privateKey]);
  else if (fuelKey) args.push(['--keys', `fuel:${fuelKey}`]);
  if (outputPath) args.push(['--config', outputPath]);

  return $`yarn ${args.flat()}`;
}

export function hyperlaneWarpRead(
  chain: string,
  warpAddress: string,
  warpDeployPath: string,
  fuelKey?: string,
): ProcessPromise {
  return hyperlaneWarpReadRaw({
    chain,
    warpAddress,
    outputPath: warpDeployPath,
    privateKey: ANVIL_KEY,
    fuelKey,
  });
}

export function hyperlaneWarpCheckRaw({
  warpDeployPath,
  symbol,
  privateKey,
  hypKey,
}: {
  symbol?: string;
  privateKey?: string;
  warpDeployPath?: string;
  hypKey?: string;
}): ProcessPromise {
  return $`${
    hypKey && !privateKey ? ['HYP_KEY=' + hypKey] : ''
  } yarn workspace @hyperlane-xyz/cli run hyperlane warp check \
        --registry ${REGISTRY_PATH} \
        ${symbol ? ['--symbol', symbol] : ''} \
        ${privateKey && !hypKey ? ['--key', privateKey] : ''} \
        --verbosity debug \
        ${warpDeployPath ? ['--config', warpDeployPath] : ''}`;
}

export function hyperlaneWarpCheck(
  warpDeployPath: string,
  symbol: string,
): ProcessPromise {
  return hyperlaneWarpCheckRaw({
    warpDeployPath,
    privateKey: ANVIL_KEY,
    symbol,
  });
}

export function hyperlaneWarpSendRelay(
  origin: string,
  destination: string,
  warpCorePath: string,
  relay = true,
  value = 1,
): ProcessPromise {
  return $`yarn workspace @hyperlane-xyz/cli run hyperlane warp send \
        ${relay ? '--relay' : ''} \
        --registry ${REGISTRY_PATH} \
        --origin ${origin} \
        --destination ${destination} \
        --warp ${warpCorePath} \
        --key ${ANVIL_KEY} \
        --verbosity debug \
        --yes \
        --amount ${value}`;
}

/**
 * Reads the Warp route deployment config to specified output path.
 * @param warpCorePath path to warp core
 * @param warpDeployPath path to output the resulting read
 * @param fuelKey optional fuel key when reading a fuel route
 * @returns The Warp route deployment config.
 */
export async function readWarpConfig(
  chain: string,
  warpCorePath: string,
  warpDeployPath: string,
  fuelKey?: string,
): Promise<WarpRouteDeployConfig> {
  const warpAddress = getDeployedWarpAddress(chain, warpCorePath);
  await hyperlaneWarpRead(chain, warpAddress!, warpDeployPath, fuelKey);
  return readYamlOrJson(warpDeployPath);
}

type GetWarpTokenConfigByTokenTypeOptions = {
  tokenType: TokenType;
  mailbox: Address;
  owner: Address;
  token: Address;
  vault: Address;
  otherChain: ChainName;
};

function getWarpTokenConfigForType({
  mailbox,
  otherChain,
  owner,
  token,
  tokenType,
  vault,
}: GetWarpTokenConfigByTokenTypeOptions): HypTokenRouterConfig {
  let tokenConfig: HypTokenRouterConfig;
  switch (tokenType) {
    case TokenType.collateral:
      tokenConfig = {
        type: TokenType.collateral,
        mailbox,
        owner,
        token,
      };
      break;
    case TokenType.collateralVault:
      tokenConfig = {
        type: TokenType.collateralVault,
        mailbox,
        owner,
        token: vault,
      };
      break;
    case TokenType.collateralVaultRebase:
      tokenConfig = {
        type: TokenType.collateralVaultRebase,
        mailbox,
        owner,
        token: vault,
      };
      break;
    case TokenType.fastCollateral:
      tokenConfig = {
        type: TokenType.fastCollateral,
        mailbox,
        owner,
        token,
      };
      break;
    case TokenType.fastSynthetic:
      tokenConfig = {
        type: TokenType.fastSynthetic,
        mailbox,
        owner,
      };
      break;
    case TokenType.native:
      tokenConfig = {
        type: TokenType.native,
        mailbox,
        owner,
      };
      break;
    case TokenType.nativeScaled:
      tokenConfig = {
        type: TokenType.nativeScaled,
        mailbox,
        owner,
        scale: 1,
      };
      break;
    case TokenType.synthetic:
      tokenConfig = {
        type: TokenType.synthetic,
        mailbox,
        owner,
      };
      break;
    case TokenType.syntheticRebase:
      tokenConfig = {
        type: TokenType.syntheticRebase,
        mailbox,
        owner,
        collateralChainName: otherChain,
      };
      break;
    default:
      throw new Error(
        `Unsupported token type "${tokenType}" for random config generation`,
      );
  }

  return tokenConfig;
}

type GetWarpTokenConfigOptions = {
  mailbox: Address;
  owner: Address;
  token: Address;
  vault: Address;
  chainName: ChainName;
};

export function generateWarpConfigs(
  chain1Config: GetWarpTokenConfigOptions,
  chain2Config: GetWarpTokenConfigOptions,
): ReadonlyArray<WarpRouteDeployConfig> {
  const ignoreTokenTypes = new Set([
    TokenType.XERC20,
    TokenType.XERC20Lockbox,
    TokenType.collateralFiat,
    TokenType.collateralUri,
    TokenType.syntheticUri,
    // TODO Fix: sender not mailbox or relaying simply fails
    TokenType.collateralVault,
    TokenType.nativeScaled,
  ]);

  const allowedWarpTokenTypes = Object.values(TokenType).filter(
    (tokenType) =>
      !ignoreTokenTypes.has(tokenType) && typeof tokenType === 'string',
  );

  const exists = new Set<string>([]);
  const configs: WarpRouteDeployConfig[] = allowedWarpTokenTypes
    .flatMap((tokenType) =>
      allowedWarpTokenTypes.map((otherTokenType) => {
        return {
          [chain1Config.chainName]: getWarpTokenConfigForType({
            ...chain1Config,
            tokenType: tokenType,
            otherChain: chain2Config.chainName,
          }),
          [chain2Config.chainName]: getWarpTokenConfigForType({
            ...chain2Config,
            tokenType: otherTokenType,
            otherChain: chain1Config.chainName,
          }),
        };
      }),
    )
    // Remove already existing config pairs
    .filter((config) => {
      const combinationId: string = [
        config[chain1Config.chainName].type,
        config[chain2Config.chainName].type,
      ]
        .sort()
        .join('');

      if (exists.has(combinationId)) {
        return false;
      }

      exists.add(combinationId);
      return true;
    })
    // Remove invalid configs
    .filter(
      (warpConfig) => WarpRouteDeployConfigSchema.safeParse(warpConfig).success,
    );

  return configs;
}
