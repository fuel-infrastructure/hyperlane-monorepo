import { $, ProcessPromise } from 'zx';

import { WarpRouteDeployConfig } from '@hyperlane-xyz/sdk';

import { readYamlOrJson } from '../../utils/files.js';

import {
  ANVIL_KEY,
  FUEL_KEY,
  FUEL_LOCAL_REGISTRY_PATH,
  getDeployedWarpAddress,
} from './helpers.js';

$.verbose = true;

export const FUEL_TEST_SRC20_SYMBOL = 'ETH';
export const FUEL_TEST_SRC20_ADDRESS =
  '0xf8f8b6283d7fa5b672b530cbb84fcccb4ff8dc40f8176ef4544ddb1f1952ad07';

/**
 * Deploys the Warp route to the specified chain using the provided config.
 */
export function hyperlaneWarpInitFuel(warpCorePath: string): ProcessPromise {
  // --overrides is " " to allow local testing to work
  return $`yarn workspace @hyperlane-xyz/cli run hyperlane warp init \
        --registry ${FUEL_LOCAL_REGISTRY_PATH} \
        --overrides " " \
        --out ${warpCorePath} \
        --verbosity debug \
        --yes`;
}

/**
 * Deploys the Warp route to the specified chain using the provided config.
 */
export async function hyperlaneWarpDeployFuel(warpCorePath: string) {
  // --overrides is " " to allow local testing to work
  return $`yarn workspace @hyperlane-xyz/cli run hyperlane warp deploy \
        --registry ${FUEL_LOCAL_REGISTRY_PATH} \
        --overrides " " \
        --config ${warpCorePath} \
        --key ${ANVIL_KEY} \
        --keys fuel:${FUEL_KEY} \
        --verbosity debug \
        --yes`;
}

/**
 * Applies updates to the Warp route config.
 */
export async function hyperlaneWarpApplyFuel(
  warpDeployPath: string,
  warpCorePath: string,
  strategyUrl = '',
) {
  return $`yarn workspace @hyperlane-xyz/cli run hyperlane warp apply \
        --registry ${FUEL_LOCAL_REGISTRY_PATH} \
        --config ${warpDeployPath} \
        --warp ${warpCorePath} \
        --key ${ANVIL_KEY} \
        --keys fuel:${FUEL_KEY} \
        --verbosity debug \
        --strategy ${strategyUrl} \
        --yes`;
}

export function hyperlaneWarpCheckRawFuel({
  warpDeployPath,
  symbol,
  privateKey,
  hypKey,
  fuelKey,
}: {
  symbol?: string;
  privateKey?: string;
  warpDeployPath?: string;
  hypKey?: string;
  fuelKey?: string;
}): ProcessPromise {
  return $`${
    hypKey && !privateKey ? ['HYP_KEY=' + hypKey] : ''
  } yarn workspace @hyperlane-xyz/cli run hyperlane warp check \
        --registry ${FUEL_LOCAL_REGISTRY_PATH} \
        ${symbol ? ['--symbol', symbol] : ''} \
        ${privateKey && !hypKey ? ['--key', privateKey] : ''} \
        --verbosity debug \
        --keys fuel:${fuelKey} \
        ${warpDeployPath ? ['--config', warpDeployPath] : ''}`;
}

export function hyperlaneWarpCheck(
  warpDeployPath: string,
  symbol: string,
): ProcessPromise {
  return hyperlaneWarpCheckRawFuel({
    warpDeployPath,
    privateKey: ANVIL_KEY,
    fuelKey: FUEL_KEY,
    symbol,
  });
}

export async function hyperlaneWarpReadFuel(
  chain: string,
  warpAddress: string,
  warpDeployPath: string,
) {
  return $`yarn workspace @hyperlane-xyz/cli run hyperlane warp read \
        --registry ${FUEL_LOCAL_REGISTRY_PATH} \
        --overrides " " \
        --address ${warpAddress} \
        --chain ${chain} \
        --key ${ANVIL_KEY} \
        --keys fuel:${FUEL_KEY} \
        --verbosity debug \
        --config ${warpDeployPath}`;
}

export function hyperlaneWarpSendRelayFuel(
  origin: string,
  destination: string,
  warpCorePath: string,
  relay = true,
  value = 1,
): ProcessPromise {
  return $`yarn workspace @hyperlane-xyz/cli run hyperlane warp send \
        ${relay ? '--relay' : ''} \
        --registry ${FUEL_LOCAL_REGISTRY_PATH} \
        --origin ${origin} \
        --destination ${destination} \
        --warp ${warpCorePath} \
        --key ${ANVIL_KEY} \
        --keys fuel:${FUEL_KEY} \
        --verbosity debug \
        --yes \
        --amount ${value}`;
}

/**
 * Reads the Warp route deployment config to specified output path.
 * @param warpCorePath path to warp core
 * @param warpDeployPath path to output the resulting read
 * @returns The Warp route deployment config.
 */
export async function readWarpConfigFuel(
  chain: string,
  warpCorePath: string,
  warpDeployPath: string,
): Promise<WarpRouteDeployConfig> {
  const warpAddress = getDeployedWarpAddress(chain, warpCorePath);
  await hyperlaneWarpReadFuel(chain, warpAddress!, warpDeployPath);
  return readYamlOrJson(warpDeployPath);
}
