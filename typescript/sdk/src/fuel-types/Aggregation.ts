import { Interface, Contract as __Contract } from 'fuels';
import type {
  Account,
  Address,
  BN,
  Bytes,
  FunctionFragment,
  InvokeFunction,
  Provider,
  StorageSlot,
} from 'fuels';

import type { Enum, Vec } from './common.js';

export enum AggregationHookErrorInput {
  UnexpectedInitAddress = 'UnexpectedInitAddress',
}
export enum AggregationHookErrorOutput {
  UnexpectedInitAddress = 'UnexpectedInitAddress',
}
export type IdentityInput = Enum<{
  Address: AddressInput;
  ContractId: ContractIdInput;
}>;
export type IdentityOutput = Enum<{
  Address: AddressOutput;
  ContractId: ContractIdOutput;
}>;
export enum InitializationErrorInput {
  CannotReinitialized = 'CannotReinitialized',
}
export enum InitializationErrorOutput {
  CannotReinitialized = 'CannotReinitialized',
}
export enum PostDispatchHookErrorInput {
  InvalidMetadata = 'InvalidMetadata',
}
export enum PostDispatchHookErrorOutput {
  InvalidMetadata = 'InvalidMetadata',
}
export enum PostDispatchHookTypeInput {
  UNUSED = 'UNUSED',
  ROUTING = 'ROUTING',
  AGGREGATION = 'AGGREGATION',
  MERKLE_TREE = 'MERKLE_TREE',
  INTERCHAIN_GAS_PAYMASTER = 'INTERCHAIN_GAS_PAYMASTER',
  FALLBACK_ROUTING = 'FALLBACK_ROUTING',
  ID_AUTH_ISM = 'ID_AUTH_ISM',
  PAUSABLE = 'PAUSABLE',
  PROTOCOL_FEE = 'PROTOCOL_FEE',
  LAYER_ZERO_V1 = 'LAYER_ZERO_V1',
  RATE_LIMITED_HOOK = 'RATE_LIMITED_HOOK',
}
export enum PostDispatchHookTypeOutput {
  UNUSED = 'UNUSED',
  ROUTING = 'ROUTING',
  AGGREGATION = 'AGGREGATION',
  MERKLE_TREE = 'MERKLE_TREE',
  INTERCHAIN_GAS_PAYMASTER = 'INTERCHAIN_GAS_PAYMASTER',
  FALLBACK_ROUTING = 'FALLBACK_ROUTING',
  ID_AUTH_ISM = 'ID_AUTH_ISM',
  PAUSABLE = 'PAUSABLE',
  PROTOCOL_FEE = 'PROTOCOL_FEE',
  LAYER_ZERO_V1 = 'LAYER_ZERO_V1',
  RATE_LIMITED_HOOK = 'RATE_LIMITED_HOOK',
}

export type AddressInput = { bits: string };
export type AddressOutput = AddressInput;
export type ContractIdInput = { bits: string };
export type ContractIdOutput = ContractIdInput;
export type OwnershipSetInput = { new_owner: IdentityInput };
export type OwnershipSetOutput = { new_owner: IdentityOutput };

export type AggregationConfigurables = Partial<{
  EXPECTED_INITIALIZER: string;
}>;

