import { Middleware, SlackCommandMiddlewareArgs } from '@slack/bolt/dist/types';
import { invalidSetParameters, noTokenFoundForSetUser } from '../responses/commandResponses';
import { installations } from '../db';
import { getStatusExpiration } from './lunch';
import getChannelMention from '../misc/utils';
import rollbar from '../misc/rollbar';

const setCommandCallback: Middleware<SlackCommandMiddlewareArgs> = async ({
  command,
  ack,
  respond,
  say,
  client,
}) => {
  await ack();

  console.log(`⬇️ ${command.user_id} (${command.user_name}) invoked /set (with text: ${command.text})`);

  const args = command.text.split(' ');

  // args length must be 2 or greater
  // args[0] must be the user to set the status for
  // args[1] must be the status to set
  // args[2] is the lunch length (if args[1] is "lunch")

  if (args.length < 2) {
    return invalidSetParameters(respond);
  }

  const user = args[0];

  // validate user ID, check we have a token for them
  const userIdRegex = /<@([^>|]+)/;
  const userIdMatch = user.match(userIdRegex);
  if (!userIdMatch || userIdMatch.length < 2) {
    return invalidSetParameters(respond);
  }

  const userId = userIdMatch[1];
  const installation = await installations.findOne(
    { 'user.id': userId },
  );

  if (!installation) {
    return noTokenFoundForSetUser(respond);
  }

  const userToken = installation.user.token;

  const status = args[1];

  if (status === 'lunch') {
    const statusExpiration = getStatusExpiration(args.slice(2).join(' '));

    if (statusExpiration === null) {
      return invalidSetParameters(respond);
    }

    await say(
      `${await getChannelMention(command.channel_id)} - <@${userId}> is going on lunch${statusExpiration > 0 ? `<!date^${statusExpiration}^ until {time}| >` : ''} :hamburger: (set by <@${command.user_id}>)`,
    )
      .catch((err) => {
        rollbar.error('Unable to send response', err);
      });

    await client.users.profile.set({
      token: userToken,
      profile: JSON.stringify({
        status_text: 'On lunch',
        status_emoji: ':hamburger:',
        status_expiration: statusExpiration,
      }),
    })
      .catch((err) => {
        rollbar.error('Unable to update user\'s Slack status', err, command);
      });
  } else if (status === 'brb') {
    await say(
      `${await getChannelMention(command.channel_id)} - <@${userId}> will be right back (set by <@${command.user_id}>)`,
    ).catch((err) => {
      rollbar.error('Unable to send response', err, command);
    });

    await client.users.profile.set({
      token: userToken,
      profile: JSON.stringify({
        status_text: 'BRB',
        status_emoji: ':clock1:',
      }),
    }).catch(async (err) => {
      rollbar.error('Unable to update user\'s Slack status', err, command);
    });
  } else if (status === 'back') {
    await say(
      `${await getChannelMention(command.channel_id)} - <@${userId}> is back (set by <@${command.user_id}>)`,
    ).catch((err) => {
      rollbar.error('Unable to send response', err, command);
    });

    await client.users.profile.set({
      token: userToken,
      profile: JSON.stringify({
        status_text: '',
        status_emoji: '',
      }),
    }).catch((err) => {
      rollbar.error('Unable to update user\'s Slack status', err, command);
    });
  } else {
    return invalidSetParameters(respond);
  }
};

export default setCommandCallback;
