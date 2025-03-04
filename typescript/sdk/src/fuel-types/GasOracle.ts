import { Interface, Contract as __Contract } from 'fuels';
import type {
  Account,
  Address,
  BN,
  BigNumberish,
  FunctionFragment,
  InvokeFunction,
  Provider,
  StorageSlot,
} from 'fuels';

import type { Enum, Vec } from './common.js';

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
export type ExchangeRateAndGasDataInput = {
  token_exchange_rate: U128Input;
  gas_price: U128Input;
};
export type ExchangeRateAndGasDataOutput = {
  token_exchange_rate: U128Output;
  gas_price: U128Output;
};
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
export type RemoteGasDataInput = {
  domain: BigNumberish;
  token_exchange_rate: U128Input;
  gas_price: U128Input;
  token_decimals: BigNumberish;
};
export type RemoteGasDataOutput = {
  domain: number;
  token_exchange_rate: U128Output;
  gas_price: U128Output;
  token_decimals: number;
};
export type RemoteGasDataConfigInput = {
  domain: BigNumberish;
  remote_gas_data: RemoteGasDataInput;
};
export type RemoteGasDataConfigOutput = {
  domain: number;
  remote_gas_data: RemoteGasDataOutput;
};
export type U128Input = { upper: BigNumberish; lower: BigNumberish };
export type U128Output = { upper: BN; lower: BN };

