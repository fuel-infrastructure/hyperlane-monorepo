import { expect } from 'chai';

import {
  multiProtocolTestChainMetadata,
  test1,
  testFuelChain,
} from '../../consts/testChains.js';
import { MultiProtocolProvider } from '../../providers/MultiProtocolProvider.js';
import { ProviderType } from '../../providers/ProviderType.js';

import { FuelCoreAdapter } from './FuelCoreAdapter.js';

describe('FuelCoreAdapter', () => {
  let adapter: FuelCoreAdapter;

  it('Constructs', () => {
    adapter = new FuelCoreAdapter(
      testFuelChain.name,
      MultiProtocolProvider.createTestMultiProtocolProvider({
        ...multiProtocolTestChainMetadata,
        inevm: {
          ...test1,
          name: 'inevm',
          chainId: 2525,
          domainId: 2525,
        },
      }),
      { mailbox: '' },
    );
    expect(adapter).to.be.instanceOf(FuelCoreAdapter);
  });

  it('Extracts message IDs', () => {
    const logs: any = [
      {
        type: 'dispatch',
        sender: 'inj16paaazy6t2ac02q5t8en099csy7pkyh3hw35up',
        destination_domain: 2525,
        recipient_address: 'inj17xpfvakm2amg962yls6f84z3kell8c5l6s5ye9',
      },
      {
        type: 'dispatch_id',
        message_id: 'abc',
      },
      {
        type: 'dispatch',
        sender: 'inj16paaazy6t2ac02q5t8en099csy7pkyh3hw35up',
        destination_domain: 2525,
        recipient_address: 'inj1mv9tjvkaw7x8w8y9vds8pkfq46g2vcfkjehc6k',
      },
      {
        type: 'dispatch_id',
        message_id: 'def',
      },
    ];

    const messages = adapter.extractMessageIds({
      type: ProviderType.Fuels,
      receipt: logs,
    });

    expect(messages).to.have.length(2);
    expect(messages[0].messageId).to.equal('abc');
    expect(messages[0].destination).to.equal('inevm');
    expect(messages[1].messageId).to.equal('def');
    expect(messages[1].destination).to.equal('inevm');
  });
});
