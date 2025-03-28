import { FC, SVGProps } from 'react';

import { ProtocolType } from '@hyperlane-xyz/utils';

import { CosmosLogo } from './Cosmos.js';
import { EthereumLogo } from './Ethereum.js';
import { FuelLogo } from './Fuel.js';
import { SolanaLogo } from './Solana.js';
import { FuelLogo } from './Fuel.js';

export const PROTOCOL_TO_LOGO: Record<
  ProtocolType,
  FC<Omit<SVGProps<SVGSVGElement>, 'ref'>>
> = {
  [ProtocolType.Ethereum]: EthereumLogo,
  [ProtocolType.Sealevel]: SolanaLogo,
  [ProtocolType.Cosmos]: CosmosLogo,
  [ProtocolType.Fuel]: FuelLogo,
};
