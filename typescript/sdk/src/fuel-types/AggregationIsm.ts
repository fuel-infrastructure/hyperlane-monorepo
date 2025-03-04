/*
  Fuels version: 0.99.0
*/

import { Contract as __Contract, Interface } from "fuels";
import type {
  Provider,
  Account,
  StorageSlot,
  Address,
  BigNumberish,
  Bytes,
  FunctionFragment,
  InvokeFunction,
} from 'fuels';

import type { Enum, Vec } from "./common.js";

export enum AccessErrorInput { NotOwner = 'NotOwner' };
export enum AccessErrorOutput { NotOwner = 'NotOwner' };
export enum AggregationIsmErrorInput { DidNotMeetThreshold = 'DidNotMeetThreshold', UnexpectedInitAddress = 'UnexpectedInitAddress', FailedToVerify = 'FailedToVerify' };
export enum AggregationIsmErrorOutput { DidNotMeetThreshold = 'DidNotMeetThreshold', UnexpectedInitAddress = 'UnexpectedInitAddress', FailedToVerify = 'FailedToVerify' };
export type IdentityInput = Enum<{ Address: AddressInput, ContractId: ContractIdInput }>;
export type IdentityOutput = Enum<{ Address: AddressOutput, ContractId: ContractIdOutput }>;
export enum InitializationErrorInput { CannotReinitialized = 'CannotReinitialized' };
export enum InitializationErrorOutput { CannotReinitialized = 'CannotReinitialized' };
export enum ModuleTypeInput { UNUSED = 'UNUSED', ROUTING = 'ROUTING', AGGREGATION = 'AGGREGATION', LEGACY_MULTISIG = 'LEGACY_MULTISIG', MERKLE_ROOT_MULTISIG = 'MERKLE_ROOT_MULTISIG', MESSAGE_ID_MULTISIG = 'MESSAGE_ID_MULTISIG', NULL = 'NULL', CCIP_READ = 'CCIP_READ' };
export enum ModuleTypeOutput { UNUSED = 'UNUSED', ROUTING = 'ROUTING', AGGREGATION = 'AGGREGATION', LEGACY_MULTISIG = 'LEGACY_MULTISIG', MERKLE_ROOT_MULTISIG = 'MERKLE_ROOT_MULTISIG', MESSAGE_ID_MULTISIG = 'MESSAGE_ID_MULTISIG', NULL = 'NULL', CCIP_READ = 'CCIP_READ' };
export type StateInput = Enum<{ Uninitialized: undefined, Initialized: IdentityInput, Revoked: undefined }>;
export type StateOutput = Enum<{ Uninitialized: void, Initialized: IdentityOutput, Revoked: void }>;

export type AddressInput = { bits: string };
export type AddressOutput = AddressInput;
export type ContractIdInput = { bits: string };
export type ContractIdOutput = ContractIdInput;
export type OwnershipRenouncedInput = { previous_owner: IdentityInput };
export type OwnershipRenouncedOutput = { previous_owner: IdentityOutput };
export type OwnershipSetInput = { new_owner: IdentityInput };
export type OwnershipSetOutput = { new_owner: IdentityOutput };
export type OwnershipTransferredInput = { new_owner: IdentityInput, previous_owner: IdentityInput };
export type OwnershipTransferredOutput = { new_owner: IdentityOutput, previous_owner: IdentityOutput };

export type AggregationIsmConfigurables = Partial<{
  EXPECTED_INITIALIZER: string;
}>;

