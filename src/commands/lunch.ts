import { addHours, addMinutes, format } from 'date-fns';
import { Middleware, SlackCommandMiddlewareArgs } from '@slack/bolt/dist/types';
import { invalidLunchParameters } from '../responses/commandResponses';

const lunchCommandCallback: Middleware<SlackCommandMiddlewareArgs> = async ({
  command,
  ack,
  say,
  client,
  context,
  respond,
}) => {
  await ack();

  console.info(`⬇️ ${command.user_id} (${command.user_name}) invoked /lunch`);

  let formattedDate;

  if (command.text !== '') {
    const tokens = command.text.split(' ');
    const validMinuteUnits = ['minute', 'minutes', 'min', 'mins', 'm'];
    const validHourUnits = ['hour', 'hours', 'hr', 'hrs', 'h'];

    if (tokens.length !== 2) {
      await invalidLunchParameters(respond);
    } else if (Number.isNaN(tokens[0])) {
      await invalidLunchParameters(respond);
    } else {
      let date = new Date();
      const length = parseInt(tokens[0], 10);
      const unit = tokens[1];

      if (validHourUnits.includes(unit)) {
        date = addHours(date, length);
      } else if (validMinuteUnits.includes(unit)) {
        date = addMinutes(date, length);
      } else {
        await invalidLunchParameters(respond);
      }

      formattedDate = format(date, 'p');
    }
  }

  await say(
    `<!here> - <@${command.user_id}> is going on lunch ${formattedDate
      ? `until ${formattedDate} `
      : ''}:knife_fork_plate:`,
  ).catch((err) => {
    console.error('⚠️ Unable to send response:');
    console.error(err);
  });

  await client.users.profile.set({
    token: context.userToken,
    profile: JSON.stringify({
      status_text: `On lunch ${formattedDate ? `until ${formattedDate} ` : ''}`,
      status_emoji: ':knife_fork_plate:',
    }),
  }).catch((err) => {
    console.error('⚠️ Unable to update user\'s Slack status:');
    console.error(err);
  });
};

export default lunchCommandCallback;
