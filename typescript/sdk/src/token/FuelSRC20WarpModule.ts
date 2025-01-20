import { TransactionResponse, WalletUnlocked, ZeroBytes32 } from 'fuels';

import {
  Address,
  ProtocolType,
  assert,
  difference,
  isZeroishAddress,
  rootLogger,
} from '@hyperlane-xyz/utils';

import {
  WarpRoute,
  WarpRouteTokenModeInput,
  WarpRouteTokenModeOutput,
} from '../fuel-types/WarpRoute.js';
import { WarpRouteFactory } from '../fuel-types/WarpRouteFactory.js';
import { FuelHookModule } from '../hook/FuelHookModule.js';
import { HookConfig } from '../hook/types.js';
import { FuelIsmModule } from '../ism/FuelIsmModule.js';
import { IsmConfig } from '../ism/types.js';
import { MultiProtocolProvider } from '../providers/MultiProtocolProvider.js';
import {
  DestinationGas,
  MailboxClientConfig,
  RemoteRoutersSchema,
} from '../router/types.js';

import { TokenType } from './config.js';
import {
  HypTokenConfig,
  HypTokenRouterConfig,
  TokenMetadata,
  TokenMetadataSchema,
  WarpRouteDeployConfig,
  isNativeTokenConfig,
  isTokenMetadata,
} from './types.js';

export class FuelSRC20WarpModule {
  static logger = rootLogger.child({ module: 'FuelSRC20WarpModule' });
  // ======== Deployment ========

  public static async deploy(
    multiProtocolProvider: MultiProtocolProvider,
    warpConfig: WarpRouteDeployConfig,
  ): Promise<
    Record<string, { contractId: string; config: HypTokenRouterConfig }>
  > {
    return Object.fromEntries(
      await Promise.all(
        Object.entries(warpConfig).map(async ([chain, config]) => {
          const signer = (await multiProtocolProvider.tryGetSigner(
            ProtocolType.Fuel,
            chain,
          )) as WalletUnlocked;

          const { waitForResult, contractId } = await WarpRouteFactory.deploy(
            signer,
          );
          const { contract } = await waitForResult();

          // If the hook is not provided, use the zero address
          const hook =
            config.hook && typeof config.hook === 'string'
              ? config.hook
              : ZeroBytes32;
          // If the ism is not provided, use the zero address
          const ism =
            config.interchainSecurityModule &&
            typeof config.interchainSecurityModule === 'string'
              ? config.interchainSecurityModule
              : ZeroBytes32;

          switch (config.type) {
            case TokenType.native: {
              await this.initNativeToken(contract, config, hook, ism);
              break;
            }
            case TokenType.collateral: {
              await this.initCollateralToken(
                contract,
                config as HypTokenRouterConfig & { type: TokenType.collateral },
                hook,
                ism,
              );
              break;
            }
            case TokenType.synthetic: {
              await this.initSyntheticToken(contract, config, hook, ism);
              break;
            }
            default:
              throw new Error(
                'Invalid token type for Fuel Warp Route - ' + config.type,
              );
          }

          return [chain, { contractId, config }] as const;
        }),
      ),
    );
  }

  static async initNativeToken(
    warpRoute: WarpRoute,
    { owner, mailbox }: HypTokenRouterConfig,
    hook: string,
    ism: string,
  ) {
    await (
      await warpRoute.functions
        .initialize(owner, mailbox, WarpRouteTokenModeInput.NATIVE, hook, ism)
        .call()
    ).waitForResult();
  }

  static async initCollateralToken(
    warpRoute: WarpRoute,
    config: HypTokenRouterConfig & { type: TokenType.collateral },
    hook: string,
    ism: string,
  ) {
    if (!config.assetId)
      throw new Error('`assetId` is required for collateral tokens on Fuel');
    await (
      await warpRoute.functions
        .initialize(
          config.owner,
          config.mailbox,
          WarpRouteTokenModeInput.COLLATERAL,
          hook,
          ism,
          undefined,
          undefined,
          undefined,
          undefined,
          { bits: config.assetId },
          config.token,
        )
        .call()
    ).waitForResult();
  }

