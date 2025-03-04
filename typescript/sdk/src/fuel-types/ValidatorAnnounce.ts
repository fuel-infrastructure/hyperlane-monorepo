import { Interface, Contract as __Contract } from 'fuels';
import type {
  Account,
  Address,
  BigNumberish,
  Bytes,
  EvmAddress,
  FunctionFragment,
  InvokeFunction,
  Provider,
  StdString,
  StorageSlot,
} from 'fuels';

import type { Vec } from './common.js';

export enum ValidatorAnnounceErrorInput {
  ValidatorNotSigner = 'ValidatorNotSigner',
  ReplayAnnouncement = 'ReplayAnnouncement',
}
export enum ValidatorAnnounceErrorOutput {
  ValidatorNotSigner = 'ValidatorNotSigner',
  ReplayAnnouncement = 'ReplayAnnouncement',
}

export type ContractIdInput = { bits: string };
export type ContractIdOutput = ContractIdInput;
export type ValidatorAnnouncementEventInput = {
  validator: EvmAddress;
  storage_location: StdString;
};
export type ValidatorAnnouncementEventOutput = ValidatorAnnouncementEventInput;

export type ValidatorAnnounceConfigurables = Partial<{
  LOCAL_DOMAIN: BigNumberish;
  MAILBOX_ID: ContractIdInput;
}>;

