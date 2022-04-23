import { Middleware, SlackCommandMiddlewareArgs } from '@slack/bolt/dist/types';
import { Installation } from '@slack/bolt';
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
    const installationKey = command.enterprise_id || command.team_id;
    const install: Installation = await installations.get(installationKey);
    const botToken = install.bot?.token;

    const userToken = await userTokens.get(command.user_id);

    if (!botToken || !userToken) {
      await needAuthorisation(respond);
    } else {
      context.botToken = botToken;
      context.userToken = userToken;
      await next();
    }
  } catch (e: any) {
    await adminErrorResponse(respond, e.message);
  }
};

export default getToken;