const abi = {
  "programType": "contract",
  "specVersion": "1",
  "encodingVersion": "1",
  "concreteTypes": [
    {
      "type": "()",
      "concreteTypeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
    },
    {
      "type": "(struct std::vec::Vec<struct std::contract_id::ContractId>, u8)",
      "concreteTypeId": "338f8824eff0cecf524266f2ab1e824b639f96afdeef1cbd5b1c66f9f50bb70e",
      "metadataTypeId": 0
    },
    {
      "type": "b256",
      "concreteTypeId": "7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b"
    },
    {
      "type": "bool",
      "concreteTypeId": "b760f44fa5965c2474a3b471467a22c43185152129295af588b022ae50b50903"
    },
    {
      "type": "enum interfaces::isms::aggregation_ism::AggregationIsmError",
      "concreteTypeId": "d132a0a455da99b27af77b6df0f334147b4f0872c3f22da9d452ab0baba6e461",
      "metadataTypeId": 1
    },
    {
      "type": "enum interfaces::isms::ism::ModuleType",
      "concreteTypeId": "4fcafc76b3c7218fc6592123cebdc1b111dcfb70e34f254ca8279c70c0d5fae5",
      "metadataTypeId": 2
    },
    {
      "type": "enum standards::src5::AccessError",
      "concreteTypeId": "3f702ea3351c9c1ece2b84048006c8034a24cbc2bad2e740d0412b4172951d3d",
      "metadataTypeId": 3
    },
    {
      "type": "enum standards::src5::State",
      "concreteTypeId": "192bc7098e2fe60635a9918afb563e4e5419d386da2bdbf0d716b4bc8549802c",
      "metadataTypeId": 4
    },
    {
      "type": "enum std::identity::Identity",
      "concreteTypeId": "ab7cd04e05be58e3fc15d424c2c4a57f824a2a2d97d67252440a3925ebdc1335",
      "metadataTypeId": 5
    },
    {
      "type": "enum sway_libs::ownership::errors::InitializationError",
      "concreteTypeId": "1dfe7feadc1d9667a4351761230f948744068a090fe91b1bc6763a90ed5d3893",
      "metadataTypeId": 6
    },
    {
      "type": "struct std::bytes::Bytes",
      "concreteTypeId": "cdd87b7d12fe505416570c294c884bca819364863efe3bf539245fa18515fbbb",
      "metadataTypeId": 10
    },
    {
      "type": "struct std::contract_id::ContractId",
      "concreteTypeId": "29c10735d33b5159f0c71ee1dbd17b36a3e69e41f00fab0d42e1bd9f428d8a54",
      "metadataTypeId": 12
    },
    {
      "type": "struct std::vec::Vec<struct std::contract_id::ContractId>",
      "concreteTypeId": "b8ca7626a08e8fb93379b5d9d58d8a12eede8de9f087bfa21feccca44f92e211",
      "metadataTypeId": 14,
      "typeArguments": [
        "29c10735d33b5159f0c71ee1dbd17b36a3e69e41f00fab0d42e1bd9f428d8a54"
      ]
    },
    {
      "type": "struct sway_libs::ownership::events::OwnershipRenounced",
      "concreteTypeId": "43c4fa7b3297401afbf300127e59ea913e5c8f0c7ae69abbec789ab0bb872bed",
      "metadataTypeId": 15
    },
    {
      "type": "struct sway_libs::ownership::events::OwnershipSet",
      "concreteTypeId": "e1ef35033ea9d2956f17c3292dea4a46ce7d61fdf37bbebe03b7b965073f43b5",
      "metadataTypeId": 16
    },
    {
      "type": "struct sway_libs::ownership::events::OwnershipTransferred",
      "concreteTypeId": "b3fffbcb3158d7c010c31b194b60fb7857adb4ad61bdcf4b8b42958951d9f308",
      "metadataTypeId": 17
    },
    {
      "type": "u8",
      "concreteTypeId": "c89951a24c6ca28c13fd1cfdc646b2b656d69e61a92b91023be7eb58eb914b6b"
    }
  ],
  "metadataTypes": [
    {
      "type": "(_, _)",
      "metadataTypeId": 0,
      "components": [
        {
          "name": "__tuple_element",
          "typeId": 14,
          "typeArguments": [
            {
              "name": "",
              "typeId": 12
            }
          ]
        },
        {
          "name": "__tuple_element",
          "typeId": "c89951a24c6ca28c13fd1cfdc646b2b656d69e61a92b91023be7eb58eb914b6b"
        }
      ]
    },
    {
      "type": "enum interfaces::isms::aggregation_ism::AggregationIsmError",
      "metadataTypeId": 1,
      "components": [
        {
          "name": "DidNotMeetThreshold",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        },
        {
          "name": "UnexpectedInitAddress",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        },
        {
          "name": "FailedToVerify",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        }
      ]
    },
    {
      "type": "enum interfaces::isms::ism::ModuleType",
      "metadataTypeId": 2,
      "components": [
        {
          "name": "UNUSED",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        },
        {
          "name": "ROUTING",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        },
        {
          "name": "AGGREGATION",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        },
        {
          "name": "LEGACY_MULTISIG",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        },
        {
          "name": "MERKLE_ROOT_MULTISIG",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        },
        {
          "name": "MESSAGE_ID_MULTISIG",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        },
        {
          "name": "NULL",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        },
        {
          "name": "CCIP_READ",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        }
      ]
    },
    {
      "type": "enum standards::src5::AccessError",
      "metadataTypeId": 3,
      "components": [
        {
          "name": "NotOwner",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        }
      ]
    },
    {
      "type": "enum standards::src5::State",
      "metadataTypeId": 4,
      "components": [
        {
          "name": "Uninitialized",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        },
        {
          "name": "Initialized",
          "typeId": 5
        },
        {
          "name": "Revoked",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        }
      ]
    },
    {
      "type": "enum std::identity::Identity",
      "metadataTypeId": 5,
      "components": [
        {
          "name": "Address",
          "typeId": 9
        },
        {
          "name": "ContractId",
          "typeId": 12
        }
      ]
    },
    {
      "type": "enum sway_libs::ownership::errors::InitializationError",
      "metadataTypeId": 6,
      "components": [
        {
          "name": "CannotReinitialized",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        }
      ]
    },
    {
      "type": "generic T",
      "metadataTypeId": 7
    },
    {
      "type": "raw untyped ptr",
      "metadataTypeId": 8
    },
    {
      "type": "struct std::address::Address",
      "metadataTypeId": 9,
      "components": [
        {
          "name": "bits",
          "typeId": "7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b"
        }
      ]
    },
    {
      "type": "struct std::bytes::Bytes",
      "metadataTypeId": 10,
      "components": [
        {
          "name": "buf",
          "typeId": 11
        },
        {
          "name": "len",
          "typeId": 18
        }
      ]
    },
    {
      "type": "struct std::bytes::RawBytes",
      "metadataTypeId": 11,
      "components": [
        {
          "name": "ptr",
          "typeId": 8
        },
        {
          "name": "cap",
          "typeId": 18
        }
      ]
    },
    {
      "type": "struct std::contract_id::ContractId",
      "metadataTypeId": 12,
      "components": [
        {
          "name": "bits",
          "typeId": "7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b"
        }
      ]
    },
    {
      "type": "struct std::vec::RawVec",
      "metadataTypeId": 13,
      "components": [
        {
          "name": "ptr",
          "typeId": 8
        },
        {
          "name": "cap",
          "typeId": 18
        }
      ],
      "typeParameters": [
        7
      ]
    },
    {
      "type": "struct std::vec::Vec",
      "metadataTypeId": 14,
      "components": [
        {
          "name": "buf",
          "typeId": 13,
          "typeArguments": [
            {
              "name": "",
              "typeId": 7
            }
          ]
        },
        {
          "name": "len",
          "typeId": 18
        }
      ],
      "typeParameters": [
        7
      ]
    },
    {
      "type": "struct sway_libs::ownership::events::OwnershipRenounced",
      "metadataTypeId": 15,
      "components": [
        {
          "name": "previous_owner",
          "typeId": 5
        }
      ]
    },
    {
      "type": "struct sway_libs::ownership::events::OwnershipSet",
      "metadataTypeId": 16,
      "components": [
        {
          "name": "new_owner",
          "typeId": 5
        }
      ]
    },
    {
      "type": "struct sway_libs::ownership::events::OwnershipTransferred",
      "metadataTypeId": 17,
      "components": [
        {
          "name": "new_owner",
          "typeId": 5
        },
        {
          "name": "previous_owner",
          "typeId": 5
        }
      ]
    },
    {
      "type": "u64",
      "metadataTypeId": 18
    }
  ],
  "functions": [
    {
      "inputs": [],
      "name": "module_type",
      "output": "4fcafc76b3c7218fc6592123cebdc1b111dcfb70e34f254ca8279c70c0d5fae5",
      "attributes": [
        {
          "name": "doc-comment",
          "arguments": [
            " Returns an enum that represents the type of security model"
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            " encoded by this ISM. Relayers infer how to fetch and format metadata."
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            ""
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            " ### Returns"
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            ""
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            " * [ModuleType] - The type of security model."
          ]
        }
      ]
    },
    {
      "inputs": [
        {
          "name": "metadata",
          "concreteTypeId": "cdd87b7d12fe505416570c294c884bca819364863efe3bf539245fa18515fbbb"
        },
        {
          "name": "message",
          "concreteTypeId": "cdd87b7d12fe505416570c294c884bca819364863efe3bf539245fa18515fbbb"
        }
      ],
      "name": "verify",
      "output": "b760f44fa5965c2474a3b471467a22c43185152129295af588b022ae50b50903",
      "attributes": [
        {
          "name": "doc-comment",
          "arguments": [
            " Verifies the message using the metadata."
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            ""
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            " ### Arguments"
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            ""
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            " * `metadata`: [Bytes] - The metadata to be used for verification."
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            " * `message`: [Bytes] - The message to be verified."
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            ""
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            " ### Returns"
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            ""
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            " * [bool] - True if the message is verified successfully."
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            ""
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            " ### Reverts"
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            ""
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            " * If any external call fails."
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            " * If the verifications do not meet the threshold."
          ]
        },
        {
          "name": "storage",
          "arguments": [
            "read"
          ]
        }
      ]
    },
    {
      "inputs": [
        {
          "name": "message",
          "concreteTypeId": "cdd87b7d12fe505416570c294c884bca819364863efe3bf539245fa18515fbbb"
        }
      ],
      "name": "modules_and_threshold",
      "output": "338f8824eff0cecf524266f2ab1e824b639f96afdeef1cbd5b1c66f9f50bb70e",
      "attributes": [
        {
          "name": "doc-comment",
          "arguments": [
            " Returns the modules and threshold for the Aggregation ISM for the given message."
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            ""
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            " ### Arguments"
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            ""
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            " * `message`: [Bytes] - The message to be processed."
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            ""
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            " ### Returns"
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            ""
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            " * [Vec<ContractId>] - The list of modules to be used for message verification."
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            " * [u8] - The threshold of approval for the Aggregation ISM."
          ]
        },
        {
          "name": "storage",
          "arguments": [
            "read"
          ]
        }
      ]
    },
    {
      "inputs": [
        {
          "name": "owner",
          "concreteTypeId": "ab7cd04e05be58e3fc15d424c2c4a57f824a2a2d97d67252440a3925ebdc1335"
        },
        {
          "name": "modules",
          "concreteTypeId": "b8ca7626a08e8fb93379b5d9d58d8a12eede8de9f087bfa21feccca44f92e211"
        },
        {
          "name": "threshold",
          "concreteTypeId": "c89951a24c6ca28c13fd1cfdc646b2b656d69e61a92b91023be7eb58eb914b6b"
        }
      ],
      "name": "initialize",
      "output": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d",
      "attributes": [
        {
          "name": "doc-comment",
          "arguments": [
            " Initializes the contract."
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            ""
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            " ### Arguments"
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            ""
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            " * `owner`: [Identity] - The address to be set as the owner of the contract."
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            ""
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            " ### Reverts"
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            ""
          ]
        },
        {
          "name": "doc-comment",
          "arguments": [
            " * If the contract is already initialized."
          ]
        },
        {
          "name": "storage",
          "arguments": [
            "read",
            "write"
          ]
        }
      ]
    },
    {
      "inputs": [
        {
          "name": "new_owner",
          "concreteTypeId": "ab7cd04e05be58e3fc15d424c2c4a57f824a2a2d97d67252440a3925ebdc1335"
        }
      ],
      "name": "initialize_ownership",
      "output": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d",
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read",
            "write"
          ]
        }
      ]
    },
    {
      "inputs": [],
      "name": "only_owner",
      "output": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d",
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read"
          ]
        }
      ]
    },
    {
      "inputs": [],
      "name": "owner",
      "output": "192bc7098e2fe60635a9918afb563e4e5419d386da2bdbf0d716b4bc8549802c",
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read"
          ]
        }
      ]
    },
    {
      "inputs": [],
      "name": "renounce_ownership",
      "output": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d",
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read",
            "write"
          ]
        }
      ]
    },
    {
      "inputs": [
        {
          "name": "new_owner",
          "concreteTypeId": "ab7cd04e05be58e3fc15d424c2c4a57f824a2a2d97d67252440a3925ebdc1335"
        }
      ],
      "name": "transfer_ownership",
      "output": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d",
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "write"
          ]
        }
      ]
    }
  ],
  "loggedTypes": [
    {
      "logId": "15074287530437941682",
      "concreteTypeId": "d132a0a455da99b27af77b6df0f334147b4f0872c3f22da9d452ab0baba6e461"
    },
    {
      "logId": "2161305517876418151",
      "concreteTypeId": "1dfe7feadc1d9667a4351761230f948744068a090fe91b1bc6763a90ed5d3893"
    },
    {
      "logId": "16280289466020123285",
      "concreteTypeId": "e1ef35033ea9d2956f17c3292dea4a46ce7d61fdf37bbebe03b7b965073f43b5"
    },
    {
      "logId": "4571204900286667806",
      "concreteTypeId": "3f702ea3351c9c1ece2b84048006c8034a24cbc2bad2e740d0412b4172951d3d"
    },
    {
      "logId": "4883303303013154842",
      "concreteTypeId": "43c4fa7b3297401afbf300127e59ea913e5c8f0c7ae69abbec789ab0bb872bed"
    },
    {
      "logId": "12970362301975156672",
      "concreteTypeId": "b3fffbcb3158d7c010c31b194b60fb7857adb4ad61bdcf4b8b42958951d9f308"
    }
  ],
  "messagesTypes": [],
  "configurables": [
    {
      "name": "EXPECTED_INITIALIZER",
      "concreteTypeId": "7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b",
      "offset": 30360
    }
  ]
};

