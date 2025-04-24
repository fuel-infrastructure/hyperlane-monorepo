import { JsonRpcProvider } from '@ethersproject/providers';
import { expect } from 'chai';
import { Wallet } from 'ethers';
import { parseEther } from 'ethers/lib/utils.js';
import { Provider, WalletUnlocked, getMintedAssetId } from 'fuels';
import { DeployContractConfig, LaunchTestNodeReturn } from 'fuels/test-utils';

import { ERC20__factory } from '@hyperlane-xyz/core';
import { ChainAddresses } from '@hyperlane-xyz/registry';
import {
  ChainMap,
  ChainMetadata,
  FuelWarpRouteType,
  Token,
  TokenType,
  WarpCoreConfig,
  WarpRouteDeployConfig,
} from '@hyperlane-xyz/sdk';
import { Address } from '@hyperlane-xyz/utils';

import { WarpSendLogs } from '../../send/transfer.js';
import { readYamlOrJson, writeYamlOrJson } from '../../utils/files.js';
import {
  ANVIL_KEY,
  CHAIN_2_METADATA_PATH,
  CHAIN_3_METADATA_PATH,
  CHAIN_FUEL_1_METADATA_PATH,
  CHAIN_NAME_2,
  CHAIN_NAME_3,
  CHAIN_NAME_FUEL_1,
  CORE_CONFIG_PATH,
  CORE_CONFIG_PATH_FUEL,
  DEFAULT_E2E_TEST_TIMEOUT,
  FUEL_TOKEN_DEFAULT_SUBID,
  WARP_DEPLOY_OUTPUT_PATH,
  cleanupFuelNodes,
  deployOrUseExistingCore,
  deployToken,
  deployTokenFuel,
  getCombinedWarpRoutePath,
  launchFuelNodes,
} from '../commands/helpers.js';
import {
  hyperlaneWarpDeploy,
  hyperlaneWarpSendRelay,
} from '../commands/warp.js';

