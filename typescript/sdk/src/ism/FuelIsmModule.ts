import { B256AddressEvm, TransactionResponse, WalletUnlocked } from 'fuels';

import {
  ProtocolType,
  WithAddress,
  addressToBytes32,
  assert,
  concurrentMap,
  deepEquals,
  intersection,
  rootLogger,
} from '@hyperlane-xyz/utils';

import {
  AggregationIsm,
  ModuleTypeOutput,
} from '../fuel-types/AggregationIsm.js';
import { AggregationIsmFactory } from '../fuel-types/AggregationIsmFactory.js';
import { DefaultFallbackDomainRoutingIsm } from '../fuel-types/DefaultFallbackDomainRoutingIsm.js';
import { DefaultFallbackDomainRoutingIsmFactory } from '../fuel-types/DefaultFallbackDomainRoutingIsmFactory.js';
import { DomainRoutingIsm } from '../fuel-types/DomainRoutingIsm.js';
import { DomainRoutingIsmFactory } from '../fuel-types/DomainRoutingIsmFactory.js';
import { IsmTestFactory } from '../fuel-types/IsmTestFactory.js';
import { MerkleRootMultisigIsm } from '../fuel-types/MerkleRootMultisigIsm.js';
import { MerkleRootMultisigIsmFactory } from '../fuel-types/MerkleRootMultisigIsmFactory.js';
import { MessageIdMultisigIsmFactory } from '../fuel-types/MessageIdMultisigIsmFactory.js';
import { PausableIsm } from '../fuel-types/PausableIsm.js';
import { PausableIsmFactory } from '../fuel-types/PausableIsmFactory.js';
import { WarpRoute } from '../fuel-types/WarpRoute.js';
import { MultiProtocolProvider } from '../providers/MultiProtocolProvider.js';
import { ChainNameOrId } from '../types.js';
import { normalizeConfig } from '../utils/ism.js';

import { DerivedIsmConfig } from './EvmIsmReader.js';
import {
  AggregationIsmConfig,
  AggregationIsmConfigSchema,
  DomainRoutingIsmConfig,
  IsmConfig,
  IsmConfigSchema,
  IsmType,
  MUTABLE_ISM_TYPE,
  MultisigIsmConfig,
  MultisigIsmConfigSchema,
  NullIsmConfig,
  RoutingIsmConfig,
  RoutingIsmConfigSchema,
} from './types.js';
import { calculateDomainRoutingDelta } from './utils.js';

export class FuelIsmModule {
  private static logger = rootLogger.child({ module: 'FuelIsmModule' });
  private static concurrency = 1;

  static async sleep(sec: number) {
    return new Promise((resolve) => setTimeout(resolve, sec * 1000));
  }

  // ============== Deploy ==============

  public static async deployWithRetry(
    multiProtocolProvider: MultiProtocolProvider,
    chain: ChainNameOrId,
    ismConfig: IsmConfig,
    mailboxId: string,
    retries = 5,
  ) {
    for (let i = 0; i < retries; i++) {
      try {
        const result = await this.deploy(
          multiProtocolProvider,
          chain,
          ismConfig,
          mailboxId,
        );
        return result;
      } catch (error) {
        if (i === retries - 1) {
          this.logger.error(`All ${retries} attempts failed: ${error}`);
          throw error;
        }
        this.logger.warn(`Attempt ${i + 1} failed: ${error}. Retrying...`);
        await this.sleep(2);
      }
    }
    throw new Error('Fuel deployment loop out of bounds');
  }

