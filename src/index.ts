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

if (!process.env.MONGO_HOST || !process.env.MONGO_USER || !process.env.MONGO_PASS) {
  throw new Error('Lunchbox needs valid MongoDB connection information in order to start.');
}

(async () => {
  await app.start(3000);
  console.log('🍔 Lunchbot is running and ready to munch');
  console.log(`Install URL: ${process.env.SLACK_APP_URL}/slack/install`);
})();
