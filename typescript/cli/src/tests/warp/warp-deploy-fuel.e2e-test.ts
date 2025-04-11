import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { ChainAddresses } from '@hyperlane-xyz/registry';
import { TokenType, WarpRouteDeployConfig } from '@hyperlane-xyz/sdk';

import { writeYamlOrJson } from '../../utils/files.js';
import {
  ANVIL_KEY,
  CHAIN_NAME_2,
  CORE_CONFIG_PATH,
  DEFAULT_E2E_TEST_TIMEOUT,
  TEMP_PATH,
  deployOrUseExistingCore,
} from '../commands/helpers.js';
import { hyperlaneWarpDeployFuel } from '../commands/warp-fuel.js';

chai.use(chaiAsPromised);
chai.should();

const WARP_CONFIG_PATH = `${TEMP_PATH}/warp-route-deployment-deploy.yaml`;

describe('hyperlane warp deploy e2e tests', async function () {
  this.timeout(DEFAULT_E2E_TEST_TIMEOUT);

  let fuelAddresses: ChainAddresses = {};
  let chain2Addresses: ChainAddresses = {};
  let vault: any;

  before(async function () {
    [fuelAddresses, chain2Addresses] = await Promise.all([
      deployOrUseExistingCore(CHAIN_NAME_2, CORE_CONFIG_PATH, ANVIL_KEY),
      deployOrUseExistingCore(CHAIN_NAME_2, CORE_CONFIG_PATH, ANVIL_KEY),
    ]);
    throw new Error(JSON.stringify(fuelAddresses));
  });

  it('should only allow rebasing yield route to be deployed with rebasing synthetic', async function () {
    const warpConfig: WarpRouteDeployConfig = {
      [CHAIN_NAME_2]: {
        type: TokenType.collateralVaultRebase,
        token: vault.address,
        mailbox: chain2Addresses.mailbox,
        owner: chain2Addresses.mailbox,
      },
    };

    writeYamlOrJson(WARP_CONFIG_PATH, warpConfig);
    await hyperlaneWarpDeployFuel(WARP_CONFIG_PATH).should.be.rejected;
  });
});
