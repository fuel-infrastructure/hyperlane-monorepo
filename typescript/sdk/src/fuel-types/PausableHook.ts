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

import type { Enum } from './common.js';

export enum AccessErrorInput {
  NotOwner = 'NotOwner',
}
export enum AccessErrorOutput {
  NotOwner = 'NotOwner',
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
export enum OwnableErrorInput {
  UnexpectedOwner = 'UnexpectedOwner',
}
export enum OwnableErrorOutput {
  UnexpectedOwner = 'UnexpectedOwner',
}
export enum PauseErrorInput {
  Paused = 'Paused',
  NotPaused = 'NotPaused',
}
export enum PauseErrorOutput {
  Paused = 'Paused',
  NotPaused = 'NotPaused',
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
export type StateInput = Enum<{
  Uninitialized: undefined;
  Initialized: IdentityInput;
  Revoked: undefined;
}>;
export type StateOutput = Enum<{
  Uninitialized: void;
  Initialized: IdentityOutput;
  Revoked: void;
}>;

export type AddressInput = { bits: string };
export type AddressOutput = AddressInput;
export type ContractIdInput = { bits: string };
export type ContractIdOutput = ContractIdInput;
export type OwnershipRenouncedInput = { previous_owner: IdentityInput };
export type OwnershipRenouncedOutput = { previous_owner: IdentityOutput };
export type OwnershipSetInput = { new_owner: IdentityInput };
export type OwnershipSetOutput = { new_owner: IdentityOutput };
export type OwnershipTransferredInput = {
  new_owner: IdentityInput;
  previous_owner: IdentityInput;
};
export type OwnershipTransferredOutput = {
  new_owner: IdentityOutput;
  previous_owner: IdentityOutput;
};

export type PausableHookConfigurables = Partial<{
  EXPECTED_OWNER: string;
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
      type: 'enum interfaces::hooks::post_dispatch_hook::PostDispatchHookType',
      concreteTypeId:
        '88d5bf06eca6ec129b0c98e6d67271d9012ccd96caf9fe498d5dd2d191db9428',
      metadataTypeId: 0,
    },
    {
      type: 'enum interfaces::ownable::OwnableError',
      concreteTypeId:
        'ac647a25698ba2dd70e3c533f7c5c93860fb5f7610fb4b4067be084e822f2c90',
      metadataTypeId: 1,
    },
    {
      type: 'enum standards::src5::AccessError',
      concreteTypeId:
        '3f702ea3351c9c1ece2b84048006c8034a24cbc2bad2e740d0412b4172951d3d',
      metadataTypeId: 2,
    },
    {
      type: 'enum standards::src5::State',
      concreteTypeId:
        '192bc7098e2fe60635a9918afb563e4e5419d386da2bdbf0d716b4bc8549802c',
      metadataTypeId: 3,
    },
    {
      type: 'enum std::identity::Identity',
      concreteTypeId:
        'ab7cd04e05be58e3fc15d424c2c4a57f824a2a2d97d67252440a3925ebdc1335',
      metadataTypeId: 4,
    },
    {
      type: 'enum sway_libs::ownership::errors::InitializationError',
      concreteTypeId:
        '1dfe7feadc1d9667a4351761230f948744068a090fe91b1bc6763a90ed5d3893',
      metadataTypeId: 5,
    },
    {
      type: 'enum sway_libs::pausable::errors::PauseError',
      concreteTypeId:
        '8b3afcadf894415a10b09fc3717487e33802c8ffbb030edafe84ca4a71b280bc',
      metadataTypeId: 6,
    },
    {
      type: 'struct std::bytes::Bytes',
      concreteTypeId:
        'cdd87b7d12fe505416570c294c884bca819364863efe3bf539245fa18515fbbb',
      metadataTypeId: 9,
    },
    {
      type: 'struct sway_libs::ownership::events::OwnershipRenounced',
      concreteTypeId:
        '43c4fa7b3297401afbf300127e59ea913e5c8f0c7ae69abbec789ab0bb872bed',
      metadataTypeId: 12,
    },
    {
      type: 'struct sway_libs::ownership::events::OwnershipSet',
      concreteTypeId:
        'e1ef35033ea9d2956f17c3292dea4a46ce7d61fdf37bbebe03b7b965073f43b5',
      metadataTypeId: 13,
    },
    {
      type: 'struct sway_libs::ownership::events::OwnershipTransferred',
      concreteTypeId:
        'b3fffbcb3158d7c010c31b194b60fb7857adb4ad61bdcf4b8b42958951d9f308',
      metadataTypeId: 14,
    },
    {
      type: 'u64',
      concreteTypeId:
        '1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0',
    },
  ],
  metadataTypes: [
    {
      type: 'enum interfaces::hooks::post_dispatch_hook::PostDispatchHookType',
      metadataTypeId: 0,
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
      type: 'enum interfaces::ownable::OwnableError',
      metadataTypeId: 1,
      components: [
        {
          name: 'UnexpectedOwner',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
      ],
    },
    {
      type: 'enum standards::src5::AccessError',
      metadataTypeId: 2,
      components: [
        {
          name: 'NotOwner',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
      ],
    },
    {
      type: 'enum standards::src5::State',
      metadataTypeId: 3,
      components: [
        {
          name: 'Uninitialized',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
        {
          name: 'Initialized',
          typeId: 4,
        },
        {
          name: 'Revoked',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
      ],
    },
    {
      type: 'enum std::identity::Identity',
      metadataTypeId: 4,
      components: [
        {
          name: 'Address',
          typeId: 8,
        },
        {
          name: 'ContractId',
          typeId: 11,
        },
      ],
    },
    {
      type: 'enum sway_libs::ownership::errors::InitializationError',
      metadataTypeId: 5,
      components: [
        {
          name: 'CannotReinitialized',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
      ],
    },
    {
      type: 'enum sway_libs::pausable::errors::PauseError',
      metadataTypeId: 6,
      components: [
        {
          name: 'Paused',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
        {
          name: 'NotPaused',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
      ],
    },
    {
      type: 'raw untyped ptr',
      metadataTypeId: 7,
    },
    {
      type: 'struct std::address::Address',
      metadataTypeId: 8,
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
      metadataTypeId: 9,
      components: [
        {
          name: 'buf',
          typeId: 10,
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
      metadataTypeId: 10,
      components: [
        {
          name: 'ptr',
          typeId: 7,
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
      metadataTypeId: 11,
      components: [
        {
          name: 'bits',
          typeId:
            '7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b',
        },
      ],
    },
    {
      type: 'struct sway_libs::ownership::events::OwnershipRenounced',
      metadataTypeId: 12,
      components: [
        {
          name: 'previous_owner',
          typeId: 4,
        },
      ],
    },
    {
      type: 'struct sway_libs::ownership::events::OwnershipSet',
      metadataTypeId: 13,
      components: [
        {
          name: 'new_owner',
          typeId: 4,
        },
      ],
    },
    {
      type: 'struct sway_libs::ownership::events::OwnershipTransferred',
      metadataTypeId: 14,
      components: [
        {
          name: 'new_owner',
          typeId: 4,
        },
        {
          name: 'previous_owner',
          typeId: 4,
        },
      ],
    },
  ],
  functions: [
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
          name: '_metadata',
          concreteTypeId:
            'cdd87b7d12fe505416570c294c884bca819364863efe3bf539245fa18515fbbb',
        },
        {
          name: '_message',
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
          arguments: [
            ' Post action after a message is dispatched via the Mailbox',
          ],
        },
        {
          name: 'doc-comment',
          arguments: [
            ' For the MerkleTreeHook, this function inserts the message ID into the MerkleTree.',
          ],
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
          arguments: [' * `message`: [Bytes] - The message to be processed.'],
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
          arguments: [' * If the contract is paused.'],
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
          name: '_metadata',
          concreteTypeId:
            'cdd87b7d12fe505416570c294c884bca819364863efe3bf539245fa18515fbbb',
        },
        {
          name: '_message',
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
          arguments: [' * `message`: [Bytes] - The message to be processed.'],
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
    {
      inputs: [],
      name: 'is_paused',
      output:
        'b760f44fa5965c2474a3b471467a22c43185152129295af588b022ae50b50903',
      attributes: [
        {
          name: 'storage',
          arguments: ['read'],
        },
      ],
    },
    {
      inputs: [],
      name: 'pause',
      output:
        '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
      attributes: [
        {
          name: 'storage',
          arguments: ['write'],
        },
      ],
    },
    {
      inputs: [],
      name: 'unpause',
      output:
        '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
      attributes: [
        {
          name: 'storage',
          arguments: ['write'],
        },
      ],
    },
    {
      inputs: [
        {
          name: 'new_owner',
          concreteTypeId:
            'ab7cd04e05be58e3fc15d424c2c4a57f824a2a2d97d67252440a3925ebdc1335',
        },
      ],
      name: 'initialize_ownership',
      output:
        '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
      attributes: [
        {
          name: 'storage',
          arguments: ['read', 'write'],
        },
      ],
    },
    {
      inputs: [],
      name: 'only_owner',
      output:
        '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
      attributes: [
        {
          name: 'storage',
          arguments: ['read'],
        },
      ],
    },
    {
      inputs: [],
      name: 'owner',
      output:
        '192bc7098e2fe60635a9918afb563e4e5419d386da2bdbf0d716b4bc8549802c',
      attributes: [
        {
          name: 'storage',
          arguments: ['read'],
        },
      ],
    },
    {
      inputs: [],
      name: 'renounce_ownership',
      output:
        '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
      attributes: [
        {
          name: 'storage',
          arguments: ['read', 'write'],
        },
      ],
    },
    {
      inputs: [
        {
          name: 'new_owner',
          concreteTypeId:
            'ab7cd04e05be58e3fc15d424c2c4a57f824a2a2d97d67252440a3925ebdc1335',
        },
      ],
      name: 'transfer_ownership',
      output:
        '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
      attributes: [
        {
          name: 'storage',
          arguments: ['write'],
        },
      ],
    },
  ],
  loggedTypes: [
    {
      logId: '10032608944051208538',
      concreteTypeId:
        '8b3afcadf894415a10b09fc3717487e33802c8ffbb030edafe84ca4a71b280bc',
    },
    {
      logId: '4571204900286667806',
      concreteTypeId:
        '3f702ea3351c9c1ece2b84048006c8034a24cbc2bad2e740d0412b4172951d3d',
    },
    {
      logId: '12422187973297808093',
      concreteTypeId:
        'ac647a25698ba2dd70e3c533f7c5c93860fb5f7610fb4b4067be084e822f2c90',
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
      logId: '4883303303013154842',
      concreteTypeId:
        '43c4fa7b3297401afbf300127e59ea913e5c8f0c7ae69abbec789ab0bb872bed',
    },
    {
      logId: '12970362301975156672',
      concreteTypeId:
        'b3fffbcb3158d7c010c31b194b60fb7857adb4ad61bdcf4b8b42958951d9f308',
    },
  ],
  messagesTypes: [],
  configurables: [
    {
      name: 'EXPECTED_OWNER',
      concreteTypeId:
        '7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b',
      offset: 20296,
    },
  ],
};

const storageSlots: StorageSlot[] = [];

export class PausableHookInterface extends Interface {
  constructor() {
    super(abi);
  }

  declare functions: {
    hook_type: FunctionFragment;
    post_dispatch: FunctionFragment;
    quote_dispatch: FunctionFragment;
    supports_metadata: FunctionFragment;
    is_paused: FunctionFragment;
    pause: FunctionFragment;
    unpause: FunctionFragment;
    initialize_ownership: FunctionFragment;
    only_owner: FunctionFragment;
    owner: FunctionFragment;
    renounce_ownership: FunctionFragment;
    transfer_ownership: FunctionFragment;
  };
}

export class PausableHook extends __Contract {
  static readonly abi = abi;
  static readonly storageSlots = storageSlots;

  declare interface: PausableHookInterface;
  declare functions: {
    hook_type: InvokeFunction<[], PostDispatchHookTypeOutput>;
    post_dispatch: InvokeFunction<[_metadata: Bytes, _message: Bytes], void>;
    quote_dispatch: InvokeFunction<[_metadata: Bytes, _message: Bytes], BN>;
    supports_metadata: InvokeFunction<[metadata: Bytes], boolean>;
    is_paused: InvokeFunction<[], boolean>;
    pause: InvokeFunction<[], void>;
    unpause: InvokeFunction<[], void>;
    initialize_ownership: InvokeFunction<[new_owner: IdentityInput], void>;
    only_owner: InvokeFunction<[], void>;
    owner: InvokeFunction<[], StateOutput>;
    renounce_ownership: InvokeFunction<[], void>;
    transfer_ownership: InvokeFunction<[new_owner: IdentityInput], void>;
  };

  constructor(id: string | Address, accountOrProvider: Account | Provider) {
    super(id, abi, accountOrProvider);
  }
}
