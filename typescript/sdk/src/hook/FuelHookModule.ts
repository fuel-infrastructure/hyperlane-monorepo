import { BigNumber, BigNumberish } from 'ethers';
import { BN, TransactionResponse, WalletUnlocked } from 'fuels';

import { InterchainGasPaymaster, StorageGasOracle } from '@hyperlane-xyz/core';
import {
  ProtocolType,
  WithAddress,
  assert,
  deepEquals,
  eqAddress,
  rootLogger,
} from '@hyperlane-xyz/utils';

import { AggregationFactory } from '../fuel-types/AggregationFactory.js';
import { FallbackDomainRoutingHook } from '../fuel-types/FallbackDomainRoutingHook.js';
import { FallbackDomainRoutingHookFactory } from '../fuel-types/FallbackDomainRoutingHookFactory.js';
import {
  GasOracle,
  RemoteGasDataConfigInput,
  U128Input,
} from '../fuel-types/GasOracle.js';
import { GasOracleFactory } from '../fuel-types/GasOracleFactory.js';
import { GasPaymaster } from '../fuel-types/GasPaymaster.js';
import { GasPaymasterFactory } from '../fuel-types/GasPaymasterFactory.js';
import {
  MerkleTreeHook,
  PostDispatchHookTypeOutput,
} from '../fuel-types/MerkleTreeHook.js';
import { MerkleTreeHookFactory } from '../fuel-types/MerkleTreeHookFactory.js';
import { PausableHook } from '../fuel-types/PausableHook.js';
import { PausableHookFactory } from '../fuel-types/PausableHookFactory.js';
import { ProtocolFee } from '../fuel-types/ProtocolFee.js';
import { ProtocolFeeFactory } from '../fuel-types/ProtocolFeeFactory.js';
import { WarpRoute } from '../fuel-types/WarpRoute.js';
import { IgpConfig } from '../gas/types.js';
import { MultiProtocolProvider } from '../providers/MultiProtocolProvider.js';
import { ChainNameOrId } from '../types.js';
import { normalizeConfig } from '../utils/ism.js';

import { IdentityInput, StateOutput } from './../fuel-types/Mailbox.js';
import { DerivedHookConfig } from './EvmHookReader.js';
import {
  AggregationHookConfig,
  FallbackRoutingHookConfig,
  HookConfig,
  HookConfigSchema,
  HookType,
  IgpHookConfig,
  IgpSchema,
  MUTABLE_HOOK_TYPE,
  MerkleTreeHookConfig,
  PausableHookConfig,
  ProtocolFeeHookConfig,
} from './types.js';

export class FuelHookModule {
  static logger = rootLogger.child({ module: 'FuelHookModule' });

  // =================== Deploy ===================

  public static async deploy(
    multiProtocolProvider: MultiProtocolProvider,
    chain: ChainNameOrId,
    hookConfig: HookConfig,
    mailboxId: string,
  ) {
    const signer = (await multiProtocolProvider.tryGetSigner(
      ProtocolType.Fuel,
      chain,
    )) as WalletUnlocked;

    if (hookConfig instanceof Object) {
      switch (hookConfig.type) {
        case HookType.MERKLE_TREE: {
          this.logger.info(`Deploying MerkleTreeHook for mailbox ${mailboxId}`);
          return this.deployMerkleTreeHook(signer, mailboxId);
        }
        case HookType.INTERCHAIN_GAS_PAYMASTER: {
          this.logger.info(`Deploying IGP Hook for mailbox ${mailboxId}`);
          return this.deployIgpHook(multiProtocolProvider, hookConfig, signer);
        }
        case HookType.PROTOCOL_FEE: {
          this.logger.info(
            `Deploying ProtocolFeeHook for mailbox ${mailboxId}`,
          );
          return this.deployProtocolFeeHook(hookConfig, signer);
        }
        case HookType.AGGREGATION: {
          this.logger.info(
            `Deploying AggregationHook for mailbox ${mailboxId}`,
          );
          return this.deployAggregationHook(hookConfig, signer);
        }
        case HookType.PAUSABLE: {
          this.logger.info(`Deploying PausableHook for mailbox ${mailboxId}`);
          return this.deployPausableHook(signer);
        }
        case HookType.FALLBACK_ROUTING: {
          this.logger.info(
            `Deploying FallbackRoutingHook for mailbox ${mailboxId}`,
          );
          return this.deployFallbackRoutingHook(hookConfig, signer);
        }
        default:
          throw new Error('Invalid hookConfig');
      }
    } else throw new Error('Invalid hookConfig');
  }

