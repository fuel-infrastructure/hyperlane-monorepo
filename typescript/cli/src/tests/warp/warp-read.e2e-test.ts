import { expect } from 'chai';
import { Wallet } from 'ethers';
import { WalletUnlocked } from 'fuels';

import { ChainAddresses } from '@hyperlane-xyz/registry';
import { TokenType, WarpRouteDeployConfig } from '@hyperlane-xyz/sdk';
import { Address, ProtocolType } from '@hyperlane-xyz/utils';

import { readYamlOrJson, writeYamlOrJson } from '../../utils/files.js';
import {
  ANVIL_KEY,
  CHAIN_NAME_2,
  CHAIN_NAME_3,
  CORE_CONFIG_PATH,
  DEFAULT_E2E_TEST_TIMEOUT,
  FUEL_CHAIN_NAME_1,
  FUEL_KEY,
  FUEL_WARP_CONFIG_PATH_EXAMPLE,
  KeyBoardKeys,
  TestPromptAction,
  WARP_CONFIG_PATH_2,
  WARP_CONFIG_PATH_EXAMPLE,
  WARP_CONFIG_PATH_FUEL_1,
  WARP_CORE_CONFIG_PATH_2,
  WARP_DEPLOY_OUTPUT_PATH,
  deployOrUseExistingCore,
  handlePrompts,
} from '../commands/helpers.js';
import {
  hyperlaneWarpDeploy,
  hyperlaneWarpReadRaw,
  readWarpConfig,
} from '../commands/warp.js';

