import { Middleware, SlackCommandMiddlewareArgs } from '@slack/bolt/dist/types';
import rollbar from '../misc/rollbar';
import { invalidChooseParameters, invalidLunchParameters } from '../responses/commandResponses';

const chooseCommandCallback: Middleware<SlackCommandMiddlewareArgs> = async ({
  command,
  ack,
  say,
  respond,
}) => {
  await ack();

  console.log(`⬇️ ${command.user_id} (${command.user_name}) invoked /choose`);

  const choices: string[] = command.text.split(' ');

  if (choices.length < 2) {
    return invalidChooseParameters(respond);
  }

  const choice: string = choices[Math.floor(Math.random() * choices.length)];

  await say(
    `${choice} is the chosen one!`,
  ).catch((err) => {
    rollbar.error('Unable to send response', err);
  });
};

export default chooseCommandCallback;
