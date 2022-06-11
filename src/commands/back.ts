import { Middleware, SlackCommandMiddlewareArgs } from '@slack/bolt/dist/types';

const backCommandCallback: Middleware<SlackCommandMiddlewareArgs> = async ({
  command,
  ack,
  say,
  client,
  context,
}) => {
  await ack();

  console.info(`⬇️ ${command.user_id} (${command.user_name}) invoked /back`);

  await say(
    `<!here> - <@${command.user_id}> is back`,
  ).catch((err) => {
    console.error('⚠️ Unable to send response:');
    console.error(err);
  });

  await client.users.profile.set({
    token: context.userToken,
    profile: JSON.stringify({
      status_text: '',
      status_emoji: '',
    }),
  }).catch((err) => {
    console.error('⚠️ Unable to update user\'s Slack status:');
    console.error(err);
  });
};

export default backCommandCallback;
