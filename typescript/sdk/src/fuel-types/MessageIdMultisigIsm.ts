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
  StorageSlot,
} from 'fuels';

import type { Enum, Vec } from './common.js';

export type MerkleRootMultisigErrorInput = Enum<{
  NoMultisigThreshold: undefined;
  NoValidatorMatch: undefined;
  FailedToRecoverSigner: undefined;
  InvalidMerkleIndexMetadata: undefined;
  FailedToRecoverSignature: Bytes;
  AlreadyInitialized: undefined;
  UnexpectedInitAddress: undefined;
}>;
export type MerkleRootMultisigErrorOutput = Enum<{
  NoMultisigThreshold: void;
  NoValidatorMatch: void;
  FailedToRecoverSigner: void;
  InvalidMerkleIndexMetadata: void;
  FailedToRecoverSignature: Bytes;
  AlreadyInitialized: void;
  UnexpectedInitAddress: void;
}>;
export type MessageIdMultisigErrorInput = Enum<{
  NoMultisigThreshold: undefined;
  NoValidatorMatch: undefined;
  FailedToRecoverSigner: undefined;
  FailedToRecoverSignature: Bytes;
  UnexpectedInitAddress: undefined;
}>;
export type MessageIdMultisigErrorOutput = Enum<{
  NoMultisigThreshold: void;
  NoValidatorMatch: void;
  FailedToRecoverSigner: void;
  FailedToRecoverSignature: Bytes;
  UnexpectedInitAddress: void;
}>;
export enum ModuleTypeInput {
  UNUSED = 'UNUSED',
  ROUTING = 'ROUTING',
  AGGREGATION = 'AGGREGATION',
  LEGACY_MULTISIG = 'LEGACY_MULTISIG',
  MERKLE_ROOT_MULTISIG = 'MERKLE_ROOT_MULTISIG',
  MESSAGE_ID_MULTISIG = 'MESSAGE_ID_MULTISIG',
  NULL = 'NULL',
  CCIP_READ = 'CCIP_READ',
}
export enum ModuleTypeOutput {
  UNUSED = 'UNUSED',
  ROUTING = 'ROUTING',
  AGGREGATION = 'AGGREGATION',
  LEGACY_MULTISIG = 'LEGACY_MULTISIG',
  MERKLE_ROOT_MULTISIG = 'MERKLE_ROOT_MULTISIG',
  MESSAGE_ID_MULTISIG = 'MESSAGE_ID_MULTISIG',
  NULL = 'NULL',
  CCIP_READ = 'CCIP_READ',
}

