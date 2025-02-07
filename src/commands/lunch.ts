import {
  Middleware,
  SlackCommandMiddlewareArgs,
} from '@slack/bolt/dist/types';
import { addHours, addMinutes } from 'date-fns';
import { invalidLunchParameters } from '../responses/commandResponses';
import rollbar from '../misc/rollbar';
import getChannelMention from '../misc/utils';

export const getStatusExpiration = (text: string) => {
  const validMinuteUnits = ['minute', 'minutes', 'min', 'mins', 'm'];
  const validHourUnits = ['hour', 'hours', 'hr', 'hrs', 'h'];

  let statusExpiration = 0;

  if (text !== '') {
    let args = text.split(' ');

    if (args.length === 1) {
      args = args[0].split(/([0-9]+)/)
        .filter((arg) => arg !== '');
    }

    if (args.length !== 2 || Number.isNaN(args[0])) {
      return null;
    }

    let date = new Date();
    const length = parseInt(args[0], 10);
    const unit = args[1];

    if (length <= 0) {
      return null;
    }

    if (validHourUnits.includes(unit)) {
      date = addHours(date, length);
    } else if (validMinuteUnits.includes(unit)) {
      date = addMinutes(date, length);
    } else {
      return null;
    }

    statusExpiration = Math.floor(date.getTime() / 1000);
  }

  return statusExpiration;
};

const lunchCommandCallback: Middleware<SlackCommandMiddlewareArgs> = async ({
  command,
  ack,
  say,
  client,
  context,
  respond,
}) => {
  await ack();

  console.log(`⬇️ ${command.user_id} (${command.user_name}) invoked /lunch`);

  const statusExpiration = getStatusExpiration(command.text);

  if (statusExpiration === null) {
    return invalidLunchParameters(respond);
  }

  return (async () => {
    await say(
      `${await getChannelMention(command.channel_id)} <@${command.user_id}> is going on lunch${statusExpiration > 0 ? `<!date^${statusExpiration}^ until {time}| >` : ''} :hamburger:`,
    )
      .catch((err) => {
        rollbar.error('Unable to send response', err, command);
      });

    await client.users.profile.set({
      token: context.userToken,
      profile: JSON.stringify({
        status_text: 'On lunch',
        status_emoji: ':hamburger:',
        status_expiration: statusExpiration,
      }),
    })
      .catch((err) => {
        rollbar.error('Unable to update user\'s Slack status', err, command);
      });
  })();
};

export default lunchCommandCallback;
