import { Middleware, SlackCommandMiddlewareArgs } from '@slack/bolt/dist/types';

const brbCommandCallback: Middleware<SlackCommandMiddlewareArgs> = async ({
  command,
  ack,
  say,
  client,
  context,
}) => {
  await ack();

  await say(
    `<!here> - <@${command.user_id}> will be right back`,
  );

  await client.users.profile.set({
    token: context.userToken,
    profile: JSON.stringify({
      status_text: 'BRB',
      status_emoji: ':clock1:',
    }),
  }).catch(async (err) => {
    console.log(err);
  });
};

export default brbCommandCallback;
