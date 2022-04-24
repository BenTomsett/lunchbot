/* eslint-disable import/first */
import dotenv from 'dotenv';

dotenv.config();

import express from 'express';
import bodyParser from 'body-parser';
import app, {receiver} from './app';
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

const port = process.env.PORT || 3000;
(async () => {
  try {
    await dbClient.connect();
    console.log('Connected to MongoDB database successfully');
  } catch (e) {
    console.error('Error connecting to MongoDB database:');
    console.error(e);
  }

  await app.start(port);
  console.log(`🍔 Lunchbot is running and ready to munch on port ${port}`);
  console.log(`Install URL: ${process.env.SLACK_APP_URL}/slack/install`);
})();

const server = express();
server.use(bodyParser.urlencoded({extended: false}));
server.get('/slack/install', (req, res) => {
  receiver.installer!.handleInstallPath(req, res);
})
server.get('/slack/oauth_redirect', (req, res) => {
  receiver.installer!.handleCallback(req, res);
});
server.listen(port);