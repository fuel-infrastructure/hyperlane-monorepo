/* Autogenerated file. Do not edit manually. */

/*
  Fuels version: 0.97.2
*/
import { Contract, Interface } from 'fuels';
import type {
  AbstractAddress,
  Account,
  BigNumberish,
  Bytes,
  EvmAddress,
  FunctionFragment,
  InvokeFunction,
  Provider,
  StorageSlot,
} from 'fuels';

import type { Enum, Vec } from './common.js';

export type MessageIdMultisigErrorInput = Enum<{
  NoMultisigThreshold: undefined;
  NoValidatorMatch: undefined;
  FailedToRecoverSigner: undefined;
  FailedToRecoverSignature: Bytes;
}>;
export type MessageIdMultisigErrorOutput = Enum<{
  NoMultisigThreshold: void;
  NoValidatorMatch: void;
  FailedToRecoverSigner: void;
  FailedToRecoverSignature: Bytes;
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
      type: 'bool',
      concreteTypeId:
        'b760f44fa5965c2474a3b471467a22c43185152129295af588b022ae50b50903',
    },
    {
      type: 'enum MessageIdMultisigError',
      concreteTypeId:
        'b26df63f7fe45e66396591c39fb75f64137b4d59aa8819e1543fd0bb06cd804e',
      metadataTypeId: 2,
    },
    {
      type: 'enum interfaces::isms::ism::ModuleType',
      concreteTypeId:
        '4fcafc76b3c7218fc6592123cebdc1b111dcfb70e34f254ca8279c70c0d5fae5',
      metadataTypeId: 3,
    },
    {
      type: 'struct std::bytes::Bytes',
      concreteTypeId:
        'cdd87b7d12fe505416570c294c884bca819364863efe3bf539245fa18515fbbb',
      metadataTypeId: 6,
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
      type: 'b256',
      metadataTypeId: 1,
    },
    {
      type: 'enum MessageIdMultisigError',
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
          name: 'FailedToRecoverSignature',
          typeId: 6,
        },
      ],
    },
    {
      type: 'enum interfaces::isms::ism::ModuleType',
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
          typeId: 1,
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
          name: 'validator',
          concreteTypeId:
            '05a44d8c3e00faf7ed545823b7a2b32723545d8715d87a0ab3cf65904948e8d2',
        },
      ],
      name: 'enroll_validator',
      output:
        '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
      attributes: [
        {
          name: 'doc-comment',
          arguments: [' Enrolls a validator to the Multisig ISM.'],
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
            ' * `validator`: [EvmAddress] - The address of the validator to be enrolled.',
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
          name: 'threshold',
          concreteTypeId:
            'c89951a24c6ca28c13fd1cfdc646b2b656d69e61a92b91023be7eb58eb914b6b',
        },
      ],
      name: 'set_threshold',
      output:
        '2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d',
      attributes: [
        {
          name: 'doc-comment',
          arguments: [' Sets the threshold for the Multisig ISM.'],
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
            ' * `threshold`: [u8] - The threshold of approval for the Multisig ISM.',
          ],
        },
        {
          name: 'storage',
          arguments: ['write'],
        },
      ],
    },
  ],
  loggedTypes: [
    {
      logId: '12857203263801679462',
      concreteTypeId:
        'b26df63f7fe45e66396591c39fb75f64137b4d59aa8819e1543fd0bb06cd804e',
    },
  ],
  messagesTypes: [],
  configurables: [],
};

const storageSlots: StorageSlot[] = [
  {
    key: '039bf66740422794083923f525e8759e120ad9321771c63f8bc14d4b8329fd36',
    value: '0000000000000000000000000000000000000000000000000000000000000000',
  },
];

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
    enroll_validator: FunctionFragment;
    set_threshold: FunctionFragment;
  };
}

export class MessageIdMultisigIsm extends Contract {
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
    enroll_validator: InvokeFunction<[validator: EvmAddress], void>;
    set_threshold: InvokeFunction<[threshold: BigNumberish], void>;
  };

  constructor(
    id: string | AbstractAddress,
    accountOrProvider: Account | Provider,
  ) {
    super(id, abi, accountOrProvider);
  }
}
