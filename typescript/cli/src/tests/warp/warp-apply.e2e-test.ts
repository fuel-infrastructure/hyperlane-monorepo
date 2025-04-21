import { expect } from 'chai';
import { Wallet } from 'ethers';
import { WalletUnlocked, getRandomB256 } from 'fuels';
import { DeployContractConfig, LaunchTestNodeReturn } from 'fuels/test-utils';

import { ChainAddresses } from '@hyperlane-xyz/registry';
import {
  HookType,
  HypTokenRouterConfig,
  TokenType,
  WarpRouteDeployConfig,
  normalizeConfig,
  randomAddress,
} from '@hyperlane-xyz/sdk';

import { readYamlOrJson, writeYamlOrJson } from '../../utils/files.js';
import {
  ANVIL_KEY,
  CHAIN_NAME_2,
  CHAIN_NAME_3,
  CHAIN_NAME_FUEL_1,
  CORE_CONFIG_PATH,
  CORE_CONFIG_PATH_FUEL,
  DEFAULT_E2E_TEST_TIMEOUT,
  E2E_TEST_BURN_ADDRESS,
  E2E_TEST_BURN_ADDRESS_FUEL,
  EXAMPLES_PATH,
  FUEL_WARP_CONFIG_PATH,
  FUEL_WARP_CONFIG_PATH_EXAMPLE,
  TEMP_PATH,
  WARP_CONFIG_PATH_2,
  WARP_CONFIG_PATH_EXAMPLE,
  WARP_CORE_CONFIG_PATH_2,
  WARP_CORE_CONFIG_PATH_FUEL,
  cleanupFuelNodes,
  deployOrUseExistingCore,
  extendWarpConfig,
  getCombinedWarpRoutePath,
  getDomainId,
  launchFuelNodes,
  updateOwner,
} from '../commands/helpers.js';
import {
  hyperlaneWarpApply,
  hyperlaneWarpDeploy,
  readWarpConfig,
} from '../commands/warp.js';

