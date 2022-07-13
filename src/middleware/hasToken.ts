import { Middleware, SlackCommandMiddlewareArgs } from '@slack/bolt/dist/types';
import {
  needAuthorisation,
} from '../responses/authResponses';

const hasToken: Middleware<SlackCommandMiddlewareArgs> = async ({
  ack,
  context,
  command,
  respond,
  next,
}) => {
  await ack();
  if (!context.userToken) {
    console.error(`⚠️ No user token found for user ${command.user_id} (${command.user_name})`);
    await needAuthorisation(respond);
  } else {
    await next();
  }
};

export default hasToken;