  static async deployMerkleTreeHook(
    signer: WalletUnlocked,
    mailboxId: string,
  ): Promise<string> {
    const signerAddress = signer.address.toB256();
    const { contractId, waitForResult } = await MerkleTreeHookFactory.deploy(
      signer,
      {
        configurableConstants: {
          EXPECTED_INITIALIZER: signerAddress,
        },
      },
    );
    const { contract } = await waitForResult();
    await (
      await contract.functions.initialize({ bits: mailboxId }).call()
    ).waitForResult();

    return contractId;
  }

  static async deployProtocolFeeHook(
    config: ProtocolFeeHookConfig,
    signer: WalletUnlocked,
  ): Promise<string> {
    const signerAddress = signer.address.toB256();
    const { contractId, waitForResult } = await ProtocolFeeFactory.deploy(
      signer,
      {
        configurableConstants: {
          EXPECTED_INITIALIZER: signerAddress,
        },
      },
    );

    const { contract } = await waitForResult();
    await (
      await contract.functions
        .initialize(
          new BN(config.protocolFee),
          { Address: { bits: config.beneficiary } },
          { Address: { bits: config.owner } },
        )
        .call()
    ).waitForResult();

    return contractId;
  }

  static async deployAggregationHook(
    config: AggregationHookConfig,
    signer: WalletUnlocked,
  ) {
    const signerAddress = signer.address.toB256();
    const { contractId, waitForResult } = await AggregationFactory.deploy(
      signer,
      {
        configurableConstants: {
          EXPECTED_INITIALIZER: signerAddress,
        },
      },
    );

    const { contract } = await waitForResult();
    const hookAddresses = config.hooks.map((hook) => ({
      bits: hook.toString(),
    }));

    await (
      await contract.functions
        .initialize({ Address: { bits: signerAddress } }, hookAddresses)
        .call()
    ).waitForResult();

    return contractId;
  }

  static async deployFallbackRoutingHook(
    config: FallbackRoutingHookConfig,
    signer: WalletUnlocked,
  ) {
    const signerAddress = signer.address.toB256();
    const { contractId, waitForResult } =
      await FallbackDomainRoutingHookFactory.deploy(signer, {
        configurableConstants: {
          EXPECTED_INITIALIZER: signerAddress,
        },
      });

    const { contract } = await waitForResult();
    const fallbackStr =
      typeof config.fallback === 'string' ? config.fallback : ''; // TODO: check if this is correct

    await (
      await contract.functions
        .initialize({ Address: { bits: signerAddress } }, fallbackStr)
        .call()
    ).waitForResult();

    return contractId;
  }

  static async deployPausableHook(signer: WalletUnlocked) {
    const signerAddress = signer.address.toB256();

    const { contractId } = await PausableHookFactory.deploy(signer, {
      configurableConstants: {
        EXPECTED_INITIALIZER: signerAddress,
      },
    });

    return contractId;
  }

  static async deployIgpHook(
    multiProtocolProvider: MultiProtocolProvider,
    hookConfig: HookConfig,
    signer: WalletUnlocked,
  ) {
    const igpData = IgpSchema.parse(hookConfig);

    const { contractId, igpSetupData } = await this.deployStorageGasOracle(
      multiProtocolProvider,
      igpData,
      signer,
    );
    this.logger.info(`Deployed StorageGasOracle for IGP Hook at ${contractId}`);

    return this.deployInterchainGasPaymaster(
      igpData,
      signer,
      contractId,
      igpSetupData,
    );
  }

