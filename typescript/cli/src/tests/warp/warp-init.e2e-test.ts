import { expect } from 'chai';
import { Wallet } from 'ethers';
import { WalletUnlocked } from 'fuels';
import { DeployContractConfig, LaunchTestNodeReturn } from 'fuels/test-utils';

import { ChainAddresses } from '@hyperlane-xyz/registry';
import {
  ChainMap,
  ChainName,
  TokenType,
  WarpRouteDeployConfig,
} from '@hyperlane-xyz/sdk';
import { Address, ProtocolType } from '@hyperlane-xyz/utils';

import { readYamlOrJson } from '../../utils/files.js';
import {
  ANVIL_KEY,
  CHAIN_NAME_2,
  CHAIN_NAME_3,
  CHAIN_NAME_FUEL_1,
  CONFIRM_DETECTED_OWNER_STEP,
  CORE_CONFIG_PATH,
  CORE_CONFIG_PATH_FUEL,
  DEFAULT_E2E_TEST_TIMEOUT,
  FUEL_1_CONFIG_PATH,
  KeyBoardKeys,
  SELECT_ANVIL_2_AND_ANVIL_3_STEPS,
  SELECT_ANVIL_2_AND_FUEL_1_STEPS,
  SELECT_ANVIL_2_FROM_MULTICHAIN_PICKER,
  SELECT_FUEL_1_FROM_MULTICHAIN_PICKER,
  SELECT_MAINNET_CHAIN_TYPE_STEP,
  TestPromptAction,
  WARP_CONFIG_PATH_2,
  cleanupFuelNodes,
  deployOrUseExistingCore,
  deployToken,
  handlePrompts,
  launchFuelNodes,
} from '../commands/helpers.js';
import { hyperlaneWarpInit } from '../commands/warp.js';

