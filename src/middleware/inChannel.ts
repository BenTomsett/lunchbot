import { Middleware, SlackCommandMiddlewareArgs } from '@slack/bolt/dist/types';
import {
  needAddedToChannel,
} from '../responses/authResponses';

const inChannel: Middleware<SlackCommandMiddlewareArgs> = async ({
  ack,
  command,
  client,
  context,
  respond,
  next,
}) => {
  await ack();
  const { members } = await client.conversations.members({ channel: command.channel_id });
  if (!members || !members.includes(context.botUserId!)) {
    await needAddedToChannel(respond);
  } else {
    await next();
  }
};

export default inChannel;
