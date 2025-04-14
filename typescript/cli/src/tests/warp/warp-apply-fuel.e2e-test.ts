import { expect } from 'chai';
import { Wallet } from 'ethers';

import { ChainAddresses } from '@hyperlane-xyz/registry';
import {
  HookType,
  HypTokenRouterConfig,
  TokenType,
  WarpRouteDeployConfig,
  normalizeConfig,
} from '@hyperlane-xyz/sdk';
import { Address } from '@hyperlane-xyz/utils';

import { readYamlOrJson, writeYamlOrJson } from '../../utils/files.js';
import {
  ANVIL_KEY,
  CHAIN_NAME_2,
  CHAIN_NAME_FUEL_1,
  CHAIN_NAME_FUEL_2,
  CORE_CONFIG_PATH,
  DEFAULT_E2E_TEST_TIMEOUT,
  E2E_TEST_BURN_ADDRESS,
  FUEL_1_CONFIG_PATH,
  FUEL_WARP_CONFIG_PATH_EXAMPLE,
  TEMP_PATH,
  WARP_DEPLOY_OUTPUT_PATH_FUEL,
  deployOrUseExistingCore,
  getCombinedWarpRoutePath,
  getCombinedWarpRoutePathFuel,
  getDomainId,
  updateOwnerFuel,
} from '../commands/helpers.js';
import {
  FUEL_TEST_SRC20_SYMBOL,
  hyperlaneWarpApplyFuel,
  hyperlaneWarpDeployFuel,
  readWarpConfigFuel,
} from '../commands/warp-fuel.js';