  static async deployStorageGasOracle(
    multiProtocolProvider: MultiProtocolProvider,
    config: IgpHookConfig,
    signer: WalletUnlocked,
  ) {
    const { contractId, waitForResult } = await GasOracleFactory.deploy(signer);
    const { contract } = await waitForResult();

    const owner = config.oracleKey;
    const tempOwner = signer.address.toB256();

    await (
      await contract.functions
        .initialize_ownership({ Address: { bits: tempOwner } })
        .call()
    ).waitForResult();

    const configs: Array<StorageGasOracle.RemoteGasDataConfigStruct> = [];
    const igpSetupData: {
      domain: string;
      domainId: BigNumberish;
      overhead: number;
    }[] = [];
    for (const [chain, { gasPrice, tokenExchangeRate }] of Object.entries(
      config.oracleConfig,
    )) {
      const chainId = multiProtocolProvider.getChainId(chain);
      igpSetupData.push({
        domain: chain,
        domainId: chainId,
        overhead: config.overhead[chain],
      });

      configs.push({ remoteDomain: chainId, tokenExchangeRate, gasPrice });
    }

    const parsedConfigs = this.parseConfigsForAbi(
      multiProtocolProvider,
      configs,
    );

    await (
      await contract.functions.set_remote_gas_data_configs(parsedConfigs).call()
    ).waitForResult();

    await (
      await contract.functions
        .transfer_ownership({ Address: { bits: owner } })
        .call()
    ).waitForResult();

    return { contractId, igpSetupData };
  }

  static async deployInterchainGasPaymaster(
    { owner, beneficiary }: IgpConfig,
    signer: WalletUnlocked,
    gasOracleAddress: string,
    igpSetupData: {
      domain: string;
      domainId: BigNumberish;
      overhead: number;
    }[],
  ) {
    const { contractId, waitForResult } = await GasPaymasterFactory.deploy(
      signer,
    );
    const { contract } = await waitForResult();
    const tempOwner = signer.address.toB256();

    await (
      await contract.functions
        .initialize(
          { Address: { bits: tempOwner } },
          { Address: { bits: beneficiary } },
        )
        .call()
    ).waitForResult();

    for (const { domainId, overhead } of igpSetupData) {
      await (
        await contract.functions
          .set_gas_oracle(domainId.toString(), gasOracleAddress)
          .call()
      ).waitForResult();

      await (
        await contract.functions
          .set_gas_overhead(domainId.toString(), overhead)
          .call()
      ).waitForResult();
    }

    await (
      await contract.functions
        .transfer_ownership({ Address: { bits: owner } })
        .call()
    ).waitForResult();

    return contractId;
  }

  // =================== Read ===================

  public static async deriveHookConfig(
    multiProtocolProvider: MultiProtocolProvider,
    hookAddress: string,
    signer: WalletUnlocked,
  ): Promise<DerivedHookConfig> {
    // Could instantiate any Hook since they all have the `hook_type` function
    const onChainHookType = (
      await new MerkleTreeHook(hookAddress, signer).functions
        .hook_type()
        .simulate()
    ).value;

    switch (onChainHookType) {
      case PostDispatchHookTypeOutput.MERKLE_TREE:
        return this.deriveMerkleTreeConfig(hookAddress);
      case PostDispatchHookTypeOutput.INTERCHAIN_GAS_PAYMASTER:
        return this.deriveIgpConfig(multiProtocolProvider, hookAddress, signer);
      case PostDispatchHookTypeOutput.FALLBACK_ROUTING:
        return this.deriveFallbackRoutingConfig(
          hookAddress,
          signer,
          multiProtocolProvider,
        );
      case PostDispatchHookTypeOutput.AGGREGATION:
        return this.deriveAggregationConfig(hookAddress);
      case PostDispatchHookTypeOutput.PAUSABLE:
        return this.derivePausableConfig(hookAddress, signer);
      case PostDispatchHookTypeOutput.PROTOCOL_FEE:
        return this.deriveProtocolFeeConfig(hookAddress, signer);
      case PostDispatchHookTypeOutput.UNUSED:
        return {
          address: hookAddress,
          type: HookType.MERKLE_TREE, // TODO remove
        };
      default:
        throw new Error(`Unsupported hook type: ${onChainHookType}`);
    }
  }