  static async deploy(
    multiProtocolProvider: MultiProtocolProvider,
    chain: ChainNameOrId,
    ismConfig: IsmConfig,
    mailboxId: string,
  ) {
    const signer = (await multiProtocolProvider.tryGetSigner(
      ProtocolType.Fuel,
      chain,
    )) as WalletUnlocked;
    const owner = signer.address.b256Address;

    if (ismConfig instanceof Object) {
      switch (ismConfig.type) {
        case IsmType.FALLBACK_ROUTING:
        case IsmType.ROUTING: {
          this.logger.info(
            `Deploying routing ISM for mailbox ${mailboxId} on chain ${chain}`,
          );
          return this.deployRoutingIsm(
            multiProtocolProvider,
            chain,
            mailboxId,
            ismConfig,
            signer,
            owner,
          );
        }
        case IsmType.AGGREGATION: {
          this.logger.info(
            `Deploying aggregation ISM for mailbox ${mailboxId} on chain ${chain}`,
          );
          return this.deployAggregationIsm(
            multiProtocolProvider,
            chain,
            ismConfig,
            mailboxId,
            signer,
            owner,
          );
        }
        case IsmType.MERKLE_ROOT_MULTISIG:
        case IsmType.MESSAGE_ID_MULTISIG: {
          this.logger.info(
            `Deploying multisig of type ${ismConfig.type} ISM for mailbox ${mailboxId} on chain ${chain}`,
          );
          return this.deployMultisigIsm(ismConfig, signer);
        }
        case IsmType.PAUSABLE: {
          this.logger.info(
            `Deploying pausable ISM for mailbox ${mailboxId} on chain ${chain}`,
          );
          return this.deployPausableIsm(signer);
        }
        case IsmType.TEST_ISM: {
          this.logger.info(
            `Deploying test ISM for mailbox ${mailboxId} on chain ${chain}`,
          );
          return this.deployTestIsm(signer);
        }
        default:
          throw new Error('Invalid ismConfig');
      }
    } else throw new Error('Invalid ismConfig');
  }

  static async deployTestIsm(signer: WalletUnlocked) {
    const { waitForResult } = await IsmTestFactory.deploy(signer);
    await waitForResult().then(async () => this.sleep(2));
    return signer.address.b256Address;
  }

  static async deployRoutingIsm(
    multiProtocolProvider: MultiProtocolProvider,
    chain: ChainNameOrId,
    mailboxId: string,
    ismConfig: IsmConfig,
    signer: WalletUnlocked,
    owner: string,
  ) {
    const routingConfig = RoutingIsmConfigSchema.parse(
      ismConfig,
    ) as DomainRoutingIsmConfig;
    const domains: number[] = [];
    const modules: string[] = [];

    for (const [domain, config] of Object.entries(routingConfig.domains)) {
      const ismId = await this.deployWithRetry(
        multiProtocolProvider,
        chain,
        config,
        mailboxId,
      );
      const domainId = multiProtocolProvider.getDomainId(domain);
      domains.push(domainId);
      modules.push(ismId);
    }

    const { waitForResult } =
      routingConfig.type === IsmType.ROUTING
        ? await DomainRoutingIsmFactory.deploy(signer, {
            configurableConstants: { EXPECTED_OWNER: owner },
          })
        : await DefaultFallbackDomainRoutingIsmFactory.deploy(signer, {
            configurableConstants: { EXPECTED_OWNER: owner },
          });
    const { contract } = await waitForResult().then(async (res) => {
      await this.sleep(2);
      return res;
    });

    const initResult =
      routingConfig.type === IsmType.ROUTING
        ? await (contract as DomainRoutingIsm).functions
            .initialize_with_domains(
              { Address: { bits: owner } },
              domains,
              modules,
            )
            .call()
        : await (contract as DefaultFallbackDomainRoutingIsm).functions
            .initialize_with_domains(
              { Address: { bits: owner } },
              mailboxId,
              domains,
              modules,
            )
            .call();
    await initResult.waitForResult().then(async () => this.sleep(2));

    return contract.id.b256Address;
  }

  static async deployAggregationIsm(
    multiProtocolProvider: MultiProtocolProvider,
    chain: ChainNameOrId,
    ismConfig: IsmConfig,
    mailboxId: string,
    signer: WalletUnlocked,
    owner: string,
  ) {
    const { modules, threshold } = AggregationIsmConfigSchema.parse(ismConfig);
    const deployedModules: string[] = [];

    for (const config of modules) {
      const moduleId = await this.deployWithRetry(
        multiProtocolProvider,
        chain,
        config,
        mailboxId,
      );
      deployedModules.push(moduleId);
    }

    const deploymentResult = await AggregationIsmFactory.deploy(signer, {
      configurableConstants: { EXPECTED_INITIALIZER: owner },
    });
    const { contract } = await deploymentResult
      .waitForResult()
      .then(async (res) => {
        await this.sleep(2);
        return res;
      });

    const initResult = await contract.functions
      .initialize(
        { Address: { bits: signer.address.b256Address } },
        deployedModules.map((module) => ({ bits: module })),
        threshold,
      )
      .call();
    await initResult.waitForResult().then(async () => this.sleep(2));

    return contract.id.b256Address;
  }

