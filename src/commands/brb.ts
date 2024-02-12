import { Middleware, SlackCommandMiddlewareArgs } from '@slack/bolt/dist/types';
import rollbar from '../misc/rollbar';

const brbCommandCallback: Middleware<SlackCommandMiddlewareArgs> = async ({
  command,
  ack,
  say,
  client,
  context,
}) => {
  await ack();

  console.log(`⬇️ ${command.user_id} (${command.user_name}) invoked /brb`);

  await say(
    `<!here> - <@${command.user_id}> will be right back`,
  ).catch((err) => {
    rollbar.error('Unable to send response', err);
  });

  await client.users.profile.set({
    token: context.userToken,
    profile: JSON.stringify({
      status_text: 'BRB',
      status_emoji: ':clock1:',
    }),
  }).catch(async (err) => {
    rollbar.error('Unable to update user\'s Slack status', err);
  });
};

export default brbCommandCallback;
