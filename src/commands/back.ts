import { Middleware, SlackCommandMiddlewareArgs } from '@slack/bolt/dist/types';
import rollbar from '../misc/rollbar';
import getChannelMention from '../misc/utils';

const backCommandCallback: Middleware<SlackCommandMiddlewareArgs> = async ({
  command,
  ack,
  say,
  client,
  context,
}) => {
  await ack();

  console.log(`⬇️ ${command.user_id} (${command.user_name}) invoked /back`);

  await say(
    `${await getChannelMention(command.channel_id)} <@${command.user_id}> is back`,
  ).catch((err) => {
    rollbar.error('Unable to send response', err, command);
  });

  await client.users.profile.set({
    token: context.userToken,
    profile: JSON.stringify({
      status_text: '',
      status_emoji: '',
    }),
  }).catch((err) => {
    rollbar.error('Unable to update user\'s Slack status', err);
  });
};

export default backCommandCallback;
