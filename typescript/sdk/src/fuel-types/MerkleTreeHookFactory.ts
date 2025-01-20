/* Autogenerated file. Do not edit manually. */

/*
  Fuels version: 0.97.2
*/
import { ContractFactory, decompressBytecode } from 'fuels';
import type { Account, DeployContractOptions, Provider } from 'fuels';

import { MerkleTreeHook } from './MerkleTreeHook.js';

const bytecode = decompressBytecode(
  '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',
);

export class MerkleTreeHookFactory extends ContractFactory {
  static readonly bytecode = bytecode;

  constructor(accountOrProvider: Account | Provider) {
    super(bytecode, MerkleTreeHook.abi, accountOrProvider);
  }

  static deploy(wallet: Account, options: DeployContractOptions = {}) {
    const factory = new MerkleTreeHookFactory(wallet);
    options.storageSlots = MerkleTreeHook.storageSlots;
    return factory.deploy<MerkleTreeHook>(options);
  }
}
