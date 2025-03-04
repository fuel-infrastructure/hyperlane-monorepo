import {
  ContractFactory as __ContractFactory,
  decompressBytecode,
} from 'fuels';
import type { Account, DeployContractOptions, Provider } from 'fuels';

import { ProtocolFee } from './ProtocolFee.js';

const bytecode = decompressBytecode(
  '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',
);

export class ProtocolFeeFactory extends __ContractFactory<ProtocolFee> {
  static readonly bytecode = bytecode;

  constructor(accountOrProvider: Account | Provider) {
    super(bytecode, ProtocolFee.abi, accountOrProvider);
  }

  static deploy(wallet: Account, options: DeployContractOptions = {}) {
    const factory = new ProtocolFeeFactory(wallet);
    options.storageSlots = ProtocolFee.storageSlots;
    return factory.deploy<ProtocolFee>(options);
  }
}
