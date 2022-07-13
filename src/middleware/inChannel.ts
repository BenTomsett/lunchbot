import { Middleware, SlackCommandMiddlewareArgs } from '@slack/bolt/dist/types';
import { needAddedToChannel, needReauthorisation } from '../responses/authResponses';

const inChannel: Middleware<SlackCommandMiddlewareArgs> = async ({
  ack,
  command,
  client,
  context,
  respond,
  next,
}) => {
  await ack();
  try {
    const { members } = await client.conversations.members({ channel: command.channel_id });
    if (!members || !members.includes(context.botUserId!)) {
      console.error(`⚠️ Command invoked by ${command.user_id} (${command.user_name}) where Lunchbot was not in channel (${command.channel_name})`);
      await needAddedToChannel(respond);
    } else {
      await next();
    }
  } catch (e: any) {
    if (e.data.error === 'missing_scope') {
      await needReauthorisation(respond);
    }
  }
};

export default inChannel;
