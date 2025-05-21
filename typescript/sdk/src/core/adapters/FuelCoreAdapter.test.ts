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
        sepolia: {
          ...test1,
          name: 'sepolia',
          chainId: 11155111,
          domainId: 11155111,
        },
      }),
      { mailbox: '' },
    );
    expect(adapter).to.be.instanceOf(FuelCoreAdapter);
  });

  it('Extracts message IDs', () => {
    const messages = adapter.extractMessageIds({
      type: ProviderType.Fuels,
      receipt: TX_RECEIPT_EXAMPLE,
    });

    expect(messages).to.have.length(1);
    expect(messages[0].messageId).to.equal(
      '0xf7ae465c336cd68d97b103b5e61f13a27a64cd1ea166c192fb1d352c043962bd',
    );
    expect(messages[0].destination).to.equal('sepolia');
  });
});

// A minimal transaction receipt example with the necessary logs for extractMessageIds to work
export const TX_RECEIPT_EXAMPLE = [
  {
    logs: [
      {
        data: '0x00aa36a70000000000000000000000000ae30543a22c74123d9c64f64b9cb9bbb7268eea0000000000000001',
        id: '0x23e3703017b1b333c3a855ee17ee64093fc9e32458515949778890c0c6bc4c64',
      },
      {
        data: '0x03000000e466665468fe93aaebea83b024776d0f842aa4ecf812c5ad762790534a99285b95452b060a00aa36a7000000000000000000000000b0e03bf85baca7874c44dbe2c961515e7f4529fe0000000000000000000000000ae30543a22c74123d9c64f64b9cb9bbb7268eea0000000000000000000000000000000000000000000000000000000000000001',
        id: '0xb0d20266f540e5693634e86f93d237ac6713ab4cf93570f2ad61c7d7b442816f',
      },
      {
        data: '0xf7ae465c336cd68d97b103b5e61f13a27a64cd1ea166c192fb1d352c043962bd',
        id: '0xb0d20266f540e5693634e86f93d237ac6713ab4cf93570f2ad61c7d7b442816f',
      },
    ],
  },
];