describe('hyperlane warp apply e2e tests', async function () {
  this.timeout(2 * DEFAULT_E2E_TEST_TIMEOUT);

  let chain2Addresses: ChainAddresses = {};

  let fuelWallet: WalletUnlocked;

  let fuelNodes: Record<string, LaunchTestNodeReturn<DeployContractConfig[]>>;

  before(async function () {
    fuelNodes = await launchFuelNodes();
    [fuelWallet] = fuelNodes[CHAIN_NAME_FUEL_1].wallets;

    await deployOrUseExistingCore(CHAIN_NAME_2, CORE_CONFIG_PATH, ANVIL_KEY);
    await deployOrUseExistingCore(
      CHAIN_NAME_FUEL_1,
      CORE_CONFIG_PATH_FUEL,
      fuelWallet.privateKey,
      fuelWallet,
    );
    chain2Addresses = await deployOrUseExistingCore(
      CHAIN_NAME_3,
      CORE_CONFIG_PATH,
      ANVIL_KEY,
    );

    // Create a new warp config using the example
    const evmWarpConfig: WarpRouteDeployConfig = readYamlOrJson(
      WARP_CONFIG_PATH_EXAMPLE,
    );
    const fuelWarpConfig: WarpRouteDeployConfig = readYamlOrJson(
      FUEL_WARP_CONFIG_PATH_EXAMPLE,
    );
    fuelWarpConfig.fueltest1.owner = fuelWallet.address.b256Address;
    const anvil2Config = { anvil2: { ...evmWarpConfig.anvil1 } };
    const fuelConfig = { fueltest1: { ...fuelWarpConfig.fueltest1 } };
    writeYamlOrJson(WARP_CONFIG_PATH_2, anvil2Config);
    writeYamlOrJson(FUEL_WARP_CONFIG_PATH, fuelConfig);
  });

  beforeEach(async function () {
    await hyperlaneWarpDeploy(WARP_CONFIG_PATH_2);
    await hyperlaneWarpDeploy(FUEL_WARP_CONFIG_PATH, fuelWallet.privateKey);
  });

  after(async function () {
    await cleanupFuelNodes(fuelNodes);
  });

  it('should burn owner address', async function () {
    const warpConfigPath = `${TEMP_PATH}/warp-route-deployment-2.yaml`;
    await updateOwner(
      E2E_TEST_BURN_ADDRESS,
      CHAIN_NAME_2,
      warpConfigPath,
      WARP_CORE_CONFIG_PATH_2,
    );
    const updatedWarpDeployConfig = await readWarpConfig(
      CHAIN_NAME_2,
      WARP_CORE_CONFIG_PATH_2,
      warpConfigPath,
    );
    expect(updatedWarpDeployConfig.anvil2.owner).to.equal(
      E2E_TEST_BURN_ADDRESS,
    );
  });

  it('FuelVM - should burn owner address', async function () {
    const warpConfigPath = `${TEMP_PATH}/warp-route-deployment-fuel.yaml`;
    await updateOwner(
      E2E_TEST_BURN_ADDRESS_FUEL,
      CHAIN_NAME_FUEL_1,
      warpConfigPath,
      WARP_CORE_CONFIG_PATH_FUEL,
      fuelWallet.privateKey,
    );
    const updatedWarpDeployConfig = await readWarpConfig(
      CHAIN_NAME_FUEL_1,
      WARP_CORE_CONFIG_PATH_FUEL,
      warpConfigPath,
      fuelWallet.privateKey,
    );
    expect(updatedWarpDeployConfig.fueltest1.owner).to.equal(
      E2E_TEST_BURN_ADDRESS_FUEL,
    );
  });

  it('should not update the same owner', async () => {
    const warpConfigPath = `${TEMP_PATH}/warp-route-deployment-2.yaml`;
    await updateOwner(
      E2E_TEST_BURN_ADDRESS,
      CHAIN_NAME_2,
      warpConfigPath,
      WARP_CORE_CONFIG_PATH_2,
    );
    const { stdout } = await updateOwner(
      E2E_TEST_BURN_ADDRESS,
      CHAIN_NAME_2,
      warpConfigPath,
      WARP_CORE_CONFIG_PATH_2,
    );
    expect(stdout).to.include(
      'Warp config is the same as target. No updates needed.',
    );
  });

  it('FuelVM - should not update the same owner', async function () {
    const warpConfigPath = `${TEMP_PATH}/warp-route-deployment-fuel.yaml`;
    await updateOwner(
      E2E_TEST_BURN_ADDRESS_FUEL,
      CHAIN_NAME_FUEL_1,
      warpConfigPath,
      WARP_CORE_CONFIG_PATH_FUEL,
      fuelWallet.privateKey,
    );
    const { stdout } = await updateOwner(
      E2E_TEST_BURN_ADDRESS_FUEL,
      CHAIN_NAME_FUEL_1,
      warpConfigPath,
      WARP_CORE_CONFIG_PATH_FUEL,
      fuelWallet.privateKey,
    );

    expect(stdout).to.include(
      'Warp config is the same as target. No updates applied.',
    );
  });

  it('should update hook configuration', async () => {
    const warpDeployPath = `${TEMP_PATH}/warp-route-deployment-2.yaml`;

    // First read the existing config
    const warpDeployConfig = await readWarpConfig(
      CHAIN_NAME_2,
      WARP_CORE_CONFIG_PATH_2,
      warpDeployPath,
    );

    // Update with a new hook config
    const owner = randomAddress();
    warpDeployConfig[CHAIN_NAME_2].hook = {
      type: HookType.PROTOCOL_FEE,
      beneficiary: owner,
      maxProtocolFee: '1000000',
      protocolFee: '100000',
      owner,
    };

    // Write the updated config
    await writeYamlOrJson(warpDeployPath, warpDeployConfig);

    // Apply the changes
    await hyperlaneWarpApply(warpDeployPath, WARP_CORE_CONFIG_PATH_2);

    // Read back the config to verify changes
    const updatedConfig = await readWarpConfig(
      CHAIN_NAME_2,
      WARP_CORE_CONFIG_PATH_2,
      warpDeployPath,
    );

    // Verify the hook was updated with all properties
    expect(normalizeConfig(updatedConfig[CHAIN_NAME_2].hook)).to.deep.equal(
      normalizeConfig(warpDeployConfig[CHAIN_NAME_2].hook),
    );
  });

  it('FuelVM - should update hook configuration', async () => {
    const warpDeployPath = `${TEMP_PATH}/warp-route-deployment-fuel.yaml`;

    // First read the existing config
    const warpDeployConfig = await readWarpConfig(
      CHAIN_NAME_FUEL_1,
      WARP_CORE_CONFIG_PATH_FUEL,
      warpDeployPath,
      fuelWallet.privateKey,
    );

    // Update with a new hook config
    const owner = getRandomB256();
    warpDeployConfig[CHAIN_NAME_FUEL_1].hook = {
      type: HookType.PROTOCOL_FEE,
      beneficiary: owner,
      maxProtocolFee: '1000000',
      protocolFee: '100000',
      owner,
    };

    // Write the updated config
    await writeYamlOrJson(warpDeployPath, warpDeployConfig);

    // Apply the changes
    await hyperlaneWarpApply(
      warpDeployPath,
      WARP_CORE_CONFIG_PATH_FUEL,
      '',
      fuelWallet.privateKey,
    );

    // Read back the config to verify changes
    const updatedConfig = await readWarpConfig(
      CHAIN_NAME_FUEL_1,
      WARP_CORE_CONFIG_PATH_FUEL,
      warpDeployPath,
      fuelWallet.privateKey,
    );

    // Verify the hook was updated with all properties
    expect(
      normalizeConfig(updatedConfig[CHAIN_NAME_FUEL_1].hook),
    ).to.deep.equal(normalizeConfig(warpDeployConfig[CHAIN_NAME_FUEL_1].hook));
  });

  it('should extend an existing warp route', async () => {
    // Read existing config into a file
    const warpConfigPath = `${TEMP_PATH}/warp-route-deployment-2.yaml`;
    await readWarpConfig(CHAIN_NAME_2, WARP_CORE_CONFIG_PATH_2, warpConfigPath);

    // Extend with new config
    const config: HypTokenRouterConfig = {
      decimals: 18,
      mailbox: chain2Addresses!.mailbox,
      name: 'Ether',
      owner: new Wallet(ANVIL_KEY).address,
      symbol: 'ETH',
      totalSupply: 0,
      type: TokenType.native,
    };

    await extendWarpConfig({
      chain: CHAIN_NAME_2,
      chainToExtend: CHAIN_NAME_3,
      extendedConfig: config,
      warpCorePath: WARP_CORE_CONFIG_PATH_2,
      warpDeployPath: warpConfigPath,
    });

    const COMBINED_WARP_CORE_CONFIG_PATH = getCombinedWarpRoutePath('ETH', [
      CHAIN_NAME_2,
      CHAIN_NAME_3,
    ]);

    // Check that chain2 is enrolled in chain1
    const updatedWarpDeployConfig1 = await readWarpConfig(
      CHAIN_NAME_2,
      COMBINED_WARP_CORE_CONFIG_PATH,
      warpConfigPath,
    );

    const chain2Id = await getDomainId(CHAIN_NAME_3, ANVIL_KEY);
    const remoteRouterKeys1 = Object.keys(
      updatedWarpDeployConfig1[CHAIN_NAME_2].remoteRouters!,
    );
    expect(remoteRouterKeys1).to.include(chain2Id);

    // Check that chain1 is enrolled in chain2
    const updatedWarpDeployConfig2 = await readWarpConfig(
      CHAIN_NAME_3,
      COMBINED_WARP_CORE_CONFIG_PATH,
      warpConfigPath,
    );

    const chain1Id = await getDomainId(CHAIN_NAME_2, ANVIL_KEY);
    const remoteRouterKeys2 = Object.keys(
      updatedWarpDeployConfig2[CHAIN_NAME_3].remoteRouters!,
    );
    expect(remoteRouterKeys2).to.include(chain1Id);
  });

  it('should extend an existing warp route with json strategy', async () => {
    // Read existing config into a file
    const warpConfigPath = `${TEMP_PATH}/warp-route-deployment-2.yaml`;
    await readWarpConfig(CHAIN_NAME_2, WARP_CORE_CONFIG_PATH_2, warpConfigPath);

    // Extend with new config
    const config: HypTokenRouterConfig = {
      decimals: 18,
      mailbox: chain2Addresses!.mailbox,
      name: 'Ether',
      owner: new Wallet(ANVIL_KEY).address,
      symbol: 'ETH',
      totalSupply: 0,
      type: TokenType.native,
    };

    await extendWarpConfig({
      chain: CHAIN_NAME_2,
      chainToExtend: CHAIN_NAME_3,
      extendedConfig: config,
      warpCorePath: WARP_CORE_CONFIG_PATH_2,
      warpDeployPath: warpConfigPath,
      strategyUrl: `${EXAMPLES_PATH}/submit/strategy/json-rpc-chain-strategy.yaml`,
    });

    const COMBINED_WARP_CORE_CONFIG_PATH = getCombinedWarpRoutePath('ETH', [
      CHAIN_NAME_2,
      CHAIN_NAME_3,
    ]);

    // Check that chain2 is enrolled in chain1
    const updatedWarpDeployConfig1 = await readWarpConfig(
      CHAIN_NAME_2,
      COMBINED_WARP_CORE_CONFIG_PATH,
      warpConfigPath,
    );

    const chain2Id = await getDomainId(CHAIN_NAME_3, ANVIL_KEY);
    const remoteRouterKeys1 = Object.keys(
      updatedWarpDeployConfig1[CHAIN_NAME_2].remoteRouters!,
    );
    expect(remoteRouterKeys1).to.include(chain2Id);

    // Check that chain1 is enrolled in chain2
    const updatedWarpDeployConfig2 = await readWarpConfig(
      CHAIN_NAME_3,
      COMBINED_WARP_CORE_CONFIG_PATH,
      warpConfigPath,
    );

    const chain1Id = await getDomainId(CHAIN_NAME_2, ANVIL_KEY);
    const remoteRouterKeys2 = Object.keys(
      updatedWarpDeployConfig2[CHAIN_NAME_3].remoteRouters!,
    );
    expect(remoteRouterKeys2).to.include(chain1Id);
  });

  it('should extend an existing warp route and update the owner', async () => {
    const warpDeployPath = `${TEMP_PATH}/warp-route-deployment-2.yaml`;
    // Burn anvil2 owner in config
    const warpDeployConfig = await readWarpConfig(
      CHAIN_NAME_2,
      WARP_CORE_CONFIG_PATH_2,
      warpDeployPath,
    );
    warpDeployConfig[CHAIN_NAME_2].owner = E2E_TEST_BURN_ADDRESS;

    // Extend with new config
    const randomOwner = new Wallet(ANVIL_KEY).address;
    const extendedConfig: HypTokenRouterConfig = {
      decimals: 18,
      mailbox: chain2Addresses!.mailbox,
      name: 'Ether',
      owner: randomOwner,
      symbol: 'ETH',
      totalSupply: 0,
      type: TokenType.native,
    };

    warpDeployConfig[CHAIN_NAME_3] = extendedConfig;
    writeYamlOrJson(warpDeployPath, warpDeployConfig);
    await hyperlaneWarpApply(warpDeployPath, WARP_CORE_CONFIG_PATH_2);

    const COMBINED_WARP_CORE_CONFIG_PATH = getCombinedWarpRoutePath('ETH', [
      CHAIN_NAME_2,
      CHAIN_NAME_3,
    ]);

    const updatedWarpDeployConfig_2 = await readWarpConfig(
      CHAIN_NAME_2,
      COMBINED_WARP_CORE_CONFIG_PATH,
      warpDeployPath,
    );
    const updatedWarpDeployConfig_3 = await readWarpConfig(
      CHAIN_NAME_3,
      COMBINED_WARP_CORE_CONFIG_PATH,
      warpDeployPath,
    );
    // Check that anvil2 owner is burned
    expect(updatedWarpDeployConfig_2.anvil2.owner).to.equal(
      E2E_TEST_BURN_ADDRESS,
    );

    // Also, anvil3 owner is not burned
    expect(updatedWarpDeployConfig_3.anvil3.owner).to.equal(randomOwner);

    // Check that both chains enrolled
    const chain2Id = await getDomainId(CHAIN_NAME_2, ANVIL_KEY);
    const chain3Id = await getDomainId(CHAIN_NAME_3, ANVIL_KEY);

    const remoteRouterKeys2 = Object.keys(
      updatedWarpDeployConfig_2[CHAIN_NAME_2].remoteRouters!,
    );
    const remoteRouterKeys3 = Object.keys(
      updatedWarpDeployConfig_3[CHAIN_NAME_3].remoteRouters!,
    );
    expect(remoteRouterKeys2).to.include(chain3Id);
    expect(remoteRouterKeys3).to.include(chain2Id);
  });

  it('should extend an existing warp route and update all destination domains', async () => {
    // Read existing config into a file
    const warpConfigPath = `${TEMP_PATH}/warp-route-deployment-2.yaml`;
    const warpDeployConfig = await readWarpConfig(
      CHAIN_NAME_2,
      WARP_CORE_CONFIG_PATH_2,
      warpConfigPath,
    );
    warpDeployConfig[CHAIN_NAME_2].gas = 7777;

    // Extend with new config
    const GAS = 694200;
    const extendedConfig: HypTokenRouterConfig = {
      decimals: 18,
      mailbox: chain2Addresses!.mailbox,
      name: 'Ether',
      owner: new Wallet(ANVIL_KEY).address,
      symbol: 'ETH',
      totalSupply: 0,
      type: TokenType.native,
      gas: GAS,
    };
    warpDeployConfig[CHAIN_NAME_3] = extendedConfig;
    writeYamlOrJson(warpConfigPath, warpDeployConfig);
    await hyperlaneWarpApply(warpConfigPath, WARP_CORE_CONFIG_PATH_2);

    const COMBINED_WARP_CORE_CONFIG_PATH = getCombinedWarpRoutePath('ETH', [
      CHAIN_NAME_2,
      CHAIN_NAME_3,
    ]);

    // Check that chain2 is enrolled in chain1
    const updatedWarpDeployConfig_2 = await readWarpConfig(
      CHAIN_NAME_2,
      COMBINED_WARP_CORE_CONFIG_PATH,
      warpConfigPath,
    );

    const chain2Id = await getDomainId(CHAIN_NAME_2, ANVIL_KEY);
    const chain3Id = await getDomainId(CHAIN_NAME_3, ANVIL_KEY);

    // Destination gas should be set in the existing chain (chain2) to include the extended chain (chain3)
    const destinationGas_2 =
      updatedWarpDeployConfig_2[CHAIN_NAME_2].destinationGas!;
    expect(Object.keys(destinationGas_2)).to.include(chain3Id);
    expect(destinationGas_2[chain3Id]).to.equal(GAS.toString());

    // Destination gas should be set for the extended chain (chain3)
    const updatedWarpDeployConfig_3 = await readWarpConfig(
      CHAIN_NAME_3,
      COMBINED_WARP_CORE_CONFIG_PATH,
      warpConfigPath,
    );
    const destinationGas_3 =
      updatedWarpDeployConfig_3[CHAIN_NAME_3].destinationGas!;
    expect(Object.keys(destinationGas_3)).to.include(chain2Id);
    expect(destinationGas_3[chain2Id]).to.equal('7777');
  });
});
