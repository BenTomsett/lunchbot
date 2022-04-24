import { Middleware, SlackCommandMiddlewareArgs } from '@slack/bolt/dist/types';
import { installations, userTokens } from '../db';
import {
  needAuthorisation,
} from '../responses/authResponses';
import { adminErrorResponse } from '../responses/errorResponses';

const getToken: Middleware<SlackCommandMiddlewareArgs> = async ({
  ack,
  command,
  respond,
  context,
  next,
}) => {
  await ack();
  try {
    let install;
    if (command.enterprise_id) {
      install = await installations.findOne({ 'enterprise.id': command.enterprise_id });
    } else {
      install = await installations.findOne({ 'team.id': command.team_id });
    }
    const botToken = install?.bot?.token;

    const user = await userTokens.findOne({ userId: command.user_id });

    if (!botToken || !user?.token) {
      await needAuthorisation(respond);
    } else {
      context.botToken = botToken;
      context.userToken = user.token;
      await next();
    }
  } catch (e: any) {
    await adminErrorResponse(respond, e.message);
  }
};

export default getToken;
