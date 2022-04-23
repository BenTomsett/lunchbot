import { Middleware, SlackCommandMiddlewareArgs } from '@slack/bolt/dist/types';

const backCommandCallback: Middleware<SlackCommandMiddlewareArgs> = async ({
  command,
  ack,
  say,
  client,
  context,
}) => {
  await ack();

  await say(
    `<!here> - <@${command.user_id}> is back`,
  );

  await client.users.profile.set({
    token: context.userToken,
    profile: JSON.stringify({
      status_text: '',
      status_emoji: '',
    }),
  }).catch(async (err) => {
    console.log(err);
  });
};

export default backCommandCallback;
