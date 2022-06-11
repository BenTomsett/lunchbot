import { Middleware, SlackCommandMiddlewareArgs } from '@slack/bolt/dist/types';
import { UsersProfileGetResponse } from '@slack/web-api';

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

  const brb: string[] = [];
  const lunch: { id: string, until?: string }[] = [];

  const { members } = await client.conversations.members(
    { channel: command.channel_id },
  );

  const promises: Promise<UsersProfileGetResponse>[] = [];
  if (members) {
    members.forEach((user) => {
      const promise = client.users.profile.get({ user });
      promises.push(promise);
    });
    const profiles = await Promise.all(promises);
    profiles.forEach(({ profile }, index) => {
      if (profile?.status_text === 'BRB' && profile.status_emoji === ':clock1:') {
        brb.push(members[index]);
      } else if (profile?.status_text?.includes('On lunch') && profile.status_emoji === ':knife_fork_plate:') {
        if (profile?.status_text?.includes('until')) {
          const until = profile?.status_text?.replace('On lunch', '');
          lunch.push({ id: members[index], until });
        } else {
          lunch.push({ id: members[index] });
        }
      }
    });

    let lunchString = '';
    if (lunch.length === 0) {
      lunchString = 'Nobody is on lunch break.';
    } else {
      lunch.forEach((member, index) => {
        lunchString += `<@${member.id}>${member.until || ''}`;
        if (index !== lunch.length - 1) {
          lunchString += ', ';
        }
      });
    }

    let brbString = '';
    if (brb.length === 0) {
      brbString = 'Nobody is away.';
    } else {
      brb.forEach((member, index) => {
        brbString += `<@${member}>`;
        if (index !== brb.length - 1) {
          brbString += ', ';
        }
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
      console.error('⚠️ Unable to send response:');
      console.error(err);
    });
  }
};

export default hereCommandCallback;