const abi = {
  programType: 'contract',
  specVersion: '1',
  encodingVersion: '1',
  concreteTypes: [
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
      type: 'enum interfaces::va::ValidatorAnnounceError',
      concreteTypeId:
        'ec76592f2dcf24ec6527242afd8946282ac000fffe21a0ed75a797cbf460a556',
      metadataTypeId: 1,
    },
    {
      type: 'struct interfaces::va::ValidatorAnnouncementEvent',
      concreteTypeId:
        'd99160a54786c91aa3bfabca957c17df96dbae05a4c79f958b3da89ddc751fbf',
      metadataTypeId: 4,
    },
    {
      type: 'struct std::bytes::Bytes',
      concreteTypeId:
        'cdd87b7d12fe505416570c294c884bca819364863efe3bf539245fa18515fbbb',
      metadataTypeId: 5,
    },
    {
      type: 'struct std::contract_id::ContractId',
      concreteTypeId:
        '29c10735d33b5159f0c71ee1dbd17b36a3e69e41f00fab0d42e1bd9f428d8a54',
      metadataTypeId: 7,
    },
    {
      type: 'struct std::string::String',
      concreteTypeId:
        '9a7f1d3e963c10e0a4ea70a8e20a4813d1dc5682e28f74cb102ae50d32f7f98c',
      metadataTypeId: 8,
    },
    {
      type: 'struct std::vec::Vec<b256>',
      concreteTypeId:
        '32559685d0c9845f059bf9d472a0a38cf77d36c23dfcffe5489e86a65cdd9198',
      metadataTypeId: 10,
      typeArguments: [
        '7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b',
      ],
    },
    {
      type: 'struct std::vec::Vec<struct std::string::String>',
      concreteTypeId:
        '44fe2320bc65785fc0e617cb83e9eed432430acbf1a3999783a15982b84237e8',
      metadataTypeId: 10,
      typeArguments: [
        '9a7f1d3e963c10e0a4ea70a8e20a4813d1dc5682e28f74cb102ae50d32f7f98c',
      ],
    },
    {
      type: 'struct std::vec::Vec<struct std::vec::Vec<struct std::string::String>>',
      concreteTypeId:
        '356056ebd0caea5064f10ead20d08a92ad675e09e3fa875f9d632a675fdea875',
      metadataTypeId: 10,
      typeArguments: [
        '44fe2320bc65785fc0e617cb83e9eed432430acbf1a3999783a15982b84237e8',
      ],
    },
    {
      type: 'struct std::vm::evm::evm_address::EvmAddress',
      concreteTypeId:
        '05a44d8c3e00faf7ed545823b7a2b32723545d8715d87a0ab3cf65904948e8d2',
      metadataTypeId: 11,
    },
    {
      type: 'u32',
      concreteTypeId:
        'd7649d428b9ff33d188ecbf38a7e4d8fd167fa01b2e10fe9a8f9308e52f1d7cc',
    },
  ],
  metadataTypes: [
    {
      type: '()',
      metadataTypeId: 0,
    },
    {
      type: 'enum interfaces::va::ValidatorAnnounceError',
      metadataTypeId: 1,
      components: [
        {
          name: 'ValidatorNotSigner',
          typeId: 0,
        },
        {
          name: 'ReplayAnnouncement',
          typeId: 0,
        },
      ],
    },
    {
      type: 'generic T',
      metadataTypeId: 2,
    },
    {
      type: 'raw untyped ptr',
      metadataTypeId: 3,
    },
    {
      type: 'struct interfaces::va::ValidatorAnnouncementEvent',
      metadataTypeId: 4,
      components: [
        {
          name: 'validator',
          typeId: 11,
        },
        {
          name: 'storage_location',
          typeId: 8,
        },
      ],
    },
    {
      type: 'struct std::bytes::Bytes',
      metadataTypeId: 5,
      components: [
        {
          name: 'buf',
          typeId: 6,
        },
        {
          name: 'len',
          typeId: 12,
        },
      ],
    },
    {
      type: 'struct std::bytes::RawBytes',
      metadataTypeId: 6,
      components: [
        {
          name: 'ptr',
          typeId: 3,
        },
        {
          name: 'cap',
          typeId: 12,
        },
      ],
    },
    {
      type: 'struct std::contract_id::ContractId',
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
      type: 'struct std::string::String',
      metadataTypeId: 8,
      components: [
        {
          name: 'bytes',
          typeId: 5,
        },
      ],
    },
    {
      type: 'struct std::vec::RawVec',
      metadataTypeId: 9,
      components: [
        {
          name: 'ptr',
          typeId: 3,
        },
        {
          name: 'cap',
          typeId: 12,
        },
      ],
      typeParameters: [2],
    },
    {
      type: 'struct std::vec::Vec',
      metadataTypeId: 10,
      components: [
        {
          name: 'buf',
          typeId: 9,
          typeArguments: [
            {
              name: '',
              typeId: 2,
            },
          ],
        },
        {
          name: 'len',
          typeId: 12,
        },
      ],
      typeParameters: [2],
    },
    {
      type: 'struct std::vm::evm::evm_address::EvmAddress',
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
      type: 'u64',
      metadataTypeId: 12,
    },
  ],
  functions: [
    {
      inputs: [
        {
          name: 'validator',
          concreteTypeId:
            '05a44d8c3e00faf7ed545823b7a2b32723545d8715d87a0ab3cf65904948e8d2',
        },
        {
          name: 'storage_location',
          concreteTypeId:
            '9a7f1d3e963c10e0a4ea70a8e20a4813d1dc5682e28f74cb102ae50d32f7f98c',
        },
        {
          name: 'signature',
          concreteTypeId:
            'cdd87b7d12fe505416570c294c884bca819364863efe3bf539245fa18515fbbb',
        },
      ],
      name: 'announce',
      output:
        'b760f44fa5965c2474a3b471467a22c43185152129295af588b022ae50b50903',
      attributes: [
        {
          name: 'doc-comment',
          arguments: [' Announces a validator signature storage location    '],
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
          arguments: [' * `validator`: [b256] - The address of the validator'],
        },
        {
          name: 'doc-comment',
          arguments: [
            ' * `storage_location`: [string] - Information encoding the location of signed checkpoints',
          ],
        },
        {
          name: 'doc-comment',
          arguments: [
            ' * `signature`: [bytes] - The signed validator announcement',
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
          arguments: [' * [bool] - Whether the announcement was successful'],
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
          arguments: [' * If the announcement has already been made'],
        },
        {
          name: 'doc-comment',
          arguments: [
            ' * If the validator is not the signer of the announcement',
          ],
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
          name: 'validators',
          concreteTypeId:
            '32559685d0c9845f059bf9d472a0a38cf77d36c23dfcffe5489e86a65cdd9198',
        },
      ],
      name: 'get_announced_storage_locations',
      output:
        '356056ebd0caea5064f10ead20d08a92ad675e09e3fa875f9d632a675fdea875',
      attributes: [
        {
          name: 'doc-comment',
          arguments: [' Returns a list of all announced storage locations   '],
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
            ' * `validators`: [Vec<b256>] - The list of validators to get storage locations for',
          ],
        },
        {
          name: 'storage',
          arguments: ['read'],
        },
      ],
    },
    {
      inputs: [],
      name: 'get_announced_validators',
      output:
        '32559685d0c9845f059bf9d472a0a38cf77d36c23dfcffe5489e86a65cdd9198',
      attributes: [
        {
          name: 'doc-comment',
          arguments: [
            ' Returns a list of validators that have made announcements',
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
          arguments: [
            ' * [Vec<b256>] - The list of validators that have made announcements',
          ],
        },
        {
          name: 'storage',
          arguments: ['read'],
        },
      ],
    },
  ],
  loggedTypes: [
    {
      logId: '17038904299369735404',
      concreteTypeId:
        'ec76592f2dcf24ec6527242afd8946282ac000fffe21a0ed75a797cbf460a556',
    },
    {
      logId: '15677418040839293210',
      concreteTypeId:
        'd99160a54786c91aa3bfabca957c17df96dbae05a4c79f958b3da89ddc751fbf',
    },
  ],
  messagesTypes: [],
  configurables: [
    {
      name: 'LOCAL_DOMAIN',
      concreteTypeId:
        'd7649d428b9ff33d188ecbf38a7e4d8fd167fa01b2e10fe9a8f9308e52f1d7cc',
      offset: 33848,
    },
    {
      name: 'MAILBOX_ID',
      concreteTypeId:
        '29c10735d33b5159f0c71ee1dbd17b36a3e69e41f00fab0d42e1bd9f428d8a54',
      offset: 33856,
    },
  ],
};

const storageSlots: StorageSlot[] = [];

export class ValidatorAnnounceInterface extends Interface {
  constructor() {
    super(abi);
  }

  declare functions: {
    announce: FunctionFragment;
    get_announced_storage_locations: FunctionFragment;
    get_announced_validators: FunctionFragment;
  };
}

export class ValidatorAnnounce extends __Contract {
  static readonly abi = abi;
  static readonly storageSlots = storageSlots;

  declare interface: ValidatorAnnounceInterface;
  declare functions: {
    announce: InvokeFunction<
      [validator: EvmAddress, storage_location: StdString, signature: Bytes],
      boolean
    >;
    get_announced_storage_locations: InvokeFunction<
      [validators: Vec<string>],
      Vec<Vec<StdString>>
    >;
    get_announced_validators: InvokeFunction<[], Vec<string>>;
  };

  constructor(id: string | Address, accountOrProvider: Account | Provider) {
    super(id, abi, accountOrProvider);
  }
}
