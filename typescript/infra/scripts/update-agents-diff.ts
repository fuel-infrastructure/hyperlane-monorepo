import { runAgentHelmCommand } from '../src/agents';
import { HelmCommand } from '../src/utils/helm';

import { getCoreEnvironmentConfig, getEnvironment } from './utils';

async function deploy() {
  const environment = await getEnvironment();
  const config = await getCoreEnvironmentConfig(environment);
  for (const chain of config.agent.chainNames) {
    await runAgentHelmCommand(HelmCommand.UpgradeDiff, config.agent, chain);
  }
}

deploy().then(console.log).catch(console.error);