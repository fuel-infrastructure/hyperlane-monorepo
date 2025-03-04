import { ContractFactory, decompressBytecode } from 'fuels';
import type { Account, DeployContractOptions, Provider } from 'fuels';

import { MessageIdMultisigIsm } from './MessageIdMultisigIsm.js';

const bytecode = decompressBytecode(
  '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d6atyt/M/kagbZ6/P9qGNQ25ju8cycKng+/goazqDpSDzFmQfVHTde0UjC/o3G3aE+epfwp078Z4Qr322Tz1hzVP/W7NU78bOuKPIQfdvYh8+3o435ar/d0f5JickXw35LvQL1jLzya5EeqDcXQz7Au3pN8vtd+S4DmAd/l73HPJydWNMThGF6vuQya5i/51LS/5TbIHIvJs9J3I4V38zn7o/x/7+L7DH90/duj+8f24gv62f+Kuf3A/FMX5X18qNP3sDZ3fXH7uwese+aNbfvKe3Bt+8MDYWw/88b94/JGv/st9d925/14w8N677rxn76HDE/vH9uIKz+/96F379h76+MS9Y3vv2Td26MDE/nsPfPyj++66565Dd+G3B8xrgufkL6gbuD3q++Bt3R/AMJO/vkMH9k/sP/yxwjYQ3r+vMLz/3nv33rn/Ha/KHzYVeA1/LPlobuFjz7144jl9Lvj682964dbPvWOPKfF5ZNDy73MLepzV4z49rjPHR/7KHI/eoUegxeSozx+FV4V/97fqcYU5jmHG8O9DHzVHLNzy14PouByxmvDvlgvmeP1z5vg67FQnR6V79b//DyqNHUYQjwAA',
);

export class MessageIdMultisigIsmFactory extends ContractFactory {
  static readonly bytecode = bytecode;

  constructor(accountOrProvider: Account | Provider) {
    super(bytecode, MessageIdMultisigIsm.abi, accountOrProvider);
  }

  static deploy(wallet: Account, options: DeployContractOptions = {}) {
    const factory = new MessageIdMultisigIsmFactory(wallet);
    options.storageSlots = MessageIdMultisigIsm.storageSlots;
    return factory.deploy<MessageIdMultisigIsm>(options);
  }
}
