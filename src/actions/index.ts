import { App } from '@slack/bolt';
import { Middleware, SlackActionMiddlewareArgs } from '@slack/bolt/dist/types';

const authoriseAction: Middleware<SlackActionMiddlewareArgs> = async ({ ack }) => {
  await ack();
};

const registerActions = (app: App) => {
  console.info('Registering actions...');

  app.action('authorise', authoriseAction);
};

export default registerActions;