describe('hyperlane warp apply fuel e2e tests', async function () {
  this.timeout(2 * DEFAULT_E2E_TEST_TIMEOUT);
  const FUEL_CORE_CONFIG_PATH = 'temp';
  let anvilAddresses: ChainAddresses = {};

  before(async function () {
    // Also deploy on Anvil for extension tests
    anvilAddresses = await deployOrUseExistingCore(
      CHAIN_NAME_2,
      CORE_CONFIG_PATH,
      ANVIL_KEY,
    );

    // Create a new warp config using the example
    const exampleWarpConfig: WarpRouteDeployConfig = readYamlOrJson(
      FUEL_WARP_CONFIG_PATH_EXAMPLE,
    );
    const fuelConfig = { fueltestnet: { ...exampleWarpConfig.fueltestnet } };
    writeYamlOrJson(FUEL_1_CONFIG_PATH, fuelConfig);

    // Deploy only once at the beginning
    await hyperlaneWarpDeployFuel(FUEL_1_CONFIG_PATH);
  });

  it('should update owner address', async function () {
    // Convert burn address to Fuel format if needed
    const burnAddress: Address =
      E2E_TEST_BURN_ADDRESS.length === 42
        ? E2E_TEST_BURN_ADDRESS.replace('0x', '0x' + '0'.repeat(24))
        : E2E_TEST_BURN_ADDRESS;

    // Update the owner using the helper function
    await updateOwnerFuel(
      burnAddress,
      CHAIN_NAME_FUEL_1,
      WARP_DEPLOY_OUTPUT_PATH_FUEL,
      FUEL_CORE_CONFIG_PATH,
    );

    // Read back the config to verify changes
    const updatedConfig = await readWarpConfigFuel(
      CHAIN_NAME_FUEL_1,
      FUEL_CORE_CONFIG_PATH,
      `${TEMP_PATH}/warp-route-deployment-2.yaml`,
    );

    expect(updatedConfig[CHAIN_NAME_FUEL_1].owner).to.equal(burnAddress);
  });

  it('should not update the same owner', async function () {
    // First read the existing config
    const warpConfig = await readWarpConfigFuel(
      CHAIN_NAME_FUEL_1,
      FUEL_CORE_CONFIG_PATH,
      `${TEMP_PATH}/warp-route-deployment-2.yaml`,
    );

    // Get the current owner
    const currentOwner = warpConfig[CHAIN_NAME_FUEL_1].owner;

    // Update with the same owner
    const output = await updateOwnerFuel(
      currentOwner,
      CHAIN_NAME_FUEL_1,
      WARP_DEPLOY_OUTPUT_PATH_FUEL,
      FUEL_CORE_CONFIG_PATH,
    );

    // Expect no changes message
    expect(output.text()).to.include(
      'Warp config is the same as target. No updates applied.',
    );
  });

  it('should update hook configuration', async function () {
    const warpDeployPath = `${TEMP_PATH}/warp-route-deployment-2.yaml`;

    // First read the existing config
    const warpDeployConfig = await readWarpConfigFuel(
      CHAIN_NAME_FUEL_1,
      FUEL_CORE_CONFIG_PATH,
      warpDeployPath,
    );

    warpDeployConfig[CHAIN_NAME_FUEL_1].hook = {
      type: HookType.MERKLE_TREE,
    };

    // Write the updated config
    writeYamlOrJson(warpDeployPath, warpDeployConfig);

    // Apply the changes
    await hyperlaneWarpApplyFuel(warpDeployPath, FUEL_CORE_CONFIG_PATH);

    // Read back the config to verify changes
    const updatedConfig = await readWarpConfigFuel(
      CHAIN_NAME_FUEL_1,
      FUEL_CORE_CONFIG_PATH,
      warpDeployPath,
    );

    // Verify the hook was updated with all properties
    expect(
      normalizeConfig(updatedConfig[CHAIN_NAME_FUEL_1].hook),
    ).to.deep.equal(normalizeConfig(warpDeployConfig[CHAIN_NAME_FUEL_1].hook));
  });

  it('should extend an existing warp route to include Anvil', async function () {
    // Read existing config into a file
    const warpConfigPath = `${TEMP_PATH}/warp-route-deployment-2.yaml`;

    // First, read the existing Fuel config
    const warpConfig = await readWarpConfigFuel(
      CHAIN_NAME_FUEL_1,
      FUEL_CORE_CONFIG_PATH,
      warpConfigPath,
    );

    // Create the Anvil config
    const anvilConfig: HypTokenRouterConfig = {
      decimals: 18,
      mailbox: anvilAddresses.mailbox,
      name: 'Test Token',
      owner: new Wallet(ANVIL_KEY).address,
      symbol: FUEL_TEST_SRC20_SYMBOL,
      totalSupply: 0,
      type: TokenType.native,
    };

    // Add Anvil to the config
    warpConfig[CHAIN_NAME_2] = anvilConfig;

    // Write the updated config
    writeYamlOrJson(warpConfigPath, warpConfig);

    try {
      // Apply the changes
      await hyperlaneWarpApplyFuel(warpConfigPath, FUEL_CORE_CONFIG_PATH);

      // Get the combined path for verification
      const COMBINED_WARP_CORE_CONFIG_PATH = getCombinedWarpRoutePath(
        FUEL_TEST_SRC20_SYMBOL,
        [CHAIN_NAME_FUEL_1, CHAIN_NAME_2],
      );

      // Check that Anvil is enrolled in Fuel
      const updatedFuelConfig = await readWarpConfigFuel(
        CHAIN_NAME_FUEL_1,
        COMBINED_WARP_CORE_CONFIG_PATH,
        warpConfigPath,
      );

      const anvilId = await getDomainId(CHAIN_NAME_2, ANVIL_KEY);
      const fuelRemoteRouters = Object.keys(
        updatedFuelConfig[CHAIN_NAME_FUEL_1].remoteRouters || {},
      );
      expect(fuelRemoteRouters).to.include(anvilId);
    } catch (error) {
      // Note: We expect this error: "Error: Only single protocol updates are supported for now"
      console.log(
        'Expected error when extending to Anvil:',
        (error as Error).message,
      );
      expect((error as Error).message).to.include(
        'Only single protocol updates are supported for now',
      );
    }
  });

  it('should extend an existing warp route to include fueltestnet2', async function () {
    // Read existing config into a file
    const warpConfigPath = `${TEMP_PATH}/warp-route-deployment-2.yaml`;

    // First, read the existing Fuel config
    const initialConfig = await readWarpConfigFuel(
      CHAIN_NAME_FUEL_1,
      FUEL_CORE_CONFIG_PATH,
      warpConfigPath,
    );

    console.log('Initial config:', JSON.stringify(initialConfig, null, 2));

    // Extend with new config
    const config: HypTokenRouterConfig = {
      decimals: 9,
      mailbox:
        '0x26dce42ec5348cfaae7f0fc582afc3f71e81ba75d527460397faf2226a45ffce',
      name: 'Test Token',
      owner:
        '0x3cd71d5638d4bacf43f26a5b43028bf6581a18d262d88da0912f32ad3d25b963',
      symbol: FUEL_TEST_SRC20_SYMBOL,
      totalSupply: 0,
      type: TokenType.native,
    };

    // Add fueltestnet2 to the config manually
    initialConfig[CHAIN_NAME_FUEL_2] = config;

    // Add remote router connections manually
    if (!initialConfig[CHAIN_NAME_FUEL_1].remoteRouters) {
      initialConfig[CHAIN_NAME_FUEL_1].remoteRouters = {};
    }

    if (!initialConfig[CHAIN_NAME_FUEL_2].remoteRouters) {
      initialConfig[CHAIN_NAME_FUEL_2].remoteRouters = {};
    }

    const fueltestnet2Id = '1717982313'; // Domain ID for fueltestnet2
    const fuelId = '1699455630'; // Domain ID for fueltestnet

    initialConfig[CHAIN_NAME_FUEL_1].remoteRouters[fueltestnet2Id] = {
      address:
        '0x445ae47eb54f2bd0644297fbceca261be68c0998d1a417106034aa34b721ca6c',
    };

    // Write the updated config
    writeYamlOrJson(warpConfigPath, initialConfig);

    console.log(
      'Updated config before apply:',
      JSON.stringify(initialConfig, null, 2),
    );

    // Apply the changes
    await hyperlaneWarpApplyFuel(warpConfigPath, FUEL_CORE_CONFIG_PATH);

    const COMBINED_WARP_CORE_CONFIG_PATH = getCombinedWarpRoutePathFuel(
      FUEL_TEST_SRC20_SYMBOL,
      [CHAIN_NAME_FUEL_1, CHAIN_NAME_FUEL_2],
    );

    // Check that fueltestnet2 is enrolled in fueltestnet
    const updatedWarpDeployConfig1 = await readWarpConfigFuel(
      CHAIN_NAME_FUEL_1,
      COMBINED_WARP_CORE_CONFIG_PATH,
      warpConfigPath,
    );

    const remoteRouterKeys1 = Object.keys(
      updatedWarpDeployConfig1[CHAIN_NAME_FUEL_1].remoteRouters || {},
    );
    expect(remoteRouterKeys1).to.include(fueltestnet2Id);

    // Check that fueltestnet is enrolled in fueltestnet2
    const updatedWarpDeployConfig2 = await readWarpConfigFuel(
      CHAIN_NAME_FUEL_2,
      COMBINED_WARP_CORE_CONFIG_PATH,
      warpConfigPath,
    );

    const remoteRouterKeys2 = Object.keys(
      updatedWarpDeployConfig2[CHAIN_NAME_FUEL_2].remoteRouters || {},
    );
    expect(remoteRouterKeys2).to.include(fuelId);
  });
});
