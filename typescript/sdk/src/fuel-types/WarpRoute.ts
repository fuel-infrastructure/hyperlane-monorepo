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
  StdString,
  StorageSlot,
} from 'fuels';

import type { Enum, Option, Vec } from './common.js';

export enum AccessErrorInput {
  NotOwner = 'NotOwner',
}
export enum AccessErrorOutput {
  NotOwner = 'NotOwner',
}
export enum BurnErrorInput {
  NotEnoughCoins = 'NotEnoughCoins',
  ZeroAmount = 'ZeroAmount',
}
export enum BurnErrorOutput {
  NotEnoughCoins = 'NotEnoughCoins',
  ZeroAmount = 'ZeroAmount',
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
export enum MintErrorInput {
  ZeroAmount = 'ZeroAmount',
}
export enum MintErrorOutput {
  ZeroAmount = 'ZeroAmount',
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
export enum ReentrancyErrorInput {
  NonReentrant = 'NonReentrant',
}
export enum ReentrancyErrorOutput {
  NonReentrant = 'NonReentrant',
}
export enum SetMetadataErrorInput {
  EmptyString = 'EmptyString',
  EmptyBytes = 'EmptyBytes',
}
export enum SetMetadataErrorOutput {
  EmptyString = 'EmptyString',
  EmptyBytes = 'EmptyBytes',
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
export enum TokenRouterErrorInput {
  RouterNotSet = 'RouterNotSet',
  RouterLengthMismatch = 'RouterLengthMismatch',
}
export enum TokenRouterErrorOutput {
  RouterNotSet = 'RouterNotSet',
  RouterLengthMismatch = 'RouterLengthMismatch',
}
export enum WarpRouteErrorInput {
  InvalidAssetSend = 'InvalidAssetSend',
  PaymentNotEqualToRequired = 'PaymentNotEqualToRequired',
  InvalidAddress = 'InvalidAddress',
  AssetIdRequiredForCollateral = 'AssetIdRequiredForCollateral',
  RemoteDecimalsNotSet = 'RemoteDecimalsNotSet',
  AmountNotConvertible = 'AmountNotConvertible',
  SenderNotMailbox = 'SenderNotMailbox',
  AssetNotReceivedForTransfer = 'AssetNotReceivedForTransfer',
}
export enum WarpRouteErrorOutput {
  InvalidAssetSend = 'InvalidAssetSend',
  PaymentNotEqualToRequired = 'PaymentNotEqualToRequired',
  InvalidAddress = 'InvalidAddress',
  AssetIdRequiredForCollateral = 'AssetIdRequiredForCollateral',
  RemoteDecimalsNotSet = 'RemoteDecimalsNotSet',
  AmountNotConvertible = 'AmountNotConvertible',
  SenderNotMailbox = 'SenderNotMailbox',
  AssetNotReceivedForTransfer = 'AssetNotReceivedForTransfer',
}
export enum WarpRouteTokenModeInput {
  SYNTHETIC = 'SYNTHETIC',
  COLLATERAL = 'COLLATERAL',
  NATIVE = 'NATIVE',
}
export enum WarpRouteTokenModeOutput {
  SYNTHETIC = 'SYNTHETIC',
  COLLATERAL = 'COLLATERAL',
  NATIVE = 'NATIVE',
}

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
export type GasRouterConfigInput = { domain: BigNumberish; gas: BigNumberish };
export type GasRouterConfigOutput = { domain: number; gas: BN };
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
export type ReceivedTransferRemoteEventInput = {
  origin: BigNumberish;
  recipient: string;
  amount: BigNumberish;
};
export type ReceivedTransferRemoteEventOutput = {
  origin: number;
  recipient: string;
  amount: BN;
};
export type SentTransferRemoteEventInput = {
  destination: BigNumberish;
  recipient: string;
  amount: BigNumberish;
};
export type SentTransferRemoteEventOutput = {
  destination: number;
  recipient: string;
  amount: BN;
};
export type SetDecimalsEventInput = {
  asset: AssetIdInput;
  decimals: BigNumberish;
  sender: IdentityInput;
};
export type SetDecimalsEventOutput = {
  asset: AssetIdOutput;
  decimals: number;
  sender: IdentityOutput;
};
export type SetNameEventInput = {
  asset: AssetIdInput;
  name: Option<StdString>;
  sender: IdentityInput;
};
export type SetNameEventOutput = {
  asset: AssetIdOutput;
  name: Option<StdString>;
  sender: IdentityOutput;
};
export type SetSymbolEventInput = {
  asset: AssetIdInput;
  symbol: Option<StdString>;
  sender: IdentityInput;
};
export type SetSymbolEventOutput = {
  asset: AssetIdOutput;
  symbol: Option<StdString>;
  sender: IdentityOutput;
};
export type TokenMetadataInput = {
  name: StdString;
  symbol: StdString;
  decimals: BigNumberish;
  total_supply: BigNumberish;
  asset_id: AssetIdInput;
  sub_id: string;
};
export type TokenMetadataOutput = {
  name: StdString;
  symbol: StdString;
  decimals: number;
  total_supply: BN;
  asset_id: AssetIdOutput;
  sub_id: string;
};
export type TotalSupplyEventInput = {
  asset: AssetIdInput;
  supply: BigNumberish;
  sender: IdentityInput;
};
export type TotalSupplyEventOutput = {
  asset: AssetIdOutput;
  supply: BN;
  sender: IdentityOutput;
};

export type WarpRouteConfigurables = Partial<{
  DEFAULT_DECIMALS: BigNumberish;
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
      type: 'enum interfaces::ownable::OwnableError',
      concreteTypeId:
        'ac647a25698ba2dd70e3c533f7c5c93860fb5f7610fb4b4067be084e822f2c90',
      metadataTypeId: 0,
    },
    {
      type: 'enum interfaces::token_router::TokenRouterError',
      concreteTypeId:
        '82c56d088164b4b8abd17409dedfa8e8a61f9ffc4d6b19e32575b36004adfb09',
      metadataTypeId: 1,
    },
    {
      type: 'enum interfaces::warp_route::WarpRouteError',
      concreteTypeId:
        '7588e3551cdd4a2f634a12f13a7e13fd3fec214c44eb154a64cacbd2859159d9',
      metadataTypeId: 2,
    },
    {
      type: 'enum interfaces::warp_route::WarpRouteTokenMode',
      concreteTypeId:
        '32a1c51a5f189b8e6b3a92437c9538256596892b398ab22a35823a19ae46b33e',
      metadataTypeId: 3,
    },
    {
      type: 'enum standards::src5::AccessError',
      concreteTypeId:
        '3f702ea3351c9c1ece2b84048006c8034a24cbc2bad2e740d0412b4172951d3d',
      metadataTypeId: 4,
    },
    {
      type: 'enum standards::src5::State',
      concreteTypeId:
        '192bc7098e2fe60635a9918afb563e4e5419d386da2bdbf0d716b4bc8549802c',
      metadataTypeId: 5,
    },
    {
      type: 'enum std::identity::Identity',
      concreteTypeId:
        'ab7cd04e05be58e3fc15d424c2c4a57f824a2a2d97d67252440a3925ebdc1335',
      metadataTypeId: 6,
    },
    {
      type: 'enum std::option::Option<b256>',
      concreteTypeId:
        '0c2beb9013490c4f753f2757dfe2d8340b22ce3827d596d81d249b7038033cb6',
      metadataTypeId: 7,
      typeArguments: [
        '7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b',
      ],
    },
    {
      type: 'enum std::option::Option<struct std::asset_id::AssetId>',
      concreteTypeId:
        '191bf2140761b3c5ab6c43992d162bb3dc9d7f2272b2ee5f5eeea411ddedcd32',
      metadataTypeId: 7,
      typeArguments: [
        'c0710b6731b1dd59799cf6bef33eee3b3b04a2e40e80a0724090215bbf2ca974',
      ],
    },
    {
      type: 'enum std::option::Option<struct std::bytes::Bytes>',
      concreteTypeId:
        '50b87f43f0097a720c18f3fb2100c4502484b716128f2706b3e187aa35a6dfe8',
      metadataTypeId: 7,
      typeArguments: [
        'cdd87b7d12fe505416570c294c884bca819364863efe3bf539245fa18515fbbb',
      ],
    },
    {
      type: 'enum std::option::Option<struct std::contract_id::ContractId>',
      concreteTypeId:
        '0d79387ad3bacdc3b7aad9da3a96f4ce60d9a1b6002df254069ad95a3931d5c8',
      metadataTypeId: 7,
      typeArguments: [
        '29c10735d33b5159f0c71ee1dbd17b36a3e69e41f00fab0d42e1bd9f428d8a54',
      ],
    },
    {
      type: 'enum std::option::Option<struct std::string::String>',
      concreteTypeId:
        '7c06d929390a9aeeb8ffccf8173ac0d101a9976d99dda01cce74541a81e75ac0',
      metadataTypeId: 7,
      typeArguments: [
        '9a7f1d3e963c10e0a4ea70a8e20a4813d1dc5682e28f74cb102ae50d32f7f98c',
      ],
    },
    {
      type: 'enum std::option::Option<u64>',
      concreteTypeId:
        'd852149004cc9ec0bbe7dc4e37bffea1d41469b759512b6136f2e865a4c06e7d',
      metadataTypeId: 7,
      typeArguments: [
        '1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0',
      ],
    },
    {
      type: 'enum std::option::Option<u8>',
      concreteTypeId:
        '2da102c46c7263beeed95818cd7bee801716ba8303dddafdcd0f6c9efda4a0f1',
      metadataTypeId: 7,
      typeArguments: [
        'c89951a24c6ca28c13fd1cfdc646b2b656d69e61a92b91023be7eb58eb914b6b',
      ],
    },
    {
      type: 'enum sway_libs::asset::errors::BurnError',
      concreteTypeId:
        '3acdc2adac8e0589c5864525e0edc9dc61a9571a4d09c3c57b58ea76d33f4b46',
      metadataTypeId: 8,
    },
    {
      type: 'enum sway_libs::asset::errors::MintError',
      concreteTypeId:
        'dff9dfec998a49b40f1c4b09567400f0e712aaf939c08f7d07bc5c63116e1084',
      metadataTypeId: 9,
    },
    {
      type: 'enum sway_libs::asset::errors::SetMetadataError',
      concreteTypeId:
        'c6c09c148c1a1341c7ab81697b3545cc695fa67668a169cddc59790a9a0b6b44',
      metadataTypeId: 10,
    },
    {
      type: 'enum sway_libs::ownership::errors::InitializationError',
      concreteTypeId:
        '1dfe7feadc1d9667a4351761230f948744068a090fe91b1bc6763a90ed5d3893',
      metadataTypeId: 11,
    },
    {
      type: 'enum sway_libs::pausable::errors::PauseError',
      concreteTypeId:
        '8b3afcadf894415a10b09fc3717487e33802c8ffbb030edafe84ca4a71b280bc',
      metadataTypeId: 12,
    },
    {
      type: 'enum sway_libs::reentrancy::errors::ReentrancyError',
      concreteTypeId:
        '4d216c57b3357523323f59401c7355785b41bdf832f6e1106272186b94797038',
      metadataTypeId: 13,
    },
    {
      type: 'str',
      concreteTypeId:
        '8c25cb3686462e9a86d2883c5688a22fe738b0bbc85f458d2d2b5f3f667c6d5a',
    },
    {
      type: 'struct interfaces::gas_router::GasRouterConfig',
      concreteTypeId:
        'acc0ad3a6f75c003e6b016e0599a99888e4e40028fbf2e398f5d06647b91be27',
      metadataTypeId: 16,
    },
    {
      type: 'struct interfaces::warp_route::BeneficiarySetEvent',
      concreteTypeId:
        '8e47289443d8a10c3f7d4215ab86b95ffe6ec75dd3d12a2ccad26a1fa2f66548',
      metadataTypeId: 17,
    },
    {
      type: 'struct interfaces::warp_route::ClaimEvent',
      concreteTypeId:
        'fda65a174152eff209e2507cb14003806f51b76a1e192d0cf07e1942cfee09c7',
      metadataTypeId: 18,
    },
    {
      type: 'struct interfaces::warp_route::ReceivedTransferRemoteEvent',
      concreteTypeId:
        'bbfc507feb87aa539acdfac1829090f6ef621885b47880f5c521d5d41a89830a',
      metadataTypeId: 19,
    },
    {
      type: 'struct interfaces::warp_route::SentTransferRemoteEvent',
      concreteTypeId:
        'a7522798eb8f593a97fc3c450f37b193f24cb0d97391dbf53a6dd873c40cefb9',
      metadataTypeId: 20,
    },
    {
      type: 'struct interfaces::warp_route::TokenMetadata',
      concreteTypeId:
        '759840b3d54cc488313168a32bb4d8e7530bb5df830c3c8c49e00c511d749bff',
      metadataTypeId: 21,
    },
    {
      type: 'struct standards::src20::SetDecimalsEvent',
      concreteTypeId:
        'fbe071a6e7ca2b2b5e503e82638f9f11c861a6fb452b65473eca8260db87392d',
      metadataTypeId: 22,
    },
    {
      type: 'struct standards::src20::SetNameEvent',
      concreteTypeId:
        '6ce295b0fb4c1c15e8ed1cfa4babda47d8a04940a5266a3229e12243a2e37c2c',
      metadataTypeId: 23,
    },
    {
      type: 'struct standards::src20::SetSymbolEvent',
      concreteTypeId:
        'a8a4b78066c51a50da6349bd395fe1c67e774d75c1db2c5c22288a432d7a363d',
      metadataTypeId: 24,
    },
    {
      type: 'struct standards::src20::TotalSupplyEvent',
      concreteTypeId:
        'f255d5cc2114d1b6bc34bef4c28d4b60caccffd9a672ed16b79ea217e1c4a8a3',
      metadataTypeId: 25,
    },
    {
      type: 'struct std::asset_id::AssetId',
      concreteTypeId:
        'c0710b6731b1dd59799cf6bef33eee3b3b04a2e40e80a0724090215bbf2ca974',
      metadataTypeId: 27,
    },
    {
      type: 'struct std::bytes::Bytes',
      concreteTypeId:
        'cdd87b7d12fe505416570c294c884bca819364863efe3bf539245fa18515fbbb',
      metadataTypeId: 28,
    },
    {
      type: 'struct std::contract_id::ContractId',
      concreteTypeId:
        '29c10735d33b5159f0c71ee1dbd17b36a3e69e41f00fab0d42e1bd9f428d8a54',
      metadataTypeId: 30,
    },
    {
      type: 'struct std::string::String',
      concreteTypeId:
        '9a7f1d3e963c10e0a4ea70a8e20a4813d1dc5682e28f74cb102ae50d32f7f98c',
      metadataTypeId: 31,
    },
    {
      type: 'struct std::vec::Vec<b256>',
      concreteTypeId:
        '32559685d0c9845f059bf9d472a0a38cf77d36c23dfcffe5489e86a65cdd9198',
      metadataTypeId: 33,
      typeArguments: [
        '7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b',
      ],
    },
    {
      type: 'struct std::vec::Vec<struct interfaces::gas_router::GasRouterConfig>',
      concreteTypeId:
        'ce2cf7a7b6f707fd4414b08da2c01ec7d590183e9dbf9d70d8070b21171b1ca7',
      metadataTypeId: 33,
      typeArguments: [
        'acc0ad3a6f75c003e6b016e0599a99888e4e40028fbf2e398f5d06647b91be27',
      ],
    },
    {
      type: 'struct std::vec::Vec<u32>',
      concreteTypeId:
        '13c38f4111bad6468fad4f8ea82fd744546b63be49db9439fb3d94e14ae2bb3a',
      metadataTypeId: 33,
      typeArguments: [
        'd7649d428b9ff33d188ecbf38a7e4d8fd167fa01b2e10fe9a8f9308e52f1d7cc',
      ],
    },
    {
      type: 'struct sway_libs::ownership::events::OwnershipRenounced',
      concreteTypeId:
        '43c4fa7b3297401afbf300127e59ea913e5c8f0c7ae69abbec789ab0bb872bed',
      metadataTypeId: 34,
    },
    {
      type: 'struct sway_libs::ownership::events::OwnershipSet',
      concreteTypeId:
        'e1ef35033ea9d2956f17c3292dea4a46ce7d61fdf37bbebe03b7b965073f43b5',
      metadataTypeId: 35,
    },
    {
      type: 'struct sway_libs::ownership::events::OwnershipTransferred',
      concreteTypeId:
        'b3fffbcb3158d7c010c31b194b60fb7857adb4ad61bdcf4b8b42958951d9f308',
      metadataTypeId: 36,
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
      type: 'enum interfaces::token_router::TokenRouterError',
      metadataTypeId: 1,
      components: [
        {
          name: 'RouterNotSet',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
        {
          name: 'RouterLengthMismatch',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
      ],
    },
    {
      type: 'enum interfaces::warp_route::WarpRouteError',
      metadataTypeId: 2,
      components: [
        {
          name: 'InvalidAssetSend',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
        {
          name: 'PaymentNotEqualToRequired',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
        {
          name: 'InvalidAddress',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
        {
          name: 'AssetIdRequiredForCollateral',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
        {
          name: 'RemoteDecimalsNotSet',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
        {
          name: 'AmountNotConvertible',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
        {
          name: 'SenderNotMailbox',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
        {
          name: 'AssetNotReceivedForTransfer',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
      ],
    },
    {
      type: 'enum interfaces::warp_route::WarpRouteTokenMode',
      metadataTypeId: 3,
      components: [
        {
          name: 'SYNTHETIC',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
        {
          name: 'COLLATERAL',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
        {
          name: 'NATIVE',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
      ],
    },
    {
      type: 'enum standards::src5::AccessError',
      metadataTypeId: 4,
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
      metadataTypeId: 5,
      components: [
        {
          name: 'Uninitialized',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
        {
          name: 'Initialized',
          typeId: 6,
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
      metadataTypeId: 6,
      components: [
        {
          name: 'Address',
          typeId: 26,
        },
        {
          name: 'ContractId',
          typeId: 30,
        },
      ],
    },
    {
      type: 'enum std::option::Option',
      metadataTypeId: 7,
      components: [
        {
          name: 'None',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
        {
          name: 'Some',
          typeId: 14,
        },
      ],
      typeParameters: [14],
    },
    {
      type: 'enum sway_libs::asset::errors::BurnError',
      metadataTypeId: 8,
      components: [
        {
          name: 'NotEnoughCoins',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
        {
          name: 'ZeroAmount',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
      ],
    },
    {
      type: 'enum sway_libs::asset::errors::MintError',
      metadataTypeId: 9,
      components: [
        {
          name: 'ZeroAmount',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
      ],
    },
    {
      type: 'enum sway_libs::asset::errors::SetMetadataError',
      metadataTypeId: 10,
      components: [
        {
          name: 'EmptyString',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
        {
          name: 'EmptyBytes',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
      ],
    },
    {
      type: 'enum sway_libs::ownership::errors::InitializationError',
      metadataTypeId: 11,
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
      metadataTypeId: 12,
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
      metadataTypeId: 13,
      components: [
        {
          name: 'NonReentrant',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
      ],
    },
    {
      type: 'generic T',
      metadataTypeId: 14,
    },
    {
      type: 'raw untyped ptr',
      metadataTypeId: 15,
    },
    {
      type: 'struct interfaces::gas_router::GasRouterConfig',
      metadataTypeId: 16,
      components: [
        {
          name: 'domain',
          typeId:
            'd7649d428b9ff33d188ecbf38a7e4d8fd167fa01b2e10fe9a8f9308e52f1d7cc',
        },
        {
          name: 'gas',
          typeId:
            '1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0',
        },
      ],
    },
    {
      type: 'struct interfaces::warp_route::BeneficiarySetEvent',
      metadataTypeId: 17,
      components: [
        {
          name: 'beneficiary',
          typeId: 6,
        },
      ],
    },
    {
      type: 'struct interfaces::warp_route::ClaimEvent',
      metadataTypeId: 18,
      components: [
        {
          name: 'beneficiary',
          typeId: 6,
        },
        {
          name: 'amount',
          typeId:
            '1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0',
        },
      ],
    },
    {
      type: 'struct interfaces::warp_route::ReceivedTransferRemoteEvent',
      metadataTypeId: 19,
      components: [
        {
          name: 'origin',
          typeId:
            'd7649d428b9ff33d188ecbf38a7e4d8fd167fa01b2e10fe9a8f9308e52f1d7cc',
        },
        {
          name: 'recipient',
          typeId:
            '7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b',
        },
        {
          name: 'amount',
          typeId:
            '1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0',
        },
      ],
    },
    {
      type: 'struct interfaces::warp_route::SentTransferRemoteEvent',
      metadataTypeId: 20,
      components: [
        {
          name: 'destination',
          typeId:
            'd7649d428b9ff33d188ecbf38a7e4d8fd167fa01b2e10fe9a8f9308e52f1d7cc',
        },
        {
          name: 'recipient',
          typeId:
            '7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b',
        },
        {
          name: 'amount',
          typeId:
            '1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0',
        },
      ],
    },
    {
      type: 'struct interfaces::warp_route::TokenMetadata',
      metadataTypeId: 21,
      components: [
        {
          name: 'name',
          typeId: 31,
        },
        {
          name: 'symbol',
          typeId: 31,
        },
        {
          name: 'decimals',
          typeId:
            'c89951a24c6ca28c13fd1cfdc646b2b656d69e61a92b91023be7eb58eb914b6b',
        },
        {
          name: 'total_supply',
          typeId:
            '1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0',
        },
        {
          name: 'asset_id',
          typeId: 27,
        },
        {
          name: 'sub_id',
          typeId:
            '7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b',
        },
      ],
    },
    {
      type: 'struct standards::src20::SetDecimalsEvent',
      metadataTypeId: 22,
      components: [
        {
          name: 'asset',
          typeId: 27,
        },
        {
          name: 'decimals',
          typeId:
            'c89951a24c6ca28c13fd1cfdc646b2b656d69e61a92b91023be7eb58eb914b6b',
        },
        {
          name: 'sender',
          typeId: 6,
        },
      ],
    },
    {
      type: 'struct standards::src20::SetNameEvent',
      metadataTypeId: 23,
      components: [
        {
          name: 'asset',
          typeId: 27,
        },
        {
          name: 'name',
          typeId: 7,
          typeArguments: [
            {
              name: '',
              typeId: 31,
            },
          ],
        },
        {
          name: 'sender',
          typeId: 6,
        },
      ],
    },
    {
      type: 'struct standards::src20::SetSymbolEvent',
      metadataTypeId: 24,
      components: [
        {
          name: 'asset',
          typeId: 27,
        },
        {
          name: 'symbol',
          typeId: 7,
          typeArguments: [
            {
              name: '',
              typeId: 31,
            },
          ],
        },
        {
          name: 'sender',
          typeId: 6,
        },
      ],
    },
    {
      type: 'struct standards::src20::TotalSupplyEvent',
      metadataTypeId: 25,
      components: [
        {
          name: 'asset',
          typeId: 27,
        },
        {
          name: 'supply',
          typeId:
            '1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0',
        },
        {
          name: 'sender',
          typeId: 6,
        },
      ],
    },
    {
      type: 'struct std::address::Address',
      metadataTypeId: 26,
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
      metadataTypeId: 27,
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
      metadataTypeId: 28,
      components: [
        {
          name: 'buf',
          typeId: 29,
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
      metadataTypeId: 29,
      components: [
        {
          name: 'ptr',
          typeId: 15,
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
      metadataTypeId: 30,
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
      metadataTypeId: 31,
      components: [
        {
          name: 'bytes',
          typeId: 28,
        },
      ],
    },
    {
      type: 'struct std::vec::RawVec',
      metadataTypeId: 32,
      components: [
        {
          name: 'ptr',
          typeId: 15,
        },
        {
          name: 'cap',
          typeId:
            '1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0',
        },
      ],
      typeParameters: [14],
    },
    {
      type: 'struct std::vec::Vec',
      metadataTypeId: 33,
      components: [
        {
          name: 'buf',
          typeId: 32,
          typeArguments: [
            {
              name: '',
              typeId: 14,
            },
          ],
        },
        {
          name: 'len',
          typeId:
            '1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0',
        },
      ],
      typeParameters: [14],
    },
    {
      type: 'struct sway_libs::ownership::events::OwnershipRenounced',
      metadataTypeId: 34,
      components: [
        {
          name: 'previous_owner',
          typeId: 6,
        },
      ],
    },
    {
      type: 'struct sway_libs::ownership::events::OwnershipSet',
      metadataTypeId: 35,
      components: [
        {
          name: 'new_owner',
          typeId: 6,
        },
      ],
    },
    {
      type: 'struct sway_libs::ownership::events::OwnershipTransferred',
      metadataTypeId: 36,
      components: [
        {
          name: 'new_owner',
          typeId: 6,
        },
        {
          name: 'previous_owner',
          typeId: 6,
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
          name: 'storage',
          arguments: ['read', 'write'],
        },
      ],
    },
    {
      inputs: [],
      name: 'get_hook',
      output:
        '29c10735d33b5159f0c71ee1dbd17b36a3e69e41f00fab0d42e1bd9f428d8a54',
      attributes: [
        {
          name: 'doc-comment',
          arguments: [
            ' Gets the post dispatch hook contract ID that the WarpRoute contract is using',
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
          arguments: [' * [ContractId] - The post dispatch hook contract ID'],
        },
        {
          name: 'storage',
          arguments: ['read'],
        },
      ],
    },
    {
      inputs: [],
      name: 'get_mailbox',
      output:
        '29c10735d33b5159f0c71ee1dbd17b36a3e69e41f00fab0d42e1bd9f428d8a54',
      attributes: [
        {
          name: 'doc-comment',
          arguments: [
            ' Gets the mailbox contract ID that the WarpRoute contract is using for transfers',
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
          arguments: [' * [ContractId] - The mailbox contract ID'],
        },
        {
          name: 'storage',
          arguments: ['read'],
        },
      ],
    },
    {
      inputs: [],
      name: 'get_token_info',
      output:
        '759840b3d54cc488313168a32bb4d8e7530bb5df830c3c8c49e00c511d749bff',
      attributes: [
        {
          name: 'doc-comment',
          arguments: [' Gets the token metadata of the WarpRoute contract'],
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
          arguments: [' * [TokenMetadata] - The token metadata'],
        },
        {
          name: 'storage',
          arguments: ['read'],
        },
      ],
    },
    {
      inputs: [],
      name: 'get_token_mode',
      output:
        '32a1c51a5f189b8e6b3a92437c9538256596892b398ab22a35823a19ae46b33e',
      attributes: [
        {
          name: 'doc-comment',
          arguments: [' Gets the token mode of the WarpRoute contract'],
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
          arguments: [' * [WarpRouteTokenMode] - The token mode'],
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
          name: 'mailbox_address',
          concreteTypeId:
            '7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b',
        },
        {
          name: 'mode',
          concreteTypeId:
            '32a1c51a5f189b8e6b3a92437c9538256596892b398ab22a35823a19ae46b33e',
        },
        {
          name: 'hook',
          concreteTypeId:
            '7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b',
        },
        {
          name: 'ism',
          concreteTypeId:
            '7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b',
        },
        {
          name: 'token_name',
          concreteTypeId:
            '7c06d929390a9aeeb8ffccf8173ac0d101a9976d99dda01cce74541a81e75ac0',
        },
        {
          name: 'token_symbol',
          concreteTypeId:
            '7c06d929390a9aeeb8ffccf8173ac0d101a9976d99dda01cce74541a81e75ac0',
        },
        {
          name: 'decimals',
          concreteTypeId:
            '2da102c46c7263beeed95818cd7bee801716ba8303dddafdcd0f6c9efda4a0f1',
        },
        {
          name: 'total_supply',
          concreteTypeId:
            'd852149004cc9ec0bbe7dc4e37bffea1d41469b759512b6136f2e865a4c06e7d',
        },
        {
          name: 'asset_id',
          concreteTypeId:
            '191bf2140761b3c5ab6c43992d162bb3dc9d7f2272b2ee5f5eeea411ddedcd32',
        },
        {
          name: 'asset_contract_id',
          concreteTypeId:
            '0c2beb9013490c4f753f2757dfe2d8340b22ce3827d596d81d249b7038033cb6',
        },
      ],
      name: 'initialize',
      output:
        '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
      attributes: [
        {
          name: 'doc-comment',
          arguments: [' Initializes the WarpRoute contract'],
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
            ' * `owner`: [Identity] - The address of the owner of the contract',
          ],
        },
        {
          name: 'doc-comment',
          arguments: [
            ' * `mailbox_address`: [b256] - The address of the mailbox contract to use',
          ],
        },
        {
          name: 'doc-comment',
          arguments: [
            ' * `mode`: [WarpRouteTokenMode] - The mode of the WarpRoute contract',
          ],
        },
        {
          name: 'doc-comment',
          arguments: [
            ' * `hook`: [b256] - The address of the post dispatch hook contract to use',
          ],
        },
        {
          name: 'doc-comment',
          arguments: [
            ' * `ism`: [b256] - The address of the ISM contract to use',
          ],
        },
        {
          name: 'doc-comment',
          arguments: [
            ' * `token_name`: [Option<String>] - The name of the token',
          ],
        },
        {
          name: 'doc-comment',
          arguments: [
            ' * `token_symbol`: [Option<String>] - The symbol of the token',
          ],
        },
        {
          name: 'doc-comment',
          arguments: [
            ' * `decimals`: [Option<u8>] - The number of decimals of the token',
          ],
        },
        {
          name: 'doc-comment',
          arguments: [
            ' * `total_supply`: [Option<u64>] - The total supply of the token',
          ],
        },
        {
          name: 'doc-comment',
          arguments: [
            ' * `asset_id`: [Option<AssetId>] - The asset ID of the token - only required in collateral/native mode',
          ],
        },
        {
          name: 'doc-comment',
          arguments: [
            ' * `asset_contract_id`: [Option<b256>] - The asset contract ID of the token - only required in collateral mode',
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
          arguments: [' * If the contract is already initialized'],
        },
        {
          name: 'doc-comment',
          arguments: [' * If the asset ID is not provided in collateral mode'],
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
      ],
      name: 'quote_gas_payment',
      output:
        '1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0',
      attributes: [
        {
          name: 'doc-comment',
          arguments: [' Gets the quote for gas payment'],
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
            ' * `destination_domain`: [u32] - The destination domain',
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
          name: 'storage',
          arguments: ['read', 'write'],
        },
      ],
    },
    {
      inputs: [
        {
          name: 'hook',
          concreteTypeId:
            '29c10735d33b5159f0c71ee1dbd17b36a3e69e41f00fab0d42e1bd9f428d8a54',
        },
      ],
      name: 'set_hook',
      output:
        '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
      attributes: [
        {
          name: 'doc-comment',
          arguments: [
            ' Sets the post dispatch hook contract ID that the WarpRoute contract is using',
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
            ' * `hook`: [ContractId] - The post dispatch hook contract ID',
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
          arguments: [' * If the caller is not the owner'],
        },
        {
          name: 'doc-comment',
          arguments: [' * If the hook address is zero'],
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
      name: 'set_ism',
      output:
        '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
      attributes: [
        {
          name: 'doc-comment',
          arguments: [' Sets the default ISM'],
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
          arguments: [' * `module`: [ContractId] - The ISM contract ID'],
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
          arguments: [' * If the caller is not the owner'],
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
          name: 'mailbox_address',
          concreteTypeId:
            '29c10735d33b5159f0c71ee1dbd17b36a3e69e41f00fab0d42e1bd9f428d8a54',
        },
      ],
      name: 'set_mailbox',
      output:
        '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
      attributes: [
        {
          name: 'doc-comment',
          arguments: [
            ' Sets the mailbox contract ID that the WarpRoute contract is using for transfers',
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
            ' * `mailbox_address`: [ContractId] - The mailbox contract ID',
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
          arguments: [' * If the caller is not the owner'],
        },
        {
          name: 'doc-comment',
          arguments: [' * If the mailbox address is zero'],
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
          name: 'destination_domain',
          concreteTypeId:
            'd7649d428b9ff33d188ecbf38a7e4d8fd167fa01b2e10fe9a8f9308e52f1d7cc',
        },
        {
          name: 'recipient',
          concreteTypeId:
            '7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b',
        },
        {
          name: 'amount',
          concreteTypeId:
            '1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0',
        },
        {
          name: 'metadata',
          concreteTypeId:
            '50b87f43f0097a720c18f3fb2100c4502484b716128f2706b3e187aa35a6dfe8',
        },
        {
          name: 'hook',
          concreteTypeId:
            '0d79387ad3bacdc3b7aad9da3a96f4ce60d9a1b6002df254069ad95a3931d5c8',
        },
      ],
      name: 'transfer_remote',
      output:
        '7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b',
      attributes: [
        {
          name: 'doc-comment',
          arguments: [' Transfers tokens to a remote domain'],
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
            ' * `destination_domain`: [u32] - The domain to transfer the tokens to',
          ],
        },
        {
          name: 'doc-comment',
          arguments: [' * `recipient`: [b256] - The address of the recipient'],
        },
        {
          name: 'doc-comment',
          arguments: [' * `amount`: [u64] - The amount of tokens to transfer'],
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
          arguments: [' * If the contract is paused'],
        },
        {
          name: 'doc-comment',
          arguments: [' * If reentrancy is detected'],
        },
        {
          name: 'doc-comment',
          arguments: [' * If the amount provided is greater than amount sent'],
        },
        {
          name: 'doc-comment',
          arguments: [
            ' * If the asset ID of the asset being transferred is not the same as the asset ID set on the contract',
          ],
        },
        {
          name: 'doc-comment',
          arguments: [' * If any external call fails'],
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
      inputs: [],
      name: 'all_domains',
      output:
        '13c38f4111bad6468fad4f8ea82fd744546b63be49db9439fb3d94e14ae2bb3a',
      attributes: [
        {
          name: 'doc-comment',
          arguments: [' Gets all domains enrolled in the contract'],
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
          arguments: [' * [Vec<u32>] - The domains enrolled in the contract'],
        },
        {
          name: 'storage',
          arguments: ['read'],
        },
      ],
    },
    {
      inputs: [],
      name: 'all_routers',
      output:
        '32559685d0c9845f059bf9d472a0a38cf77d36c23dfcffe5489e86a65cdd9198',
      attributes: [
        {
          name: 'doc-comment',
          arguments: [' Gets all routers enrolled in the contract'],
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
          arguments: [' * [Vec<b256>] - The routers enrolled in the contract'],
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
          name: 'router',
          concreteTypeId:
            '7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b',
        },
      ],
      name: 'enroll_remote_router',
      output:
        '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
      attributes: [
        {
          name: 'doc-comment',
          arguments: [' Enrolls a new router for a specific domain'],
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
          arguments: [' * `domain`: [u32] - The domain to enroll'],
        },
        {
          name: 'doc-comment',
          arguments: [' * `router`: [b256] - The router address to enroll'],
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
          arguments: [' * If the caller is not the owner'],
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
          name: 'domains',
          concreteTypeId:
            '13c38f4111bad6468fad4f8ea82fd744546b63be49db9439fb3d94e14ae2bb3a',
        },
        {
          name: 'routers',
          concreteTypeId:
            '32559685d0c9845f059bf9d472a0a38cf77d36c23dfcffe5489e86a65cdd9198',
        },
      ],
      name: 'enroll_remote_routers',
      output:
        '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
      attributes: [
        {
          name: 'doc-comment',
          arguments: [' Batch enrolls multiple routers for multiple domains'],
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
          arguments: [' * `domains`: [Vec<u32>] - The domains to enroll'],
        },
        {
          name: 'doc-comment',
          arguments: [
            ' * `routers`: [Vec<b256>] - The router addresses to enroll',
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
          arguments: [
            " * If the lengths of domains and routers arrays don't match",
          ],
        },
        {
          name: 'doc-comment',
          arguments: [' * If the caller is not the owner'],
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
          name: 'router',
          concreteTypeId:
            '7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b',
        },
      ],
      name: 'remote_router_decimals',
      output:
        'c89951a24c6ca28c13fd1cfdc646b2b656d69e61a92b91023be7eb58eb914b6b',
      attributes: [
        {
          name: 'doc-comment',
          arguments: [' Gets the decimals for a specific remote router'],
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
          arguments: [' * `router`: [b256] - The router to query'],
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
      name: 'router',
      output:
        '7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b',
      attributes: [
        {
          name: 'doc-comment',
          arguments: [' Gets the router address for a specific domain'],
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
          arguments: [' * `domain`: [u32] - The domain to query'],
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
            ' * [b256] - The router address (zero address if not set)',
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
          name: 'router',
          concreteTypeId:
            '7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b',
        },
        {
          name: 'decimals',
          concreteTypeId:
            'c89951a24c6ca28c13fd1cfdc646b2b656d69e61a92b91023be7eb58eb914b6b',
        },
      ],
      name: 'set_remote_router_decimals',
      output:
        '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
      attributes: [
        {
          name: 'doc-comment',
          arguments: [' Sets the decimals for a specific remote router'],
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
          arguments: [' * `router`: [b256] - The router to set'],
        },
        {
          name: 'doc-comment',
          arguments: [' * `decimals`: [u8] - The decimals to set'],
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
          arguments: [' * If the caller is not the owner'],
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
          name: 'domain',
          concreteTypeId:
            'd7649d428b9ff33d188ecbf38a7e4d8fd167fa01b2e10fe9a8f9308e52f1d7cc',
        },
      ],
      name: 'unenroll_remote_router',
      output:
        'b760f44fa5965c2474a3b471467a22c43185152129295af588b022ae50b50903',
      attributes: [
        {
          name: 'doc-comment',
          arguments: [' Removes a router for a specific domain'],
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
            ' * `domain`: [u32] - The domain to remove the router for',
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
          arguments: [' * If the caller is not the owner'],
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
          name: 'domain',
          concreteTypeId:
            'd7649d428b9ff33d188ecbf38a7e4d8fd167fa01b2e10fe9a8f9308e52f1d7cc',
        },
      ],
      name: 'destination_gas',
      output:
        '1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0',
      attributes: [
        {
          name: 'doc-comment',
          arguments: [' Gets the gas amount dispatched for a specific domain'],
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
          arguments: [' * `domain`: [u32] - The destination domain ID'],
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
          arguments: [' * [u64] - The gas limit'],
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
          name: 'destination',
          concreteTypeId:
            'd7649d428b9ff33d188ecbf38a7e4d8fd167fa01b2e10fe9a8f9308e52f1d7cc',
        },
      ],
      name: 'gas_router_hook_metadata',
      output:
        'cdd87b7d12fe505416570c294c884bca819364863efe3bf539245fa18515fbbb',
      attributes: [
        {
          name: 'doc-comment',
          arguments: [' Gets the metadata for the GasRouter hook'],
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
          arguments: [' * `destination`: [u32] - The destination domain ID'],
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
          arguments: [' * [Bytes] - The metadata for the GasRouter hook'],
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
          name: 'gas',
          concreteTypeId:
            '1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0',
        },
      ],
      name: 'set_destination_gas',
      output:
        '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
      attributes: [
        {
          name: 'doc-comment',
          arguments: [' Sets the gas amount dispatched for a specific domain'],
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
          arguments: [' * `domain`: [u32] - The destination domain ID'],
        },
        {
          name: 'doc-comment',
          arguments: [' * `gas`: [u64] - The gas limit'],
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
          name: 'gas_configs',
          concreteTypeId:
            'ce2cf7a7b6f707fd4414b08da2c01ec7d590183e9dbf9d70d8070b21171b1ca7',
        },
      ],
      name: 'set_destination_gas_configs',
      output:
        '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
      attributes: [
        {
          name: 'doc-comment',
          arguments: [
            ' Sets the gas amount dispatched for each configured domain',
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
            ' * `gasConfigs`: [Vec<GasRouterConfig>] - The array of GasRouterConfig structs',
          ],
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
          name: 'origin',
          concreteTypeId:
            'd7649d428b9ff33d188ecbf38a7e4d8fd167fa01b2e10fe9a8f9308e52f1d7cc',
        },
        {
          name: 'sender',
          concreteTypeId:
            '7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b',
        },
        {
          name: 'message_body',
          concreteTypeId:
            'cdd87b7d12fe505416570c294c884bca819364863efe3bf539245fa18515fbbb',
        },
      ],
      name: 'handle',
      output:
        '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
      attributes: [
        {
          name: 'doc-comment',
          arguments: [' Handles a transfer from a remote domain'],
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
          arguments: [' * `origin`: [u32] - The domain of the origin'],
        },
        {
          name: 'doc-comment',
          arguments: [' * `sender`: [b256] - The address of the sender'],
        },
        {
          name: 'doc-comment',
          arguments: [' * `message_body`: [bytes] - The message body'],
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
          arguments: [' * If the contract is paused'],
        },
        {
          name: 'doc-comment',
          arguments: [' * If the message has already been delivered'],
        },
        {
          name: 'doc-comment',
          arguments: [' * If the sender is not the mailbox'],
        },
        {
          name: 'doc-comment',
          arguments: [' * If the cumulative supply exceeds the maximum supply'],
        },
        {
          name: 'storage',
          arguments: ['read', 'write'],
        },
      ],
    },
    {
      inputs: [],
      name: 'interchain_security_module',
      output:
        '29c10735d33b5159f0c71ee1dbd17b36a3e69e41f00fab0d42e1bd9f428d8a54',
      attributes: [
        {
          name: 'storage',
          arguments: ['read'],
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
      logId: '4571204900286667806',
      concreteTypeId:
        '3f702ea3351c9c1ece2b84048006c8034a24cbc2bad2e740d0412b4172951d3d',
    },
    {
      logId: '18277395193656438770',
      concreteTypeId:
        'fda65a174152eff209e2507cb14003806f51b76a1e192d0cf07e1942cfee09c7',
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
      logId: '18149631459970394923',
      concreteTypeId:
        'fbe071a6e7ca2b2b5e503e82638f9f11c861a6fb452b65473eca8260db87392d',
    },
    {
      logId: '14321618427101975361',
      concreteTypeId:
        'c6c09c148c1a1341c7ab81697b3545cc695fa67668a169cddc59790a9a0b6b44',
    },
    {
      logId: '7845998088195677205',
      concreteTypeId:
        '6ce295b0fb4c1c15e8ed1cfa4babda47d8a04940a5266a3229e12243a2e37c2c',
    },
    {
      logId: '12152039456660331088',
      concreteTypeId:
        'a8a4b78066c51a50da6349bd395fe1c67e774d75c1db2c5c22288a432d7a363d',
    },
    {
      logId: '16139176946940135860',
      concreteTypeId:
        'dff9dfec998a49b40f1c4b09567400f0e712aaf939c08f7d07bc5c63116e1084',
    },
    {
      logId: '17462098202904023478',
      concreteTypeId:
        'f255d5cc2114d1b6bc34bef4c28d4b60caccffd9a672ed16b79ea217e1c4a8a3',
    },
    {
      logId: '8469269053966207535',
      concreteTypeId:
        '7588e3551cdd4a2f634a12f13a7e13fd3fec214c44eb154a64cacbd2859159d9',
    },
    {
      logId: '10252207693990764812',
      concreteTypeId:
        '8e47289443d8a10c3f7d4215ab86b95ffe6ec75dd3d12a2ccad26a1fa2f66548',
    },
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
      logId: '9423057678640657592',
      concreteTypeId:
        '82c56d088164b4b8abd17409dedfa8e8a61f9ffc4d6b19e32575b36004adfb09',
    },
    {
      logId: '4237256875605624201',
      concreteTypeId:
        '3acdc2adac8e0589c5864525e0edc9dc61a9571a4d09c3c57b58ea76d33f4b46',
    },
    {
      logId: '12056742690164791610',
      concreteTypeId:
        'a7522798eb8f593a97fc3c450f37b193f24cb0d97391dbf53a6dd873c40cefb9',
    },
    {
      logId: '10098701174489624218',
      concreteTypeId:
        '8c25cb3686462e9a86d2883c5688a22fe738b0bbc85f458d2d2b5f3f667c6d5a',
    },
    {
      logId: '13545790289566214739',
      concreteTypeId:
        'bbfc507feb87aa539acdfac1829090f6ef621885b47880f5c521d5d41a89830a',
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
      name: 'DEFAULT_DECIMALS',
      concreteTypeId:
        'c89951a24c6ca28c13fd1cfdc646b2b656d69e61a92b91023be7eb58eb914b6b',
      offset: 92680,
    },
    {
      name: 'EXPECTED_OWNER',
      concreteTypeId:
        '7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b',
      offset: 92688,
    },
  ],
};

const storageSlots: StorageSlot[] = [
  {
    key: '013fc3f7c63bb1ab21618d12eda29df53765cf109efb7aa0713e1cb63d712af7',
    value: '0000000000000000000000000000000000000000000000000000000000000000',
  },
  {
    key: '2fa1ff14e204b91bddd90e41b567b61bf1d03ba69b9d8318dad2b2e05f4619dc',
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
    key: '693acfbc935dc1d73b81fcc38580f377b1edfde0def9402a446c443400d0fc65',
    value: '0000000000000000000000000000000000000000000000000000000000000000',
  },
  {
    key: '93b67ee4f0f76b71456fb4385c86aec15689e1ce5f6f6ac63b71716afa052998',
    value: '0000000000000000000000000000000000000000000000000000000000000000',
  },
  {
    key: 'ccecdaae64d028efc03d6da906d6eac1e11948509e5f9244fc1067951e4b7e91',
    value: '0000000000000001000000000000000000000000000000000000000000000000',
  },
  {
    key: 'ccecdaae64d028efc03d6da906d6eac1e11948509e5f9244fc1067951e4b7e92',
    value: '0000000000000000000000000000000000000000000000000000000000000000',
  },
  {
    key: 'd5354b695493bac2ed3dd4f37b9e77c1d20cfa9a5eef204fdc8e09703a43359c',
    value: '0000000000000000000000000000000000000000000000000000000000000000',
  },
  {
    key: 'd9befdb0fe32b18efc27ec4199d2bd652637ac46541b3425607ff9728b389356',
    value: '0000000000000000000000000000000000000000000000000000000000000000',
  },
];

export class WarpRouteInterface extends Interface {
  constructor() {
    super(abi);
  }

  declare functions: {
    beneficiary: FunctionFragment;
    claim: FunctionFragment;
    get_hook: FunctionFragment;
    get_mailbox: FunctionFragment;
    get_token_info: FunctionFragment;
    get_token_mode: FunctionFragment;
    initialize: FunctionFragment;
    quote_gas_payment: FunctionFragment;
    set_beneficiary: FunctionFragment;
    set_hook: FunctionFragment;
    set_ism: FunctionFragment;
    set_mailbox: FunctionFragment;
    transfer_remote: FunctionFragment;
    all_domains: FunctionFragment;
    all_routers: FunctionFragment;
    enroll_remote_router: FunctionFragment;
    enroll_remote_routers: FunctionFragment;
    remote_router_decimals: FunctionFragment;
    router: FunctionFragment;
    set_remote_router_decimals: FunctionFragment;
    unenroll_remote_router: FunctionFragment;
    destination_gas: FunctionFragment;
    gas_router_hook_metadata: FunctionFragment;
    set_destination_gas: FunctionFragment;
    set_destination_gas_configs: FunctionFragment;
    handle: FunctionFragment;
    interchain_security_module: FunctionFragment;
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

export class WarpRoute extends __Contract {
  static readonly abi = abi;
  static readonly storageSlots = storageSlots;

  declare interface: WarpRouteInterface;
  declare functions: {
    beneficiary: InvokeFunction<[], IdentityOutput>;
    claim: InvokeFunction<[asset?: Option<AssetIdInput>], void>;
    get_hook: InvokeFunction<[], ContractIdOutput>;
    get_mailbox: InvokeFunction<[], ContractIdOutput>;
    get_token_info: InvokeFunction<[], TokenMetadataOutput>;
    get_token_mode: InvokeFunction<[], WarpRouteTokenModeOutput>;
    initialize: InvokeFunction<
      [
        owner: IdentityInput,
        mailbox_address: string,
        mode: WarpRouteTokenModeInput,
        hook: string,
        ism: string,
        token_name?: Option<StdString>,
        token_symbol?: Option<StdString>,
        decimals?: Option<BigNumberish>,
        total_supply?: Option<BigNumberish>,
        asset_id?: Option<AssetIdInput>,
        asset_contract_id?: Option<string>,
      ],
      void
    >;
    quote_gas_payment: InvokeFunction<[destination_domain: BigNumberish], BN>;
    set_beneficiary: InvokeFunction<[beneficiary: IdentityInput], void>;
    set_hook: InvokeFunction<[hook: ContractIdInput], void>;
    set_ism: InvokeFunction<[module: ContractIdInput], void>;
    set_mailbox: InvokeFunction<[mailbox_address: ContractIdInput], void>;
    transfer_remote: InvokeFunction<
      [
        destination_domain: BigNumberish,
        recipient: string,
        amount: BigNumberish,
        metadata?: Option<Bytes>,
        hook?: Option<ContractIdInput>,
      ],
      string
    >;
    all_domains: InvokeFunction<[], Vec<number>>;
    all_routers: InvokeFunction<[], Vec<string>>;
    enroll_remote_router: InvokeFunction<
      [domain: BigNumberish, router: string],
      void
    >;
    enroll_remote_routers: InvokeFunction<
      [domains: Vec<BigNumberish>, routers: Vec<string>],
      void
    >;
    remote_router_decimals: InvokeFunction<[router: string], number>;
    router: InvokeFunction<[domain: BigNumberish], string>;
    set_remote_router_decimals: InvokeFunction<
      [router: string, decimals: BigNumberish],
      void
    >;
    unenroll_remote_router: InvokeFunction<[domain: BigNumberish], boolean>;
    destination_gas: InvokeFunction<[domain: BigNumberish], BN>;
    gas_router_hook_metadata: InvokeFunction<
      [destination: BigNumberish],
      Bytes
    >;
    set_destination_gas: InvokeFunction<
      [domain: BigNumberish, gas: BigNumberish],
      void
    >;
    set_destination_gas_configs: InvokeFunction<
      [gas_configs: Vec<GasRouterConfigInput>],
      void
    >;
    handle: InvokeFunction<
      [origin: BigNumberish, sender: string, message_body: Bytes],
      void
    >;
    interchain_security_module: InvokeFunction<[], ContractIdOutput>;
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