  static async deriveMerkleTreeConfig(
    hookAddress: string,
  ): Promise<WithAddress<MerkleTreeHookConfig>> {
    return {
      address: hookAddress,
      type: HookType.MERKLE_TREE,
    };
  }

  static async deriveFallbackRoutingConfig(
    hookAddress: string,
    signer: WalletUnlocked,
    multiProtocolProvider: MultiProtocolProvider,
  ): Promise<WithAddress<FallbackRoutingHookConfig>> {
    const hook = new FallbackDomainRoutingHook(hookAddress, signer);
    const ownerResponse = (await hook.functions.owner().simulate()).value;
    const owner = this.getOwnerFromOwnerResponse(ownerResponse);

    const domainIds = multiProtocolProvider.getKnownDomainIds();

    return {
      address: hookAddress,
      type: HookType.FALLBACK_ROUTING,
      owner,
      fallback: '', // TODO: get fallback
      domains: domainIds.reduce(
        (acc, domainId) => ({ ...acc, [domainId]: '' }),
        {},
      ),
    };
  }

  static async deriveAggregationConfig(
    hookAddress: string,
  ): Promise<WithAddress<AggregationHookConfig>> {
    return {
      address: hookAddress,
      type: HookType.AGGREGATION,
      hooks: [], // TODO: get hooks
    };
  }

  static async derivePausableConfig(
    hookAddress: string,
    signer: WalletUnlocked,
  ): Promise<WithAddress<PausableHookConfig>> {
    const hook = new PausableHook(hookAddress, signer);
    const ownerResponse = (await hook.functions.owner().simulate()).value;
    const owner = this.getOwnerFromOwnerResponse(ownerResponse);

    return {
      address: hookAddress,
      type: HookType.PAUSABLE,
      owner,
      paused: false,
      ownerOverrides: {}, // TODO: get owner overrides
    };
  }

  static async deriveProtocolFeeConfig(
    hookAddress: string,
    signer: WalletUnlocked,
  ): Promise<WithAddress<ProtocolFeeHookConfig>> {
    const hook = new ProtocolFee(hookAddress, signer);
    const ownerResponse = (await hook.functions.owner().simulate()).value;
    const owner = this.getOwnerFromOwnerResponse(ownerResponse);

    const beneficiaryResponse = (await hook.functions.beneficiary().simulate())
      .value;
    const beneficiary =
      this.getBeneficiaryFromBeneficiaryResponse(beneficiaryResponse);

    const maxProtocolFeeResponse = (
      await hook.functions.max_protocol_fee().simulate()
    ).value;
    const maxProtocolFee = maxProtocolFeeResponse.toString();

    const protocolFeeResponse = (await hook.functions.protocol_fee().simulate())
      .value;
    const protocolFee = protocolFeeResponse.toString();
    return {
      address: hookAddress,
      type: HookType.PROTOCOL_FEE,
      owner,
      beneficiary,
      maxProtocolFee,
      protocolFee,
      ownerOverrides: {}, // TODO: get owner overrides
    };
  }

