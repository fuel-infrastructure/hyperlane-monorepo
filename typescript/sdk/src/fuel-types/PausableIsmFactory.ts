import {
  ContractFactory as __ContractFactory,
  decompressBytecode,
} from 'fuels';
import type { Account, DeployContractOptions, Provider } from 'fuels';

import { PausableIsm } from './PausableIsm.js';

const bytecode = decompressBytecode(
  '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',
);

export class PausableIsmFactory extends __ContractFactory<PausableIsm> {
  static readonly bytecode = bytecode;

  constructor(accountOrProvider: Account | Provider) {
    super(bytecode, PausableIsm.abi, accountOrProvider);
  }

  static deploy(wallet: Account, options: DeployContractOptions = {}) {
    const factory = new PausableIsmFactory(wallet);
    options.storageSlots = PausableIsm.storageSlots;
    return factory.deploy<PausableIsm>(options);
  }
}
