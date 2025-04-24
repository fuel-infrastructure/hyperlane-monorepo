import { WalletUnlocked, getRandomB256 } from 'fuels';
import { $, ProcessPromise } from 'zx';

import { DerivedCoreConfig, FuelPausableHookFactory } from '@hyperlane-xyz/sdk';
import { Address } from '@hyperlane-xyz/utils';

import { readYamlOrJson, writeYamlOrJson } from '../../utils/files.js';
import { IsmTestFactory } from '../fuel-core-abis/IsmTestFactory.js';
import { MailboxFactory } from '../fuel-core-abis/MailboxFactory.js';

//import { MockPostDispatchFactory } from '../fuel-core-abis/MockPostDispatchFactory.js';
import { ANVIL_KEY, REGISTRY_PATH } from './helpers.js';

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
  LOCAL_DOMAIN: string | undefined = '13373',
) {
  const { contractId: mailboxId, waitForResult } = await MailboxFactory.deploy(
    wallet,
    {
      configurableConstants: {
        EXPECTED_OWNER: wallet.address.b256Address,
        LOCAL_DOMAIN,
      },
      salt: getRandomB256(),
    },
  );
  const mailbox = (await waitForResult()).contract;

  const deployHook = async () => {
    const { contractId, waitForResult } = await FuelPausableHookFactory.deploy(
      wallet,
      {
        configurableConstants: { EXPECTED_OWNER: wallet.address.b256Address },
        salt: getRandomB256(),
      },
    );
    const hook = await waitForResult();
    const init_res = await (
      await hook.contract.functions
        .initialize_ownership({ Address: { bits: wallet.address.b256Address } })
        .call()
    ).waitForResult();

    if (!init_res.transactionResult.isStatusSuccess)
      throw new Error(
        'Fuel Core Deployment: Hook ownership initialization failed',
      );
    return contractId;
  };

  const deployIsm = async () => {
    const { contractId, waitForResult } = await IsmTestFactory.deploy(wallet, {
      salt: getRandomB256(),
    });
    await waitForResult();
    return contractId;
  };

  const res = await (
    await mailbox.functions
      .initialize(
        { Address: { bits: wallet.address.b256Address } },
        await deployIsm(),
        await deployHook(),
        await deployHook(),
      )
      .call()
  ).waitForResult();
  if (!res.transactionResult.isStatusSuccess)
    throw new Error('Fuel Core Deployment: Mailbox initialization failed');

  const addressMap = { mailbox: mailboxId };

  writeYamlOrJson(
    `${REGISTRY_PATH}/chains/${chain}/addresses.yaml`,
    addressMap,
    'yaml',
  );
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
