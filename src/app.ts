import {App, Installation, SocketModeReceiver} from '@slack/bolt';

import {scopes, userScopes} from './misc/scopes';
import {installations, userTokens} from './db';
import registerCommands from './commands';

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
      try {
        await installations.insertOne(installation);
      } catch (e) {
        throw new Error(`Error storing new installation: ${e}`);
      }
      if (installation.user && installation.user.token) {
        await userTokens.insertOne(
            {userId: installation.user.id, token: installation.user.token},
        );
      }
    },
    fetchInstallation: async (query) => {
      let install;
      if (query.isEnterpriseInstall && query.enterpriseId !== undefined) {
        install = (await installations.findOne(
            {'enterprise.id': query.enterpriseId})) as unknown as Installation;
      } else {
        install = (await installations.findOne(
            {'team.id': query.teamId})) as unknown as Installation;
      }
      if(install){
        return install;
      }else{
        throw new Error('Failed fetching installation');
      }
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