  static async deriveIgpConfig(
    multiProtocolProvider: MultiProtocolProvider,
    hookAddress: string,
    signer: WalletUnlocked,
  ): Promise<WithAddress<IgpHookConfig>> {
    const hook = new GasPaymaster(hookAddress, signer);

    const ownerResponse = (await hook.functions.owner().simulate()).value;
    const owner = this.getOwnerFromOwnerResponse(ownerResponse);

    const beneficiaryResponse = (await hook.functions.beneficiary().simulate())
      .value;
    const beneficiary =
      this.getBeneficiaryFromBeneficiaryResponse(beneficiaryResponse);

    const overhead: IgpHookConfig['overhead'] = {};
    const oracleConfig: IgpHookConfig['oracleConfig'] = {};
    let oracleKey: string | undefined;

    const domainIds = multiProtocolProvider.getKnownDomainIds();

    const allKeys = await Promise.all(
      domainIds.map(async (domainId) => {
        const chainName = multiProtocolProvider.getChainName(domainId);

        const { gas_price, token_exchange_rate } = (
          await hook.functions.get_remote_gas_data(domainId).simulate()
        ).value;

        const domainGasOverhead =
          (await hook.functions.gas_overhead(domainId).simulate()).value ??
          new BN();

        overhead[chainName] = domainGasOverhead.toNumber();
        oracleConfig[chainName] = {
          tokenExchangeRate: token_exchange_rate.toString(),
          gasPrice: gas_price.toString(),
        };

        const gasOracleAddress = (
          await hook.functions.gas_oracle(domainId).simulate()
        ).value;
        if (!gasOracleAddress) return null;
        const gasOracle = new GasOracle(gasOracleAddress, signer);
        const ownerResponse = (await gasOracle.functions.owner().simulate())
          .value;
        if ('Revoked' in ownerResponse || 'Uninitialized' in ownerResponse)
          return null;

        const gasOracleOwner =
          ownerResponse.Initialized?.Address?.bits ??
          ownerResponse.Initialized.ContractId?.bits;
        if (!gasOracleOwner) return null;
        return gasOracleOwner;
      }),
    );

    const resolvedOracleKeys = allKeys.filter(
      (key): key is string => key !== null,
    );

    if (resolvedOracleKeys.length > 0) {
      const allKeysMatch = resolvedOracleKeys.every((key) =>
        eqAddress(resolvedOracleKeys[0], key),
      );
      assert(allKeysMatch, 'Not all oracle keys match');
      oracleKey = resolvedOracleKeys[0];
    }

    return {
      owner,
      address: hookAddress,
      type: HookType.INTERCHAIN_GAS_PAYMASTER,
      beneficiary,
      oracleKey: oracleKey ?? owner,
      overhead,
      oracleConfig,
    };
  }

  // =================== Update ===================

  public static async update(
    multiProtocolProvider: MultiProtocolProvider,
    chain: string,
    mailboxId: string,
    warpRoute: WarpRoute,
    currentConfig: HookConfig,
    targetConfig: HookConfig,
  ) {
    targetConfig = HookConfigSchema.parse(targetConfig);

    // Do not support updating to a custom Hook address
    if (typeof targetConfig === 'string')
      throw new Error(
        'Invalid targetConfig: Updating to a custom Hook address is not supported. Please provide a valid Hook configuration.',
      );

    targetConfig = normalizeConfig(targetConfig);
    currentConfig = normalizeConfig(currentConfig);

    // If configs match, no updates needed
    if (deepEquals(currentConfig, targetConfig)) return [];

    if (
      !currentConfig ||
      this.shouldDeployNewHook(
        currentConfig,
        targetConfig as Exclude<HookConfig, string>,
      )
    ) {
      const newHookId = await this.deploy(
        multiProtocolProvider,
        chain,
        targetConfig,
        mailboxId,
      );

      const { transactionResponse } = await (
        await warpRoute.functions.set_hook({ bits: newHookId }).call()
      ).waitForResult();

      this.logger.debug(
        `Upated Hook to a newly deployed Hook at ${newHookId} for mailbox ${mailboxId}`,
      );

      return [transactionResponse];
    }

    // Should be only IGP hook left at this point
    if (
      (targetConfig as Exclude<HookConfig, string>).type !==
      HookType.INTERCHAIN_GAS_PAYMASTER
    )
      throw new Error('Unsupported Hook type');

    const transactions: TransactionResponse[] = await this.updateIgpHook(
      multiProtocolProvider,
      chain,
      currentConfig as IgpHookConfig,
      targetConfig as IgpHookConfig,
    );
    this.logger.debug(`Updated IGP Hook for mailbox ${mailboxId}`);

    return transactions;
  }

