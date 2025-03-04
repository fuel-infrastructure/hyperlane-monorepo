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

import type { Enum, Vec } from './common.js';

export enum MerkleErrorInput {
  MerkleTreeFull = 'MerkleTreeFull',
}
export enum MerkleErrorOutput {
  MerkleTreeFull = 'MerkleTreeFull',
}
export type MerkleTreeHookErrorInput = Enum<{
  MessageNotDispatching: string;
  NoValueExpected: undefined;
  ContractNotInitialized: undefined;
  ContractAlreadyInitialized: undefined;
  UnexpectedInitAddress: undefined;
  CannotInitializeWithZeroAddress: undefined;
}>;
export type MerkleTreeHookErrorOutput = Enum<{
  MessageNotDispatching: string;
  NoValueExpected: void;
  ContractNotInitialized: void;
  ContractAlreadyInitialized: void;
  UnexpectedInitAddress: void;
  CannotInitializeWithZeroAddress: void;
}>;
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

export type ContractIdInput = { bits: string };
export type ContractIdOutput = ContractIdInput;
export type InsertedIntoTreeEventInput = {
  message_id: string;
  index: BigNumberish;
};
export type InsertedIntoTreeEventOutput = { message_id: string; index: number };
export type MerkleTreeInput = { branch: Vec<string>; count: BigNumberish };
export type MerkleTreeOutput = { branch: Vec<string>; count: number };

