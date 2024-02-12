import { Middleware, SlackCommandMiddlewareArgs } from '@slack/bolt/dist/types';
import { Installation } from '@slack/bolt';
import {
  needAuthorisation,
} from '../responses/authResponses';
import { installations } from '../db';
import rollbar from '../misc/rollbar';

const getToken: Middleware<SlackCommandMiddlewareArgs> = async ({
  ack,
  context,
  command,
  respond,
  next,
}) => {
  await ack();

  const install = await installations.findOne({
    'team.id': command.team_id,
    'user.id': command.user_id,
  }) as unknown as Installation;

  if (install && install.user.token) {
    context.userToken = install.user.token;
    await next();
  } else {
    rollbar.error(`No user token found for user ${command.user_id} (${command.user_name})`);
    await needAuthorisation(respond);
  }
};

export default getToken;