  static async updateIgpHook(
    multiProtocolProvider: MultiProtocolProvider,
    chain: string,
    currentConfig: IgpHookConfig,
    targetConfig: IgpHookConfig,
  ) {
    const igpConfig = IgpSchema.parse(currentConfig) as WithAddress<IgpConfig>;

    const signer = (await multiProtocolProvider.tryGetSigner(
      ProtocolType.Fuel,
      chain,
    )) as WalletUnlocked;
    const igpHook = new GasPaymaster(igpConfig.address, signer);

    const transactions: TransactionResponse[] = [];
    if (!eqAddress(currentConfig.beneficiary, targetConfig.beneficiary)) {
      const { transactionResponse } = await (
        await igpHook.functions
          .set_beneficiary({ Address: { bits: targetConfig.beneficiary } })
          .call()
      ).waitForResult();
      this.logger.debug(
        `Updating beneficiary from ${currentConfig.beneficiary} to ${targetConfig.beneficiary}`,
      );
      transactions.push(transactionResponse);
    }

    // get gasOracleAddress using any remote domain in the current config
    let gasOracle: string;
    const domainKeys = Object.keys(currentConfig.oracleConfig);

    if (domainKeys.length > 0) {
      const domainId = multiProtocolProvider.getDomainId(domainKeys[0]);

      gasOracle = (
        await igpHook.functions.get_domain_gas_config(domainId).simulate()
      ).value.gas_oracle;

      // update storage gas oracle
      // Note: this will only update the gas oracle for remotes that are in the target config
      transactions.push(
        ...(await this.updateStorageGasOracle(
          multiProtocolProvider,
          signer,
          gasOracle,
          currentConfig.oracleConfig,
          targetConfig.oracleConfig,
          chain,
        )),
      );
    } else {
      gasOracle = (
        await this.deployStorageGasOracle(
          multiProtocolProvider,
          targetConfig,
          signer,
        )
      ).contractId;
    }

    // update igp remote gas params
    // Note: this will only update the gas params for remotes that are in the target config
    transactions.push(
      ...(await this.updateIgpRemoteGasParams(
        multiProtocolProvider,
        signer,
        chain,
        igpConfig.address,
        gasOracle,
        targetConfig.overhead,
        currentConfig.overhead,
      )),
    );

    return transactions;
  }

  static async updateStorageGasOracle(
    multiProtocolProvider: MultiProtocolProvider,
    signer: WalletUnlocked,
    gasOracleAddress: string,
    currentOracleConfig: IgpHookConfig['oracleConfig'],
    targetOracleConfig: IgpHookConfig['oracleConfig'],
    chain: string,
  ) {
    this.logger.info(`Updating gas oracle configuration from ${chain}...`);
    const configsToSet: Array<StorageGasOracle.RemoteGasDataConfigStruct> = [];

    for (const [remote, target] of Object.entries(targetOracleConfig)) {
      const current = currentOracleConfig?.[remote];
      const remoteDomain = multiProtocolProvider.tryGetDomainId(remote);

      if (!remoteDomain) {
        this.logger.warn(
          `Skipping gas oracle update ${chain} -> ${remote}. Expected if the remote domain is not in the MultiProtocolProvider.`,
        );
        continue;
      }

      // only update if the oracle config has changed
      if (!current || !deepEquals(current, target)) {
        configsToSet.push({ remoteDomain, ...target });
      }
    }

    if (configsToSet.length === 0) return [];

    const gasOracle = new GasOracle(gasOracleAddress, signer);

    const parsedConfigs = this.parseConfigsForAbi(
      multiProtocolProvider,
      configsToSet,
    );

    const { transactionResponse } = await (
      await gasOracle.functions
        .set_remote_gas_data_configs(parsedConfigs)
        .call()
    ).waitForResult();

    return [transactionResponse];
  }

