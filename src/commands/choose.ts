import { Middleware, SlackCommandMiddlewareArgs } from '@slack/bolt/dist/types';
import rollbar from '../misc/rollbar';

const chooseCommandCallback: Middleware<SlackCommandMiddlewareArgs> = async ({
  command,
  ack,
  say,
}) => {
  await ack();

  console.log(`⬇️ ${command.user_id} (${command.user_name}) invoked /choose`);

  const choices: string[] = command.text.split(' ');
  const choice: string = choices[Math.floor(Math.random() * choices.length)];

  await say(
    `${choice} is the chosen one!`,
  ).catch((err) => {
    rollbar.error('Unable to send response', err);
  });
};

export default chooseCommandCallback;
