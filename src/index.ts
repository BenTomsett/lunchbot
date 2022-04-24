/* eslint-disable import/first */
import dotenv from 'dotenv';

dotenv.config();

import app from './app';
import { dbClient } from './db';

if (!process.env.SLACK_APP_TOKEN) {
  throw new Error('Lunchbox needs a valid app-level token in order to start.');
}

if (!process.env.SLACK_CLIENT_ID) {
  throw new Error('Lunchbox needs a valid Slack client ID in order to start.');
}

if (!process.env.SLACK_CLIENT_SECRET) {
  throw new Error('Lunchbox needs a valid Slack client secret in order to start.');
}

if (!process.env.MONGO_CONN_STRING) {
  throw new Error('Lunchbox needs valid MongoDB connection information in order to start.');
}

(async () => {
  try {
    await dbClient.connect();
    console.log('Connected to MongoDB database successfully');
  } catch (e) {
    console.error('Error connecting to MongoDB database:');
    console.error(e);
  }

  await app.start(3000);
  console.log('🍔 Lunchbot is running and ready to munch');
  console.log(`Install URL: ${process.env.SLACK_APP_URL}/slack/install`);
})();
