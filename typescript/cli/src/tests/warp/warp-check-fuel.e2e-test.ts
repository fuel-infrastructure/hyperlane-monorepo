import { expect } from 'chai';

import { WarpRouteDeployConfig } from '@hyperlane-xyz/sdk';

import { writeYamlOrJson } from '../../utils/files.js';
import {
  ANVIL_KEY,
  CHAIN_NAME_FUEL_1,
  DEFAULT_E2E_TEST_TIMEOUT,
  FUEL_1_CONFIG_PATH,
  FUEL_KEY,
  WARP_DEPLOY_OUTPUT_PATH_FUEL,
} from '../commands/helpers.js';
import {
  FUEL_TEST_SRC20_SYMBOL,
  hyperlaneWarpCheckRawFuel,
  readWarpConfigFuel,
} from '../commands/warp-fuel.js';

describe('hyperlane warp check fuel e2e tests', async function () {
  // Set a longer timeout for all tests in this suite
  this.timeout(DEFAULT_E2E_TEST_TIMEOUT);

  const FUEL_CORE_CONFIG_PATH = 'temp';

  // Setup variables to be used across tests
  let warpConfig: WarpRouteDeployConfig;
  let originalOwner: string;

  before(async function () {
    // Read the current config before running any tests
    warpConfig = await readWarpConfigFuel(
      CHAIN_NAME_FUEL_1,
      FUEL_CORE_CONFIG_PATH,
      FUEL_1_CONFIG_PATH,
    );

    // Store the original owner for later use
    originalOwner = warpConfig[CHAIN_NAME_FUEL_1].owner;
  });

  describe('detecting configuration differences', () => {
    it('should detect differences between expected and actual config', async function () {
      // Modify the config with a new owner - use a Fuel-style address (64 hex chars)
      const newOwner = '0x' + 'a'.repeat(64);
      const modifiedConfig = { ...warpConfig };
      modifiedConfig[CHAIN_NAME_FUEL_1].owner = newOwner;
      writeYamlOrJson(FUEL_1_CONFIG_PATH, modifiedConfig);

      // Expected text in the output - match the actual format from logs
      const expectedDiffText = `EXPECTED: "${newOwner}"`;

      // Run the check command and expect it to fail with the difference
      const output = await hyperlaneWarpCheckRawFuel({
        hypKey: ANVIL_KEY,
        fuelKey: FUEL_KEY,
        warpDeployPath: WARP_DEPLOY_OUTPUT_PATH_FUEL,
        symbol: FUEL_TEST_SRC20_SYMBOL,
      }).nothrow();

      expect(output.exitCode).to.equal(1);
      expect(output.text()).to.include(expectedDiffText);
    });
  });

  describe('validating matching configurations', () => {
    it('should successfully check the config when it matches', async function () {
      // Read the current config
      const currentConfig = await readWarpConfigFuel(
        CHAIN_NAME_FUEL_1,
        FUEL_CORE_CONFIG_PATH,
        FUEL_1_CONFIG_PATH,
      );

      // Write the same config back without changes
      writeYamlOrJson(FUEL_1_CONFIG_PATH, currentConfig);

      // Run the check command and expect it to succeed
      const output = await hyperlaneWarpCheckRawFuel({
        hypKey: ANVIL_KEY,
        fuelKey: FUEL_KEY,
        warpDeployPath: WARP_DEPLOY_OUTPUT_PATH_FUEL,
        symbol: FUEL_TEST_SRC20_SYMBOL,
      });

      expect(output.exitCode).to.equal(0);
      expect(output.text()).to.include('No violations found');
    });
  });

  describe('handling command parameters', () => {
    it('should require symbol parameter', async function () {
      // Test with missing symbol parameter but valid keys
      const output = await hyperlaneWarpCheckRawFuel({
        hypKey: ANVIL_KEY,
        fuelKey: FUEL_KEY,
        warpDeployPath: WARP_DEPLOY_OUTPUT_PATH_FUEL,
        // symbol intentionally omitted
      }).nothrow();

      expect(output.exitCode).to.equal(1);
    });
  });

  describe('hyperlane warp check --symbol ... --config ... --key ...', () => {
    it('should not find any differences between the on chain config and the local one', async function () {
      // Read the current config
      const currentConfig = await readWarpConfigFuel(
        CHAIN_NAME_FUEL_1,
        FUEL_CORE_CONFIG_PATH,
        FUEL_1_CONFIG_PATH,
      );

      // Write the same config back without changes
      writeYamlOrJson(FUEL_1_CONFIG_PATH, currentConfig);

      // Run the check command with all parameters
      const output = await hyperlaneWarpCheckRawFuel({
        hypKey: ANVIL_KEY,
        fuelKey: FUEL_KEY,
        warpDeployPath: WARP_DEPLOY_OUTPUT_PATH_FUEL,
        symbol: FUEL_TEST_SRC20_SYMBOL,
      });

      expect(output.exitCode).to.equal(0);
      expect(output.text()).to.include('No violations found');
    });

    it('should find differences between the local config and the on chain config', async function () {
      // Modify the config with a new owner - use a Fuel-style address (64 hex chars)
      const newOwner = '0x' + 'b'.repeat(64);
      const modifiedConfig = { ...warpConfig };
      modifiedConfig[CHAIN_NAME_FUEL_1].owner = newOwner;
      writeYamlOrJson(FUEL_1_CONFIG_PATH, modifiedConfig);

      // Expected text in the output
      const expectedDiffText = `EXPECTED: "${newOwner}"`;

      // Run the check command and expect it to fail with the difference
      const output = await hyperlaneWarpCheckRawFuel({
        hypKey: ANVIL_KEY,
        fuelKey: FUEL_KEY,
        warpDeployPath: WARP_DEPLOY_OUTPUT_PATH_FUEL,
        symbol: FUEL_TEST_SRC20_SYMBOL,
      }).nothrow();

      expect(output.exitCode).to.equal(1);
      expect(output.text()).to.include(expectedDiffText);
    });
  });

  // Restore the original config after all tests
  after(async function () {
    if (originalOwner) {
      const currentConfig = await readWarpConfigFuel(
        CHAIN_NAME_FUEL_1,
        FUEL_CORE_CONFIG_PATH,
        FUEL_1_CONFIG_PATH,
      );
      currentConfig[CHAIN_NAME_FUEL_1].owner = originalOwner;
      writeYamlOrJson(FUEL_1_CONFIG_PATH, currentConfig);
    }
  });
});