  static async deployMultisigIsm(ismConfig: IsmConfig, signer: WalletUnlocked) {
    const { type, validators, threshold } =
      MultisigIsmConfigSchema.parse(ismConfig);

    const factory =
      type === IsmType.MERKLE_ROOT_MULTISIG
        ? MerkleRootMultisigIsmFactory
        : MessageIdMultisigIsmFactory;
    const { waitForResult } = await factory.deploy(signer, {
      configurableConstants: {
        EXPECTED_INITIALIZER: signer.address.b256Address,
        THRESHOLD: threshold,
      },
    });
    const { contract } = await waitForResult().then(async (res) => {
      await this.sleep(2);
      return res;
    });

    await (
      await contract.functions
        .initialize(
          validators.map((v) => ({
            bits: addressToBytes32(v) as B256AddressEvm,
          })),
        )
        .call()
    )
      .waitForResult()
      .then(async () => this.sleep(2));

    return contract.id.b256Address;
  }

  static async deployPausableIsm(signer: WalletUnlocked) {
    const { waitForResult } = await PausableIsmFactory.deploy(signer, {
      configurableConstants: { EXPECTED_OWNER: signer.address.b256Address },
    });
    const { contract } = await waitForResult().then(async (res) => {
      await this.sleep(2);
      return res;
    });
    await (
      await contract.functions
        .initialize_ownership({ Address: { bits: signer.address.b256Address } })
        .call()
    )
      .waitForResult()
      .then(() => this.sleep(2));

    return contract.id.b256Address;
  }

  // ============== Read ==============

  public static async deriveIsmConfig(
    multiProtocolProvider: MultiProtocolProvider,
    ismAddress: string,
    signer: WalletUnlocked,
  ): Promise<DerivedIsmConfig> {
    const onChainIsmType =
      // Could instantiate any ISM since they all have the `module_type` function
      (
        await new AggregationIsm(ismAddress, signer).functions
          .module_type()
          .simulate()
      ).value;

    switch (onChainIsmType) {
      case ModuleTypeOutput.AGGREGATION:
        return this.deriveAggregationConfig(
          multiProtocolProvider,
          ismAddress,
          signer,
        );
      case ModuleTypeOutput.ROUTING:
        return this.deriveRoutingConfig(
          multiProtocolProvider,
          ismAddress,
          signer,
        );
      case ModuleTypeOutput.MERKLE_ROOT_MULTISIG:
      case ModuleTypeOutput.MESSAGE_ID_MULTISIG:
        return this.deriveMultisigConfig(ismAddress, signer, onChainIsmType);
      case ModuleTypeOutput.NULL:
        return this.deriveNullConfig(ismAddress, signer);
      default:
        throw new Error('Unsupported Fuel ISM type' + onChainIsmType);
    }
  }

  static async deriveNullConfig(
    ismAddress: string,
    signer: WalletUnlocked,
  ): Promise<WithAddress<NullIsmConfig>> {
    const ism = new PausableIsm(ismAddress, signer);

    try {
      const paused = (await ism.functions.is_paused().simulate()).value;
      const ownerOutput = (await ism.functions.owner().simulate()).value;
      const owner = ownerOutput.Initialized
        ? ownerOutput.Initialized.Address
          ? ownerOutput.Initialized.Address.bits
          : ownerOutput.Initialized.ContractId.bits
        : '0x';
      return { address: ismAddress, type: IsmType.PAUSABLE, paused, owner };
    } catch {
      this.logger.warn(`Null ISM is not pausable`);
    }

    return { address: ismAddress, type: IsmType.TEST_ISM };
  }

  static async deriveAggregationConfig(
    multiProtocolProvider: MultiProtocolProvider,
    ismAddress: string,
    signer: WalletUnlocked,
  ): Promise<WithAddress<AggregationIsmConfig>> {
    const ism = new AggregationIsm(ismAddress, signer);
    const [modules, threshold] = (
      await ism.functions.modules_and_threshold([]).simulate()
    ).value;

    const ismConfigs = await concurrentMap(
      this.concurrency,
      modules,
      async (module) =>
        this.deriveIsmConfig(multiProtocolProvider, module.bits, signer),
    );

    return {
      address: ismAddress,
      type: IsmType.AGGREGATION,
      modules: ismConfigs,
      threshold,
    };
  }