const storageSlots: StorageSlot[] = [
  {
    "key": "039bf66740422794083923f525e8759e120ad9321771c63f8bc14d4b8329fd36",
    "value": "0000000000000000000000000000000000000000000000000000000000000000"
  }
];

export class AggregationIsmInterface extends Interface {
  constructor() {
    super(abi);
  }

  declare functions: {
    module_type: FunctionFragment;
    verify: FunctionFragment;
    modules_and_threshold: FunctionFragment;
    initialize: FunctionFragment;
    initialize_ownership: FunctionFragment;
    only_owner: FunctionFragment;
    owner: FunctionFragment;
    renounce_ownership: FunctionFragment;
    transfer_ownership: FunctionFragment;
  };
}

export class AggregationIsm extends __Contract {
  static readonly abi = abi;
  static readonly storageSlots = storageSlots;

  declare interface: AggregationIsmInterface;
  declare functions: {
    module_type: InvokeFunction<[], ModuleTypeOutput>;
    verify: InvokeFunction<[metadata: Bytes, message: Bytes], boolean>;
    modules_and_threshold: InvokeFunction<[message: Bytes], [Vec<ContractIdOutput>, number]>;
    initialize: InvokeFunction<[owner: IdentityInput, modules: Vec<ContractIdInput>, threshold: BigNumberish], void>;
    initialize_ownership: InvokeFunction<[new_owner: IdentityInput], void>;
    only_owner: InvokeFunction<[], void>;
    owner: InvokeFunction<[], StateOutput>;
    renounce_ownership: InvokeFunction<[], void>;
    transfer_ownership: InvokeFunction<[new_owner: IdentityInput], void>;
  };

  constructor(
    id: string | Address,
    accountOrProvider: Account | Provider,
  ) {
    super(id, abi, accountOrProvider);
  }
}
