import { ContractFactory, decompressBytecode } from 'fuels';
import type { Account, DeployContractOptions, Provider } from 'fuels';

import { MerkleRootMultisigIsm } from './MerkleRootMultisigIsm.js';

const bytecode = decompressBytecode(
  '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',
);

export class MerkleRootMultisigIsmFactory extends ContractFactory {
  static readonly bytecode = bytecode;

  constructor(accountOrProvider: Account | Provider) {
    super(bytecode, MerkleRootMultisigIsm.abi, accountOrProvider);
  }

  static deploy(wallet: Account, options: DeployContractOptions = {}) {
    const factory = new MerkleRootMultisigIsmFactory(wallet);
    options.storageSlots = MerkleRootMultisigIsm.storageSlots;
    return factory.deploy<MerkleRootMultisigIsm>(options);
  }
}