  static async deriveRoutingConfig(
    multiProtocolProvider: MultiProtocolProvider,
    ismAddress: string,
    signer: WalletUnlocked,
  ): Promise<WithAddress<RoutingIsmConfig>> {
    const ism = new DefaultFallbackDomainRoutingIsm(ismAddress, signer);

    const ownerInitialized = (await ism.functions.owner().simulate()).value
      .Initialized;
    const owner = ownerInitialized
      ? ownerInitialized.Address
        ? ownerInitialized.Address.bits
        : ownerInitialized.ContractId.bits
      : (() => {
          throw new Error('Owner not initialized');
        })();

    const domainIds = (await ism.functions.domains().simulate()).value;
    const domains: Record<string, any> = {};

    for (const domainId of domainIds) {
      try {
        const domainIsmId = (await ism.functions.module(domainId).simulate())
          .value;
        const chainName = multiProtocolProvider.getChainName(domainId);
        domains[chainName] = await this.deriveIsmConfig(
          multiProtocolProvider,
          domainIsmId,
          signer,
        );
      } catch {
        this.logger.warn(`Unable to derive ISM config for domain ${domainId}`);
      }
    }

    // Fallback routing ISM extends from MailboxClient, default routing
    let ismType = IsmType.FALLBACK_ROUTING;
    try {
      const res = (
        await new DefaultFallbackDomainRoutingIsm(ismAddress, signer).functions
          .mailbox()
          .simulate()
      ).callResult.dryRunStatus?.type;
      assert(res === 'DryRunSuccessStatus', 'Mailbox call failed');
    } catch {
      ismType = IsmType.ROUTING;
    }

    return { owner, address: ismAddress, type: ismType, domains };
  }

  static async deriveMultisigConfig(
    ismAddress: string,
    signer: WalletUnlocked,
    onChainIsmType: ModuleTypeOutput,
  ): Promise<WithAddress<MultisigIsmConfig>> {
    const ismType =
      onChainIsmType === ModuleTypeOutput.MERKLE_ROOT_MULTISIG
        ? IsmType.MERKLE_ROOT_MULTISIG
        : IsmType.MESSAGE_ID_MULTISIG;

    const [validators, threshold] =
      // Could instantiate any Multisig ISM since they all have the `validators_and_threshold` function
      (
        await new MerkleRootMultisigIsm(ismAddress, signer).functions
          .validators_and_threshold([])
          .simulate()
      ).value;

    return {
      address: ismAddress,
      type: ismType,
      validators: validators.map((validator) => {
        // Remove the leading zeros of a 32 byte address which is an Ethereum address
        return `0x${validator.bits.slice(26)}`;
      }),
      threshold,
    };
  }

  // ============== Update ==============

  public static async update(
    multiProtocolProvider: MultiProtocolProvider,
    chain: string,
    mailboxId: string,
    warpRoute: WarpRoute,
    currentConfig: IsmConfig,
    targetConfig: IsmConfig,
  ): Promise<TransactionResponse[]> {
    targetConfig = IsmConfigSchema.parse(targetConfig);

    // Do not support updating to a custom ISM address
    if (typeof targetConfig === 'string') {
      throw new Error(
        'Invalid targetConfig: Updating to a custom ISM address is not supported. Please provide a valid ISM configuration.',
      );
    }
    // normalize the config to ensure it's in a consistent format for comparison
    currentConfig = normalizeConfig(currentConfig);
    targetConfig = normalizeConfig(targetConfig);

    assert(
      typeof targetConfig === 'object',
      'normalized targetConfig should be an object',
    );

    // If configs match, no updates needed
    if (deepEquals(currentConfig, targetConfig)) return [];

    // Else, we have to figure out what an update for this ISM entails
    // Check if we need to deploy a new ISM
    if (
      // if no hook is set, do a new deploy
      !currentConfig ||
      // if updating from an address/custom config to a proper ISM config, do a new deploy
      typeof currentConfig === 'string' ||
      // if updating a proper ISM config whose types are different, do a new deploy
      currentConfig.type !== targetConfig.type ||
      // if it is not a mutable ISM, do a new deploy
      !MUTABLE_ISM_TYPE.includes(targetConfig.type)
    ) {
      const newIsmId = await this.deployWithRetry(
        multiProtocolProvider,
        chain,
        targetConfig,
        mailboxId,
      );

      const { transactionResponse } = await (
        await warpRoute.functions.set_ism({ bits: newIsmId }).call()
      ).waitForResult();

      this.logger.debug(
        `Upated ISM to a newly deployed ISM at ${newIsmId} for mailbox ${mailboxId}`,
      );

      return [transactionResponse];
    }

    // At this point, only the 2 ownable/mutable ISM types should remain: ROUTING, FALLBACK_ROUTING
    if (
      targetConfig.type !== IsmType.ROUTING &&
      targetConfig.type !== IsmType.FALLBACK_ROUTING
    )
      throw new Error(`Unsupported ISM type ${targetConfig.type}`);

    const signer = (await multiProtocolProvider.tryGetSigner(
      ProtocolType.Fuel,
      chain,
    )) as WalletUnlocked;

    // if it's either of the routing ISMs, update their submodules
    let updateTxs: TransactionResponse[] = [];
    if (
      targetConfig.type === IsmType.ROUTING ||
      targetConfig.type === IsmType.FALLBACK_ROUTING
    ) {
      updateTxs = await this.updateRoutingIsm(
        multiProtocolProvider,
        signer,
        chain,
        mailboxId,
        currentConfig as DomainRoutingIsmConfig,
        targetConfig,
      );
    }

    updateTxs.push(
      ...(await this.transferIsmOwnership(
        signer,
        currentConfig as DomainRoutingIsmConfig,
        targetConfig as DomainRoutingIsmConfig,
      )),
    );

    return updateTxs;
  }

