import dotenv from 'dotenv';
import { App, SocketModeReceiver } from '@slack/bolt';

import { scopes, userScopes } from './misc/scopes';
import { installations, userTokens } from './db';
import registerCommands from './commands';

dotenv.config();

export const receiver: SocketModeReceiver = new SocketModeReceiver({
  appToken: process.env.SLACK_APP_TOKEN!,
  clientId: process.env.SLACK_CLIENT_ID,
  clientSecret: process.env.SLACK_CLIENT_SECRET,
  stateSecret: 'my-state-secret',
  scopes,
  installerOptions: {
    userScopes,
    directInstall: true,
  },

  installationStore: {
    storeInstallation: async (installation) => {
      if (installation.isEnterpriseInstall) {
        await installations.set(installation.enterprise!.id, installation);
      } else {
        await installations.set(installation.team!.id, installation);
      }
      if (installation.user && installation.user.token) {
        await userTokens.set(installation.user.id, installation.user.token);
      }
    },
    fetchInstallation: async (query) => {
      if (query.isEnterpriseInstall && query.enterpriseId !== undefined) {
        return installations.get(query.enterpriseId);
      }
      if (query.teamId !== undefined) {
        return installations.get(query.teamId);
      }
      throw new Error('Failed fetching installation');
    },
  },
});

const app = new App({
  receiver,
});

registerCommands(app);

app.error(async (error) => {
  console.error(error);
});

export default app;