export type GasOracleConfigurables = Partial<{
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
      type: 'enum interfaces::ownable::OwnableError',
      concreteTypeId:
        'ac647a25698ba2dd70e3c533f7c5c93860fb5f7610fb4b4067be084e822f2c90',
      metadataTypeId: 0,
    },
    {
      type: 'enum standards::src5::AccessError',
      concreteTypeId:
        '3f702ea3351c9c1ece2b84048006c8034a24cbc2bad2e740d0412b4172951d3d',
      metadataTypeId: 1,
    },
    {
      type: 'enum standards::src5::State',
      concreteTypeId:
        '192bc7098e2fe60635a9918afb563e4e5419d386da2bdbf0d716b4bc8549802c',
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
      type: 'struct interfaces::hooks::gas_oracle::ExchangeRateAndGasData',
      concreteTypeId:
        '9b806e0ead09025957d6856cb508ef188a7c7e19a39b99110f44f905bf919e12',
      metadataTypeId: 7,
    },
    {
      type: 'struct interfaces::hooks::gas_oracle::RemoteGasData',
      concreteTypeId:
        '7b4c89ae67dd062b19fc7f4acf9b99d824182c6051d7c26c06be18c1de085595',
      metadataTypeId: 8,
    },
    {
      type: 'struct interfaces::hooks::gas_oracle::RemoteGasDataConfig',
      concreteTypeId:
        'f639e556b00763e80146327e7a56fdcace4646dbcf835e822f810dee15062f36',
      metadataTypeId: 9,
    },
    {
      type: 'struct std::vec::Vec<struct interfaces::hooks::gas_oracle::RemoteGasDataConfig>',
      concreteTypeId:
        'd837a2e1ca84a6b9b55fdd75d5470b44f16ac86bc0b45fc163ca38dbda7899e8',
      metadataTypeId: 14,
      typeArguments: [
        'f639e556b00763e80146327e7a56fdcace4646dbcf835e822f810dee15062f36',
      ],
    },
    {
      type: 'struct sway_libs::ownership::events::OwnershipRenounced',
      concreteTypeId:
        '43c4fa7b3297401afbf300127e59ea913e5c8f0c7ae69abbec789ab0bb872bed',
      metadataTypeId: 15,
    },
    {
      type: 'struct sway_libs::ownership::events::OwnershipSet',
      concreteTypeId:
        'e1ef35033ea9d2956f17c3292dea4a46ce7d61fdf37bbebe03b7b965073f43b5',
      metadataTypeId: 16,
    },
    {
      type: 'struct sway_libs::ownership::events::OwnershipTransferred',
      concreteTypeId:
        'b3fffbcb3158d7c010c31b194b60fb7857adb4ad61bdcf4b8b42958951d9f308',
      metadataTypeId: 17,
    },
    {
      type: 'u32',
      concreteTypeId:
        'd7649d428b9ff33d188ecbf38a7e4d8fd167fa01b2e10fe9a8f9308e52f1d7cc',
    },
  ],
  metadataTypes: [
    {
      type: 'enum interfaces::ownable::OwnableError',
      metadataTypeId: 0,
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
      metadataTypeId: 1,
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
      metadataTypeId: 2,
      components: [
        {
          name: 'Uninitialized',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
        {
          name: 'Initialized',
          typeId: 3,
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
      metadataTypeId: 3,
      components: [
        {
          name: 'Address',
          typeId: 10,
        },
        {
          name: 'ContractId',
          typeId: 11,
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
      type: 'struct interfaces::hooks::gas_oracle::ExchangeRateAndGasData',
      metadataTypeId: 7,
      components: [
        {
          name: 'token_exchange_rate',
          typeId: 12,
        },
        {
          name: 'gas_price',
          typeId: 12,
        },
      ],
    },
    {
      type: 'struct interfaces::hooks::gas_oracle::RemoteGasData',
      metadataTypeId: 8,
      components: [
        {
          name: 'domain',
          typeId:
            'd7649d428b9ff33d188ecbf38a7e4d8fd167fa01b2e10fe9a8f9308e52f1d7cc',
        },
        {
          name: 'token_exchange_rate',
          typeId: 12,
        },
        {
          name: 'gas_price',
          typeId: 12,
        },
        {
          name: 'token_decimals',
          typeId: 19,
        },
      ],
    },
    {
      type: 'struct interfaces::hooks::gas_oracle::RemoteGasDataConfig',
      metadataTypeId: 9,
      components: [
        {
          name: 'domain',
          typeId:
            'd7649d428b9ff33d188ecbf38a7e4d8fd167fa01b2e10fe9a8f9308e52f1d7cc',
        },
        {
          name: 'remote_gas_data',
          typeId: 8,
        },
      ],
    },
    {
      type: 'struct std::address::Address',
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
      type: 'struct std::u128::U128',
      metadataTypeId: 12,
      components: [
        {
          name: 'upper',
          typeId: 18,
        },
        {
          name: 'lower',
          typeId: 18,
        },
      ],
    },
    {
      type: 'struct std::vec::RawVec',
      metadataTypeId: 13,
      components: [
        {
          name: 'ptr',
          typeId: 6,
        },
        {
          name: 'cap',
          typeId: 18,
        },
      ],
      typeParameters: [5],
    },
    {
      type: 'struct std::vec::Vec',
      metadataTypeId: 14,
      components: [
        {
          name: 'buf',
          typeId: 13,
          typeArguments: [
            {
              name: '',
              typeId: 5,
            },
          ],
        },
        {
          name: 'len',
          typeId: 18,
        },
      ],
      typeParameters: [5],
    },
    {
      type: 'struct sway_libs::ownership::events::OwnershipRenounced',
      metadataTypeId: 15,
      components: [
        {
          name: 'previous_owner',
          typeId: 3,
        },
      ],
    },
    {
      type: 'struct sway_libs::ownership::events::OwnershipSet',
      metadataTypeId: 16,
      components: [
        {
          name: 'new_owner',
          typeId: 3,
        },
      ],
    },
    {
      type: 'struct sway_libs::ownership::events::OwnershipTransferred',
      metadataTypeId: 17,
      components: [
        {
          name: 'new_owner',
          typeId: 3,
        },
        {
          name: 'previous_owner',
          typeId: 3,
        },
      ],
    },
    {
      type: 'u64',
      metadataTypeId: 18,
    },
    {
      type: 'u8',
      metadataTypeId: 19,
    },
  ],
  functions: [
    {
      inputs: [
        {
          name: 'domain',
          concreteTypeId:
            'd7649d428b9ff33d188ecbf38a7e4d8fd167fa01b2e10fe9a8f9308e52f1d7cc',
        },
      ],
      name: 'get_exchange_rate_and_gas_price',
      output:
        '9b806e0ead09025957d6856cb508ef188a7c7e19a39b99110f44f905bf919e12',
      attributes: [
        {
          name: 'doc-comment',
          arguments: [
            ' Gets the token exchange rate and gas price for a given domain.',
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
            ' * `domain`: [u32] - The domain to get the gas data for.',
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
            ' * [ExchangeRateAndGasData] - The exchange rate and gas price for the remote domain.',
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
          name: 'domain',
          concreteTypeId:
            'd7649d428b9ff33d188ecbf38a7e4d8fd167fa01b2e10fe9a8f9308e52f1d7cc',
        },
      ],
      name: 'get_remote_gas_data',
      output:
        '7b4c89ae67dd062b19fc7f4acf9b99d824182c6051d7c26c06be18c1de085595',
      attributes: [
        {
          name: 'doc-comment',
          arguments: [' Gets the gas data from storage.'],
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
            ' * `domain`: [u32] - The domain to get the gas data for.',
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
            ' * [RemoteGasData] - The gas data for the remote domain.',
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
          name: 'configs',
          concreteTypeId:
            'd837a2e1ca84a6b9b55fdd75d5470b44f16ac86bc0b45fc163ca38dbda7899e8',
        },
      ],
      name: 'set_remote_gas_data_configs',
      output:
        '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
      attributes: [
        {
          name: 'doc-comment',
          arguments: [
            ' Sets the gas data for a given domain. Only callable by the owner.',
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
            ' * `configs`: [Vec]<[RemoteGasDataConfig]> - The remote gas data configs to set.',
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
      offset: 20240,
    },
  ],
};

const storageSlots: StorageSlot[] = [];

export class GasOracleInterface extends Interface {
  constructor() {
    super(abi);
  }

  declare functions: {
    get_exchange_rate_and_gas_price: FunctionFragment;
    get_remote_gas_data: FunctionFragment;
    set_remote_gas_data_configs: FunctionFragment;
    initialize_ownership: FunctionFragment;
    only_owner: FunctionFragment;
    owner: FunctionFragment;
    renounce_ownership: FunctionFragment;
    transfer_ownership: FunctionFragment;
  };
}

export class GasOracle extends __Contract {
  static readonly abi = abi;
  static readonly storageSlots = storageSlots;

  declare interface: GasOracleInterface;
  declare functions: {
    get_exchange_rate_and_gas_price: InvokeFunction<
      [domain: BigNumberish],
      ExchangeRateAndGasDataOutput
    >;
    get_remote_gas_data: InvokeFunction<
      [domain: BigNumberish],
      RemoteGasDataOutput
    >;
    set_remote_gas_data_configs: InvokeFunction<
      [configs: Vec<RemoteGasDataConfigInput>],
      void
    >;
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
