import {
  ContractFactory as __ContractFactory,
  decompressBytecode,
} from 'fuels';
import type { Account, DeployContractOptions, Provider } from 'fuels';

import { Src20Test } from './Src20Test.js';

const bytecode = decompressBytecode(
  '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',
);

export class Src20TestFactory extends __ContractFactory<Src20Test> {
  static readonly bytecode = bytecode;

  constructor(accountOrProvider: Account | Provider) {
    super(bytecode, Src20Test.abi, accountOrProvider);
  }

  static deploy(wallet: Account, options: DeployContractOptions = {}) {
    const factory = new Src20TestFactory(wallet);
    options.storageSlots = Src20Test.storageSlots;
    return factory.deploy<Src20Test>(options);
  }
}