  static async initSyntheticToken(
    warpRoute: WarpRoute,
    config: HypTokenRouterConfig,
    hook: string,
    ism: string,
  ) {
    await (
      await warpRoute.functions
        .initialize(
          config.owner,
          config.mailbox,
          WarpRouteTokenModeInput.SYNTHETIC,
          hook,
          ism,
          config.name,
          config.symbol,
          config.decimals,
          config.totalSupply,
        )
        .call()
    ).waitForResult();
  }

  // ======== Reading ========

  public static async deriveTokenMetadata(
    multiProtocolProvider: MultiProtocolProvider,
    warpRouteDeployment: Record<
      string,
      { contractId: string; config: HypTokenRouterConfig }
    >,
  ): Promise<TokenMetadata | undefined> {
    // this is used for synthetic token metadata and should always be 0
    const DERIVED_TOKEN_SUPPLY = 0;

    for (const [chain, { contractId, config }] of Object.entries(
      warpRouteDeployment,
    )) {
      if (isTokenMetadata(config)) return TokenMetadataSchema.parse(config);

      if (isNativeTokenConfig(config)) {
        const nativeToken =
          multiProtocolProvider.getChainMetadata(chain).nativeToken;
        if (nativeToken) {
          return TokenMetadataSchema.parse({
            totalSupply: DERIVED_TOKEN_SUPPLY,
            ...nativeToken,
          });
        }
      }

      const signer = (await multiProtocolProvider.tryGetSigner(
        ProtocolType.Fuel,
        chain,
      )) as WalletUnlocked;

      const warpRoute = new WarpRoute(contractId, signer);
      const { name, symbol, decimals } = (
        await warpRoute.functions.get_token_info().simulate()
      ).value;

      return TokenMetadataSchema.parse({
        name,
        symbol,
        decimals,
        totalSupply: DERIVED_TOKEN_SUPPLY,
      });
    }
    return undefined;
  }

  public static async deriveWarpRouteConfig(
    multiProtocolProvider: MultiProtocolProvider,
    chain: string,
    warpRouteAddress: Address,
  ): Promise<HypTokenRouterConfig> {
    const signer = (await multiProtocolProvider.tryGetSigner(
      ProtocolType.Fuel,
      chain,
    )) as WalletUnlocked;

    const warpRoute = new WarpRoute(warpRouteAddress, signer);

    const baseMetadata = await this.getMailboxClientConfig(
      multiProtocolProvider,
      warpRoute,
      signer,
    );
    const domains = (await warpRoute.functions.all_domains().simulate()).value;
    const { tokenConfig, type } = await this.getTokenConfig(
      warpRoute,
      chain,
      multiProtocolProvider,
    );
    const destinationGas = await this.getDestinationGas(warpRoute, domains);
    const remoteRouters = await this.getRouters(warpRoute, domains);

    return {
      ...baseMetadata,
      ...tokenConfig,
      remoteRouters,
      destinationGas,
      type,
    } as HypTokenRouterConfig;
  }

  static async getMailboxClientConfig(
    multiProtocolProvider: MultiProtocolProvider,
    warpRoute: WarpRoute,
    signer: WalletUnlocked,
  ): Promise<MailboxClientConfig> {
    const mailbox = (await warpRoute.functions.get_mailbox().simulate()).value
      .bits;
    const ownerQueryRes = (await warpRoute.functions.owner().simulate()).value;

    const owner =
      ownerQueryRes.Initialized?.Address?.bits ??
      ownerQueryRes.Initialized?.ContractId?.bits;
    if (!owner) throw new Error(`Failed to get the owner of the mailbox`);

    const hook = (await warpRoute.functions.get_hook().simulate()).value.bits;
    const ism = (
      await warpRoute.functions.interchain_security_module().simulate()
    ).value.bits;

    const derivedIsm = isZeroishAddress(ism)
      ? undefined
      : await FuelIsmModule.deriveIsmConfig(multiProtocolProvider, ism, signer);
    const derivedHook = isZeroishAddress(hook)
      ? undefined
      : await FuelHookModule.deriveHookConfig(
          multiProtocolProvider,
          hook,
          signer,
        );

    return {
      mailbox,
      owner,
      hook: derivedHook,
      interchainSecurityModule: derivedIsm,
    };
  }

