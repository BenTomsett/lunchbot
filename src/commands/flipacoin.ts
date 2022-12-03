import { Middleware, SlackCommandMiddlewareArgs } from '@slack/bolt/dist/types';

const flipacoinCommandCallback: Middleware<SlackCommandMiddlewareArgs> = async ({
  command,
  ack,
  say,
}) => {
  await ack();

  console.log(`⬇️ ${command.user_id} (${command.user_name}) invoked /flipacoin`);

  const coinToss: string = Math.floor(Math.random() * 2) === 0 ? 'heads' : 'tails';

  await say(
    `It's ${coinToss}!`,
  ).catch((err) => {
    console.error('⚠️ Unable to send response:');
    console.error(err);
  });
};

export default flipacoinCommandCallback;