  static async updateIgpRemoteGasParams(
    multiProtocolProvider: MultiProtocolProvider,
    signer: WalletUnlocked,
    chain: string,
    igpAddress: string,
    gasOracleAddress: string,
    targetOverheads: IgpConfig['overhead'],
    currentOverheads?: IgpConfig['overhead'],
  ) {
    const gasParamsToSet: InterchainGasPaymaster.GasParamStruct[] = [];
    for (const [remote, gasOverhead] of Object.entries(targetOverheads)) {
      const remoteDomain = multiProtocolProvider.tryGetDomainId(remote);

      if (!remoteDomain) {
        this.logger.warn(
          `Skipping overhead ${chain} -> ${remote}. Expected if the remote domain is not in the MultiProtocolProvider.`,
        );
        continue;
      }

      // only update if the gas overhead has changed
      if (currentOverheads?.[remote] !== gasOverhead) {
        this.logger.debug(
          `Setting gas params for ${chain} -> ${remote}: gasOverhead = ${gasOverhead} gasOracle = ${gasOracleAddress}`,
        );
        gasParamsToSet.push({
          remoteDomain,
          config: { gasOverhead, gasOracle: gasOracleAddress },
        });
      }
    }
    if (gasParamsToSet.length === 0) return [];

    const igpHook = new GasPaymaster(igpAddress, signer);
    const transactions: TransactionResponse[] = [];
    for (const {
      remoteDomain,
      config: { gasOracle, gasOverhead },
    } of gasParamsToSet) {
      const { transactionResponse: setOracleRes } = await (
        await igpHook.functions
          .set_gas_oracle(remoteDomain.toString(), gasOracle)
          .call()
      ).waitForResult();
      transactions.push(setOracleRes);

      const { transactionResponse: setOverheadRes } = await (
        await igpHook.functions
          .set_gas_overhead(remoteDomain.toString(), gasOverhead.toString())
          .call()
      ).waitForResult();
      transactions.push(setOverheadRes);
    }

    return transactions;
  }

  // =================== Utils ===================

  /**
   * Determines if a new hook should be deployed based on the current and target configurations.
   *
   * @param currentConfig - The current hook configuration.
   * @param targetConfig - The target hook configuration. Must not be a string.
   * @returns {boolean} - Returns true if a new hook should be deployed, otherwise false.
   *
   * Conditions for deploying a new hook:
   * - If updating from an address/custom config to a proper hook config.
   * - If updating a proper hook config whose types are different.
   * - If it is not a mutable Hook.
   */
  private static shouldDeployNewHook(
    currentConfig: HookConfig,
    targetConfig: Exclude<HookConfig, string>,
  ): boolean {
    return (
      typeof currentConfig === 'string' ||
      currentConfig.type !== targetConfig.type ||
      !MUTABLE_HOOK_TYPE.includes(targetConfig.type)
    );
  }

  private static parseConfigsForAbi(
    multiProtocolProvider: MultiProtocolProvider,
    configs: StorageGasOracle.RemoteGasDataConfigStruct[],
  ): RemoteGasDataConfigInput[] {
    return configs.map(({ remoteDomain, tokenExchangeRate, gasPrice }) => {
      const protocol =
        multiProtocolProvider.metadata[Number(remoteDomain)].protocol;
      const decimals =
        protocol === ProtocolType.Sealevel || protocol === ProtocolType.Fuel
          ? 9
          : 18;

      return {
        domain: remoteDomain.toString(),
        remote_gas_data: {
          domain: remoteDomain.toString(),
          gas_price: this.bigNumberishToU128Input(gasPrice),
          token_exchange_rate: this.bigNumberishToU128Input(tokenExchangeRate),
          token_decimals: decimals,
        },
      };
    });
  }

  private static bigNumberishToU128Input(value: BigNumberish): U128Input {
    const bigValue = BigNumber.from(value);

    // Define the 64-bit mask (2^64 - 1)
    const mask = BigNumber.from('0xFFFFFFFFFFFFFFFF');
    // Extract the lower 64 bits
    const lower = bigValue.and(mask);
    // Extract the upper 64 bits by right-shifting 64 bits
    const upper = bigValue.shr(64);

    return { upper: upper.toString(), lower: lower.toString() };
  }

  private static getOwnerFromOwnerResponse(ownerResponse: StateOutput): string {
    if ('Revoked' in ownerResponse || 'Uninitialized' in ownerResponse) {
      throw new Error(
        'Failed to get owner, ownership state - ' + ownerResponse,
      );
    }

    const owner =
      ownerResponse.Initialized?.Address?.bits ??
      ownerResponse.Initialized.ContractId?.bits;
    if (!owner) throw new Error('Failed to get owner');

    return owner;
  }

  private static getBeneficiaryFromBeneficiaryResponse(
    beneficiaryResponse: IdentityInput,
  ): string {
    const beneficiary =
      beneficiaryResponse.Address?.bits ?? beneficiaryResponse.ContractId?.bits;
    if (!beneficiary) throw new Error('Failed to get beneficiary');

    return beneficiary;
  }
}