describe('hyperlane warp init e2e tests', async function () {
  this.timeout(2 * DEFAULT_E2E_TEST_TIMEOUT);

  let chain2Addresses: ChainAddresses = {};
  let chain3Addresses: ChainAddresses = {};
  let fuelChain1Addresses: ChainAddresses = {};
  let initialEVMOwnerAddress: Address;
  let initialFuelOwnerAddress: Address;
  let initialFuelOwnerPk: string;
  let chainMapAddresses: ChainMap<ChainAddresses> = {};
  let fuelNodes: Record<string, LaunchTestNodeReturn<DeployContractConfig[]>>;

  before(async function () {
    fuelNodes = await launchFuelNodes();
    const fuelWallet = fuelNodes[CHAIN_NAME_FUEL_1].wallets[0];
    const fuel_pk = fuelWallet.privateKey;
    initialFuelOwnerPk = fuel_pk;

    [chain2Addresses, chain3Addresses, fuelChain1Addresses] = await Promise.all(
      [
        deployOrUseExistingCore(CHAIN_NAME_2, CORE_CONFIG_PATH, ANVIL_KEY),
        deployOrUseExistingCore(CHAIN_NAME_3, CORE_CONFIG_PATH, ANVIL_KEY),
        deployOrUseExistingCore(
          CHAIN_NAME_FUEL_1,
          CORE_CONFIG_PATH_FUEL,
          fuel_pk,
          fuelWallet,
        ),
      ],
    );

    chainMapAddresses = {
      [CHAIN_NAME_2]: chain2Addresses,
      [CHAIN_NAME_3]: chain3Addresses,
      [CHAIN_NAME_FUEL_1]: fuelChain1Addresses,
    };

    initialEVMOwnerAddress = new Wallet(ANVIL_KEY).address;
    initialFuelOwnerAddress = new WalletUnlocked(fuel_pk).address.b256Address;
  });

  after(async function () {
    await cleanupFuelNodes(fuelNodes);
  });

  describe('hyperlane warp init --yes', () => {
    function assertWarpConfig(
      warpConfig: WarpRouteDeployConfig,
      chainMapAddresses: ChainMap<ChainAddresses>,
      chainName: ChainName,
      protocolType: ProtocolType = ProtocolType.Ethereum,
    ) {
      expect(warpConfig[chainName]).not.to.be.undefined;

      const chain2TokenConfig = warpConfig[chainName];
      expect(chain2TokenConfig.mailbox).equal(
        chainMapAddresses[chainName].mailbox,
      );
      const expectedOwnerAddress =
        protocolType === ProtocolType.Ethereum
          ? initialEVMOwnerAddress
          : initialFuelOwnerAddress;
      expect(chain2TokenConfig.owner).equal(expectedOwnerAddress);
      expect(chain2TokenConfig.type).equal(TokenType.native);
    }

    it('it should generate a warp deploy config with a single chain', async function () {
      const steps: TestPromptAction[] = [
        SELECT_MAINNET_CHAIN_TYPE_STEP,
        {
          check: (currentOutput: string) =>
            currentOutput.includes('--Mainnet Chains--'),
          // Scroll down through the mainnet chains list and select anvil2
          input: `${SELECT_ANVIL_2_FROM_MULTICHAIN_PICKER}${KeyBoardKeys.ENTER}`,
        },
        CONFIRM_DETECTED_OWNER_STEP,
        {
          check: (currentOutput: string) =>
            !!currentOutput.match(/Select .+?'s token type/),
          // Scroll up through the token type list and select native
          input: `${KeyBoardKeys.ARROW_UP.repeat(2)}${KeyBoardKeys.ENTER}`,
        },
      ];

      const output = hyperlaneWarpInit(WARP_CONFIG_PATH_2).stdio('pipe');

      await handlePrompts(output, steps);

      const warpConfig: WarpRouteDeployConfig =
        readYamlOrJson(WARP_CONFIG_PATH_2);

      assertWarpConfig(warpConfig, chainMapAddresses, CHAIN_NAME_2);
    });

    it('it should generate a warp deploy config with a single fuel chain', async function () {
      const steps: TestPromptAction[] = [
        SELECT_MAINNET_CHAIN_TYPE_STEP,
        {
          check: (currentOutput: string) =>
            currentOutput.includes('--Mainnet Chains--'),
          // Scroll down through the mainnet chains list and select fueltest1
          input: `${SELECT_FUEL_1_FROM_MULTICHAIN_PICKER}${KeyBoardKeys.ENTER}`,
        },
        CONFIRM_DETECTED_OWNER_STEP,
        {
          check: (currentOutput: string) =>
            !!currentOutput.match(/Select .+?'s token type/),
          // Scroll up through the token type list and select native
          input: `${KeyBoardKeys.ARROW_UP.repeat(1)}${KeyBoardKeys.ENTER}`,
        },
      ];

      const output = hyperlaneWarpInit(
        FUEL_1_CONFIG_PATH,
        initialFuelOwnerPk,
      ).stdio('pipe');

      await handlePrompts(output, steps);

      const warpConfig: WarpRouteDeployConfig =
        readYamlOrJson(FUEL_1_CONFIG_PATH);

      assertWarpConfig(
        warpConfig,
        chainMapAddresses,
        CHAIN_NAME_FUEL_1,
        ProtocolType.Fuel,
      );
    });

    it('it should generate a warp deploy config with a 2 chains warp route (native->native)', async function () {
      const steps: TestPromptAction[] = [
        SELECT_MAINNET_CHAIN_TYPE_STEP,
        ...SELECT_ANVIL_2_AND_ANVIL_3_STEPS,
        CONFIRM_DETECTED_OWNER_STEP,
        {
          check: (currentOutput: string) =>
            !!currentOutput.match(/Select .+?'s token type/),
          input: `${KeyBoardKeys.ARROW_UP.repeat(2)}${KeyBoardKeys.ENTER}`,
        },
        CONFIRM_DETECTED_OWNER_STEP,
        {
          check: (currentOutput: string) =>
            !!currentOutput.match(/Select .+?'s token type/),
          input: `${KeyBoardKeys.ARROW_UP.repeat(2)}${KeyBoardKeys.ENTER}`,
        },
      ];

      const output = hyperlaneWarpInit(WARP_CONFIG_PATH_2).stdio('pipe');

      await handlePrompts(output, steps);

      const warpConfig: WarpRouteDeployConfig =
        readYamlOrJson(WARP_CONFIG_PATH_2);

      [CHAIN_NAME_2, CHAIN_NAME_3].map((chainName) =>
        assertWarpConfig(warpConfig, chainMapAddresses, chainName),
      );
    });

    it('it should generate a warp deploy config with a 2 chains and protocol warp route (evm:native->fuel:native)', async function () {
      const steps: TestPromptAction[] = [
        SELECT_MAINNET_CHAIN_TYPE_STEP,
        ...SELECT_ANVIL_2_AND_FUEL_1_STEPS,
        CONFIRM_DETECTED_OWNER_STEP,
        {
          check: (currentOutput: string) =>
            !!currentOutput.match(/Select .+?'s token type/),
          input: `${KeyBoardKeys.ARROW_UP.repeat(2)}${KeyBoardKeys.ENTER}`,
        },
        CONFIRM_DETECTED_OWNER_STEP,
        {
          check: (currentOutput: string) =>
            !!currentOutput.match(/Select .+?'s token type/),
          input: `${KeyBoardKeys.ARROW_DOWN.repeat(2)}${KeyBoardKeys.ENTER}`,
        },
      ];

      const output = hyperlaneWarpInit(
        WARP_CONFIG_PATH_2,
        initialFuelOwnerPk,
      ).stdio('pipe');

      await handlePrompts(output, steps);

      const warpConfig: WarpRouteDeployConfig =
        readYamlOrJson(WARP_CONFIG_PATH_2);

      [CHAIN_NAME_2, CHAIN_NAME_FUEL_1].map((chainName, index) =>
        assertWarpConfig(
          warpConfig,
          chainMapAddresses,
          chainName,
          index == 1 ? ProtocolType.Fuel : ProtocolType.Ethereum,
        ),
      );
    });

    it('it should generate a warp deploy config with a 2 chains warp route (collateral->synthetic)', async function () {
      const erc20Token = await deployToken(ANVIL_KEY, CHAIN_NAME_2, 6);
      const steps: TestPromptAction[] = [
        SELECT_MAINNET_CHAIN_TYPE_STEP,
        ...SELECT_ANVIL_2_AND_ANVIL_3_STEPS,
        // First chain token config
        CONFIRM_DETECTED_OWNER_STEP,
        {
          check: (currentOutput: string) =>
            !!currentOutput.match(/Select .+?'s token type/),
          // Scroll down through the token type list and select collateral
          input: `${KeyBoardKeys.ARROW_DOWN.repeat(4)}${KeyBoardKeys.ENTER}`,
        },
        {
          check: (currentOutput: string) =>
            currentOutput.includes('Enter the existing token address on chain'),
          input: `${erc20Token.address}${KeyBoardKeys.ENTER}`,
        },
        // Other chain token config
        CONFIRM_DETECTED_OWNER_STEP,
        {
          check: (currentOutput: string) =>
            !!currentOutput.match(/Select .+?'s token type/),
          // Select the synthetic token type
          input: `${KeyBoardKeys.ENTER}`,
        },
      ];

      const output = hyperlaneWarpInit(WARP_CONFIG_PATH_2).stdio('pipe');

      await handlePrompts(output, steps);

      const warpConfig: WarpRouteDeployConfig =
        readYamlOrJson(WARP_CONFIG_PATH_2);

      expect(warpConfig[CHAIN_NAME_2]).not.to.be.undefined;

      const chain2TokenConfig = warpConfig[CHAIN_NAME_2];
      expect(chain2TokenConfig.mailbox).equal(chain2Addresses.mailbox);
      expect(chain2TokenConfig.owner).equal(initialEVMOwnerAddress);
      expect(chain2TokenConfig.type).equal(TokenType.collateral);
      expect((chain2TokenConfig as any).token).equal(erc20Token.address);

      expect(warpConfig[CHAIN_NAME_3]).not.to.be.undefined;

      const chain3TokenConfig = warpConfig[CHAIN_NAME_3];
      expect(chain3TokenConfig.mailbox).equal(chain3Addresses.mailbox);
      expect(chain3TokenConfig.owner).equal(initialEVMOwnerAddress);
      expect(chain3TokenConfig.type).equal(TokenType.synthetic);
    });

    it('it should generate a warp deploy config with a 2 chains and protocol warp route (evm:collateral->fuel:synthetic)', async function () {
      const erc20Token = await deployToken(ANVIL_KEY, CHAIN_NAME_2, 6);

      const tokenName = await erc20Token.name();
      const tokenSymbol = await erc20Token.symbol();
      const tokenDecimals = await erc20Token.decimals();
      const tokenSupply = await erc20Token.totalSupply();

      const steps: TestPromptAction[] = [
        SELECT_MAINNET_CHAIN_TYPE_STEP,
        ...SELECT_ANVIL_2_AND_FUEL_1_STEPS,
        // First chain token config
        CONFIRM_DETECTED_OWNER_STEP,
        {
          check: (currentOutput: string) =>
            !!currentOutput.match(/Select .+?'s token type/),
          // Scroll down through the token type list and select collateral
          input: `${KeyBoardKeys.ARROW_DOWN.repeat(4)}${KeyBoardKeys.ENTER}`,
        },
        {
          check: (currentOutput: string) =>
            currentOutput.includes('Enter the existing token address on chain'),
          input: `${erc20Token.address}${KeyBoardKeys.ENTER}`,
        },
        // Other chain token config
        CONFIRM_DETECTED_OWNER_STEP,
        {
          check: (currentOutput: string) =>
            !!currentOutput.match(/Select .+?'s token type/),
          // Select the synthetic token type
          input: `${KeyBoardKeys.ENTER}`,
        },
        {
          check: (currentOutput: string) =>
            currentOutput.includes('Enter the name of the token on chain'),
          input: `${tokenName}${KeyBoardKeys.ENTER}`,
        },
        {
          check: (currentOutput: string) =>
            currentOutput.includes('Enter the symbol of the token on chain'),
          input: `${tokenSymbol}${KeyBoardKeys.ENTER}`,
        },
        {
          check: (currentOutput: string) =>
            currentOutput.includes('Enter the decimals of the token on chain'),
          input: `${tokenDecimals}${KeyBoardKeys.ENTER}`,
        },
        {
          check: (currentOutput: string) =>
            currentOutput.includes(
              'Enter the total supply of the token on chain',
            ),
          input: `${tokenSupply}${KeyBoardKeys.ENTER}`,
        },
      ];

      const output = hyperlaneWarpInit(
        WARP_CONFIG_PATH_2,
        initialFuelOwnerPk,
      ).stdio('pipe');

      await handlePrompts(output, steps);

      const warpConfig: WarpRouteDeployConfig =
        readYamlOrJson(WARP_CONFIG_PATH_2);

      expect(warpConfig[CHAIN_NAME_2]).not.to.be.undefined;

      const chain2TokenConfig = warpConfig[CHAIN_NAME_2];
      expect(chain2TokenConfig.mailbox).equal(chain2Addresses.mailbox);
      expect(chain2TokenConfig.owner).equal(initialEVMOwnerAddress);
      expect(chain2TokenConfig.type).equal(TokenType.collateral);
      expect((chain2TokenConfig as any).token).equal(erc20Token.address);

      expect(warpConfig[CHAIN_NAME_FUEL_1]).not.to.be.undefined;

      const fuel1TokenConfig = warpConfig[CHAIN_NAME_FUEL_1];
      expect(fuel1TokenConfig.mailbox).equal(fuelChain1Addresses.mailbox);
      expect(fuel1TokenConfig.owner).equal(initialFuelOwnerAddress);
      expect(fuel1TokenConfig.type).equal(TokenType.synthetic);
    });

    it('it should generate a warp deploy config with a 2 chains and protocol warp route (fuel:collateral->evm:synthetic)', async function () {
      const erc20Token = await deployToken(ANVIL_KEY, CHAIN_NAME_2, 6);
      const mockFuelAddress = `0x000000000000000000000000${erc20Token.address.slice(
        2,
      )}`;

      const tokenName = await erc20Token.name();
      const tokenSymbol = await erc20Token.symbol();
      const tokenDecimals = await erc20Token.decimals();
      const tokenSupply = await erc20Token.totalSupply();

      const steps: TestPromptAction[] = [
        SELECT_MAINNET_CHAIN_TYPE_STEP,
        ...SELECT_ANVIL_2_AND_FUEL_1_STEPS,
        // First chain token config
        CONFIRM_DETECTED_OWNER_STEP,
        {
          check: (currentOutput: string) =>
            !!currentOutput.match(/Select .+?'s token type/),
          // Select synthetic
          input: `${KeyBoardKeys.ENTER}`,
        },
        {
          check: (currentOutput: string) =>
            currentOutput.includes('Enter the name of the token on chain'),
          input: `${tokenName}${KeyBoardKeys.ENTER}`,
        },
        {
          check: (currentOutput: string) =>
            currentOutput.includes('Enter the symbol of the token on chain'),
          input: `${tokenSymbol}${KeyBoardKeys.ENTER}`,
        },
        {
          check: (currentOutput: string) =>
            currentOutput.includes('Enter the decimals of the token on chain'),
          input: `${tokenDecimals}${KeyBoardKeys.ENTER}`,
        },
        {
          check: (currentOutput: string) =>
            currentOutput.includes(
              'Enter the total supply of the token on chain',
            ),
          input: `${tokenSupply}${KeyBoardKeys.ENTER}`,
        },
        // Other chain token config
        CONFIRM_DETECTED_OWNER_STEP,
        {
          check: (currentOutput: string) =>
            !!currentOutput.match(/Select .+?'s token type/),
          // Select the synthetic token type
          input: `${KeyBoardKeys.ARROW_DOWN.repeat(1)}${KeyBoardKeys.ENTER}`,
        },
        {
          check: (currentOutput: string) =>
            currentOutput.includes('Enter the existing token address on chain'),
          input: `${mockFuelAddress}${KeyBoardKeys.ENTER}`,
        },
        {
          check: (currentOutput: string) =>
            currentOutput.includes('Enter the asset ID of the token on chain'),
          input: `${mockFuelAddress}${KeyBoardKeys.ENTER}`,
        },
      ];

      const output = hyperlaneWarpInit(
        WARP_CONFIG_PATH_2,
        initialFuelOwnerPk,
      ).stdio('pipe');

      await handlePrompts(output, steps);

      const warpConfig: WarpRouteDeployConfig =
        readYamlOrJson(WARP_CONFIG_PATH_2);

      expect(warpConfig[CHAIN_NAME_2]).not.to.be.undefined;

      const chain2TokenConfig = warpConfig[CHAIN_NAME_2];
      expect(chain2TokenConfig.mailbox).equal(chain2Addresses.mailbox);
      expect(chain2TokenConfig.owner).equal(initialEVMOwnerAddress);
      expect(chain2TokenConfig.type).equal(TokenType.synthetic);

      expect(warpConfig[CHAIN_NAME_FUEL_1]).not.to.be.undefined;

      const fuel1TokenConfig = warpConfig[CHAIN_NAME_FUEL_1];
      expect((fuel1TokenConfig as any).token).equal(mockFuelAddress);
      expect((fuel1TokenConfig as any).assetId).equal(mockFuelAddress);
      expect(fuel1TokenConfig.mailbox).equal(fuelChain1Addresses.mailbox);
      expect(fuel1TokenConfig.owner).equal(initialFuelOwnerAddress);
      expect(fuel1TokenConfig.type).equal(TokenType.collateral);
    });
  });
});
