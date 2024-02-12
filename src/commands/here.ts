import { Middleware, SlackCommandMiddlewareArgs } from '@slack/bolt/dist/types';
import { UsersProfileGetResponse } from '@slack/web-api';
import rollbar from '../misc/rollbar';

const hereCommandCallback: Middleware<SlackCommandMiddlewareArgs> = async ({
  command,
  ack,
  respond,
  client,
}) => {
  await ack();

  console.log(`⬇️ ${command.user_id} (${command.user_name}) invoked /here`);

  // How do we know who's not here?
  // 1) if they have 'On lunch' as their status text and ':knife_fork_plate:' as their status emoji
  // 2) if they have 'BRB' as their status text and ':clock1:' as their status emoji

  const { members } = await client.conversations.members(
    { channel: command.channel_id },
  );

  if (members) {
    const promises: Promise<UsersProfileGetResponse>[] = [];
    members.forEach((user) => {
      const promise = client.users.profile.get({ user });
      promises.push(promise);
    });
    const profiles = await Promise.all(promises);

    const brb: string[] = [];
    const lunch: { id: string, until: number }[] = [];

    profiles.forEach(({ profile }, index) => {
      if (profile?.status_text === 'BRB' && profile.status_emoji === ':clock1:') {
        brb.push(members[index]);
      } else if (profile?.status_text === 'On lunch' && profile.status_emoji === ':hamburger:') {
        lunch.push({
          id: members[index],
          until: Math.floor(profile.status_expiration || 0 / 1000) || 0,
        });
      }
    });

    let lunchString = '';
    if (lunch.length === 0) {
      lunchString = 'Nobody is on lunch break.';
    } else {
      lunch.forEach((member) => {
        lunchString += `<@${member.id}>${member.until > 0 ? `<!date^${member.until}^ until {time}| >` : ''}\n`;
      });
    }

    let brbString = '';
    if (brb.length === 0) {
      brbString = 'Nobody is away.';
    } else {
      brb.forEach((member) => {
        brbString += `<@${member}>\n`;
      });
    }

    await respond({
      response_type: 'ephemeral',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*On lunch:*\n${lunchString}`,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*BRB:*\n${brbString}`,
          },
        },
      ],
    }).catch((err) => {
      rollbar.error('Unable to send response', err);
    });
  }
};

export default hereCommandCallback;
