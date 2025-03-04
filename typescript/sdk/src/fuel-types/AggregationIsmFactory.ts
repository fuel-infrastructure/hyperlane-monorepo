import { ContractFactory, decompressBytecode } from 'fuels';
import type { Account, DeployContractOptions, Provider } from 'fuels';

import { AggregationIsm } from './AggregationIsm.js';

const bytecode = decompressBytecode(
  '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',
);

export class AggregationIsmFactory extends ContractFactory {
  static readonly bytecode = bytecode;

  constructor(accountOrProvider: Account | Provider) {
    super(bytecode, AggregationIsm.abi, accountOrProvider);
  }

  static deploy(wallet: Account, options: DeployContractOptions = {}) {
    const factory = new AggregationIsmFactory(wallet);
    options.storageSlots = AggregationIsm.storageSlots;
    return factory.deploy<AggregationIsm>(options);
  }
}
