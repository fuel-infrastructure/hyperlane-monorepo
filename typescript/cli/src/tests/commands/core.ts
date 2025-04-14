import { WalletUnlocked } from 'fuels';
import { $, ProcessPromise } from 'zx';

import { DerivedCoreConfig } from '@hyperlane-xyz/sdk';
import { Address } from '@hyperlane-xyz/utils';

import { readYamlOrJson, writeYamlOrJson } from '../../utils/files.js';
import { MailboxFactory } from '../fuel-core-abis/MailboxFactory.js';

import {
  ANVIL_KEY,
  FUEL_KEY,
  FUEL_REGISTRY_PATH,
  REGISTRY_PATH,
} from './helpers.js';

/**
 * Deploys the Hyperlane core contracts to the specified chain using the provided config.
 */
export function hyperlaneCoreDeployRaw(
  coreInputPath: string,
  privateKey?: string,
  skipConfirmationPrompts?: boolean,
  hypKey?: string,
): ProcessPromise {
  if (hypKey) {
    return $`HYP_KEY=${hypKey} yarn workspace @hyperlane-xyz/cli run hyperlane core deploy \
        --registry ${REGISTRY_PATH} \
        --config ${coreInputPath} \
        --verbosity debug \
        ${skipConfirmationPrompts ? '--yes' : ''}`;
  }

  if (privateKey) {
    return $`yarn workspace @hyperlane-xyz/cli run hyperlane core deploy \
        --registry ${REGISTRY_PATH} \
        --config ${coreInputPath} \
        --key ${privateKey} \
        --verbosity debug \
        ${skipConfirmationPrompts ? '--yes' : ''}`;
  }

  return $`yarn workspace @hyperlane-xyz/cli run hyperlane core deploy \
        --registry ${REGISTRY_PATH} \
        --config ${coreInputPath} \
        --verbosity debug \
        ${skipConfirmationPrompts ? '--yes' : ''}`;
}

/**
 * Deploys the Hyperlane core contracts to the specified chain using the provided config.
 */
export async function hyperlaneCoreDeploy(
  chain: string,
  coreInputPath: string,
) {
  return $`yarn workspace @hyperlane-xyz/cli run hyperlane core deploy \
        --registry ${REGISTRY_PATH} \
        --config ${coreInputPath} \
        --chain ${chain} \
        --key ${ANVIL_KEY} \
        --verbosity debug \
        --yes`;
}

/**
 * Since `core deploy` does not support FuelVM, deploy the core contracts we need ourselves.
 * We also imitate the yaml writing functionality of `core deploy`.
 */
export async function mockFuelCoreDeploy(
  chain: string,
  wallet: WalletUnlocked,
) {
  const { contractId, waitForResult } = await MailboxFactory.deploy(wallet);
  await waitForResult();

  const addressMap = { mailbox: contractId };

  writeYamlOrJson(
    `${REGISTRY_PATH}/chains/${chain}/addresses.yaml`,
    addressMap,
    'yaml',
  );
}

/**
 * Deploys the Hyperlane core contracts to the specified chain using the provided config.
 */
export async function hyperlaneCoreDeployFuel(
  chain: string,
  coreInputPath: string,
) {
  return $`yarn workspace @hyperlane-xyz/cli run hyperlane core deploy \
        --registry ${FUEL_REGISTRY_PATH} \
        --config ${coreInputPath} \
        --chain ${chain} \
        --key ${ANVIL_KEY} \
        --keys ${FUEL_KEY} \
        --verbosity debug \
        --yes`;
}

/**
 * Reads a Hyperlane core deployment on the specified chain using the provided config.
 */
export async function hyperlaneCoreRead(chain: string, coreOutputPath: string) {
  return $`yarn workspace @hyperlane-xyz/cli run hyperlane core read \
        --registry ${REGISTRY_PATH} \
        --config ${coreOutputPath} \
        --chain ${chain} \
        --verbosity debug \
        --yes`;
}

/**
 * Verifies that a Hyperlane core deployment matches the provided config on the specified chain.
 */
export function hyperlaneCoreCheck(
  chain: string,
  coreOutputPath: string,
  mailbox?: Address,
): ProcessPromise {
  if (mailbox) {
    return $`yarn workspace @hyperlane-xyz/cli run hyperlane core check \
        --registry ${REGISTRY_PATH} \
        --config ${coreOutputPath} \
        --chain ${chain} \
        --mailbox ${mailbox} \
        --verbosity debug \
        --yes`;
  }

  return $`yarn workspace @hyperlane-xyz/cli run hyperlane core check \
        --registry ${REGISTRY_PATH} \
        --config ${coreOutputPath} \
        --chain ${chain} \
        --verbosity debug \
        --yes`;
}

/**
 * Creates a Hyperlane core deployment config
 */
export function hyperlaneCoreInit(
  coreOutputPath: string,
  privateKey?: string,
  hyp_key?: string,
): ProcessPromise {
  if (hyp_key) {
    return $`${
      hyp_key ? `HYP_KEY=${hyp_key}` : ''
    } yarn workspace @hyperlane-xyz/cli run hyperlane core init \
        --registry ${REGISTRY_PATH} \
        --config ${coreOutputPath} \
        --verbosity debug \
        --yes`;
  }

  if (privateKey) {
    return $`${
      hyp_key ? 'HYP_KEY=${hyp_key}' : ''
    } yarn workspace @hyperlane-xyz/cli run hyperlane core init \
        --registry ${REGISTRY_PATH} \
        --config ${coreOutputPath} \
        --verbosity debug \
        --key ${privateKey} \
        --yes`;
  }

  return $`yarn workspace @hyperlane-xyz/cli run hyperlane core init \
        --registry ${REGISTRY_PATH} \
        --config ${coreOutputPath} \
        --verbosity debug \
        --yes`;
}

/**
 * Updates a Hyperlane core deployment on the specified chain using the provided config.
 */
export async function hyperlaneCoreApply(
  chain: string,
  coreOutputPath: string,
) {
  return $`yarn workspace @hyperlane-xyz/cli run hyperlane core apply \
        --registry ${REGISTRY_PATH} \
        --config ${coreOutputPath} \
        --chain ${chain} \
        --key ${ANVIL_KEY} \
        --verbosity debug \
        --yes`;
}

/**
 * Reads the Core deployment config and outputs it to specified output path.
 */
export async function readCoreConfig(
  chain: string,
  coreConfigPath: string,
): Promise<DerivedCoreConfig> {
  await hyperlaneCoreRead(chain, coreConfigPath);
  return readYamlOrJson(coreConfigPath);
}