  static async getTokenConfig(
    warpRoute: WarpRoute,
    chain: string,
    multiProtocolProvider: MultiProtocolProvider,
  ): Promise<{ tokenConfig: HypTokenConfig; type: TokenType }> {
    const tokenType = (await warpRoute.functions.get_token_mode().simulate())
      .value;

    const tokenTypeFromFuelType = {
      [WarpRouteTokenModeOutput.SYNTHETIC]: TokenType.synthetic,
      [WarpRouteTokenModeOutput.COLLATERAL]: TokenType.collateral,
      [WarpRouteTokenModeOutput.NATIVE]: TokenType.native,
    };

    const parsedType = tokenTypeFromFuelType[tokenType];

    const { asset_id, decimals, name, symbol, total_supply } = (
      await warpRoute.functions.get_token_info().simulate()
    ).value;
    const token = warpRoute.id.toB256();

    let tokenConfig: HypTokenConfig;
    if (
      parsedType === TokenType.collateral ||
      parsedType === TokenType.synthetic
    ) {
      tokenConfig = {
        type: parsedType,
        decimals,
        name,
        symbol,
        totalSupply: total_supply.toString(),
        token,
        asset_id: asset_id.bits,
      } as HypTokenConfig;
    } else {
      const nativeToken =
        multiProtocolProvider.getChainMetadata(chain).nativeToken;
      if (nativeToken) {
        tokenConfig = {
          type: TokenType.native,
          decimals: nativeToken.decimals,
          name: nativeToken.name,
          symbol: nativeToken.symbol,
          totalSupply: 0,
        } as HypTokenConfig;
      } else {
        throw new Error('No native token found for chain' + chain);
      }
    }

    return { tokenConfig, type: tokenTypeFromFuelType[tokenType] };
  }

  static async getDestinationGas(
    warpRoute: WarpRoute,
    domains: number[],
  ): Promise<DestinationGas> {
    return Object.fromEntries(
      await Promise.all(
        domains.map(async (domain) => {
          return [
            domain,
            (
              await warpRoute.functions.quote_gas_payment(domain).simulate()
            ).value.toString(),
          ];
        }),
      ),
    );
  }

  static async getRouters(warpRoute: WarpRoute, domains: number[]) {
    return RemoteRoutersSchema.parse(
      Object.fromEntries(
        await Promise.all(
          domains.map(async (domain) => {
            return [
              domain,
              {
                address: (await warpRoute.functions.router(domain).simulate())
                  .value,
              },
            ];
          }),
        ),
      ),
    );
  }

  // ======== Updating ========

  public static async update(
    multiProtocolProvider: MultiProtocolProvider,
    warpRouteAddress: string,
    chain: string,
    expectedConfig: HypTokenRouterConfig,
  ) {
    const signer = (await multiProtocolProvider.tryGetSigner(
      ProtocolType.Fuel,
      chain,
    )) as WalletUnlocked;
    const warpRoute = new WarpRoute(warpRouteAddress, signer);

    const transactions: TransactionResponse[] = [];
    const currentConfig = await this.deriveWarpRouteConfig(
      multiProtocolProvider,
      chain,
      warpRouteAddress,
    );

    // eslint-disable-next-line no-console
    console.log('currentConfig', currentConfig);

    transactions.push(
      ...(await this.updateWarpRouteIsm(
        multiProtocolProvider,
        chain,
        warpRoute,
        currentConfig,
        expectedConfig,
      )),
      ...(await this.updateWarpRouteHook(
        multiProtocolProvider,
        chain,
        warpRoute,
        currentConfig,
        expectedConfig,
      )),
      ...(await this.updateRemoteRouters(
        warpRoute,
        currentConfig,
        expectedConfig,
      )),
      ...(await this.transferOwnership(
        warpRoute,
        currentConfig,
        expectedConfig,
      )),
    );

    return transactions;
  }

