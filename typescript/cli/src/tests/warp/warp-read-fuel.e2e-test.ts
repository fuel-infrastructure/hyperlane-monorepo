// import { expect } from 'chai';

// import { WarpRouteDeployConfig } from '@hyperlane-xyz/sdk';

// import { readYamlOrJson, writeYamlOrJson } from '../../utils/files.js';
// import {
//   DEFAULT_E2E_TEST_TIMEOUT,
//   FUEL_1_CONFIG_PATH,
//   FUEL_CHAIN_NAME_1,
//   FUEL_CORE_CONFIG_PATH,
//   FUEL_WARP_CONFIG_PATH_EXAMPLE,
//   TEMP_PATH,
// } from '../commands/helpers.js';
// import {
//   hyperlaneWarpDeployFuel,
//   readWarpConfigFuel,
// } from '../commands/warp-fuel.js';

// describe('hyperlane warp read e2e tests', async function () {
//   this.timeout(DEFAULT_E2E_TEST_TIMEOUT);

//   let fuelConfig: WarpRouteDeployConfig;

//   before(async function () {
//     // Create a new warp config using the example
//     const exampleWarpConfig: WarpRouteDeployConfig = readYamlOrJson(
//       FUEL_WARP_CONFIG_PATH_EXAMPLE,
//     );
//     fuelConfig = { fueltestnet: { ...exampleWarpConfig.fueltestnet } };
//     writeYamlOrJson(FUEL_1_CONFIG_PATH, fuelConfig);
//   });

//   beforeEach(async function () {
//     await hyperlaneWarpDeployFuel(FUEL_1_CONFIG_PATH);
//   });

//   it('should be able to read a warp route', async function () {
//     const warpConfigPath = `${TEMP_PATH}/warp-route-deployment-2.yaml`;
//     const warpConfig = await readWarpConfigFuel(
//       FUEL_CHAIN_NAME_1,
//       FUEL_CORE_CONFIG_PATH,
//       warpConfigPath,
//     );
//     expect(warpConfig[FUEL_CHAIN_NAME_1].type).to.be.equal(
//       fuelConfig[FUEL_CHAIN_NAME_1].type,
//     );
//   });
// });