describe('hyperlane warp read e2e tests', async function () {
  this.timeout(DEFAULT_E2E_TEST_TIMEOUT);

  let anvil2Config: WarpRouteDeployConfig;
  let fuel1Config: WarpRouteDeployConfig;

  let chain2Addresses: ChainAddresses = {};
  let chain3Addresses: ChainAddresses = {};
  let fuel1Addresses: ChainAddresses = {};

  let evmOwnerAddress: Address;
  let fuelOwnerAddress: Address;

  before(async function () {
    [chain2Addresses, chain3Addresses, fuel1Addresses] = await Promise.all([
      deployOrUseExistingCore(CHAIN_NAME_2, CORE_CONFIG_PATH, ANVIL_KEY),
      deployOrUseExistingCore(CHAIN_NAME_3, CORE_CONFIG_PATH, ANVIL_KEY),
      // Pulls preset fake data since we don't need core contract functionality
      deployOrUseExistingCore(FUEL_CHAIN_NAME_1, '', ''),
    ]);

    evmOwnerAddress = new Wallet(ANVIL_KEY).address;
    fuelOwnerAddress = new WalletUnlocked(FUEL_KEY).address.b256Address;
    fuelOwnerAddress = fuelOwnerAddress.toLowerCase();
    fuel1Addresses.mailbox = fuel1Addresses.mailbox.toLowerCase();
  });

  before(async function () {
    await deployOrUseExistingCore(CHAIN_NAME_2, CORE_CONFIG_PATH, ANVIL_KEY);

    // Create a new warp config using the example
    const exampleEvmWarpConfig: WarpRouteDeployConfig = readYamlOrJson(
      WARP_CONFIG_PATH_EXAMPLE,
    );
    const exampleFuelWarpConfig: WarpRouteDeployConfig = readYamlOrJson(
      FUEL_WARP_CONFIG_PATH_EXAMPLE,
    );
    anvil2Config = { [CHAIN_NAME_2]: { ...exampleEvmWarpConfig.anvil1 } };
    fuel1Config = {
      [FUEL_CHAIN_NAME_1]: { ...exampleFuelWarpConfig.fueltestnet },
    };
    writeYamlOrJson(WARP_CONFIG_PATH_2, anvil2Config);
    writeYamlOrJson(WARP_CONFIG_PATH_FUEL_1, fuel1Config);
  });

  describe('hyperlane warp read --key ... --config ...', () => {
    // eslint-disable-next-line jest/no-disabled-tests
    it.skip('should exit early if no symbol, chain or warp file have been provided', async () => {
      await hyperlaneWarpDeploy(WARP_CONFIG_PATH_2);

      const output = await hyperlaneWarpReadRaw({
        privateKey: ANVIL_KEY,
        outputPath: WARP_CONFIG_PATH_2,
      }).nothrow();

      expect(output.exitCode).to.equal(1);
      expect(output.text()).to.include(
        'Please specify either a symbol, chain and address or warp file',
      );
    });
  });

  describe('hyperlane warp read --config ... --symbol ...', () => {
    // eslint-disable-next-line jest/no-focused-tests
    it.only('should successfully read the complete warp route config from all the chains', async () => {
      await hyperlaneWarpDeploy(WARP_CONFIG_PATH_2);
      // TODO this is mocking, we should use that if possible
      // await hyperlaneWarpDeploy(WARP_CONFIG_PATH_FUEL_1);

      // const steps: TestPromptAction[] = [
      //   {
      //     check: (currentOutput) =>
      //       currentOutput.includes('Please enter the private key for chain'),
      //     input: `${ANVIL_KEY}${KeyBoardKeys.ENTER}`,
      //   },
      // ];

      const steps = (protocol: ProtocolType): TestPromptAction[] => {
        return [
          {
            check: (currentOutput) =>
              currentOutput.includes('Please enter the private key for chain'),
            input: `${
              protocol === ProtocolType.Ethereum ? ANVIL_KEY : FUEL_KEY
            }${KeyBoardKeys.ENTER}`,
          },
        ];
      };

      // const output = hyperlaneWarpReadRaw({
      //   symbol: 'ETH',
      //   outputPath: WARP_CONFIG_PATH_2,
      // })
      //   .stdio('pipe')
      //   .nothrow();

      const output = (protocol: ProtocolType) => {
        return hyperlaneWarpReadRaw({
          symbol: 'ETH',
          outputPath:
            protocol === ProtocolType.Ethereum
              ? WARP_CONFIG_PATH_2
              : WARP_CONFIG_PATH_FUEL_1,
        })
          .stdio('pipe')
          .nothrow();
      };

      const evmFinalOutput = await handlePrompts(
        output(ProtocolType.Ethereum),
        steps(ProtocolType.Ethereum),
      );

      expect(evmFinalOutput.exitCode).to.equal(0);

      const warpReadResult: WarpRouteDeployConfig =
        readYamlOrJson(WARP_CONFIG_PATH_2);
      expect(warpReadResult[CHAIN_NAME_2]).not.to.be.undefined;
      expect(warpReadResult[CHAIN_NAME_2].type).to.equal(TokenType.native);
    });
  });

  describe('hyperlane warp read --key ... --symbol ...', () => {
    // eslint-disable-next-line jest/no-disabled-tests
    it.skip('should successfully read the complete warp route config from all the chains', async () => {
      const warpConfig: WarpRouteDeployConfig = {
        [CHAIN_NAME_2]: {
          type: TokenType.native,
          mailbox: chain2Addresses.mailbox,
          owner: evmOwnerAddress,
        },
        [CHAIN_NAME_3]: {
          type: TokenType.synthetic,
          mailbox: chain3Addresses.mailbox,
          owner: evmOwnerAddress,
        },
      };

      writeYamlOrJson(WARP_DEPLOY_OUTPUT_PATH, warpConfig);
      await hyperlaneWarpDeploy(WARP_DEPLOY_OUTPUT_PATH);

      const steps: TestPromptAction[] = [
        // Select the anvil2-anvil3 ETH route from the selection prompt
        {
          check: (currentOutput: string) =>
            currentOutput.includes('Select from matching warp routes'),
          input: KeyBoardKeys.ENTER,
        },
      ];

      const output = hyperlaneWarpReadRaw({
        privateKey: ANVIL_KEY,
        symbol: 'ETH',
        outputPath: WARP_DEPLOY_OUTPUT_PATH,
      })
        .stdio('pipe')
        .nothrow();

      const finalOutput = await handlePrompts(output, steps);

      expect(finalOutput.exitCode).to.equal(0);

      const warpReadResult: WarpRouteDeployConfig = readYamlOrJson(
        WARP_DEPLOY_OUTPUT_PATH,
      );
      expect(warpReadResult[CHAIN_NAME_2]).not.to.be.undefined;
      expect(warpReadResult[CHAIN_NAME_2].type).to.equal(TokenType.native);

      expect(warpReadResult[CHAIN_NAME_3]).not.to.be.undefined;
      expect(warpReadResult[CHAIN_NAME_3].type).to.equal(TokenType.synthetic);
    });
  });

  describe('hyperlane warp read --key ... --chain ... --config ...', () => {
    // eslint-disable-next-line jest/no-disabled-tests
    it.skip('should be able to read a warp route', async function () {
      await hyperlaneWarpDeploy(WARP_CONFIG_PATH_2);

      const warpReadResult: WarpRouteDeployConfig = await readWarpConfig(
        CHAIN_NAME_2,
        WARP_CORE_CONFIG_PATH_2,
        WARP_DEPLOY_OUTPUT_PATH,
      );

      expect(warpReadResult[CHAIN_NAME_2].type).to.be.equal(
        anvil2Config[CHAIN_NAME_2].type,
      );
    });
  });
});