export type MessageIdMultisigIsmConfigurables = Partial<{
  THRESHOLD: BigNumberish;
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
      type: '(struct std::vec::Vec<struct std::vm::evm::evm_address::EvmAddress>, u8)',
      concreteTypeId:
        'd4da8aeea50e70d476c1f976d23444a72acfe4d9cbbb780710b947b747c1f637',
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
      type: 'enum interfaces::isms::ism::ModuleType',
      concreteTypeId:
        '4fcafc76b3c7218fc6592123cebdc1b111dcfb70e34f254ca8279c70c0d5fae5',
      metadataTypeId: 1,
    },
    {
      type: 'enum interfaces::isms::multisig::multisig_ism::MerkleRootMultisigError',
      concreteTypeId:
        'a9e12ce5428a3a5e60ce6d80348e323f1da0b084f3ba9e8bbe8c226d85c72c8d',
      metadataTypeId: 2,
    },
    {
      type: 'enum interfaces::isms::multisig::multisig_ism::MessageIdMultisigError',
      concreteTypeId:
        '9208f06dcce9a0ccc70f9b9fe484e92b27fb8403737c88adef7279d81fdcc7fe',
      metadataTypeId: 3,
    },
    {
      type: 'struct std::bytes::Bytes',
      concreteTypeId:
        'cdd87b7d12fe505416570c294c884bca819364863efe3bf539245fa18515fbbb',
      metadataTypeId: 6,
    },
    {
      type: 'struct std::vec::Vec<struct std::vm::evm::evm_address::EvmAddress>',
      concreteTypeId:
        'f951df7078495f429752af31cbfeda352f61f1a4bf88da5268dc9936b6385012',
      metadataTypeId: 9,
      typeArguments: [
        '05a44d8c3e00faf7ed545823b7a2b32723545d8715d87a0ab3cf65904948e8d2',
      ],
    },
    {
      type: 'struct std::vm::evm::evm_address::EvmAddress',
      concreteTypeId:
        '05a44d8c3e00faf7ed545823b7a2b32723545d8715d87a0ab3cf65904948e8d2',
      metadataTypeId: 10,
    },
    {
      type: 'u32',
      concreteTypeId:
        'd7649d428b9ff33d188ecbf38a7e4d8fd167fa01b2e10fe9a8f9308e52f1d7cc',
    },
    {
      type: 'u8',
      concreteTypeId:
        'c89951a24c6ca28c13fd1cfdc646b2b656d69e61a92b91023be7eb58eb914b6b',
    },
  ],
  metadataTypes: [
    {
      type: '(_, _)',
      metadataTypeId: 0,
      components: [
        {
          name: '__tuple_element',
          typeId: 9,
          typeArguments: [
            {
              name: '',
              typeId: 10,
            },
          ],
        },
        {
          name: '__tuple_element',
          typeId:
            'c89951a24c6ca28c13fd1cfdc646b2b656d69e61a92b91023be7eb58eb914b6b',
        },
      ],
    },
    {
      type: 'enum interfaces::isms::ism::ModuleType',
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
          name: 'LEGACY_MULTISIG',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
        {
          name: 'MERKLE_ROOT_MULTISIG',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
        {
          name: 'MESSAGE_ID_MULTISIG',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
        {
          name: 'NULL',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
        {
          name: 'CCIP_READ',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
      ],
    },
    {
      type: 'enum interfaces::isms::multisig::multisig_ism::MerkleRootMultisigError',
      metadataTypeId: 2,
      components: [
        {
          name: 'NoMultisigThreshold',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
        {
          name: 'NoValidatorMatch',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
        {
          name: 'FailedToRecoverSigner',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
        {
          name: 'InvalidMerkleIndexMetadata',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
        {
          name: 'FailedToRecoverSignature',
          typeId: 6,
        },
        {
          name: 'AlreadyInitialized',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
        {
          name: 'UnexpectedInitAddress',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
      ],
    },
    {
      type: 'enum interfaces::isms::multisig::multisig_ism::MessageIdMultisigError',
      metadataTypeId: 3,
      components: [
        {
          name: 'NoMultisigThreshold',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
        {
          name: 'NoValidatorMatch',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
        {
          name: 'FailedToRecoverSigner',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
        {
          name: 'FailedToRecoverSignature',
          typeId: 6,
        },
        {
          name: 'UnexpectedInitAddress',
          typeId:
            '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
        },
      ],
    },
    {
      type: 'generic T',
      metadataTypeId: 4,
    },
    {
      type: 'raw untyped ptr',
      metadataTypeId: 5,
    },
    {
      type: 'struct std::bytes::Bytes',
      metadataTypeId: 6,
      components: [
        {
          name: 'buf',
          typeId: 7,
        },
        {
          name: 'len',
          typeId: 11,
        },
      ],
    },
    {
      type: 'struct std::bytes::RawBytes',
      metadataTypeId: 7,
      components: [
        {
          name: 'ptr',
          typeId: 5,
        },
        {
          name: 'cap',
          typeId: 11,
        },
      ],
    },
    {
      type: 'struct std::vec::RawVec',
      metadataTypeId: 8,
      components: [
        {
          name: 'ptr',
          typeId: 5,
        },
        {
          name: 'cap',
          typeId: 11,
        },
      ],
      typeParameters: [4],
    },
    {
      type: 'struct std::vec::Vec',
      metadataTypeId: 9,
      components: [
        {
          name: 'buf',
          typeId: 8,
          typeArguments: [
            {
              name: '',
              typeId: 4,
            },
          ],
        },
        {
          name: 'len',
          typeId: 11,
        },
      ],
      typeParameters: [4],
    },
    {
      type: 'struct std::vm::evm::evm_address::EvmAddress',
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
      type: 'u64',
      metadataTypeId: 11,
    },
  ],
  functions: [
    {
      inputs: [],
      name: 'module_type',
      output:
        '4fcafc76b3c7218fc6592123cebdc1b111dcfb70e34f254ca8279c70c0d5fae5',
      attributes: [
        {
          name: 'doc-comment',
          arguments: [
            ' Returns an enum that represents the type of security model',
          ],
        },
        {
          name: 'doc-comment',
          arguments: [
            ' encoded by this ISM. Relayers infer how to fetch and format metadata.',
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
          arguments: [' * [ModuleType] - The type of security model.'],
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
      name: 'verify',
      output:
        'b760f44fa5965c2474a3b471467a22c43185152129295af588b022ae50b50903',
      attributes: [
        {
          name: 'doc-comment',
          arguments: [' Verifies the message using the metadata.'],
        },
        {
          name: 'doc-comment',
          arguments: [
            ' Assumes the signatures are in the same order as the validators.',
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
            ' * `metadata`: [Bytes] - The metadata to be used for verification.',
          ],
        },
        {
          name: 'doc-comment',
          arguments: [' * `message`: [Bytes] - The message to be verified.'],
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
            ' * [bool] - True if the message is verified successfully.',
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
          arguments: [' * If the threshold is not set or is less than 0.'],
        },
        {
          name: 'doc-comment',
          arguments: [' * If the signature recovery fails.'],
        },
        {
          name: 'doc-comment',
          arguments: [' * If the signer recovery fails.'],
        },
        {
          name: 'doc-comment',
          arguments: [' * If no validator matches the signer.'],
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
      name: 'digest',
      output:
        'cdd87b7d12fe505416570c294c884bca819364863efe3bf539245fa18515fbbb',
      attributes: [
        {
          name: 'doc-comment',
          arguments: [
            ' Returns the digest to be used for signature verification.',
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
          arguments: [' * `metadata`: [Bytes] - ABI encoded module metadata.'],
        },
        {
          name: 'doc-comment',
          arguments: [' * `message`: [Bytes] - Formatted Hyperlane message.'],
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
          arguments: [' * [Bytes] - The digest to be signed by validators.'],
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
          name: 'index',
          concreteTypeId:
            'd7649d428b9ff33d188ecbf38a7e4d8fd167fa01b2e10fe9a8f9308e52f1d7cc',
        },
      ],
      name: 'signature_at',
      output:
        'cdd87b7d12fe505416570c294c884bca819364863efe3bf539245fa18515fbbb',
      attributes: [
        {
          name: 'doc-comment',
          arguments: [
            ' Returns the signature at a given index from the metadata.',
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
          arguments: [' * `metadata`: [Bytes] - ABI encoded module metadata.'],
        },
        {
          name: 'doc-comment',
          arguments: [
            ' * `index`: [u32] - The index of the signature to be retrieved.',
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
          arguments: [' * [Bytes] - Packed encoding of signature (65 bytes).'],
        },
      ],
    },
    {
      inputs: [
        {
          name: 'message',
          concreteTypeId:
            'cdd87b7d12fe505416570c294c884bca819364863efe3bf539245fa18515fbbb',
        },
      ],
      name: 'validators_and_threshold',
      output:
        'd4da8aeea50e70d476c1f976d23444a72acfe4d9cbbb780710b947b747c1f637',
      attributes: [
        {
          name: 'doc-comment',
          arguments: [
            ' Returns the validators and threshold for the Multisig ISM for the given message.',
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
            ' * [Vec<EvmAddress>] - The list of validators that are set to approve the message.',
          ],
        },
        {
          name: 'doc-comment',
          arguments: [
            ' * [u8] - The threshold of approval for the Multisig ISM.',
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
          name: 'validators',
          concreteTypeId:
            'f951df7078495f429752af31cbfeda352f61f1a4bf88da5268dc9936b6385012',
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
          arguments: [
            ' * `validators`: [Vec<EvmAddress>] - The list of validators which can approve messages.',
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
          arguments: ['read', 'write'],
        },
      ],
    },
  ],
  loggedTypes: [
    {
      logId: '10522924883731128524',
      concreteTypeId:
        '9208f06dcce9a0ccc70f9b9fe484e92b27fb8403737c88adef7279d81fdcc7fe',
    },
    {
      logId: '12241114625345206878',
      concreteTypeId:
        'a9e12ce5428a3a5e60ce6d80348e323f1da0b084f3ba9e8bbe8c226d85c72c8d',
    },
  ],
  messagesTypes: [],
  configurables: [
    {
      name: 'THRESHOLD',
      concreteTypeId:
        'c89951a24c6ca28c13fd1cfdc646b2b656d69e61a92b91023be7eb58eb914b6b',
      offset: 36616,
    },
    {
      name: 'EXPECTED_INITIALIZER',
      concreteTypeId:
        '7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b',
      offset: 36584,
    },
  ],
};

const storageSlots: StorageSlot[] = [];

export class MessageIdMultisigIsmInterface extends Interface {
  constructor() {
    super(abi);
  }

  declare functions: {
    module_type: FunctionFragment;
    verify: FunctionFragment;
    digest: FunctionFragment;
    signature_at: FunctionFragment;
    validators_and_threshold: FunctionFragment;
    initialize: FunctionFragment;
  };
}

export class MessageIdMultisigIsm extends __Contract {
  static readonly abi = abi;
  static readonly storageSlots = storageSlots;

  declare interface: MessageIdMultisigIsmInterface;
  declare functions: {
    module_type: InvokeFunction<[], ModuleTypeOutput>;
    verify: InvokeFunction<[metadata: Bytes, message: Bytes], boolean>;
    digest: InvokeFunction<[metadata: Bytes, message: Bytes], Bytes>;
    signature_at: InvokeFunction<[metadata: Bytes, index: BigNumberish], Bytes>;
    validators_and_threshold: InvokeFunction<
      [message: Bytes],
      [Vec<EvmAddress>, number]
    >;
    initialize: InvokeFunction<[validators: Vec<EvmAddress>], void>;
  };

  constructor(id: string | Address, accountOrProvider: Account | Provider) {
    super(id, abi, accountOrProvider);
  }
}
