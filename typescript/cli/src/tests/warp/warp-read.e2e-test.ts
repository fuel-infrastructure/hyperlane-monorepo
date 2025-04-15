import { expect } from 'chai';
import { Wallet } from 'ethers';
import { WalletUnlocked } from 'fuels';
import { DeployContractConfig, LaunchTestNodeReturn } from 'fuels/test-utils';

import { ChainAddresses } from '@hyperlane-xyz/registry';
import { TokenType, WarpRouteDeployConfig } from '@hyperlane-xyz/sdk';
import { Address, ProtocolType } from '@hyperlane-xyz/utils';

import { readYamlOrJson, writeYamlOrJson } from '../../utils/files.js';
import {
  ANVIL_KEY,
  CHAIN_NAME_2,
  CHAIN_NAME_3,
  CHAIN_NAME_FUEL_1,
  CORE_CONFIG_PATH,
  CORE_CONFIG_PATH_FUEL,
  DEFAULT_E2E_TEST_TIMEOUT,
  FUEL_WARP_CONFIG_PATH_EXAMPLE,
  KeyBoardKeys,
  TestPromptAction,
  WARP_CONFIG_PATH_2,
  WARP_CONFIG_PATH_EXAMPLE,
  WARP_CONFIG_PATH_FUEL_1,
  WARP_CORE_CONFIG_PATH_2,
  WARP_DEPLOY_OUTPUT_PATH,
  cleanupFuelNodes,
  deployOrUseExistingCore,
  handlePrompts,
  launchFuelNodes,
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
  let initialFuelOwnerPk: string;

  let fuelNodes: Record<string, LaunchTestNodeReturn<DeployContractConfig[]>>;

  before(async function () {
    fuelNodes = await launchFuelNodes();
    const fuelWallet = fuelNodes[CHAIN_NAME_FUEL_1].wallets[0];
    const fuelPk = fuelWallet.privateKey;
    initialFuelOwnerPk = fuelPk;

    [chain2Addresses, chain3Addresses, fuel1Addresses] = await Promise.all([
      deployOrUseExistingCore(CHAIN_NAME_2, CORE_CONFIG_PATH, ANVIL_KEY),
      deployOrUseExistingCore(CHAIN_NAME_3, CORE_CONFIG_PATH, ANVIL_KEY),
      deployOrUseExistingCore(
        CHAIN_NAME_FUEL_1,
        CORE_CONFIG_PATH_FUEL,
        fuelPk,
        fuelWallet,
      ),
    ]);

    evmOwnerAddress = new Wallet(ANVIL_KEY).address;
    fuelOwnerAddress = new WalletUnlocked(fuelPk).address.b256Address;
  });

  before(async function () {
    await deployOrUseExistingCore(CHAIN_NAME_2, CORE_CONFIG_PATH, ANVIL_KEY);
    await deployOrUseExistingCore(
      CHAIN_NAME_FUEL_1,
      CORE_CONFIG_PATH_FUEL,
      initialFuelOwnerPk,
      fuelNodes[CHAIN_NAME_FUEL_1].wallets[0],
    );

    // Create a new warp config using the example
    const exampleEvmWarpConfig: WarpRouteDeployConfig = readYamlOrJson(
      WARP_CONFIG_PATH_EXAMPLE,
    );
    const exampleFuelWarpConfig: WarpRouteDeployConfig = readYamlOrJson(
      FUEL_WARP_CONFIG_PATH_EXAMPLE,
    );
    anvil2Config = { [CHAIN_NAME_2]: { ...exampleEvmWarpConfig.anvil1 } };
    fuel1Config = {
      [CHAIN_NAME_FUEL_1]: { ...exampleFuelWarpConfig.fueltest1 },
    };
    writeYamlOrJson(WARP_CONFIG_PATH_2, anvil2Config);
    writeYamlOrJson(WARP_CONFIG_PATH_FUEL_1, fuel1Config);
  });

  after(async function () {
    await cleanupFuelNodes(fuelNodes);
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
    // eslint-disable-next-line jest/no-disabled-tests
    it.skip('should successfully read the complete warp route config from all the chains', async () => {
      await hyperlaneWarpDeploy(WARP_CONFIG_PATH_2);
      await hyperlaneWarpDeploy(WARP_CONFIG_PATH_FUEL_1, initialFuelOwnerPk);

      const steps = (protocol: ProtocolType): TestPromptAction[] => {
        return [
          {
            check: (currentOutput) =>
              currentOutput.includes('Select from matching warp routes'),
            input:
              protocol === ProtocolType.Ethereum
                ? `${KeyBoardKeys.ENTER}`
                : `${KeyBoardKeys.ARROW_DOWN.repeat(1)}${KeyBoardKeys.ENTER}`,
          },
          {
            check: (currentOutput) =>
              currentOutput.includes('Please enter the private key for chain'),
            input: `${
              protocol === ProtocolType.Ethereum
                ? ANVIL_KEY
                : initialFuelOwnerPk
            }${KeyBoardKeys.ENTER}`,
          },
        ];
      };

      const output = (protocol: ProtocolType) => {
        return hyperlaneWarpReadRaw({
          symbol: 'ETH',
          outputPath:
            protocol === ProtocolType.Ethereum
              ? WARP_CONFIG_PATH_2
              : WARP_CONFIG_PATH_FUEL_1,
          ...(protocol === ProtocolType.Fuel
            ? { fuelKey: initialFuelOwnerPk }
            : {}),
        })
          .stdio('pipe')
          .nothrow();
      };

      const evmFinalOutput = await handlePrompts(
        output(ProtocolType.Ethereum),
        steps(ProtocolType.Ethereum),
      );
      const fuelFinalOutput = await handlePrompts(
        output(ProtocolType.Fuel),
        steps(ProtocolType.Fuel),
      );

      expect(evmFinalOutput.exitCode).to.equal(0);
      expect(fuelFinalOutput.exitCode).to.equal(0);

      const evmWarpReadResult: WarpRouteDeployConfig =
        readYamlOrJson(WARP_CONFIG_PATH_2);
      expect(evmWarpReadResult[CHAIN_NAME_2]).not.to.be.undefined;
      expect(evmWarpReadResult[CHAIN_NAME_2].type).to.equal(TokenType.native);

      const fuelWarpReadResult: WarpRouteDeployConfig = readYamlOrJson(
        WARP_CONFIG_PATH_FUEL_1,
      );
      expect(fuelWarpReadResult[CHAIN_NAME_FUEL_1]).not.to.be.undefined;
      expect(fuelWarpReadResult[CHAIN_NAME_FUEL_1].type).to.equal(
        TokenType.native,
      );
    });
  });

  describe('hyperlane warp read --key ... --symbol ...', () => {
    // eslint-disable-next-line jest/no-focused-tests
    it.only('should successfully read the complete warp route config from all the chains', async () => {
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
        [CHAIN_NAME_FUEL_1]: {
          type: TokenType.native,
          mailbox: fuel1Addresses.mailbox,
          owner: fuelOwnerAddress,
        },
      };

      writeYamlOrJson(WARP_DEPLOY_OUTPUT_PATH, warpConfig);
      await hyperlaneWarpDeploy(WARP_DEPLOY_OUTPUT_PATH, initialFuelOwnerPk);

      const steps: TestPromptAction[] = [
        // Select the anvil2-anvil3 ETH route from the selection prompt
        {
          check: (currentOutput: string) =>
            currentOutput.includes('Select from matching warp routes'),
          input: KeyBoardKeys.ENTER,
        },
        // {
        //   check: (currentOutput) =>
        //     currentOutput.includes('Please enter the private key for chain'),
        //   input: `${ANVIL_KEY}${KeyBoardKeys.ENTER}`,
        // },
      ];

      const output = hyperlaneWarpReadRaw({
        privateKey: ANVIL_KEY,
        fuelKey: initialFuelOwnerPk,
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

      expect(warpReadResult[CHAIN_NAME_FUEL_1]).not.to.be.undefined;
      expect(warpReadResult[CHAIN_NAME_FUEL_1].type).to.equal(TokenType.native);
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
