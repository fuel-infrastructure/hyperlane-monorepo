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

import type { Enum, Option, Vec } from './common.js';

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
export enum IgpErrorInput {
  InsufficientGasPayment = 'InsufficientGasPayment',
  InterchainGasPaymentInBaseAsset = 'InterchainGasPaymentInBaseAsset',
  UnsupportedMetadataFormat = 'UnsupportedMetadataFormat',
  InvalidDomainConfigLength = 'InvalidDomainConfigLength',
}
export enum IgpErrorOutput {
  InsufficientGasPayment = 'InsufficientGasPayment',
  InterchainGasPaymentInBaseAsset = 'InterchainGasPaymentInBaseAsset',
  UnsupportedMetadataFormat = 'UnsupportedMetadataFormat',
  InvalidDomainConfigLength = 'InvalidDomainConfigLength',
}
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
export type AssetIdInput = { bits: string };
export type AssetIdOutput = AssetIdInput;
export type BeneficiarySetEventInput = { beneficiary: IdentityInput };
export type BeneficiarySetEventOutput = { beneficiary: IdentityOutput };
export type ClaimEventInput = {
  beneficiary: IdentityInput;
  amount: BigNumberish;
};
export type ClaimEventOutput = { beneficiary: IdentityOutput; amount: BN };
export type ContractIdInput = { bits: string };
export type ContractIdOutput = ContractIdInput;
export type DestinationGasConfigSetEventInput = {
  domain: BigNumberish;
  oracle: string;
  overhead: BigNumberish;
};
export type DestinationGasConfigSetEventOutput = {
  domain: number;
  oracle: string;
  overhead: BN;
};
export type DomainGasConfigInput = {
  gas_oracle: string;
  gas_overhead: BigNumberish;
};
export type DomainGasConfigOutput = { gas_oracle: string; gas_overhead: BN };
export type GasOracleSetEventInput = {
  domain: BigNumberish;
  gas_oracle: string;
};
export type GasOracleSetEventOutput = { domain: number; gas_oracle: string };
export type GasPaymentEventInput = {
  message_id: string;
  destination_domain: BigNumberish;
  gas_amount: BigNumberish;
  payment: BigNumberish;
};
export type GasPaymentEventOutput = {
  message_id: string;
  destination_domain: number;
  gas_amount: BN;
  payment: BN;
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
export type U128Input = { upper: BigNumberish; lower: BigNumberish };
export type U128Output = { upper: BN; lower: BN };

export type GasPaymasterConfigurables = Partial<{
  BASE_ASSET_DECIMALS: BigNumberish;
  TOKEN_EXCHANGE_RATE_SCALE: BigNumberish;
  DEFAULT_GAS_AMOUNT: BigNumberish;
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
      type: 'enum interfaces::hooks::igp::IgpError',
      concreteTypeId:
        'e8ec08fc35b6312eaeca1be8ba0645b2eb1bf5656f53fed618eda7c184a7c6bc',
      metadataTypeId: 0,
    },
    {
      type: 'enum interfaces::hooks::post_dispatch_hook::PostDispatchHookType',
      concreteTypeId:
        '88d5bf06eca6ec129b0c98e6d67271d9012ccd96caf9fe498d5dd2d191db9428',
      metadataTypeId: 1,
    },
    {
      type: 'enum interfaces::ownable::OwnableError',
      concreteTypeId:
        'ac647a25698ba2dd70e3c533f7c5c93860fb5f7610fb4b4067be084e822f2c90',
      metadataTypeId: 2,
    },
    {
      type: 'enum standards::src5::AccessError',
      concreteTypeId:
        '3f702ea3351c9c1ece2b84048006c8034a24cbc2bad2e740d0412b4172951d3d',
      metadataTypeId: 3,
    },
    {
      type: 'enum standards::src5::State',
      concreteTypeId:
        '192bc7098e2fe60635a9918afb563e4e5419d386da2bdbf0d716b4bc8549802c',
      metadataTypeId: 4,
    },
    {
      type: 'enum std::identity::Identity',
      concreteTypeId:
        'ab7cd04e05be58e3fc15d424c2c4a57f824a2a2d97d67252440a3925ebdc1335',
      metadataTypeId: 5,
    },
    {
      type: 'enum std::option::Option<b256>',
      concreteTypeId:
        '0c2beb9013490c4f753f2757dfe2d8340b22ce3827d596d81d249b7038033cb6',
      metadataTypeId: 6,
      typeArguments: [
        '7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b',
      ],
    },
    {
      type: 'enum std::option::Option<struct std::asset_id::AssetId>',
      concreteTypeId:
        '191bf2140761b3c5ab6c43992d162bb3dc9d7f2272b2ee5f5eeea411ddedcd32',
      metadataTypeId: 6,
      typeArguments: [
        'c0710b6731b1dd59799cf6bef33eee3b3b04a2e40e80a0724090215bbf2ca974',
      ],
    },
    {
      type: 'enum std::option::Option<u64>',
      concreteTypeId:
        'd852149004cc9ec0bbe7dc4e37bffea1d41469b759512b6136f2e865a4c06e7d',
      metadataTypeId: 6,
      typeArguments: [
        '1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0',
      ],
    },
    {
      type: 'enum sway_libs::ownership::errors::InitializationError',
      concreteTypeId:
        '1dfe7feadc1d9667a4351761230f948744068a090fe91b1bc6763a90ed5d3893',
      metadataTypeId: 7,
    },
    {
      type: 'str',
      concreteTypeId:
        '8c25cb3686462e9a86d2883c5688a22fe738b0bbc85f458d2d2b5f3f667c6d5a',
    },
    {
      type: 'struct interfaces::hooks::gas_oracle::RemoteGasData',
      concreteTypeId:
        '7b4c89ae67dd062b19fc7f4acf9b99d824182c6051d7c26c06be18c1de085595',
      metadataTypeId: 10,
    },
    {
      type: 'struct interfaces::hooks::igp::BeneficiarySetEvent',
      concreteTypeId:
        '229f9e763c8424886a0b828eb92ecd7ee7ee60fb9b34ec5595a43cc02b21a6e7',
      metadataTypeId: 11,
    },
    {
      type: 'struct interfaces::hooks::igp::ClaimEvent',
      concreteTypeId:
        'f6197f499ee863b7f79af9d4149ec4c76ac1f12af5d55ac5a3e9aa2adf195bc9',
      metadataTypeId: 12,
    },
    {
      type: 'struct interfaces::hooks::igp::DestinationGasConfigSetEvent',
      concreteTypeId:
        'b8b47e85d8cb1e8bd7a47922d6ac2c9aef8c272feb8d5a404e972bb189aeedb3',
      metadataTypeId: 13,
    },
    {
      type: 'struct interfaces::hooks::igp::DomainGasConfig',
      concreteTypeId:
        'daf5a9441e8f4aed11368121fb8cd7fcaec71d243bf701ceefd0cd2aba270d8b',
      metadataTypeId: 14,
    },
    {
      type: 'struct interfaces::hooks::igp::GasOracleSetEvent',
      concreteTypeId:
        '9a9d03fe63ecba2bda69c30f8c743b0d5719d4dc01ad2cbbedce34332ae57970',
      metadataTypeId: 15,
    },
    {
      type: 'struct interfaces::hooks::igp::GasPaymentEvent',
      concreteTypeId:
        '8dfafd11d278da7cc3347b4432a7bd4dbb4dbc21d2475f98b8ae17b0a1a5c122',
      metadataTypeId: 16,
    },
    {
      type: 'struct std::asset_id::AssetId',
      concreteTypeId:
        'c0710b6731b1dd59799cf6bef33eee3b3b04a2e40e80a0724090215bbf2ca974',
      metadataTypeId: 18,
    },
    {
      type: 'struct std::bytes::Bytes',
      concreteTypeId:
        'cdd87b7d12fe505416570c294c884bca819364863efe3bf539245fa18515fbbb',
      metadataTypeId: 19,
    },
    {
      type: 'struct std::vec::Vec<struct interfaces::hooks::igp::DomainGasConfig>',
      concreteTypeId:
        '72e5e46f1e7d3f8964a9236d110d456cb86fea809e436c91f60e6503b65f9f1d',
      metadataTypeId: 24,
      typeArguments: [
        'daf5a9441e8f4aed11368121fb8cd7fcaec71d243bf701ceefd0cd2aba270d8b',
      ],
    },
    {
      type: 'struct std::vec::Vec<u32>',
      concreteTypeId:
        '13c38f4111bad6468fad4f8ea82fd744546b63be49db9439fb3d94e14ae2bb3a',
      metadataTypeId: 24,
      typeArguments: [
        'd7649d428b9ff33d188ecbf38a7e4d8fd167fa01b2e10fe9a8f9308e52f1d7cc',
      ],
    },
    {
      type: 'struct sway_libs::ownership::events::OwnershipRenounced',
      concreteTypeId:
        '43c4fa7b3297401afbf300127e59ea913e5c8f0c7ae69abbec789ab0bb872bed',
      metadataTypeId: 25,
    },
    {
      type: 'struct sway_libs::ownership::events::OwnershipSet',
      concreteTypeId:
        'e1ef35033ea9d2956f17c3292dea4a46ce7d61fdf37bbebe03b7b965073f43b5',
      metadataTypeId: 26,
    },
    {
      type: 'struct sway_libs::ownership::events::OwnershipTransferred',
      concreteTypeId:
        'b3fffbcb3158d7c010c31b194b60fb7857adb4ad61bdcf4b8b42958951d9f308',
      metadataTypeId: 27,
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
    {
      type: 'u8',
      concreteTypeId:
        'c89951a24c6ca28c13fd1cfdc646b2b656d69e61a92b91023be7eb58eb914b6b',
    },
  ],
  metadataTypes: [
    {
      type: 'enum interfaces::hooks::igp::IgpError',
      metadataTypeId: 0,
      components: [
        {
          name: 'InsufficientGasPayment',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
        {
          name: 'InterchainGasPaymentInBaseAsset',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
        {
          name: 'UnsupportedMetadataFormat',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
        {
          name: 'InvalidDomainConfigLength',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
      ],
    },
    {
      type: 'enum interfaces::hooks::post_dispatch_hook::PostDispatchHookType',
      metadataTypeId: 1,
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
      metadataTypeId: 2,
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
      metadataTypeId: 3,
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
      metadataTypeId: 4,
      components: [
        {
          name: 'Uninitialized',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
        {
          name: 'Initialized',
          typeId: 5,
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
      metadataTypeId: 5,
      components: [
        {
          name: 'Address',
          typeId: 17,
        },
        {
          name: 'ContractId',
          typeId: 21,
        },
      ],
    },
    {
      type: 'enum std::option::Option',
      metadataTypeId: 6,
      components: [
        {
          name: 'None',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
        {
          name: 'Some',
          typeId: 8,
        },
      ],
      typeParameters: [8],
    },
    {
      type: 'enum sway_libs::ownership::errors::InitializationError',
      metadataTypeId: 7,
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
      metadataTypeId: 8,
    },
    {
      type: 'raw untyped ptr',
      metadataTypeId: 9,
    },
    {
      type: 'struct interfaces::hooks::gas_oracle::RemoteGasData',
      metadataTypeId: 10,
      components: [
        {
          name: 'domain',
          typeId:
            'd7649d428b9ff33d188ecbf38a7e4d8fd167fa01b2e10fe9a8f9308e52f1d7cc',
        },
        {
          name: 'token_exchange_rate',
          typeId: 22,
        },
        {
          name: 'gas_price',
          typeId: 22,
        },
        {
          name: 'token_decimals',
          typeId:
            'c89951a24c6ca28c13fd1cfdc646b2b656d69e61a92b91023be7eb58eb914b6b',
        },
      ],
    },
    {
      type: 'struct interfaces::hooks::igp::BeneficiarySetEvent',
      metadataTypeId: 11,
      components: [
        {
          name: 'beneficiary',
          typeId: 5,
        },
      ],
    },
    {
      type: 'struct interfaces::hooks::igp::ClaimEvent',
      metadataTypeId: 12,
      components: [
        {
          name: 'beneficiary',
          typeId: 5,
        },
        {
          name: 'amount',
          typeId:
            '1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0',
        },
      ],
    },
    {
      type: 'struct interfaces::hooks::igp::DestinationGasConfigSetEvent',
      metadataTypeId: 13,
      components: [
        {
          name: 'domain',
          typeId:
            'd7649d428b9ff33d188ecbf38a7e4d8fd167fa01b2e10fe9a8f9308e52f1d7cc',
        },
        {
          name: 'oracle',
          typeId:
            '7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b',
        },
        {
          name: 'overhead',
          typeId:
            '1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0',
        },
      ],
    },
    {
      type: 'struct interfaces::hooks::igp::DomainGasConfig',
      metadataTypeId: 14,
      components: [
        {
          name: 'gas_oracle',
          typeId:
            '7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b',
        },
        {
          name: 'gas_overhead',
          typeId:
            '1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0',
        },
      ],
    },
    {
      type: 'struct interfaces::hooks::igp::GasOracleSetEvent',
      metadataTypeId: 15,
      components: [
        {
          name: 'domain',
          typeId:
            'd7649d428b9ff33d188ecbf38a7e4d8fd167fa01b2e10fe9a8f9308e52f1d7cc',
        },
        {
          name: 'gas_oracle',
          typeId:
            '7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b',
        },
      ],
    },
    {
      type: 'struct interfaces::hooks::igp::GasPaymentEvent',
      metadataTypeId: 16,
      components: [
        {
          name: 'message_id',
          typeId:
            '7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b',
        },
        {
          name: 'destination_domain',
          typeId:
            'd7649d428b9ff33d188ecbf38a7e4d8fd167fa01b2e10fe9a8f9308e52f1d7cc',
        },
        {
          name: 'gas_amount',
          typeId:
            '1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0',
        },
        {
          name: 'payment',
          typeId:
            '1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0',
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
      type: 'struct std::asset_id::AssetId',
      metadataTypeId: 18,
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
      metadataTypeId: 19,
      components: [
        {
          name: 'buf',
          typeId: 20,
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
      metadataTypeId: 20,
      components: [
        {
          name: 'ptr',
          typeId: 9,
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
      metadataTypeId: 21,
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
      metadataTypeId: 22,
      components: [
        {
          name: 'upper',
          typeId:
            '1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0',
        },
        {
          name: 'lower',
          typeId:
            '1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0',
        },
      ],
    },
    {
      type: 'struct std::vec::RawVec',
      metadataTypeId: 23,
      components: [
        {
          name: 'ptr',
          typeId: 9,
        },
        {
          name: 'cap',
          typeId:
            '1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0',
        },
      ],
      typeParameters: [8],
    },
    {
      type: 'struct std::vec::Vec',
      metadataTypeId: 24,
      components: [
        {
          name: 'buf',
          typeId: 23,
          typeArguments: [
            {
              name: '',
              typeId: 8,
            },
          ],
        },
        {
          name: 'len',
          typeId:
            '1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0',
        },
      ],
      typeParameters: [8],
    },
    {
      type: 'struct sway_libs::ownership::events::OwnershipRenounced',
      metadataTypeId: 25,
      components: [
        {
          name: 'previous_owner',
          typeId: 5,
        },
      ],
    },
    {
      type: 'struct sway_libs::ownership::events::OwnershipSet',
      metadataTypeId: 26,
      components: [
        {
          name: 'new_owner',
          typeId: 5,
        },
      ],
    },
    {
      type: 'struct sway_libs::ownership::events::OwnershipTransferred',
      metadataTypeId: 27,
      components: [
        {
          name: 'new_owner',
          typeId: 5,
        },
        {
          name: 'previous_owner',
          typeId: 5,
        },
      ],
    },
  ],
  functions: [
    {
      inputs: [],
      name: 'beneficiary',
      output:
        'ab7cd04e05be58e3fc15d424c2c4a57f824a2a2d97d67252440a3925ebdc1335',
      attributes: [
        {
          name: 'doc-comment',
          arguments: [' Gets the current beneficiary.'],
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
          arguments: [' * [Identity] - The beneficiary.'],
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
          name: 'asset',
          concreteTypeId:
            '191bf2140761b3c5ab6c43992d162bb3dc9d7f2272b2ee5f5eeea411ddedcd32',
        },
      ],
      name: 'claim',
      output:
        '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
      attributes: [
        {
          name: 'doc-comment',
          arguments: [
            ' Sends all base asset funds to the beneficiary. Callable by anyone.',
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
      name: 'gas_oracle',
      output:
        '0c2beb9013490c4f753f2757dfe2d8340b22ce3827d596d81d249b7038033cb6',
      attributes: [
        {
          name: 'doc-comment',
          arguments: [' Returns the gas oracle for a domain.'],
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
            ' * `domain`: [u32] - The domain to get the gas oracle for.',
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
      name: 'get_current_domain_gas',
      output:
        '1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0',
      attributes: [
        {
          name: 'doc-comment',
          arguments: [' Gets the gas amount for the current domain.'],
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
          arguments: [' * [u64] - The gas amount for the current domain.'],
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
      name: 'get_domain_gas_config',
      output:
        'daf5a9441e8f4aed11368121fb8cd7fcaec71d243bf701ceefd0cd2aba270d8b',
      attributes: [
        {
          name: 'doc-comment',
          arguments: [' Gets the gas config for a domain.'],
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
            ' * `domain`: [u32] - The domain to get the gas config for.',
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
            ' * [DomainGasConfig] - The gas config for the domain (gas overhead and oracle address).',
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
          name: 'destination_domain',
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
          arguments: [
            ' Gets the exchange rate and gas price for a given domain using the',
          ],
        },
        {
          name: 'doc-comment',
          arguments: [' configured gas oracle.'],
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
            ' * [RemoteGasData] - Remote gas data for the domain from the oracle.',
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
          arguments: [' * If no gas oracle is set.'],
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
          name: 'beneficiary',
          concreteTypeId:
            'ab7cd04e05be58e3fc15d424c2c4a57f824a2a2d97d67252440a3925ebdc1335',
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
            ' * `beneficiary`: [Identity] - The beneficiary of the contract.',
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
      inputs: [
        {
          name: 'message_id',
          concreteTypeId:
            '7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b',
        },
        {
          name: 'destination_domain',
          concreteTypeId:
            'd7649d428b9ff33d188ecbf38a7e4d8fd167fa01b2e10fe9a8f9308e52f1d7cc',
        },
        {
          name: 'gas_amount',
          concreteTypeId:
            '1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0',
        },
        {
          name: 'refund_address',
          concreteTypeId:
            'ab7cd04e05be58e3fc15d424c2c4a57f824a2a2d97d67252440a3925ebdc1335',
        },
      ],
      name: 'pay_for_gas',
      output:
        '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
      attributes: [
        {
          name: 'doc-comment',
          arguments: [' Allows the caller to pay for gas.'],
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
          arguments: [' * `message_id`: [b256] - The message ID.'],
        },
        {
          name: 'doc-comment',
          arguments: [
            ' * `destination_domain`: [u32] - The domain to pay for.',
          ],
        },
        {
          name: 'doc-comment',
          arguments: [' * `gas_amount`: [u64] - The amount of gas.'],
        },
        {
          name: 'doc-comment',
          arguments: [
            ' * `refund_address`: [Identity] - The address to refund the excess payment to.',
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
          arguments: [' * If asset sent is not the base asset.'],
        },
        {
          name: 'doc-comment',
          arguments: [' * If the payment is less than the required amount.'],
        },
        {
          name: 'doc-comment',
          arguments: [' * If the metadata is invalid.'],
        },
        {
          name: 'payable',
          arguments: [],
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
          name: 'gas_amount',
          concreteTypeId:
            '1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0',
        },
      ],
      name: 'quote_gas_payment',
      output:
        '1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0',
      attributes: [
        {
          name: 'doc-comment',
          arguments: [
            ' Quotes the required interchain gas payment to be paid in the base asset.',
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
            ' * `destination_domain`: [u32] - The destination domain of the message.',
          ],
        },
        {
          name: 'doc-comment',
          arguments: [
            ' * `gas_amount`: [u64] - The amount of destination gas to pay for.',
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
          arguments: [' * [u64] - The total payment for the gas amount.'],
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
          name: 'beneficiary',
          concreteTypeId:
            'ab7cd04e05be58e3fc15d424c2c4a57f824a2a2d97d67252440a3925ebdc1335',
        },
      ],
      name: 'set_beneficiary',
      output:
        '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
      attributes: [
        {
          name: 'doc-comment',
          arguments: [
            ' Sets the beneficiary to `beneficiary`. Only callable by the owner.',
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
          arguments: [' * `beneficiary`: [Identity] - The new beneficiary.'],
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
          name: 'domain',
          concreteTypeId:
            '13c38f4111bad6468fad4f8ea82fd744546b63be49db9439fb3d94e14ae2bb3a',
        },
        {
          name: 'config',
          concreteTypeId:
            '72e5e46f1e7d3f8964a9236d110d456cb86fea809e436c91f60e6503b65f9f1d',
        },
      ],
      name: 'set_destination_gas_config',
      output:
        '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
      attributes: [
        {
          name: 'doc-comment',
          arguments: [' Sets the gas configs for a destination domain.'],
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
            ' * `domain`: [Vec<u32>] - The domains to set the gas config for.',
          ],
        },
        {
          name: 'doc-comment',
          arguments: [
            ' * `config`: [Vec<DomainGasConfig>] - The gas config to set.',
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
          name: 'domain',
          concreteTypeId:
            'd7649d428b9ff33d188ecbf38a7e4d8fd167fa01b2e10fe9a8f9308e52f1d7cc',
        },
        {
          name: 'gas_oracle',
          concreteTypeId:
            '7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b',
        },
      ],
      name: 'set_gas_oracle',
      output:
        '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
      attributes: [
        {
          name: 'doc-comment',
          arguments: [' Sets the gas oracle for a domain.'],
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
            ' * `domain`: [u32] - The domain to set the gas oracle for.',
          ],
        },
        {
          name: 'doc-comment',
          arguments: [' * `gas_oracle`: [b256] - The gas oracle.'],
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
    {
      inputs: [
        {
          name: 'domain',
          concreteTypeId:
            'd7649d428b9ff33d188ecbf38a7e4d8fd167fa01b2e10fe9a8f9308e52f1d7cc',
        },
      ],
      name: 'gas_overhead',
      output:
        'd852149004cc9ec0bbe7dc4e37bffea1d41469b759512b6136f2e865a4c06e7d',
      attributes: [
        {
          name: 'doc-comment',
          arguments: [' Gets the gas overhead for a given domain.'],
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
            ' * `domain`: [u32] - The domain to get the gas overhead for.',
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
          arguments: [' * [u64] - The gas overhead.'],
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
        {
          name: 'gas_overhead',
          concreteTypeId:
            '1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0',
        },
      ],
      name: 'set_gas_overhead',
      output:
        '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
      attributes: [
        {
          name: 'doc-comment',
          arguments: [' Sets the gas overhead for a given domain.'],
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
            ' * `domain`: [u32] - The domain to set the gas overhead for.',
          ],
        },
        {
          name: 'doc-comment',
          arguments: [' * `gas_overhead`: [u64] - The gas overhead.'],
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
          arguments: [
            ' Manages payments on a source chain to cover gas costs of relaying',
          ],
        },
        {
          name: 'doc-comment',
          arguments: [
            ' messages to destination chains and includes the gas overhead per destination',
          ],
        },
        {
          name: 'doc-comment',
          arguments: [''],
        },
        {
          name: 'doc-comment',
          arguments: [
            ' The intended use of this contract is to store overhead gas amounts for destination',
          ],
        },
        {
          name: 'doc-comment',
          arguments: [
            ' domains, e.g. Mailbox and ISM gas usage, such that users of this IGP are only required',
          ],
        },
        {
          name: 'doc-comment',
          arguments: [
            ' to specify the gas amount used by their own applications.',
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
          arguments: [' * `message`: [Bytes] - The message being dispatched.'],
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
          arguments: [' * If the contract is not initialized.'],
        },
        {
          name: 'doc-comment',
          arguments: [' * If the message is invalid'],
        },
        {
          name: 'doc-comment',
          arguments: [' * If IGP call fails'],
        },
        {
          name: 'doc-comment',
          arguments: [' * If metadata is invalid'],
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
          arguments: [' * If the contract is not initialized.'],
        },
        {
          name: 'doc-comment',
          arguments: [' * If the message is invalid'],
        },
        {
          name: 'doc-comment',
          arguments: [' * If IGP call fails'],
        },
        {
          name: 'doc-comment',
          arguments: [' * If metadata is invalid'],
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
      logId: '17733344961923408823',
      concreteTypeId:
        'f6197f499ee863b7f79af9d4149ec4c76ac1f12af5d55ac5a3e9aa2adf195bc9',
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
      logId: '16783799790628909358',
      concreteTypeId:
        'e8ec08fc35b6312eaeca1be8ba0645b2eb1bf5656f53fed618eda7c184a7c6bc',
    },
    {
      logId: '10098701174489624218',
      concreteTypeId:
        '8c25cb3686462e9a86d2883c5688a22fe738b0bbc85f458d2d2b5f3f667c6d5a',
    },
    {
      logId: '10230767756512909948',
      concreteTypeId:
        '8dfafd11d278da7cc3347b4432a7bd4dbb4dbc21d2475f98b8ae17b0a1a5c122',
    },
    {
      logId: '4571204900286667806',
      concreteTypeId:
        '3f702ea3351c9c1ece2b84048006c8034a24cbc2bad2e740d0412b4172951d3d',
    },
    {
      logId: '2494886949245166728',
      concreteTypeId:
        '229f9e763c8424886a0b828eb92ecd7ee7ee60fb9b34ec5595a43cc02b21a6e7',
    },
    {
      logId: '13309401912119598731',
      concreteTypeId:
        'b8b47e85d8cb1e8bd7a47922d6ac2c9aef8c272feb8d5a404e972bb189aeedb3',
    },
    {
      logId: '11141065444317510187',
      concreteTypeId:
        '9a9d03fe63ecba2bda69c30f8c743b0d5719d4dc01ad2cbbedce34332ae57970',
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
      name: 'BASE_ASSET_DECIMALS',
      concreteTypeId:
        'c89951a24c6ca28c13fd1cfdc646b2b656d69e61a92b91023be7eb58eb914b6b',
      offset: 54136,
    },
    {
      name: 'TOKEN_EXCHANGE_RATE_SCALE',
      concreteTypeId:
        '1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0',
      offset: 54184,
    },
    {
      name: 'DEFAULT_GAS_AMOUNT',
      concreteTypeId:
        '1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0',
      offset: 54144,
    },
    {
      name: 'EXPECTED_OWNER',
      concreteTypeId:
        '7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b',
      offset: 54152,
    },
  ],
};

const storageSlots: StorageSlot[] = [
  {
    key: 'ccecdaae64d028efc03d6da906d6eac1e11948509e5f9244fc1067951e4b7e91',
    value: '0000000000000001000000000000000000000000000000000000000000000000',
  },
  {
    key: 'ccecdaae64d028efc03d6da906d6eac1e11948509e5f9244fc1067951e4b7e92',
    value: '0000000000000000000000000000000000000000000000000000000000000000',
  },
];

export class GasPaymasterInterface extends Interface {
  constructor() {
    super(abi);
  }

  declare functions: {
    beneficiary: FunctionFragment;
    claim: FunctionFragment;
    gas_oracle: FunctionFragment;
    get_current_domain_gas: FunctionFragment;
    get_domain_gas_config: FunctionFragment;
    get_remote_gas_data: FunctionFragment;
    initialize: FunctionFragment;
    pay_for_gas: FunctionFragment;
    quote_gas_payment: FunctionFragment;
    set_beneficiary: FunctionFragment;
    set_destination_gas_config: FunctionFragment;
    set_gas_oracle: FunctionFragment;
    initialize_ownership: FunctionFragment;
    only_owner: FunctionFragment;
    owner: FunctionFragment;
    renounce_ownership: FunctionFragment;
    transfer_ownership: FunctionFragment;
    gas_overhead: FunctionFragment;
    set_gas_overhead: FunctionFragment;
    hook_type: FunctionFragment;
    post_dispatch: FunctionFragment;
    quote_dispatch: FunctionFragment;
    supports_metadata: FunctionFragment;
  };
}

export class GasPaymaster extends __Contract {
  static readonly abi = abi;
  static readonly storageSlots = storageSlots;

  declare interface: GasPaymasterInterface;
  declare functions: {
    beneficiary: InvokeFunction<[], IdentityOutput>;
    claim: InvokeFunction<[asset?: Option<AssetIdInput>], void>;
    gas_oracle: InvokeFunction<[domain: BigNumberish], Option<string>>;
    get_current_domain_gas: InvokeFunction<[], BN>;
    get_domain_gas_config: InvokeFunction<
      [domain: BigNumberish],
      DomainGasConfigOutput
    >;
    get_remote_gas_data: InvokeFunction<
      [destination_domain: BigNumberish],
      RemoteGasDataOutput
    >;
    initialize: InvokeFunction<
      [owner: IdentityInput, beneficiary: IdentityInput],
      void
    >;
    pay_for_gas: InvokeFunction<
      [
        message_id: string,
        destination_domain: BigNumberish,
        gas_amount: BigNumberish,
        refund_address: IdentityInput,
      ],
      void
    >;
    quote_gas_payment: InvokeFunction<
      [destination_domain: BigNumberish, gas_amount: BigNumberish],
      BN
    >;
    set_beneficiary: InvokeFunction<[beneficiary: IdentityInput], void>;
    set_destination_gas_config: InvokeFunction<
      [domain: Vec<BigNumberish>, config: Vec<DomainGasConfigInput>],
      void
    >;
    set_gas_oracle: InvokeFunction<
      [domain: BigNumberish, gas_oracle: string],
      void
    >;
    initialize_ownership: InvokeFunction<[new_owner: IdentityInput], void>;
    only_owner: InvokeFunction<[], void>;
    owner: InvokeFunction<[], StateOutput>;
    renounce_ownership: InvokeFunction<[], void>;
    transfer_ownership: InvokeFunction<[new_owner: IdentityInput], void>;
    gas_overhead: InvokeFunction<[domain: BigNumberish], Option<BN>>;
    set_gas_overhead: InvokeFunction<
      [domain: BigNumberish, gas_overhead: BigNumberish],
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