const abi = {
  programType: 'contract',
  specVersion: '1',
  encodingVersion: '1',
  concreteTypes: [
    {
      type: '()',
      concreteTypeId:
        '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
    },
    {
      type: 'b256',
      concreteTypeId:
        '7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b',
    },
    {
      type: 'bool',
      concreteTypeId:
        'b760f44fa5965c2474a3b471467a22c43185152129295af588b022ae50b50903',
    },
    {
      type: 'enum interfaces::hooks::aggregation_hook::AggregationHookError',
      concreteTypeId:
        '7eb38c2ef772b33e257058c6f54290b49d43b82a099e7f8046e000a92c5cd322',
      metadataTypeId: 0,
    },
    {
      type: 'enum interfaces::hooks::post_dispatch_hook::PostDispatchHookError',
      concreteTypeId:
        '4611e5d60fe9a7d989bf9886547dd0f25bc5ff2716b968c5b5465bfced99c6ab',
      metadataTypeId: 1,
    },
    {
      type: 'enum interfaces::hooks::post_dispatch_hook::PostDispatchHookType',
      concreteTypeId:
        '88d5bf06eca6ec129b0c98e6d67271d9012ccd96caf9fe498d5dd2d191db9428',
      metadataTypeId: 2,
    },
    {
      type: 'enum std::identity::Identity',
      concreteTypeId:
        'ab7cd04e05be58e3fc15d424c2c4a57f824a2a2d97d67252440a3925ebdc1335',
      metadataTypeId: 3,
    },
    {
      type: 'enum sway_libs::ownership::errors::InitializationError',
      concreteTypeId:
        '1dfe7feadc1d9667a4351761230f948744068a090fe91b1bc6763a90ed5d3893',
      metadataTypeId: 4,
    },
    {
      type: 'struct std::bytes::Bytes',
      concreteTypeId:
        'cdd87b7d12fe505416570c294c884bca819364863efe3bf539245fa18515fbbb',
      metadataTypeId: 8,
    },
    {
      type: 'struct std::contract_id::ContractId',
      concreteTypeId:
        '29c10735d33b5159f0c71ee1dbd17b36a3e69e41f00fab0d42e1bd9f428d8a54',
      metadataTypeId: 10,
    },
    {
      type: 'struct std::vec::Vec<struct std::contract_id::ContractId>',
      concreteTypeId:
        'b8ca7626a08e8fb93379b5d9d58d8a12eede8de9f087bfa21feccca44f92e211',
      metadataTypeId: 12,
      typeArguments: [
        '29c10735d33b5159f0c71ee1dbd17b36a3e69e41f00fab0d42e1bd9f428d8a54',
      ],
    },
    {
      type: 'struct sway_libs::ownership::events::OwnershipSet',
      concreteTypeId:
        'e1ef35033ea9d2956f17c3292dea4a46ce7d61fdf37bbebe03b7b965073f43b5',
      metadataTypeId: 13,
    },
    {
      type: 'u64',
      concreteTypeId:
        '1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0',
    },
  ],
  metadataTypes: [
    {
      type: 'enum interfaces::hooks::aggregation_hook::AggregationHookError',
      metadataTypeId: 0,
      components: [
        {
          name: 'UnexpectedInitAddress',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
      ],
    },
    {
      type: 'enum interfaces::hooks::post_dispatch_hook::PostDispatchHookError',
      metadataTypeId: 1,
      components: [
        {
          name: 'InvalidMetadata',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
      ],
    },
    {
      type: 'enum interfaces::hooks::post_dispatch_hook::PostDispatchHookType',
      metadataTypeId: 2,
      components: [
        {
          name: 'UNUSED',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
        {
          name: 'ROUTING',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
        {
          name: 'AGGREGATION',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
        {
          name: 'MERKLE_TREE',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
        {
          name: 'INTERCHAIN_GAS_PAYMASTER',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
        {
          name: 'FALLBACK_ROUTING',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
        {
          name: 'ID_AUTH_ISM',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
        {
          name: 'PAUSABLE',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
        {
          name: 'PROTOCOL_FEE',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
        {
          name: 'LAYER_ZERO_V1',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
        {
          name: 'RATE_LIMITED_HOOK',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
      ],
    },
    {
      type: 'enum std::identity::Identity',
      metadataTypeId: 3,
      components: [
        {
          name: 'Address',
          typeId: 7,
        },
        {
          name: 'ContractId',
          typeId: 10,
        },
      ],
    },
    {
      type: 'enum sway_libs::ownership::errors::InitializationError',
      metadataTypeId: 4,
      components: [
        {
          name: 'CannotReinitialized',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
      ],
    },
    {
      type: 'generic T',
      metadataTypeId: 5,
    },
    {
      type: 'raw untyped ptr',
      metadataTypeId: 6,
    },
    {
      type: 'struct std::address::Address',
      metadataTypeId: 7,
      components: [
        {
          name: 'bits',
          typeId:
            '7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b',
        },
      ],
    },
    {
      type: 'struct std::bytes::Bytes',
      metadataTypeId: 8,
      components: [
        {
          name: 'buf',
          typeId: 9,
        },
        {
          name: 'len',
          typeId:
            '1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0',
        },
      ],
    },
    {
      type: 'struct std::bytes::RawBytes',
      metadataTypeId: 9,
      components: [
        {
          name: 'ptr',
          typeId: 6,
        },
        {
          name: 'cap',
          typeId:
            '1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0',
        },
      ],
    },
    {
      type: 'struct std::contract_id::ContractId',
      metadataTypeId: 10,
      components: [
        {
          name: 'bits',
          typeId:
            '7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b',
        },
      ],
    },
    {
      type: 'struct std::vec::RawVec',
      metadataTypeId: 11,
      components: [
        {
          name: 'ptr',
          typeId: 6,
        },
        {
          name: 'cap',
          typeId:
            '1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0',
        },
      ],
      typeParameters: [5],
    },
    {
      type: 'struct std::vec::Vec',
      metadataTypeId: 12,
      components: [
        {
          name: 'buf',
          typeId: 11,
          typeArguments: [
            {
              name: '',
              typeId: 5,
            },
          ],
        },
        {
          name: 'len',
          typeId:
            '1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0',
        },
      ],
      typeParameters: [5],
    },
    {
      type: 'struct sway_libs::ownership::events::OwnershipSet',
      metadataTypeId: 13,
      components: [
        {
          name: 'new_owner',
          typeId: 3,
        },
      ],
    },
  ],
  functions: [
    {
      inputs: [],
      name: 'get_hooks',
      output:
        'b8ca7626a08e8fb93379b5d9d58d8a12eede8de9f087bfa21feccca44f92e211',
      attributes: [
        {
          name: 'doc-comment',
          arguments: [' Returns the hooks.'],
        },
        {
          name: 'doc-comment',
          arguments: [''],
        },
        {
          name: 'doc-comment',
          arguments: [' ### Returns'],
        },
        {
          name: 'doc-comment',
          arguments: [''],
        },
        {
          name: 'doc-comment',
          arguments: [' * `hooks`: [Vec<ContractId>] - The hooks.'],
        },
        {
          name: 'storage',
          arguments: ['read'],
        },
      ],
    },
    {
      inputs: [
        {
          name: 'owner',
          concreteTypeId:
            'ab7cd04e05be58e3fc15d424c2c4a57f824a2a2d97d67252440a3925ebdc1335',
        },
        {
          name: 'hooks',
          concreteTypeId:
            'b8ca7626a08e8fb93379b5d9d58d8a12eede8de9f087bfa21feccca44f92e211',
        },
      ],
      name: 'initialize',
      output:
        '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
      attributes: [
        {
          name: 'doc-comment',
          arguments: [' Initializes the AggregationHook contract.'],
        },
        {
          name: 'doc-comment',
          arguments: [''],
        },
        {
          name: 'doc-comment',
          arguments: [' ### Arguments'],
        },
        {
          name: 'doc-comment',
          arguments: [''],
        },
        {
          name: 'doc-comment',
          arguments: [' * `owner`: [Identity] - The owner of the contract.'],
        },
        {
          name: 'doc-comment',
          arguments: [
            ' * `hooks`: [Vec<ContractId>] - The hooks to initialize with.',
          ],
        },
        {
          name: 'doc-comment',
          arguments: [''],
        },
        {
          name: 'doc-comment',
          arguments: [' ### Reverts'],
        },
        {
          name: 'doc-comment',
          arguments: [''],
        },
        {
          name: 'doc-comment',
          arguments: [' * If the contract is already initialized.'],
        },
        {
          name: 'storage',
          arguments: ['write'],
        },
      ],
    },
    {
      inputs: [],
      name: 'hook_type',
      output:
        '88d5bf06eca6ec129b0c98e6d67271d9012ccd96caf9fe498d5dd2d191db9428',
      attributes: [
        {
          name: 'doc-comment',
          arguments: [' Returns an enum that represents the type of hook'],
        },
        {
          name: 'doc-comment',
          arguments: [''],
        },
        {
          name: 'doc-comment',
          arguments: [' ### Returns'],
        },
        {
          name: 'doc-comment',
          arguments: [''],
        },
        {
          name: 'doc-comment',
          arguments: [' * [PostDispatchHookType] - The type of the hook.'],
        },
      ],
    },
    {
      inputs: [
        {
          name: 'metadata',
          concreteTypeId:
            'cdd87b7d12fe505416570c294c884bca819364863efe3bf539245fa18515fbbb',
        },
        {
          name: 'message',
          concreteTypeId:
            'cdd87b7d12fe505416570c294c884bca819364863efe3bf539245fa18515fbbb',
        },
      ],
      name: 'post_dispatch',
      output:
        '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
      attributes: [
        {
          name: 'doc-comment',
          arguments: [' Executes the postDispatch call on all hooks'],
        },
        {
          name: 'doc-comment',
          arguments: [''],
        },
        {
          name: 'doc-comment',
          arguments: [' ### Arguments'],
        },
        {
          name: 'doc-comment',
          arguments: [''],
        },
        {
          name: 'doc-comment',
          arguments: [
            ' * `metadata`: [Bytes] - The metadata required for the hook.',
          ],
        },
        {
          name: 'doc-comment',
          arguments: [' * `message`: [Bytes] - The message being dispatched.'],
        },
        {
          name: 'payable',
          arguments: [],
        },
        {
          name: 'storage',
          arguments: ['read', 'write'],
        },
      ],
    },
    {
      inputs: [
        {
          name: 'metadata',
          concreteTypeId:
            'cdd87b7d12fe505416570c294c884bca819364863efe3bf539245fa18515fbbb',
        },
        {
          name: 'message',
          concreteTypeId:
            'cdd87b7d12fe505416570c294c884bca819364863efe3bf539245fa18515fbbb',
        },
      ],
      name: 'quote_dispatch',
      output:
        '1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0',
      attributes: [
        {
          name: 'doc-comment',
          arguments: [' Compute the payment required by the postDispatch call'],
        },
        {
          name: 'doc-comment',
          arguments: [''],
        },
        {
          name: 'doc-comment',
          arguments: [' ### Arguments'],
        },
        {
          name: 'doc-comment',
          arguments: [''],
        },
        {
          name: 'doc-comment',
          arguments: [
            ' * `metadata`: [Bytes] - The metadata required for the hook.',
          ],
        },
        {
          name: 'doc-comment',
          arguments: [' * `message`: [Bytes] - The message being dispatched.'],
        },
        {
          name: 'doc-comment',
          arguments: [''],
        },
        {
          name: 'doc-comment',
          arguments: [' ### Returns'],
        },
        {
          name: 'doc-comment',
          arguments: [''],
        },
        {
          name: 'doc-comment',
          arguments: [
            ' * [u64] - The payment required for the postDispatch call.',
          ],
        },
        {
          name: 'storage',
          arguments: ['read'],
        },
      ],
    },
    {
      inputs: [
        {
          name: 'metadata',
          concreteTypeId:
            'cdd87b7d12fe505416570c294c884bca819364863efe3bf539245fa18515fbbb',
        },
      ],
      name: 'supports_metadata',
      output:
        'b760f44fa5965c2474a3b471467a22c43185152129295af588b022ae50b50903',
      attributes: [
        {
          name: 'doc-comment',
          arguments: [' Returns whether the hook supports metadata'],
        },
        {
          name: 'doc-comment',
          arguments: [''],
        },
        {
          name: 'doc-comment',
          arguments: [' ### Arguments'],
        },
        {
          name: 'doc-comment',
          arguments: [''],
        },
        {
          name: 'doc-comment',
          arguments: [' * `metadata`: [Bytes] - The metadata to be checked.'],
        },
        {
          name: 'doc-comment',
          arguments: [''],
        },
        {
          name: 'doc-comment',
          arguments: [' ### Returns'],
        },
        {
          name: 'doc-comment',
          arguments: [''],
        },
        {
          name: 'doc-comment',
          arguments: [' * [bool] - Whether the hook supports the metadata.'],
        },
      ],
    },
  ],
  loggedTypes: [
    {
      logId: '9129795002958000958',
      concreteTypeId:
        '7eb38c2ef772b33e257058c6f54290b49d43b82a099e7f8046e000a92c5cd322',
    },
    {
      logId: '2161305517876418151',
      concreteTypeId:
        '1dfe7feadc1d9667a4351761230f948744068a090fe91b1bc6763a90ed5d3893',
    },
    {
      logId: '16280289466020123285',
      concreteTypeId:
        'e1ef35033ea9d2956f17c3292dea4a46ce7d61fdf37bbebe03b7b965073f43b5',
    },
    {
      logId: '5049069364811769817',
      concreteTypeId:
        '4611e5d60fe9a7d989bf9886547dd0f25bc5ff2716b968c5b5465bfced99c6ab',
    },
  ],
  messagesTypes: [],
  configurables: [
    {
      name: 'EXPECTED_INITIALIZER',
      concreteTypeId:
        '7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b',
      offset: 26552,
    },
  ],
};

const storageSlots: StorageSlot[] = [];

export class AggregationInterface extends Interface {
  constructor() {
    super(abi);
  }

  declare functions: {
    get_hooks: FunctionFragment;
    initialize: FunctionFragment;
    hook_type: FunctionFragment;
    post_dispatch: FunctionFragment;
    quote_dispatch: FunctionFragment;
    supports_metadata: FunctionFragment;
  };
}

export class Aggregation extends __Contract {
  static readonly abi = abi;
  static readonly storageSlots = storageSlots;

  declare interface: AggregationInterface;
  declare functions: {
    get_hooks: InvokeFunction<[], Vec<ContractIdOutput>>;
    initialize: InvokeFunction<
      [owner: IdentityInput, hooks: Vec<ContractIdInput>],
      void
    >;
    hook_type: InvokeFunction<[], PostDispatchHookTypeOutput>;
    post_dispatch: InvokeFunction<[metadata: Bytes, message: Bytes], void>;
    quote_dispatch: InvokeFunction<[metadata: Bytes, message: Bytes], BN>;
    supports_metadata: InvokeFunction<[metadata: Bytes], boolean>;
  };

  constructor(id: string | Address, accountOrProvider: Account | Provider) {
    super(id, abi, accountOrProvider);
  }
}
