import { expect } from 'chai';
import { WalletUnlocked } from 'fuels';

import { ChainAddresses } from '@hyperlane-xyz/registry';
import {
  ChainMap,
  ChainName,
  TokenType,
  WarpRouteDeployConfig,
} from '@hyperlane-xyz/sdk';
import { Address } from '@hyperlane-xyz/utils';

import { readYamlOrJson } from '../utils/files.js';

import {
  DEFAULT_E2E_TEST_TIMEOUT,
  FUEL_CHAIN_NAME,
  FUEL_CONFIG_PATH,
  FUEL_EXAMPLE_CONFIG_PATH,
  FUEL_KEY,
  KeyBoardKeys,
  SELECT_TESTNET_CHAIN_TYPE_STEP,
  TestPromptAction,
  deployOrUseExistingCoreFuel,
  handlePrompts,
} from './commands/helpers.js';
import { hyperlaneWarpInitFuel } from './commands/warp.js';

describe('hyperlane warp init e2e tests', async function () {
  this.timeout(2 * DEFAULT_E2E_TEST_TIMEOUT);

  let fuelAddresses: ChainAddresses = {};
  let initialOwnerAddress: Address;
  let chainMapAddresses: ChainMap<ChainAddresses> = {};

  before(async function () {
    fuelAddresses = await deployOrUseExistingCoreFuel(
      FUEL_CHAIN_NAME,
      FUEL_EXAMPLE_CONFIG_PATH,
      FUEL_KEY,
    );

    chainMapAddresses = {
      [FUEL_CHAIN_NAME]: fuelAddresses,
    };

    const wallet = new WalletUnlocked(FUEL_KEY);
    initialOwnerAddress = wallet.address.toHexString();
  });

  describe('hyperlane warp init --yes', () => {
    function assertWarpConfig(
      warpConfig: WarpRouteDeployConfig,
      chainMapAddresses: ChainMap<ChainAddresses>,
      chainName: ChainName,
    ) {
      expect(warpConfig[chainName]).not.to.be.undefined;

      const chain2TokenConfig = warpConfig[chainName];
      expect(chain2TokenConfig.mailbox).equal(
        chainMapAddresses[chainName].mailbox,
      );
      expect(chain2TokenConfig.owner).equal(initialOwnerAddress);
      expect(chain2TokenConfig.type).equal(TokenType.native);
    }

    it('it should generate a warp deploy config with a single chain', async function () {
      const steps: TestPromptAction[] = [
        SELECT_TESTNET_CHAIN_TYPE_STEP,
        {
          check: (currentOutput: string) =>
            currentOutput.includes('--Testnet Chains--'),
          // Scroll down through the testnet chains list and select fueltestnet
          input: `${KeyBoardKeys.ARROW_DOWN}${KeyBoardKeys.TAB}${KeyBoardKeys.ENTER}`,
        },
        {
          check: (currentOutput: string) =>
            currentOutput.includes('Enter the desired owner address:'),
          input: `${initialOwnerAddress}${KeyBoardKeys.ENTER}`,
        },
        {
          check: (currentOutput: string) =>
            !!currentOutput.match(/Select .+?'s token type/),
          // Scroll up through the token type list and select native
          input: `${KeyBoardKeys.ARROW_DOWN.repeat(2)}${KeyBoardKeys.ENTER}`,
        },
      ];

      const output = hyperlaneWarpInitFuel(FUEL_CONFIG_PATH).stdio('pipe');

      await handlePrompts(output, steps);

      const warpConfig: WarpRouteDeployConfig =
        readYamlOrJson(FUEL_CONFIG_PATH);

      assertWarpConfig(warpConfig, chainMapAddresses, FUEL_CHAIN_NAME);
    });
  });
});