  static async updateWarpRouteIsm(
    multiProtocolProvider: MultiProtocolProvider,
    chain: string,
    warpRoute: WarpRoute,
    currentConfig: HypTokenRouterConfig,
    expectedConfig: HypTokenRouterConfig,
  ): Promise<TransactionResponse[]> {
    if (!expectedConfig.interchainSecurityModule) {
      this.logger.debug('No ism provided, skipping hook update');
      return [];
    }

    return FuelIsmModule.update(
      multiProtocolProvider,
      chain,
      expectedConfig.mailbox,
      warpRoute,
      currentConfig.interchainSecurityModule as IsmConfig,
      expectedConfig.interchainSecurityModule,
    );
  }

  static async updateWarpRouteHook(
    multiProtocolProvider: MultiProtocolProvider,
    chain: string,
    warpRoute: WarpRoute,
    currentConfig: HypTokenRouterConfig,
    expectedConfig: HypTokenRouterConfig,
  ): Promise<TransactionResponse[]> {
    if (!expectedConfig.hook) {
      this.logger.debug('No hook provided, skipping hook update');
      return [];
    }

    return FuelHookModule.update(
      multiProtocolProvider,
      chain,
      expectedConfig.mailbox,
      warpRoute,
      currentConfig.hook as HookConfig,
      expectedConfig.hook,
    );
  }

  static async updateRemoteRouters(
    warpRoute: WarpRoute,
    currentConfig: HypTokenRouterConfig,
    expectedConfig: HypTokenRouterConfig,
  ): Promise<TransactionResponse[]> {
    const updateTransactions: TransactionResponse[] = [];
    if (!expectedConfig.remoteRouters) return [];

    assert(currentConfig.remoteRouters, 'Current remote routers are undefined');
    assert(
      expectedConfig.remoteRouters,
      'Expected remote routers are undefined',
    );

    const { remoteRouters: actualRemoteRouters } = currentConfig;
    const { remoteRouters: expectedRemoteRouters } = expectedConfig;

    const routesToEnroll = Array.from(
      difference(
        new Set(Object.keys(expectedRemoteRouters)),
        new Set(Object.keys(actualRemoteRouters)),
      ),
    );

    const routesToUnenroll = Array.from(
      difference(
        new Set(Object.keys(actualRemoteRouters)),
        new Set(Object.keys(expectedRemoteRouters)),
      ),
    );

    updateTransactions.push(
      ...(await this.enrollRemoteRouters(
        warpRoute,
        routesToEnroll,
        expectedRemoteRouters,
      )),
      ...(await this.unenrollRemoteRouters(warpRoute, routesToUnenroll)),
    );

    return updateTransactions;
  }

  static async enrollRemoteRouters(
    warpRoute: WarpRoute,
    domains: string[],
    expectedRemoteRouters: Record<string, { address: string }>,
  ): Promise<TransactionResponse[]> {
    if (!domains.length) return [];
    const routers = domains.map(
      (domain) => expectedRemoteRouters[domain].address,
    );

    const { transactionResponse } = await (
      await warpRoute.functions.enroll_remote_routers(domains, routers).call()
    ).waitForResult();
    return [transactionResponse];
  }

  static async unenrollRemoteRouters(
    warpRoute: WarpRoute,
    domains: string[],
  ): Promise<TransactionResponse[]> {
    if (!domains.length) return [];
    const transactions: TransactionResponse[] = [];
    for (const domain of domains) {
      const { transactionResponse } = await (
        await warpRoute.functions.unenroll_remote_router(domain).call()
      ).waitForResult();
      transactions.push(transactionResponse);
    }
    return transactions;
  }

  static async transferOwnership(
    warpRoute: WarpRoute,
    currentConfig: HypTokenRouterConfig,
    expectedConfig: HypTokenRouterConfig,
  ) {
    if (currentConfig.owner == expectedConfig.owner) return [];

    const { transactionResponse } = await (
      await warpRoute.functions
        .transfer_ownership({ Address: { bits: expectedConfig.owner } })
        .call()
    ).waitForResult();
    return [transactionResponse];
  }
}
