import { JsonRpcProvider } from '@ethersproject/providers';
import { expect } from 'chai';
import { Wallet } from 'ethers';
import { Provider, WalletUnlocked } from 'fuels';

import {
  HypERC20Collateral__factory, //HypNative__factory,
} from '@hyperlane-xyz/core';
import {
  ChainMap,
  ChainMetadata,
  FuelWarpRouteType,
  Token,
  TokenType,
  WarpCoreConfig,
} from '@hyperlane-xyz/sdk';

import { WarpSendLogs } from '../../send/transfer.js';
import { readYamlOrJson } from '../../utils/files.js';
import {
  ANVIL_KEY,
  CHAIN_2_METADATA_PATH,
  CHAIN_NAME_2,
  DEFAULT_E2E_TEST_TIMEOUT,
  FUEL_CHAIN_METADATA_PATH,
  FUEL_CHAIN_NAME_1,
  FUEL_KEY,
  deployToken,
  getCombinedWarpRoutePath,
  getDomainId,
} from '../commands/helpers.js';
import { hyperlaneWarpSendRelayFuel } from '../commands/warp-fuel.js';

describe('hyperlane warp deploy e2e tests', async function () {
  this.timeout(DEFAULT_E2E_TEST_TIMEOUT);

  let walletChain2: Wallet;
  let walletFuelChain: WalletUnlocked;

  const fuelChainMetadata: ChainMetadata = readYamlOrJson(
    FUEL_CHAIN_METADATA_PATH,
  );

  const providerFuelChain: Provider = new Provider(
    fuelChainMetadata.rpcUrls[0].http,
  );

  before(async function () {
    const chain2Metadata: ChainMetadata = readYamlOrJson(CHAIN_2_METADATA_PATH);

    const providerChain2 = new JsonRpcProvider(chain2Metadata.rpcUrls[0].http);
    await providerFuelChain.init();

    walletChain2 = new Wallet(ANVIL_KEY).connect(providerChain2);
    walletFuelChain = new WalletUnlocked(FUEL_KEY, providerFuelChain);
  });

  it(`should be able to bridge between ${TokenType.collateral} and ${TokenType.synthetic}`, async function () {
    const token = await deployToken(ANVIL_KEY, CHAIN_NAME_2);
    const tokenSymbol = await token.symbol();
    const tokenDecimals = await token.decimals();

    const WARP_CORE_CONFIG_PATH_2_3 = getCombinedWarpRoutePath(tokenSymbol, [
      CHAIN_NAME_2,
      FUEL_CHAIN_NAME_1,
    ]);

    // Get domain IDs for both chains
    const chain2Id = await getDomainId(CHAIN_NAME_2, ANVIL_KEY);
    const fuelChainId = await getDomainId(FUEL_CHAIN_NAME_1, FUEL_KEY);

    // Read the deployed config to get router addresses
    const config: ChainMap<Token> = (
      readYamlOrJson(WARP_CORE_CONFIG_PATH_2_3) as WarpCoreConfig
    ).tokens.reduce((acc, curr) => ({ ...acc, [curr.chainName]: curr }), {});

    // Get the router contract on Chain 2
    const chain2RouterAddress = config[CHAIN_NAME_2].addressOrDenom;
    const chain2Router = HypERC20Collateral__factory.connect(
      chain2RouterAddress,
      walletChain2,
    );

    // Get the router address on Fuel chain
    const fuelRouterAddress = config[FUEL_CHAIN_NAME_1].addressOrDenom;

    // Explicitly enroll remote routers
    const enrollTx1 = await chain2Router.enrollRemoteRouter(
      fuelChainId,
      fuelRouterAddress,
    );
    await enrollTx1.wait();
    console.log(`Successfully enrolled Fuel router on Chain 2`);

    // For Fuel, we need to use the Fuel SDK to call enrollRemoteRouter
    // This would depend on the specific Fuel contract interface
    const fuelContract = new FuelWarpRouteType(
      fuelRouterAddress,
      walletFuelChain,
    );

    const chain2RouterAddressB256 = `0x${chain2RouterAddress
      .slice(2)
      .padStart(64, '0')}`;

    const res = await (
      await fuelContract.functions
        .enroll_remote_routers([chain2Id], [chain2RouterAddressB256])
        .call()
    ).waitForResult();
    console.log(
      `Transaction response: ${res.value} for enrolling Chain 2 router on Fuel`,
    );

    const res2 = await (
      await fuelContract.functions
        .set_remote_router_decimals(
          chain2RouterAddressB256,
          tokenDecimals.toString(),
        )
        .call()
    ).waitForResult();
    console.log(
      `Transaction response: ${res2.value} for setting decimals ${tokenDecimals} on Fuel`,
    );

    // Now test the token transfer
    const [tokenBalanceOnChain2Before2, tokenBalanceOnFuelChainBefore2] =
      await Promise.all([
        token.callStatic.balanceOf(walletChain2.address),
        providerFuelChain.getBalance(walletFuelChain.address, token.address),
      ]);

    const { stdout: stdout2, exitCode: exitCode2 } =
      await hyperlaneWarpSendRelayFuel(
        CHAIN_NAME_2,
        FUEL_CHAIN_NAME_1,
        WARP_CORE_CONFIG_PATH_2_3,
        true,
        1000,
      );
    expect(exitCode2).to.equal(0);
    expect(stdout2).to.include(WarpSendLogs.SUCCESS);

    const [tokenBalanceOnChain2After2, tokenBalanceOnFuelChainAfter2] =
      await Promise.all([
        token.callStatic.balanceOf(walletChain2.address),
        providerFuelChain.getBalance(walletFuelChain.address, token.address),
      ]);

    console.log(
      'Chain2 balance change:',
      tokenBalanceOnChain2Before2.sub(tokenBalanceOnChain2After2).toString(),
    );

    console.log(
      'Fuel balance change:',
      tokenBalanceOnFuelChainAfter2
        .sub(tokenBalanceOnFuelChainBefore2)
        .toString(),
    );

    // Now test the token transfer from Fuel to Chain 2
    const [tokenBalanceOnChain2Before, tokenBalanceOnFuelChainBefore] =
      await Promise.all([
        token.callStatic.balanceOf(walletChain2.address),
        providerFuelChain.getBalance(walletFuelChain.address, token.address),
      ]);

    const { stdout, exitCode } = await hyperlaneWarpSendRelayFuel(
      FUEL_CHAIN_NAME_1,
      CHAIN_NAME_2,
      WARP_CORE_CONFIG_PATH_2_3,
    );

    console.log('stdout', stdout);
    console.log('exitCode', exitCode);

    const [tokenBalanceOnChain2After, tokenBalanceOnFuelChainAfter] =
      await Promise.all([
        token.callStatic.balanceOf(walletChain2.address),
        providerFuelChain.getBalance(walletFuelChain.address, token.address),
      ]);

    console.log(
      'Chain2 balance change:',
      tokenBalanceOnChain2Before.sub(tokenBalanceOnChain2After).toString(),
    );

    console.log(
      'Fuel balance change:',
      tokenBalanceOnFuelChainAfter
        .sub(tokenBalanceOnFuelChainBefore)
        .toString(),
    );
  });
});
