import { App, Installation, SocketModeReceiver } from '@slack/bolt';

import { scopes, userScopes } from './misc/scopes';
import { installations } from './db';
import registerCommands from './commands';
import registerActions from './actions';
import registerEvents from './events';
import rollbar from './misc/rollbar';

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
      await installations.insertOne(installation)
        .then(() => {
          rollbar.info(`✅ New workspace installation completed - ${installation.team?.name}`);
        })
        .catch((err) => {
          rollbar.error('⛔️ Error saving new workspace installation details:', err);
        });
    },
    fetchInstallation: async (query) => {
      const install = await installations.findOne({
        'team.id': query.teamId,
      }) as unknown as Installation;
      if (install) {
        return install;
      }
      throw new Error(`⛔️ Failed to fetch installation data, query: ${JSON.stringify(query)}`);
    },
  },
});

const app = new App({
  receiver,
});

registerCommands(app);
registerActions(app);
registerEvents(app);

app.error(async (err) => {
  rollbar.error('Unspecified error', err);
});

export default app;
