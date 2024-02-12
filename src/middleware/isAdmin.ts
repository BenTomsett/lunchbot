import { Middleware, SlackCommandMiddlewareArgs } from '@slack/bolt/dist/types';
import { needAddedToChannel, needAdminPerms, needReauthorisation } from '../responses/authResponses';
import rollbar from '../misc/rollbar';
import { admins } from '../db';

const isAdmin: Middleware<SlackCommandMiddlewareArgs> = async ({
  ack,
  command,
  respond,
  next,
}) => {
  await ack();

  const invokingUserId = command.user_id;
  const channelId = command.channel_id;

  const admin = await admins.findOne({
    userId: invokingUserId,
    channelId,
  });

  if (!admin) {
    rollbar.error(`Admin-only command invoked by ${command.user_id} (${command.user_name}) without admin permissions in channel (${command.channel_name})`);
    return needAdminPerms(respond);
  }

  await next();
};

export default isAdmin;