describe('hyperlane warp deploy e2e tests', async function () {
  this.timeout(DEFAULT_E2E_TEST_TIMEOUT);

  let chain2Addresses: ChainAddresses = {};
  let chain3Addresses: ChainAddresses = {};
  let fuelChain1Addresses: ChainAddresses = {};

  let ownerAddress: Address;
  let fuelAddress: Address;
  let walletChain2: Wallet;
  let walletChain3: Wallet;
  let walletFuel1: WalletUnlocked;

  let fuelOwnerPk: string;
  let fuelNodes: Record<string, LaunchTestNodeReturn<DeployContractConfig[]>>;
  let fuelBaseAsset: string;
  let providerFuel1: Provider;

  before(async function () {
    fuelNodes = await launchFuelNodes();
    const fuelWallet = fuelNodes[CHAIN_NAME_FUEL_1].wallets[0];
    const fuel_pk = fuelWallet.privateKey;
    fuelOwnerPk = fuel_pk;

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

    const chain2Metadata: ChainMetadata = readYamlOrJson(CHAIN_2_METADATA_PATH);
    const chain3Metadata: ChainMetadata = readYamlOrJson(CHAIN_3_METADATA_PATH);
    const fuel1Metadata: ChainMetadata = readYamlOrJson(
      CHAIN_FUEL_1_METADATA_PATH,
    );

    const providerChain2 = new JsonRpcProvider(chain2Metadata.rpcUrls[0].http);
    const providerChain3 = new JsonRpcProvider(chain3Metadata.rpcUrls[0].http);
    providerFuel1 = new Provider(fuel1Metadata.rpcUrls[0].http);

    walletChain2 = new Wallet(ANVIL_KEY).connect(providerChain2);
    walletChain3 = new Wallet(ANVIL_KEY).connect(providerChain3);

    walletFuel1 = new WalletUnlocked(fuel_pk, providerFuel1);
    fuelAddress = walletFuel1.address.b256Address;

    ownerAddress = walletChain2.address;
    fuelBaseAsset = await providerFuel1.getBaseAssetId();
  });

  after(async function () {
    await cleanupFuelNodes(fuelNodes);
  });
  it(`should be able to bridge between ${TokenType.collateral} and ${TokenType.synthetic}`, async function () {
    const token = await deployToken(ANVIL_KEY, CHAIN_NAME_2);
    const tokenSymbol = await token.symbol();

    const WARP_CORE_CONFIG_PATH_2_3 = getCombinedWarpRoutePath(tokenSymbol, [
      CHAIN_NAME_2,
      CHAIN_NAME_3,
    ]);

    const warpConfig: WarpRouteDeployConfig = {
      [CHAIN_NAME_2]: {
        type: TokenType.collateral,
        token: token.address,
        mailbox: chain2Addresses.mailbox,
        owner: ownerAddress,
      },
      [CHAIN_NAME_3]: {
        type: TokenType.synthetic,
        mailbox: chain3Addresses.mailbox,
        owner: ownerAddress,
      },
    };

    writeYamlOrJson(WARP_DEPLOY_OUTPUT_PATH, warpConfig);
    await hyperlaneWarpDeploy(WARP_DEPLOY_OUTPUT_PATH);

    const config: ChainMap<Token> = (
      readYamlOrJson(WARP_CORE_CONFIG_PATH_2_3) as WarpCoreConfig
    ).tokens.reduce((acc, curr) => ({ ...acc, [curr.chainName]: curr }), {});
    const synthetic = ERC20__factory.connect(
      config[CHAIN_NAME_3].addressOrDenom,
      walletChain3,
    );

    const [tokenBalanceOnChain2Before, tokenBalanceOnChain3Before] =
      await Promise.all([
        token.callStatic.balanceOf(walletChain2.address),
        synthetic.callStatic.balanceOf(walletChain3.address),
      ]);

    const { stdout, exitCode } = await hyperlaneWarpSendRelay(
      CHAIN_NAME_2,
      CHAIN_NAME_3,
      WARP_CORE_CONFIG_PATH_2_3,
    );
    expect(exitCode).to.equal(0);
    expect(stdout).to.include(WarpSendLogs.SUCCESS);

    const [tokenBalanceOnChain2After, tokenBalanceOnChain3After] =
      await Promise.all([
        token.callStatic.balanceOf(walletChain2.address),
        synthetic.callStatic.balanceOf(walletChain3.address),
      ]);

    expect(tokenBalanceOnChain2After.lt(tokenBalanceOnChain2Before)).to.be.true;
    expect(tokenBalanceOnChain3After.gt(tokenBalanceOnChain3Before)).to.be.true;
  });

  it(`should be able to bridge between ${TokenType.collateral} and ${TokenType.collateral}`, async function () {
    const [tokenChain2, tokenChain3] = await Promise.all([
      deployToken(ANVIL_KEY, CHAIN_NAME_2),
      deployToken(ANVIL_KEY, CHAIN_NAME_3),
    ]);
    const tokenSymbolChain2 = await tokenChain2.symbol();

    const WARP_CORE_CONFIG_PATH_2_3 = getCombinedWarpRoutePath(
      tokenSymbolChain2,
      [CHAIN_NAME_2, CHAIN_NAME_3],
    );

    const warpConfig: WarpRouteDeployConfig = {
      [CHAIN_NAME_2]: {
        type: TokenType.collateral,
        token: tokenChain2.address,
        mailbox: chain2Addresses.mailbox,
        owner: ownerAddress,
      },
      [CHAIN_NAME_3]: {
        type: TokenType.collateral,
        mailbox: chain3Addresses.mailbox,
        token: tokenChain3.address,
        owner: ownerAddress,
      },
    };

    writeYamlOrJson(WARP_DEPLOY_OUTPUT_PATH, warpConfig);
    await hyperlaneWarpDeploy(WARP_DEPLOY_OUTPUT_PATH);

    const config: ChainMap<Token> = (
      readYamlOrJson(WARP_CORE_CONFIG_PATH_2_3) as WarpCoreConfig
    ).tokens.reduce((acc, curr) => ({ ...acc, [curr.chainName]: curr }), {});

    const collateral = parseEther('1');
    const tx = await tokenChain3.transfer(
      config[CHAIN_NAME_3].addressOrDenom,
      collateral,
    );
    await tx.wait();

    const [tokenBalanceOnChain2Before, tokenBalanceOnChain3Before] =
      await Promise.all([
        tokenChain2.callStatic.balanceOf(walletChain2.address),
        tokenChain3.callStatic.balanceOf(walletChain3.address),
      ]);

    const { stdout } = await hyperlaneWarpSendRelay(
      CHAIN_NAME_2,
      CHAIN_NAME_3,
      WARP_CORE_CONFIG_PATH_2_3,
      undefined,
      Number(collateral),
    );
    expect(stdout).to.include(WarpSendLogs.SUCCESS);

    const [tokenBalanceOnChain2After, tokenBalanceOnChain3After] =
      await Promise.all([
        tokenChain2.callStatic.balanceOf(walletChain2.address),
        tokenChain3.callStatic.balanceOf(walletChain3.address),
      ]);

    expect(tokenBalanceOnChain2After.lt(tokenBalanceOnChain2Before)).to.be.true;
    expect(tokenBalanceOnChain3After.gt(tokenBalanceOnChain3Before)).to.be.true;
  });

  it(`should be able to bridge between ${TokenType.native} and ${TokenType.synthetic}`, async function () {
    const WARP_CORE_CONFIG_PATH_2_3 = getCombinedWarpRoutePath('ETH', [
      CHAIN_NAME_2,
      CHAIN_NAME_3,
    ]);

    const warpConfig: WarpRouteDeployConfig = {
      [CHAIN_NAME_2]: {
        type: TokenType.native,
        mailbox: chain2Addresses.mailbox,
        owner: ownerAddress,
      },
      [CHAIN_NAME_3]: {
        type: TokenType.synthetic,
        mailbox: chain3Addresses.mailbox,
        owner: ownerAddress,
      },
    };

    writeYamlOrJson(WARP_DEPLOY_OUTPUT_PATH, warpConfig);
    await hyperlaneWarpDeploy(WARP_DEPLOY_OUTPUT_PATH);

    const config: ChainMap<Token> = (
      readYamlOrJson(WARP_CORE_CONFIG_PATH_2_3) as WarpCoreConfig
    ).tokens.reduce((acc, curr) => ({ ...acc, [curr.chainName]: curr }), {});

    const synthetic = ERC20__factory.connect(
      config[CHAIN_NAME_3].addressOrDenom,
      walletChain3,
    );
    const [nativeBalanceOnChain2Before, syntheticBalanceOnChain3Before] =
      await Promise.all([
        walletChain2.getBalance(),
        synthetic.callStatic.balanceOf(walletChain3.address),
      ]);

    const { stdout, exitCode } = await hyperlaneWarpSendRelay(
      CHAIN_NAME_2,
      CHAIN_NAME_3,
      WARP_CORE_CONFIG_PATH_2_3,
    );

    expect(exitCode).to.equal(0);
    expect(stdout).to.include(WarpSendLogs.SUCCESS);

    const [nativeBalanceOnChain2After, syntheticBalanceOnChain3After] =
      await Promise.all([
        walletChain2.getBalance(),
        synthetic.callStatic.balanceOf(walletChain3.address),
      ]);

    expect(nativeBalanceOnChain2After.lt(nativeBalanceOnChain2Before)).to.be
      .true;
    expect(syntheticBalanceOnChain3After.gt(syntheticBalanceOnChain3Before)).to
      .be.true;
  });

  it(`should be able to bridge between ${TokenType.native} and ${TokenType.native}`, async function () {
    const WARP_CORE_CONFIG_PATH_2_3 = getCombinedWarpRoutePath('ETH', [
      CHAIN_NAME_2,
      CHAIN_NAME_3,
    ]);

    const warpConfig: WarpRouteDeployConfig = {
      [CHAIN_NAME_2]: {
        type: TokenType.native,
        mailbox: chain2Addresses.mailbox,
        owner: ownerAddress,
      },
      [CHAIN_NAME_3]: {
        type: TokenType.native,
        mailbox: chain3Addresses.mailbox,
        owner: ownerAddress,
      },
    };

    writeYamlOrJson(WARP_DEPLOY_OUTPUT_PATH, warpConfig);
    await hyperlaneWarpDeploy(WARP_DEPLOY_OUTPUT_PATH);

    const config: ChainMap<Token> = (
      readYamlOrJson(WARP_CORE_CONFIG_PATH_2_3) as WarpCoreConfig
    ).tokens.reduce((acc, curr) => ({ ...acc, [curr.chainName]: curr }), {});

    const collateral = parseEther('1');
    // Sending eth to the hypnative contract otherwise bridging will fail
    await walletChain3.sendTransaction({
      to: config[CHAIN_NAME_3].addressOrDenom,
      value: collateral,
    });

    const [nativeBalanceOnChain2Before, nativeBalanceOnChain3Before] =
      await Promise.all([walletChain2.getBalance(), walletChain3.getBalance()]);

    const { stdout, exitCode } = await hyperlaneWarpSendRelay(
      CHAIN_NAME_2,
      CHAIN_NAME_3,
      WARP_CORE_CONFIG_PATH_2_3,
      undefined,
      Number(collateral),
    );

    expect(exitCode).to.equal(0);
    expect(stdout).to.include(WarpSendLogs.SUCCESS);

    const [nativeBalanceOnChain2After, nativeBalanceOnChain3After] =
      await Promise.all([walletChain2.getBalance(), walletChain3.getBalance()]);

    expect(nativeBalanceOnChain2After.lt(nativeBalanceOnChain2Before)).to.be
      .true;
    expect(nativeBalanceOnChain3After.gt(nativeBalanceOnChain3Before)).to.be
      .true;
  });

  it(`should not be able to bridge between ${TokenType.native} and ${TokenType.native} when the token on the destination chain does not have enough collateral`, async function () {
    const WARP_CORE_CONFIG_PATH_2_3 = getCombinedWarpRoutePath('ETH', [
      CHAIN_NAME_2,
      CHAIN_NAME_3,
    ]);

    const warpConfig: WarpRouteDeployConfig = {
      [CHAIN_NAME_2]: {
        type: TokenType.native,
        mailbox: chain2Addresses.mailbox,
        owner: ownerAddress,
      },
      [CHAIN_NAME_3]: {
        type: TokenType.native,
        mailbox: chain3Addresses.mailbox,
        owner: ownerAddress,
      },
    };

    writeYamlOrJson(WARP_DEPLOY_OUTPUT_PATH, warpConfig);
    await hyperlaneWarpDeploy(WARP_DEPLOY_OUTPUT_PATH);

    const [nativeBalanceOnChain1Before, nativeBalanceOnChain2Before] =
      await Promise.all([walletChain2.getBalance(), walletChain3.getBalance()]);

    const { exitCode, stdout } = await hyperlaneWarpSendRelay(
      CHAIN_NAME_2,
      CHAIN_NAME_3,
      WARP_CORE_CONFIG_PATH_2_3,
      undefined,
      Number(parseEther('1')),
    ).nothrow();

    expect(exitCode).to.equal(1);
    expect(stdout).to.include(`to ${CHAIN_NAME_3} has INSUFFICIENT collateral`);

    const [nativeBalanceOnChain1After, nativeBalanceOnChain2After] =
      await Promise.all([walletChain2.getBalance(), walletChain3.getBalance()]);

    expect(nativeBalanceOnChain1After.eq(nativeBalanceOnChain1Before)).to.be
      .true;
    expect(nativeBalanceOnChain2After.eq(nativeBalanceOnChain2Before)).to.be
      .true;
  });

  it(`should not be able to bridge between ${TokenType.collateral} and ${TokenType.collateral} when the token on the destination chain does not have enough collateral`, async function () {
    const [tokenChain2, tokenChain3] = await Promise.all([
      deployToken(ANVIL_KEY, CHAIN_NAME_2),
      deployToken(ANVIL_KEY, CHAIN_NAME_3),
    ]);
    const tokenSymbolChain2 = await tokenChain2.symbol();

    const WARP_CORE_CONFIG_PATH_2_3 = getCombinedWarpRoutePath(
      tokenSymbolChain2,
      [CHAIN_NAME_2, CHAIN_NAME_3],
    );

    const warpConfig: WarpRouteDeployConfig = {
      [CHAIN_NAME_2]: {
        type: TokenType.collateral,
        token: tokenChain2.address,
        mailbox: chain2Addresses.mailbox,
        owner: ownerAddress,
      },
      [CHAIN_NAME_3]: {
        type: TokenType.collateral,
        mailbox: chain3Addresses.mailbox,
        token: tokenChain3.address,
        owner: ownerAddress,
      },
    };

    writeYamlOrJson(WARP_DEPLOY_OUTPUT_PATH, warpConfig);
    await hyperlaneWarpDeploy(WARP_DEPLOY_OUTPUT_PATH);

    const [tokenBalanceOnChain2Before, tokenBalanceOnChain3Before] =
      await Promise.all([
        tokenChain2.callStatic.balanceOf(walletChain2.address),
        tokenChain3.callStatic.balanceOf(walletChain3.address),
      ]);

    const { exitCode, stdout } = await hyperlaneWarpSendRelay(
      CHAIN_NAME_2,
      CHAIN_NAME_3,
      WARP_CORE_CONFIG_PATH_2_3,
    ).nothrow();

    expect(exitCode).to.equal(1);
    expect(stdout).to.include(`to ${CHAIN_NAME_3} has INSUFFICIENT collateral`);

    const [tokenBalanceOnChain2After, tokenBalanceOnChain3After] =
      await Promise.all([
        tokenChain2.callStatic.balanceOf(walletChain2.address),
        tokenChain3.callStatic.balanceOf(walletChain3.address),
      ]);

    expect(tokenBalanceOnChain2After.eq(tokenBalanceOnChain2Before)).to.be.true;
    expect(tokenBalanceOnChain3After.eq(tokenBalanceOnChain3Before)).to.be.true;
  });

  it(`should be able to bridge between ${TokenType.collateral} and ${TokenType.collateral} on fuel`, async function () {
    const [tokenChain2, tokenFuel1] = await Promise.all([
      deployToken(ANVIL_KEY, CHAIN_NAME_2, 18, 'TT'),
      deployTokenFuel(walletFuel1),
    ]);

    const tokenSymbolChain2 = await tokenChain2.symbol();
    await tokenChain2.mint(150);
    await tokenChain2.mintTo(walletChain2.address, 250);

    const fuelAssetId = await getMintedAssetId(
      tokenFuel1.id.toString(),
      FUEL_TOKEN_DEFAULT_SUBID,
    );

    const WARP_CORE_CONFIG_PATH_2_FUEL_1 = getCombinedWarpRoutePath(
      tokenSymbolChain2,
      [CHAIN_NAME_2, CHAIN_NAME_FUEL_1],
    );

    const warpConfig: WarpRouteDeployConfig = {
      [CHAIN_NAME_2]: {
        type: TokenType.collateral,
        token: tokenChain2.address,
        mailbox: chain2Addresses.mailbox,
        owner: ownerAddress,
      },
      [CHAIN_NAME_FUEL_1]: {
        type: TokenType.collateral,
        mailbox: fuelChain1Addresses.mailbox,
        token: tokenFuel1.id.toString(),
        owner: fuelAddress,
        assetId: fuelAssetId,
      },
    };

    writeYamlOrJson(WARP_DEPLOY_OUTPUT_PATH, warpConfig);
    await hyperlaneWarpDeploy(WARP_DEPLOY_OUTPUT_PATH, fuelOwnerPk);

    const config: ChainMap<Token> = (
      readYamlOrJson(WARP_CORE_CONFIG_PATH_2_FUEL_1) as WarpCoreConfig
    ).tokens.reduce((acc, curr) => ({ ...acc, [curr.chainName]: curr }), {});

    const collateral = parseEther('1');
    const tx = await tokenChain2.transfer(
      config[CHAIN_NAME_2].addressOrDenom,
      collateral,
    );
    await tx.wait();

    const mint_tx = await tokenFuel1.functions
      .mint(
        { Address: { bits: walletFuel1.address.toB256() } },
        FUEL_TOKEN_DEFAULT_SUBID,
        1,
      )
      .call();
    await mint_tx.waitForResult();

    const [tokenBalanceOnChain2Before, tokenBalanceOnFuel1Before] =
      await Promise.all([
        tokenChain2.callStatic.balanceOf(walletChain2.address),
        walletFuel1.getBalance(
          config[CHAIN_NAME_FUEL_1].collateralAddressOrDenom,
        ),
      ]);

    const { stdout } = await hyperlaneWarpSendRelay(
      CHAIN_NAME_FUEL_1,
      CHAIN_NAME_2,
      WARP_CORE_CONFIG_PATH_2_FUEL_1,
      undefined,
      1,
      fuelOwnerPk,
    );
    expect(stdout).to.include(WarpSendLogs.SUCCESS);

    const [tokenBalanceOnChain2After, tokenBalanceOnFuel1After] =
      await Promise.all([
        tokenChain2.callStatic.balanceOf(walletChain2.address),
        walletFuel1.getBalance(
          config[CHAIN_NAME_FUEL_1].collateralAddressOrDenom,
        ),
      ]);

    expect(tokenBalanceOnChain2After.gt(tokenBalanceOnChain2Before)).to.be.true;
    expect(tokenBalanceOnFuel1After.lt(tokenBalanceOnFuel1Before)).to.be.true;
  });

  it(`should be able to bridge between ${TokenType.collateral} and ${TokenType.synthetic} on fuel`, async function () {
    const token = await deployToken(ANVIL_KEY, CHAIN_NAME_2);
    const tokenSymbol = await token.symbol();
    const tokenName = await token.name();

    const WARP_CORE_CONFIG_PATH_2_FUEL = getCombinedWarpRoutePath(tokenSymbol, [
      CHAIN_NAME_2,
      CHAIN_NAME_FUEL_1,
    ]);

    const warpConfig: WarpRouteDeployConfig = {
      [CHAIN_NAME_2]: {
        type: TokenType.collateral,
        token: token.address,
        mailbox: chain2Addresses.mailbox,
        owner: ownerAddress,
      },
      [CHAIN_NAME_FUEL_1]: {
        type: TokenType.synthetic,
        mailbox: fuelChain1Addresses.mailbox,
        owner: fuelAddress,
        name: tokenName,
        symbol: tokenSymbol,
        decimals: 9,
      },
    };

    writeYamlOrJson(WARP_DEPLOY_OUTPUT_PATH, warpConfig);
    await hyperlaneWarpDeploy(WARP_DEPLOY_OUTPUT_PATH, fuelOwnerPk);

    const config: ChainMap<Token> = (
      readYamlOrJson(WARP_CORE_CONFIG_PATH_2_FUEL) as WarpCoreConfig
    ).tokens.reduce((acc, curr) => ({ ...acc, [curr.chainName]: curr }), {});

    const fuelWarpRoute = new FuelWarpRouteType(
      config[CHAIN_NAME_FUEL_1].addressOrDenom,
      walletFuel1,
    );

    const fuelAssetId = (
      await (
        await fuelWarpRoute.functions.get_token_info().call()
      ).waitForResult()
    ).value.asset_id;
    const tokenBalanceOnFuel1Before = await walletFuel1.getBalance(
      fuelAssetId.bits.toString(),
    );

    const [tokenBalanceOnChain2Before] = await Promise.all([
      token.callStatic.balanceOf(walletChain2.address),
    ]);

    const { stdout, exitCode } = await hyperlaneWarpSendRelay(
      CHAIN_NAME_2,
      CHAIN_NAME_FUEL_1,
      WARP_CORE_CONFIG_PATH_2_FUEL,
      true,
      10000000000,
      fuelOwnerPk,
    );
    expect(exitCode).to.equal(0);
    expect(stdout).to.include(WarpSendLogs.SUCCESS);

    const [tokenBalanceOnChain2After] = await Promise.all([
      token.callStatic.balanceOf(walletChain2.address),
    ]);

    const tokenBalanceOnFuel1After = await walletFuel1.getBalance(
      fuelAssetId.bits.toString(),
    );

    expect(tokenBalanceOnChain2After.lt(tokenBalanceOnChain2Before)).to.be.true;
    expect(tokenBalanceOnFuel1After.gt(tokenBalanceOnFuel1Before)).to.be.true;
  });

  it(`should not be able to bridge between ${TokenType.collateral} and ${TokenType.collateral} when the token on the destination chain does not have enough collateral on fuel`, async function () {
    const [tokenChain2, tokenFuel1] = await Promise.all([
      deployToken(ANVIL_KEY, CHAIN_NAME_2),
      deployTokenFuel(walletFuel1),
    ]);

    const tokenSymbolChain2 = await tokenChain2.symbol();

    const WARP_CORE_CONFIG_PATH_2_FUEL_1 = getCombinedWarpRoutePath(
      tokenSymbolChain2,
      [CHAIN_NAME_2, CHAIN_NAME_FUEL_1],
    );

    const fuelAssetId = await getMintedAssetId(
      tokenFuel1.id.toString(),
      FUEL_TOKEN_DEFAULT_SUBID,
    );

    const warpConfig: WarpRouteDeployConfig = {
      [CHAIN_NAME_2]: {
        type: TokenType.collateral,
        token: tokenChain2.address,
        mailbox: chain2Addresses.mailbox,
        owner: ownerAddress,
      },
      [CHAIN_NAME_FUEL_1]: {
        type: TokenType.collateral,
        mailbox: fuelChain1Addresses.mailbox,
        token: tokenFuel1.id.toString(),
        owner: walletFuel1.address.toString(),
        assetId: fuelAssetId,
      },
    };

    writeYamlOrJson(WARP_DEPLOY_OUTPUT_PATH, warpConfig);
    await hyperlaneWarpDeploy(WARP_DEPLOY_OUTPUT_PATH, fuelOwnerPk);

    const [tokenBalanceOnChain2Before, tokenBalanceOnFuel1Before] =
      await Promise.all([
        tokenChain2.callStatic.balanceOf(walletChain2.address),
        walletFuel1.getBalance(fuelAssetId),
      ]);

    const { exitCode, stdout } = await hyperlaneWarpSendRelay(
      CHAIN_NAME_FUEL_1,
      CHAIN_NAME_2,
      WARP_CORE_CONFIG_PATH_2_FUEL_1,
      undefined,
      Number(parseEther('1')),
      fuelOwnerPk,
    ).nothrow();

    expect(exitCode).to.equal(1);
    expect(stdout).to.include(`to ${CHAIN_NAME_2} has INSUFFICIENT collateral`);

    const [tokenBalanceOnChain2After, tokenBalanceOnFuel1After] =
      await Promise.all([
        tokenChain2.callStatic.balanceOf(walletChain2.address),
        walletFuel1.getBalance(fuelAssetId),
      ]);

    expect(tokenBalanceOnChain2After.eq(tokenBalanceOnChain2Before)).to.be.true;
    expect(tokenBalanceOnFuel1After.eq(tokenBalanceOnFuel1Before)).to.be.true;
  });
  it(`should be able to bridge between ${TokenType.native} and ${TokenType.native} on fuel`, async function () {
    const WARP_CORE_CONFIG_PATH_2_FUEL_1 = getCombinedWarpRoutePath('ETH', [
      CHAIN_NAME_2,
      CHAIN_NAME_FUEL_1,
    ]);

    const warpConfig: WarpRouteDeployConfig = {
      [CHAIN_NAME_2]: {
        type: TokenType.native,
        mailbox: chain2Addresses.mailbox,
        owner: ownerAddress,
      },
      [CHAIN_NAME_FUEL_1]: {
        type: TokenType.native,
        mailbox: fuelChain1Addresses.mailbox,
        owner: walletFuel1.address.toString(),
      },
    };

    writeYamlOrJson(WARP_DEPLOY_OUTPUT_PATH, warpConfig);
    await hyperlaneWarpDeploy(WARP_DEPLOY_OUTPUT_PATH, fuelOwnerPk);

    const config: ChainMap<Token> = (
      readYamlOrJson(WARP_CORE_CONFIG_PATH_2_FUEL_1) as WarpCoreConfig
    ).tokens.reduce((acc, curr) => ({ ...acc, [curr.chainName]: curr }), {});

    const collateral = parseEther('1');
    await walletChain2.sendTransaction({
      to: config[CHAIN_NAME_2].addressOrDenom,
      value: collateral,
    });

    await walletFuel1.transferToContract(
      config[CHAIN_NAME_FUEL_1].addressOrDenom,
      1_000,
      fuelBaseAsset,
    );

    const [nativeBalanceOnChain2Before, nativeBalanceOnFuel1Before] =
      await Promise.all([
        walletChain2.getBalance(),
        walletFuel1.getBalance(),
        providerFuel1.getContractBalance(
          config[CHAIN_NAME_FUEL_1].addressOrDenom,
          fuelBaseAsset,
        ),
      ]);

    const { stdout, exitCode } = await hyperlaneWarpSendRelay(
      CHAIN_NAME_2,
      CHAIN_NAME_FUEL_1,
      WARP_CORE_CONFIG_PATH_2_FUEL_1,
      true,
      1_000_000_000_000,
      fuelOwnerPk,
    );

    expect(exitCode).to.equal(0);
    expect(stdout).to.include(WarpSendLogs.SUCCESS);

    const [nativeBalanceOnChain2After, nativeBalanceOnFuel1After] =
      await Promise.all([
        walletChain2.getBalance(),
        walletFuel1.getBalance(),
        providerFuel1.getContractBalance(
          config[CHAIN_NAME_FUEL_1].addressOrDenom,
          fuelBaseAsset,
        ),
      ]);

    expect(nativeBalanceOnChain2After.lt(nativeBalanceOnChain2Before)).to.be
      .true;
    expect(nativeBalanceOnFuel1After.gt(nativeBalanceOnFuel1Before)).to.be.true;
  });

  it(`should not be able to bridge between ${TokenType.native} and ${TokenType.native} when the amount is not convertible to fuel decimals`, async function () {
    const WARP_CORE_CONFIG_PATH_2_FUEL_1 = getCombinedWarpRoutePath('ETH', [
      CHAIN_NAME_2,
      CHAIN_NAME_FUEL_1,
    ]);

    const warpConfig: WarpRouteDeployConfig = {
      [CHAIN_NAME_2]: {
        type: TokenType.native,
        mailbox: chain2Addresses.mailbox,
        owner: ownerAddress,
      },
      [CHAIN_NAME_FUEL_1]: {
        type: TokenType.native,
        mailbox: fuelChain1Addresses.mailbox,
        owner: walletFuel1.address.toString(),
      },
    };

    writeYamlOrJson(WARP_DEPLOY_OUTPUT_PATH, warpConfig);
    await hyperlaneWarpDeploy(WARP_DEPLOY_OUTPUT_PATH, fuelOwnerPk);

    const config: ChainMap<Token> = (
      readYamlOrJson(WARP_CORE_CONFIG_PATH_2_FUEL_1) as WarpCoreConfig
    ).tokens.reduce((acc, curr) => ({ ...acc, [curr.chainName]: curr }), {});

    const collateral = parseEther('1');
    await walletChain2.sendTransaction({
      to: config[CHAIN_NAME_2].addressOrDenom,
      value: collateral,
    });

    await walletFuel1.transferToContract(
      config[CHAIN_NAME_FUEL_1].addressOrDenom,
      1,
      fuelBaseAsset,
    );

    //Amount in CHAIN_NAME_2, will be divided by 10^9 due to decimal difference, therefore the minimum amount that can be sent to fuel is 10^9
    const { exitCode, stdout } = await hyperlaneWarpSendRelay(
      CHAIN_NAME_2,
      CHAIN_NAME_FUEL_1,
      WARP_CORE_CONFIG_PATH_2_FUEL_1,
      undefined,
      1,
      fuelOwnerPk,
    ).nothrow();

    expect(exitCode).to.equal(1);
    expect(stdout).to.include(
      `Selected amount cannot be converted to the destination token`,
    );
  });
});
