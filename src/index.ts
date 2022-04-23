import Keyv from 'keyv';
import app from './app';

if (!process.env.SLACK_APP_TOKEN) {
  throw new Error('Lunchbox needs a valid app-level token in order to start.');
}

if (!process.env.SLACK_CLIENT_ID) {
  throw new Error('Lunchbox needs a valid Slack client ID in order to start.');
}

if (!process.env.SLACK_CLIENT_SECRET) {
  throw new Error('Lunchbox needs a valid Slack client secret in order to start.');
}

export const installations = new Keyv('mongodb://localhost:27017/lunchbot');
installations.on('error', (err) => {
  console.error(err);
});

(async () => {
  await app.start(3000);
  console.log('🍔 Lunchbot is running and ready to munch');
  console.log(`Install URL: ${process.env.SLACK_APP_URL}/slack/install`);
})();