  static async updateRoutingIsm(
    multiProtocolProvider: MultiProtocolProvider,
    signer: WalletUnlocked,
    chain: string,
    mailboxId: string,
    currentConfig: DomainRoutingIsmConfig,
    targetConfig: DomainRoutingIsmConfig,
  ): Promise<TransactionResponse[]> {
    const routingConfig = RoutingIsmConfigSchema.parse(
      currentConfig,
    ) as WithAddress<DomainRoutingIsmConfig>;

    const routingIsm = new DomainRoutingIsm(routingConfig.address, signer);

    const { domainsToEnroll, domainsToUnenroll } = calculateDomainRoutingDelta(
      currentConfig,
      targetConfig,
    );

    const knownChains = new Set(multiProtocolProvider.getKnownChainNames());
    const knownEnrolls = intersection(knownChains, new Set(domainsToEnroll));

    const transactions: TransactionResponse[] = [];

    for (const origin of knownEnrolls) {
      this.logger.debug(
        `Reconfiguring preexisting routing ISM for origin ${origin}...`,
      );
      const ism = await this.deployWithRetry(
        multiProtocolProvider,
        chain,
        targetConfig.domains[origin],
        mailboxId,
      );

      const domainId = multiProtocolProvider.getDomainId(origin);

      const { transactionResponse } = await (
        await routingIsm.functions.set(domainId, ism).call()
      ).waitForResult();
      transactions.push(transactionResponse);
      this.logger.debug(
        `New ISM for origin ${origin} set for ${routingConfig.address}`,
      );
    }

    const knownUnenrolls = intersection(
      knownChains,
      new Set(domainsToUnenroll),
    );

    // Unenroll domains
    for (const origin of knownUnenrolls) {
      const domainId = multiProtocolProvider.getDomainId(origin);

      const { transactionResponse } = await (
        await routingIsm.functions.remove(domainId).call()
      ).waitForResult();

      transactions.push(transactionResponse);

      this.logger.debug(
        `Origin ${origin} unenrolled from preexisting routing ISM at ${routingConfig.address}`,
      );
    }

    return transactions;
  }

  static async transferIsmOwnership(
    signer: WalletUnlocked,
    currentConfig: DomainRoutingIsmConfig,
    targetConfig: DomainRoutingIsmConfig,
  ): Promise<TransactionResponse[]> {
    if (currentConfig.owner === targetConfig.owner) return [];
    this.logger.debug(
      `Transferring ownership of ISM from ${currentConfig.owner} to ${targetConfig.owner}`,
    );
    const routingConfig = RoutingIsmConfigSchema.parse(
      currentConfig,
    ) as WithAddress<DomainRoutingIsmConfig>;

    const { transactionResponse } = await (
      await new DomainRoutingIsm(routingConfig.address, signer).functions
        .transfer_ownership({ Address: { bits: targetConfig.owner } })
        .call()
    ).waitForResult();

    return [transactionResponse];
  }
}
