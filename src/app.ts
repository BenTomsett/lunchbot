import { App, Installation, SocketModeReceiver } from '@slack/bolt';

import { scopes, userScopes } from './misc/scopes';
import { installations, userTokens } from './db';
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
      await installations.insertOne(installation).then(() => {
        console.info(`✅ New workspace installation completed - ${installation.team?.name}`);
      }).catch((err) => {
        console.error('⛔️ Error saving new workspace installation details:');
        console.error(err);
      });

      if (installation.user && installation.user.token) {
        await userTokens.insertOne(
          { userId: installation.user.id, token: installation.user.token },
        ).then(() => {
          console.info('✅ New user installation completed');
        }).catch((err) => {
          console.error('⛔️ Error saving new user token:');
          console.error(err);
        });
      }
    },
    fetchInstallation: async (query) => {
      let install;
      if (query.isEnterpriseInstall && query.enterpriseId !== undefined) {
        install = (await installations.findOne(
          { 'enterprise.id': query.enterpriseId },
        )) as unknown as Installation;
      } else {
        install = (await installations.findOne(
          { 'team.id': query.teamId },
        )) as unknown as Installation;
      }
      if (install) {
        return install;
      }
      console.error('⛔️ Failed to fetch installation data:');
      console.error(`Installation query: ${JSON.stringify(query)}`);
      throw new Error('Failed to fetch installation data');
    },
  },
});

const app = new App({
  receiver,
});

registerCommands(app);

app.error(async (err) => {
  console.error('⛔️ Unspecified error:');
  console.error(err);
});

export default app;
