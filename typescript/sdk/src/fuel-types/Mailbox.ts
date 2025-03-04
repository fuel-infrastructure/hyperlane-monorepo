import { Interface, Contract as __Contract } from 'fuels';
import type {
  Account,
  Address,
  BN,
  BigNumberish,
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
export type MailboxErrorInput = Enum<{
  InvalidISMAddress: undefined;
  InvalidHookAddress: undefined;
  InvalidProtocolVersion: BigNumberish;
  UnexpectedDestination: BigNumberish;
  MessageAlreadyDelivered: undefined;
  MessageVerificationFailed: undefined;
  MessageTooLarge: BigNumberish;
}>;
export type MailboxErrorOutput = Enum<{
  InvalidISMAddress: void;
  InvalidHookAddress: void;
  InvalidProtocolVersion: number;
  UnexpectedDestination: number;
  MessageAlreadyDelivered: void;
  MessageVerificationFailed: void;
  MessageTooLarge: BN;
}>;
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
export enum ReentrancyErrorInput {
  NonReentrant = 'NonReentrant',
}
export enum ReentrancyErrorOutput {
  NonReentrant = 'NonReentrant',
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
export type DefaultHookSetEventInput = { module: ContractIdInput };
export type DefaultHookSetEventOutput = { module: ContractIdOutput };
export type DefaultIsmSetEventInput = { module: ContractIdInput };
export type DefaultIsmSetEventOutput = { module: ContractIdOutput };
export type DispatchEventInput = {
  sender: string;
  destination_domain: BigNumberish;
  recipient_address: string;
  message: EncodedMessageInput;
};
export type DispatchEventOutput = {
  sender: string;
  destination_domain: number;
  recipient_address: string;
  message: EncodedMessageOutput;
};
export type DispatchIdEventInput = { message_id: string };
export type DispatchIdEventOutput = DispatchIdEventInput;
export type EncodedMessageInput = { bytes: Bytes };
export type EncodedMessageOutput = EncodedMessageInput;
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
export type ProcessEventInput = {
  origin: BigNumberish;
  sender: string;
  recipient: string;
};
export type ProcessEventOutput = {
  origin: number;
  sender: string;
  recipient: string;
};
export type ProcessIdEventInput = { message_id: string };
export type ProcessIdEventOutput = ProcessIdEventInput;
export type RequiredHookSetEventInput = { module: ContractIdInput };
export type RequiredHookSetEventOutput = { module: ContractIdOutput };

export type MailboxConfigurables = Partial<{
  LOCAL_DOMAIN: BigNumberish;
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
      type: 'enum interfaces::mailbox::mailbox::MailboxError',
      concreteTypeId:
        '68180f8a59a30ee2f3461d64d15269bb1789948b3138b259046029f86c0b23a1',
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
      type: 'enum sway_libs::reentrancy::errors::ReentrancyError',
      concreteTypeId:
        '4d216c57b3357523323f59401c7355785b41bdf832f6e1106272186b94797038',
      metadataTypeId: 7,
    },
    {
      type: 'struct interfaces::mailbox::events::DefaultHookSetEvent',
      concreteTypeId:
        'f42f98beefff531713e86f8b0b1257193b6bd522d880b8c125e0396db2c24ee3',
      metadataTypeId: 9,
    },
    {
      type: 'struct interfaces::mailbox::events::DefaultIsmSetEvent',
      concreteTypeId:
        '8742fde87d84001c6590ba9c1448233175037fc3ef90b383fb6176ec01fda2ff',
      metadataTypeId: 10,
    },
    {
      type: 'struct interfaces::mailbox::events::DispatchEvent',
      concreteTypeId:
        'df0611b3b38657e8253e2c64c87af0b7082c972e9fbf22a0d61eff177cd5c71d',
      metadataTypeId: 11,
    },
    {
      type: 'struct interfaces::mailbox::events::DispatchIdEvent',
      concreteTypeId:
        'f4d83fa1c2e15e97430f0f61138ea404e6853cafd90da2b4609e2fa95d9e43c9',
      metadataTypeId: 12,
    },
    {
      type: 'struct interfaces::mailbox::events::ProcessEvent',
      concreteTypeId:
        '019ee4dbd8a5c577232b95d738e0bbcb2898c0417c9e0b05694284994582a199',
      metadataTypeId: 13,
    },
    {
      type: 'struct interfaces::mailbox::events::ProcessIdEvent',
      concreteTypeId:
        'e473e91ab8fc9b72d6833e3c5ffc45bff9a6da162b5dcec87a0fbd31858b6ee0',
      metadataTypeId: 14,
    },
    {
      type: 'struct interfaces::mailbox::events::RequiredHookSetEvent',
      concreteTypeId:
        'be7aa440073b70d771ca9ed0e1520ed742cf67643ad38de897637be76a2fe6ea',
      metadataTypeId: 15,
    },
    {
      type: 'struct std::bytes::Bytes',
      concreteTypeId:
        'cdd87b7d12fe505416570c294c884bca819364863efe3bf539245fa18515fbbb',
      metadataTypeId: 18,
    },
    {
      type: 'struct std::contract_id::ContractId',
      concreteTypeId:
        '29c10735d33b5159f0c71ee1dbd17b36a3e69e41f00fab0d42e1bd9f428d8a54',
      metadataTypeId: 20,
    },
    {
      type: 'struct sway_libs::ownership::events::OwnershipRenounced',
      concreteTypeId:
        '43c4fa7b3297401afbf300127e59ea913e5c8f0c7ae69abbec789ab0bb872bed',
      metadataTypeId: 21,
    },
    {
      type: 'struct sway_libs::ownership::events::OwnershipSet',
      concreteTypeId:
        'e1ef35033ea9d2956f17c3292dea4a46ce7d61fdf37bbebe03b7b965073f43b5',
      metadataTypeId: 22,
    },
    {
      type: 'struct sway_libs::ownership::events::OwnershipTransferred',
      concreteTypeId:
        'b3fffbcb3158d7c010c31b194b60fb7857adb4ad61bdcf4b8b42958951d9f308',
      metadataTypeId: 23,
    },
    {
      type: 'u32',
      concreteTypeId:
        'd7649d428b9ff33d188ecbf38a7e4d8fd167fa01b2e10fe9a8f9308e52f1d7cc',
    },
    {
      type: 'u64',
      concreteTypeId:
        '1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0',
    },
  ],
  metadataTypes: [
    {
      type: 'enum interfaces::mailbox::mailbox::MailboxError',
      metadataTypeId: 0,
      components: [
        {
          name: 'InvalidISMAddress',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
        {
          name: 'InvalidHookAddress',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
        {
          name: 'InvalidProtocolVersion',
          typeId: 24,
        },
        {
          name: 'UnexpectedDestination',
          typeId:
            'd7649d428b9ff33d188ecbf38a7e4d8fd167fa01b2e10fe9a8f9308e52f1d7cc',
        },
        {
          name: 'MessageAlreadyDelivered',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
        {
          name: 'MessageVerificationFailed',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
        {
          name: 'MessageTooLarge',
          typeId:
            '1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0',
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
          typeId: 17,
        },
        {
          name: 'ContractId',
          typeId: 20,
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
      type: 'enum sway_libs::reentrancy::errors::ReentrancyError',
      metadataTypeId: 7,
      components: [
        {
          name: 'NonReentrant',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
      ],
    },
    {
      type: 'raw untyped ptr',
      metadataTypeId: 8,
    },
    {
      type: 'struct interfaces::mailbox::events::DefaultHookSetEvent',
      metadataTypeId: 9,
      components: [
        {
          name: 'module',
          typeId: 20,
        },
      ],
    },
    {
      type: 'struct interfaces::mailbox::events::DefaultIsmSetEvent',
      metadataTypeId: 10,
      components: [
        {
          name: 'module',
          typeId: 20,
        },
      ],
    },
    {
      type: 'struct interfaces::mailbox::events::DispatchEvent',
      metadataTypeId: 11,
      components: [
        {
          name: 'sender',
          typeId:
            '7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b',
        },
        {
          name: 'destination_domain',
          typeId:
            'd7649d428b9ff33d188ecbf38a7e4d8fd167fa01b2e10fe9a8f9308e52f1d7cc',
        },
        {
          name: 'recipient_address',
          typeId:
            '7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b',
        },
        {
          name: 'message',
          typeId: 16,
        },
      ],
    },
    {
      type: 'struct interfaces::mailbox::events::DispatchIdEvent',
      metadataTypeId: 12,
      components: [
        {
          name: 'message_id',
          typeId:
            '7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b',
        },
      ],
    },
    {
      type: 'struct interfaces::mailbox::events::ProcessEvent',
      metadataTypeId: 13,
      components: [
        {
          name: 'origin',
          typeId:
            'd7649d428b9ff33d188ecbf38a7e4d8fd167fa01b2e10fe9a8f9308e52f1d7cc',
        },
        {
          name: 'sender',
          typeId:
            '7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b',
        },
        {
          name: 'recipient',
          typeId:
            '7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b',
        },
      ],
    },
    {
      type: 'struct interfaces::mailbox::events::ProcessIdEvent',
      metadataTypeId: 14,
      components: [
        {
          name: 'message_id',
          typeId:
            '7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b',
        },
      ],
    },
    {
      type: 'struct interfaces::mailbox::events::RequiredHookSetEvent',
      metadataTypeId: 15,
      components: [
        {
          name: 'module',
          typeId: 20,
        },
      ],
    },
    {
      type: 'struct message::EncodedMessage',
      metadataTypeId: 16,
      components: [
        {
          name: 'bytes',
          typeId: 18,
        },
      ],
    },
    {
      type: 'struct std::address::Address',
      metadataTypeId: 17,
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
      metadataTypeId: 18,
      components: [
        {
          name: 'buf',
          typeId: 19,
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
      metadataTypeId: 19,
      components: [
        {
          name: 'ptr',
          typeId: 8,
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
      metadataTypeId: 20,
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
      metadataTypeId: 21,
      components: [
        {
          name: 'previous_owner',
          typeId: 4,
        },
      ],
    },
    {
      type: 'struct sway_libs::ownership::events::OwnershipSet',
      metadataTypeId: 22,
      components: [
        {
          name: 'new_owner',
          typeId: 4,
        },
      ],
    },
    {
      type: 'struct sway_libs::ownership::events::OwnershipTransferred',
      metadataTypeId: 23,
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
    {
      type: 'u8',
      metadataTypeId: 24,
    },
  ],
  functions: [
    {
      inputs: [],
      name: 'default_hook',
      output:
        '29c10735d33b5159f0c71ee1dbd17b36a3e69e41f00fab0d42e1bd9f428d8a54',
      attributes: [
        {
          name: 'doc-comment',
          arguments: [' Gets the default hook used for message verification.'],
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
          arguments: [' * [ContractId] - Address implementing Hook interface.'],
        },
        {
          name: 'storage',
          arguments: ['read'],
        },
      ],
    },
    {
      inputs: [],
      name: 'default_ism',
      output:
        '29c10735d33b5159f0c71ee1dbd17b36a3e69e41f00fab0d42e1bd9f428d8a54',
      attributes: [
        {
          name: 'doc-comment',
          arguments: [' Gets the default ISM used for message verification.'],
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
          arguments: [' * [ContractId] - Address implementing ISM interface.'],
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
          name: 'message_id',
          concreteTypeId:
            '7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b',
        },
      ],
      name: 'delivered',
      output:
        'b760f44fa5965c2474a3b471467a22c43185152129295af588b022ae50b50903',
      attributes: [
        {
          name: 'doc-comment',
          arguments: [' Returns true if the message has been processed.'],
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
            ' * `message_id`: [b256] - The unique identifier of the message.',
          ],
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
          arguments: [' * [bool] - True if the message has been processed.'],
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
          name: 'destination_domain',
          concreteTypeId:
            'd7649d428b9ff33d188ecbf38a7e4d8fd167fa01b2e10fe9a8f9308e52f1d7cc',
        },
        {
          name: 'recipient_address',
          concreteTypeId:
            '7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b',
        },
        {
          name: 'message_body',
          concreteTypeId:
            'cdd87b7d12fe505416570c294c884bca819364863efe3bf539245fa18515fbbb',
        },
        {
          name: 'metadata',
          concreteTypeId:
            'cdd87b7d12fe505416570c294c884bca819364863efe3bf539245fa18515fbbb',
        },
        {
          name: 'hook',
          concreteTypeId:
            '29c10735d33b5159f0c71ee1dbd17b36a3e69e41f00fab0d42e1bd9f428d8a54',
        },
      ],
      name: 'dispatch',
      output:
        '7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b',
      attributes: [
        {
          name: 'doc-comment',
          arguments: [
            ' Dispatches a message to the destination domain and recipient.',
          ],
        },
        {
          name: 'doc-comment',
          arguments: [" Returns the message's ID."],
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
            ' * `destination_domain`: [u32] - The domain of the destination chain.',
          ],
        },
        {
          name: 'doc-comment',
          arguments: [
            ' * `recipient`: [b256] - Address of the recipient on the destination chain.',
          ],
        },
        {
          name: 'doc-comment',
          arguments: [
            ' * `message_body`: [Bytes] - Raw bytes content of the message body.',
          ],
        },
        {
          name: 'doc-comment',
          arguments: [
            ' * `metadata`: [Bytes] - Raw bytes content of the metadata.',
          ],
        },
        {
          name: 'doc-comment',
          arguments: [' * `hook`: [ContractId] - The hook contract Id.'],
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
          arguments: [' * [b256] - The ID of the dispatched message.'],
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
          arguments: [' * If the message body is too large.'],
        },
        {
          name: 'doc-comment',
          arguments: [' * If the contract is paused.'],
        },
        {
          name: 'doc-comment',
          arguments: [' * If reentrancy is detected.'],
        },
        {
          name: 'doc-comment',
          arguments: [' * If any external call fails.'],
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
          name: 'owner',
          concreteTypeId:
            'ab7cd04e05be58e3fc15d424c2c4a57f824a2a2d97d67252440a3925ebdc1335',
        },
        {
          name: 'default_ism',
          concreteTypeId:
            '7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b',
        },
        {
          name: 'default_hook',
          concreteTypeId:
            '7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b',
        },
        {
          name: 'required_hook',
          concreteTypeId:
            '7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b',
        },
      ],
      name: 'initialize',
      output:
        '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
      attributes: [
        {
          name: 'doc-comment',
          arguments: [' Initializes the contract.'],
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
            ' * `default_ism`: [b256] - The default ISM contract Id.',
          ],
        },
        {
          name: 'doc-comment',
          arguments: [
            ' * `default_hook`: [b256] - The default hook contract Id.',
          ],
        },
        {
          name: 'doc-comment',
          arguments: [
            ' * `required_hook`: [b256] - The required hook contract Id.',
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
      name: 'latest_dispatched_id',
      output:
        '7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b',
      attributes: [
        {
          name: 'doc-comment',
          arguments: [' Returns the ID of the last dispatched message.'],
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
          arguments: [' * [b256] - The ID of the last dispatched message.'],
        },
        {
          name: 'storage',
          arguments: ['read'],
        },
      ],
    },
    {
      inputs: [],
      name: 'local_domain',
      output:
        'd7649d428b9ff33d188ecbf38a7e4d8fd167fa01b2e10fe9a8f9308e52f1d7cc',
      attributes: [
        {
          name: 'doc-comment',
          arguments: [
            ' Gets the domain which is specified on contract initialization.',
          ],
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
          arguments: [' * [u32] - The domain of the contract.'],
        },
      ],
    },
    {
      inputs: [],
      name: 'nonce',
      output:
        'd7649d428b9ff33d188ecbf38a7e4d8fd167fa01b2e10fe9a8f9308e52f1d7cc',
      attributes: [
        {
          name: 'doc-comment',
          arguments: [
            ' Returns the number of inserted leaves (i.e. messages) in the merkle tree.',
          ],
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
          arguments: [' * [u32] - The number of leaves in the merkle tree.'],
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
        {
          name: 'message',
          concreteTypeId:
            'cdd87b7d12fe505416570c294c884bca819364863efe3bf539245fa18515fbbb',
        },
      ],
      name: 'process',
      output:
        '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
      attributes: [
        {
          name: 'doc-comment',
          arguments: [' Processes a message.'],
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
            ' * `metadata`: [Bytes] - The metadata for ISM verification.',
          ],
        },
        {
          name: 'doc-comment',
          arguments: [
            ' * `message`: [Bytes] - The message as emitted by dispatch.',
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
          arguments: [' * If the contract is paused.'],
        },
        {
          name: 'doc-comment',
          arguments: [' * If reentrancy is detected.'],
        },
        {
          name: 'doc-comment',
          arguments: [' * If the message has already been delivered.'],
        },
        {
          name: 'doc-comment',
          arguments: [" * If the message's protocol version is invalid."],
        },
        {
          name: 'doc-comment',
          arguments: [" * If the message's origin is invalid."],
        },
        {
          name: 'doc-comment',
          arguments: [" * If the message's verification fails."],
        },
        {
          name: 'doc-comment',
          arguments: [' * If any external call fails.'],
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
          name: 'destination_domain',
          concreteTypeId:
            'd7649d428b9ff33d188ecbf38a7e4d8fd167fa01b2e10fe9a8f9308e52f1d7cc',
        },
        {
          name: 'recipient_address',
          concreteTypeId:
            '7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b',
        },
        {
          name: 'message_body',
          concreteTypeId:
            'cdd87b7d12fe505416570c294c884bca819364863efe3bf539245fa18515fbbb',
        },
        {
          name: 'metadata',
          concreteTypeId:
            'cdd87b7d12fe505416570c294c884bca819364863efe3bf539245fa18515fbbb',
        },
        {
          name: 'hook',
          concreteTypeId:
            '29c10735d33b5159f0c71ee1dbd17b36a3e69e41f00fab0d42e1bd9f428d8a54',
        },
      ],
      name: 'quote_dispatch',
      output:
        '1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0',
      attributes: [
        {
          name: 'doc-comment',
          arguments: [' Quotes a price for dispatching a message'],
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
            ' * `destination_domain`: [u32] - The domain of the destination chain.',
          ],
        },
        {
          name: 'doc-comment',
          arguments: [
            ' * `recipient_address`: [b256] - Address of the recipient on the destination chain.',
          ],
        },
        {
          name: 'doc-comment',
          arguments: [
            ' * `message_body`: [Bytes] - Raw bytes content of the message body.',
          ],
        },
        {
          name: 'doc-comment',
          arguments: [
            ' * `metadata`: [Bytes] - Raw bytes content of the metadata.',
          ],
        },
        {
          name: 'doc-comment',
          arguments: [' * `hook`: [ContractId] - The hook contract Id.'],
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
          arguments: [' * [u64] - The price of the dispatch.'],
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
          arguments: [' * If any external call fails.'],
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
          name: 'recipient',
          concreteTypeId:
            '29c10735d33b5159f0c71ee1dbd17b36a3e69e41f00fab0d42e1bd9f428d8a54',
        },
      ],
      name: 'recipient_ism',
      output:
        '29c10735d33b5159f0c71ee1dbd17b36a3e69e41f00fab0d42e1bd9f428d8a54',
      attributes: [
        {
          name: 'doc-comment',
          arguments: [' Returns the ISM set by a recipient.'],
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
            " * `recipient`: [ContractId] - The recipient's contract Id.",
          ],
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
          arguments: [' * [ContractId] - The ISM contract Id.'],
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
          arguments: [' * If recipient call fails.'],
        },
        {
          name: 'storage',
          arguments: ['read'],
        },
      ],
    },
    {
      inputs: [],
      name: 'required_hook',
      output:
        '29c10735d33b5159f0c71ee1dbd17b36a3e69e41f00fab0d42e1bd9f428d8a54',
      attributes: [
        {
          name: 'doc-comment',
          arguments: [' Gets the required hook used for message verification.'],
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
          arguments: [' * [ContractId] - Address implementing Hook interface.'],
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
          name: 'module',
          concreteTypeId:
            '29c10735d33b5159f0c71ee1dbd17b36a3e69e41f00fab0d42e1bd9f428d8a54',
        },
      ],
      name: 'set_default_hook',
      output:
        '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
      attributes: [
        {
          name: 'doc-comment',
          arguments: [' Sets the required hook used for message verification.'],
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
            ' * `module`: [ContractId] - Address implementing Hook interface.',
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
          arguments: [' * If the caller is not the owner.'],
        },
        {
          name: 'doc-comment',
          arguments: [' * If the provided hook address is zero.'],
        },
        {
          name: 'storage',
          arguments: ['write'],
        },
      ],
    },
    {
      inputs: [
        {
          name: 'module',
          concreteTypeId:
            '29c10735d33b5159f0c71ee1dbd17b36a3e69e41f00fab0d42e1bd9f428d8a54',
        },
      ],
      name: 'set_default_ism',
      output:
        '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
      attributes: [
        {
          name: 'doc-comment',
          arguments: [' Sets the default ISM used for message verification.'],
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
            ' * `module`: [ContractId] - Address implementing ISM interface.',
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
          arguments: [' * If the caller is not the owner.'],
        },
        {
          name: 'doc-comment',
          arguments: [' * If the provided ISM address is zero.'],
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
          name: 'module',
          concreteTypeId:
            '29c10735d33b5159f0c71ee1dbd17b36a3e69e41f00fab0d42e1bd9f428d8a54',
        },
      ],
      name: 'set_required_hook',
      output:
        '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
      attributes: [
        {
          name: 'doc-comment',
          arguments: [' Sets the required hook used for message verification.'],
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
            ' * `module`: [ContractId] - Address implementing Hook interface.',
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
          arguments: [' * If the caller is not the owner.'],
        },
        {
          name: 'doc-comment',
          arguments: [' * If the provided hook address is zero.'],
        },
        {
          name: 'storage',
          arguments: ['write'],
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
      logId: '5557842539076482339',
      concreteTypeId:
        '4d216c57b3357523323f59401c7355785b41bdf832f6e1106272186b94797038',
    },
    {
      logId: '10032608944051208538',
      concreteTypeId:
        '8b3afcadf894415a10b09fc3717487e33802c8ffbb030edafe84ca4a71b280bc',
    },
    {
      logId: '7500762266269322978',
      concreteTypeId:
        '68180f8a59a30ee2f3461d64d15269bb1789948b3138b259046029f86c0b23a1',
    },
    {
      logId: '16070551783826937832',
      concreteTypeId:
        'df0611b3b38657e8253e2c64c87af0b7082c972e9fbf22a0d61eff177cd5c71d',
    },
    {
      logId: '17642921504215752343',
      concreteTypeId:
        'f4d83fa1c2e15e97430f0f61138ea404e6853cafd90da2b4609e2fa95d9e43c9',
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
      logId: '116782273241924983',
      concreteTypeId:
        '019ee4dbd8a5c577232b95d738e0bbcb2898c0417c9e0b05694284994582a199',
    },
    {
      logId: '16461757363951278962',
      concreteTypeId:
        'e473e91ab8fc9b72d6833e3c5ffc45bff9a6da162b5dcec87a0fbd31858b6ee0',
    },
    {
      logId: '4571204900286667806',
      concreteTypeId:
        '3f702ea3351c9c1ece2b84048006c8034a24cbc2bad2e740d0412b4172951d3d',
    },
    {
      logId: '17595450214997512983',
      concreteTypeId:
        'f42f98beefff531713e86f8b0b1257193b6bd522d880b8c125e0396db2c24ee3',
    },
    {
      logId: '9746631718563217436',
      concreteTypeId:
        '8742fde87d84001c6590ba9c1448233175037fc3ef90b383fb6176ec01fda2ff',
    },
    {
      logId: '13725463409271206103',
      concreteTypeId:
        'be7aa440073b70d771ca9ed0e1520ed742cf67643ad38de897637be76a2fe6ea',
    },
    {
      logId: '12422187973297808093',
      concreteTypeId:
        'ac647a25698ba2dd70e3c533f7c5c93860fb5f7610fb4b4067be084e822f2c90',
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
      name: 'LOCAL_DOMAIN',
      concreteTypeId:
        'd7649d428b9ff33d188ecbf38a7e4d8fd167fa01b2e10fe9a8f9308e52f1d7cc',
      offset: 52072,
    },
    {
      name: 'EXPECTED_OWNER',
      concreteTypeId:
        '7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b',
      offset: 52040,
    },
  ],
};

const storageSlots: StorageSlot[] = [
  {
    key: '1700cd11f570bb5b1d76513ec5299c3c4cbdf64c2f4a2e16382e169bba4ddb9a',
    value: '0000000000000000000000000000000000000000000000000000000000000000',
  },
  {
    key: '3b44831af663d4d8e4836aade5e534ff534f0dca87ed663466f10ff85c606671',
    value: '0000000000000000000000000000000000000000000000000000000000000000',
  },
  {
    key: '4d5263c1face7959369ed416164a203ede6156c87fe65b4666dbdd794ee8f0fa',
    value: '0000000000000000000000000000000000000000000000000000000000000000',
  },
  {
    key: '5185c8d9c061b8c01c97bd481311ea530482925d6a58a77f00a5851cee6b14fc',
    value: '0000000000000000000000000000000000000000000000000000000000000000',
  },
  {
    key: 'a60e9adf516f409644f459252238c42e9b7b4fb3e1869205afee182b3cb81ab4',
    value: '0000000000000000000000000000000000000000000000000000000000000000',
  },
];

export class MailboxInterface extends Interface {
  constructor() {
    super(abi);
  }

  declare functions: {
    default_hook: FunctionFragment;
    default_ism: FunctionFragment;
    delivered: FunctionFragment;
    dispatch: FunctionFragment;
    initialize: FunctionFragment;
    latest_dispatched_id: FunctionFragment;
    local_domain: FunctionFragment;
    nonce: FunctionFragment;
    process: FunctionFragment;
    quote_dispatch: FunctionFragment;
    recipient_ism: FunctionFragment;
    required_hook: FunctionFragment;
    set_default_hook: FunctionFragment;
    set_default_ism: FunctionFragment;
    set_required_hook: FunctionFragment;
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

export class Mailbox extends __Contract {
  static readonly abi = abi;
  static readonly storageSlots = storageSlots;

  declare interface: MailboxInterface;
  declare functions: {
    default_hook: InvokeFunction<[], ContractIdOutput>;
    default_ism: InvokeFunction<[], ContractIdOutput>;
    delivered: InvokeFunction<[message_id: string], boolean>;
    dispatch: InvokeFunction<
      [
        destination_domain: BigNumberish,
        recipient_address: string,
        message_body: Bytes,
        metadata: Bytes,
        hook: ContractIdInput,
      ],
      string
    >;
    initialize: InvokeFunction<
      [
        owner: IdentityInput,
        default_ism: string,
        default_hook: string,
        required_hook: string,
      ],
      void
    >;
    latest_dispatched_id: InvokeFunction<[], string>;
    local_domain: InvokeFunction<[], number>;
    nonce: InvokeFunction<[], number>;
    process: InvokeFunction<[metadata: Bytes, message: Bytes], void>;
    quote_dispatch: InvokeFunction<
      [
        destination_domain: BigNumberish,
        recipient_address: string,
        message_body: Bytes,
        metadata: Bytes,
        hook: ContractIdInput,
      ],
      BN
    >;
    recipient_ism: InvokeFunction<
      [recipient: ContractIdInput],
      ContractIdOutput
    >;
    required_hook: InvokeFunction<[], ContractIdOutput>;
    set_default_hook: InvokeFunction<[module: ContractIdInput], void>;
    set_default_ism: InvokeFunction<[module: ContractIdInput], void>;
    set_required_hook: InvokeFunction<[module: ContractIdInput], void>;
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