export type MerkleTreeHookConfigurables = Partial<{
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
      type: '(b256, u32)',
      concreteTypeId:
        'ca65b5ac32a1d2b9c2c913a704974f17a67f9ed81cdd78007c6584eb8feb5e95',
      metadataTypeId: 1,
    },
    {
      type: '(u32, u32)',
      concreteTypeId:
        'c01e801cd76e1f67f52a84fd90af41cca92724d7aa0326270953a5fb5e9f5af1',
      metadataTypeId: 0,
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
      type: 'enum interfaces::hooks::merkle_tree_hook::MerkleTreeHookError',
      concreteTypeId:
        '426dfda92f184fcf45cda17321259db8a156eaf4feb660630f639da630463334',
      metadataTypeId: 2,
    },
    {
      type: 'enum interfaces::hooks::post_dispatch_hook::PostDispatchHookType',
      concreteTypeId:
        '88d5bf06eca6ec129b0c98e6d67271d9012ccd96caf9fe498d5dd2d191db9428',
      metadataTypeId: 3,
    },
    {
      type: 'enum merkle::MerkleError',
      concreteTypeId:
        'ddd5d04db81b028838a7ccd28dd2d24122ce431e475b353a1d076c740b9168cb',
      metadataTypeId: 4,
    },
    {
      type: 'struct interfaces::hooks::merkle_tree_hook::InsertedIntoTreeEvent',
      concreteTypeId:
        'd2f65b9b35997bd4c25ba60c8fdfc379fb7277a88e621b81804e37ee727dee7b',
      metadataTypeId: 7,
    },
    {
      type: 'struct merkle::MerkleTree',
      concreteTypeId:
        '4f367a560e7594cc203b566f49d1b5f9a43fb5e5c4172cef5eb32b9dc5a0d0df',
      metadataTypeId: 8,
    },
    {
      type: 'struct std::bytes::Bytes',
      concreteTypeId:
        'cdd87b7d12fe505416570c294c884bca819364863efe3bf539245fa18515fbbb',
      metadataTypeId: 9,
    },
    {
      type: 'struct std::contract_id::ContractId',
      concreteTypeId:
        '29c10735d33b5159f0c71ee1dbd17b36a3e69e41f00fab0d42e1bd9f428d8a54',
      metadataTypeId: 11,
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
      type: '(_, _)',
      metadataTypeId: 0,
      components: [
        {
          name: '__tuple_element',
          typeId:
            'd7649d428b9ff33d188ecbf38a7e4d8fd167fa01b2e10fe9a8f9308e52f1d7cc',
        },
        {
          name: '__tuple_element',
          typeId:
            'd7649d428b9ff33d188ecbf38a7e4d8fd167fa01b2e10fe9a8f9308e52f1d7cc',
        },
      ],
    },
    {
      type: '(_, _)',
      metadataTypeId: 1,
      components: [
        {
          name: '__tuple_element',
          typeId:
            '7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b',
        },
        {
          name: '__tuple_element',
          typeId:
            'd7649d428b9ff33d188ecbf38a7e4d8fd167fa01b2e10fe9a8f9308e52f1d7cc',
        },
      ],
    },
    {
      type: 'enum interfaces::hooks::merkle_tree_hook::MerkleTreeHookError',
      metadataTypeId: 2,
      components: [
        {
          name: 'MessageNotDispatching',
          typeId:
            '7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b',
        },
        {
          name: 'NoValueExpected',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
        {
          name: 'ContractNotInitialized',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
        {
          name: 'ContractAlreadyInitialized',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
        {
          name: 'UnexpectedInitAddress',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
        {
          name: 'CannotInitializeWithZeroAddress',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
      ],
    },
    {
      type: 'enum interfaces::hooks::post_dispatch_hook::PostDispatchHookType',
      metadataTypeId: 3,
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
      type: 'enum merkle::MerkleError',
      metadataTypeId: 4,
      components: [
        {
          name: 'MerkleTreeFull',
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
      type: 'struct interfaces::hooks::merkle_tree_hook::InsertedIntoTreeEvent',
      metadataTypeId: 7,
      components: [
        {
          name: 'message_id',
          typeId:
            '7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b',
        },
        {
          name: 'index',
          typeId:
            'd7649d428b9ff33d188ecbf38a7e4d8fd167fa01b2e10fe9a8f9308e52f1d7cc',
        },
      ],
    },
    {
      type: 'struct merkle::MerkleTree',
      metadataTypeId: 8,
      components: [
        {
          name: 'branch',
          typeId: 13,
          typeArguments: [
            {
              name: '',
              typeId:
                '7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b',
            },
          ],
        },
        {
          name: 'count',
          typeId:
            'd7649d428b9ff33d188ecbf38a7e4d8fd167fa01b2e10fe9a8f9308e52f1d7cc',
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
      type: 'struct std::vec::RawVec',
      metadataTypeId: 12,
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
      metadataTypeId: 13,
      components: [
        {
          name: 'buf',
          typeId: 12,
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
  ],
  functions: [
    {
      inputs: [],
      name: 'count',
      output:
        'd7649d428b9ff33d188ecbf38a7e4d8fd167fa01b2e10fe9a8f9308e52f1d7cc',
      attributes: [
        {
          name: 'doc-comment',
          arguments: [' Returns the count from the MerkleTree.'],
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
          arguments: [' * [u32] - The count from the MerkleTree.'],
        },
        {
          name: 'storage',
          arguments: ['read'],
        },
      ],
    },
    {
      inputs: [],
      name: 'count_and_block',
      output:
        'c01e801cd76e1f67f52a84fd90af41cca92724d7aa0326270953a5fb5e9f5af1',
      attributes: [
        {
          name: 'doc-comment',
          arguments: [' Gets the stored count of the MerkleTree.'],
        },
        {
          name: 'doc-comment',
          arguments: [' And the current block number.'],
        },
        {
          name: 'doc-comment',
          arguments: [' Used since we cannot query point in time data.'],
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
            ' * [(u32, u32)] - The count and the current block number.',
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
          name: 'mailbox',
          concreteTypeId:
            '29c10735d33b5159f0c71ee1dbd17b36a3e69e41f00fab0d42e1bd9f428d8a54',
        },
      ],
      name: 'initialize',
      output:
        '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
      attributes: [
        {
          name: 'doc-comment',
          arguments: [
            ' Initializes the MerkleTreeHook contract with the given mailbox contract ID.',
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
            ' * `mailbox`: [ContractId] - The contract ID of the mailbox contract.',
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
      name: 'latest_checkpoint',
      output:
        'ca65b5ac32a1d2b9c2c913a704974f17a67f9ed81cdd78007c6584eb8feb5e95',
      attributes: [
        {
          name: 'storage',
          arguments: ['read'],
        },
      ],
    },
    {
      inputs: [],
      name: 'root',
      output:
        '7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b',
      attributes: [
        {
          name: 'doc-comment',
          arguments: [' Returns the root from the MerkleTree.'],
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
          arguments: [' * [b256] - The root from the MerkleTree.'],
        },
        {
          name: 'storage',
          arguments: ['read'],
        },
      ],
    },
    {
      inputs: [],
      name: 'tree',
      output:
        '4f367a560e7594cc203b566f49d1b5f9a43fb5e5c4172cef5eb32b9dc5a0d0df',
      attributes: [
        {
          name: 'doc-comment',
          arguments: [' Returns the latest checkpoint from the MerkleTree.'],
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
          arguments: [' * [b256] - The root from the MerkleTree.'],
        },
        {
          name: 'doc-comment',
          arguments: [' * [u32] - The count from the MerkleTree.'],
        },
        {
          name: 'storage',
          arguments: ['read'],
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
          name: '_metadata',
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
          arguments: [' * If the contract is not initialized.'],
        },
        {
          name: 'doc-comment',
          arguments: [' * If the message ID is not the latest dispatched ID.'],
        },
        {
          name: 'doc-comment',
          arguments: [' * If there was assets sent with the function call.'],
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
  ],
  loggedTypes: [
    {
      logId: '4786760882046128079',
      concreteTypeId:
        '426dfda92f184fcf45cda17321259db8a156eaf4feb660630f639da630463334',
    },
    {
      logId: '15984911484641280648',
      concreteTypeId:
        'ddd5d04db81b028838a7ccd28dd2d24122ce431e475b353a1d076c740b9168cb',
    },
    {
      logId: '15201438314412997588',
      concreteTypeId:
        'd2f65b9b35997bd4c25ba60c8fdfc379fb7277a88e621b81804e37ee727dee7b',
    },
  ],
  messagesTypes: [],
  configurables: [
    {
      name: 'EXPECTED_INITIALIZER',
      concreteTypeId:
        '7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b',
      offset: 29776,
    },
  ],
};

const storageSlots: StorageSlot[] = [
  {
    key: '63e66efdfaeba56a7477c264324f95ad92c3efa3faf8d9782a5c2a6f9adb4cb8',
    value: '0000000000000000000000000000000000000000000000000000000000000000',
  },
  {
    key: 'd5354b695493bac2ed3dd4f37b9e77c1d20cfa9a5eef204fdc8e09703a43359c',
    value: '0000000000000000000000000000000000000000000000000000000000000000',
  },
];

export class MerkleTreeHookInterface extends Interface {
  constructor() {
    super(abi);
  }

  declare functions: {
    count: FunctionFragment;
    count_and_block: FunctionFragment;
    initialize: FunctionFragment;
    latest_checkpoint: FunctionFragment;
    root: FunctionFragment;
    tree: FunctionFragment;
    hook_type: FunctionFragment;
    post_dispatch: FunctionFragment;
    quote_dispatch: FunctionFragment;
    supports_metadata: FunctionFragment;
  };
}

export class MerkleTreeHook extends __Contract {
  static readonly abi = abi;
  static readonly storageSlots = storageSlots;

  declare interface: MerkleTreeHookInterface;
  declare functions: {
    count: InvokeFunction<[], number>;
    count_and_block: InvokeFunction<[], [number, number]>;
    initialize: InvokeFunction<[mailbox: ContractIdInput], void>;
    latest_checkpoint: InvokeFunction<[], [string, number]>;
    root: InvokeFunction<[], string>;
    tree: InvokeFunction<[], MerkleTreeOutput>;
    hook_type: InvokeFunction<[], PostDispatchHookTypeOutput>;
    post_dispatch: InvokeFunction<[_metadata: Bytes, message: Bytes], void>;
    quote_dispatch: InvokeFunction<[_metadata: Bytes, _message: Bytes], BN>;
    supports_metadata: InvokeFunction<[metadata: Bytes], boolean>;
  };

  constructor(id: string | Address, accountOrProvider: Account | Provider) {
    super(id, abi, accountOrProvider);
  }
}
