import { App, SlackEventMiddlewareArgs } from '@slack/bolt';
import { Middleware } from '@slack/bolt/dist/types';
import { channels } from '../db';

const memberJoinedChannelEvent: Middleware<SlackEventMiddlewareArgs<'member_joined_channel'>> = async ({ event, client, say }) => {
  console.log(`⬇️ responding to member_joined_channel event in channel ${event.channel} from team ${event.team}`);

  const joinedUserId = event.user;
  const botUserId = await client.auth.test().then((res) => res.user_id);

  if (joinedUserId === botUserId) {
    const channelInfo = {
      channelId: event.channel,
      teamId: event.team,
    };

    await channels.updateOne(channelInfo, { $set: channelInfo }, { upsert: true });
  }
};

const registerEvents = (app: App) => {
  console.info('Registering events...');

  app.event('member_joined_channel', memberJoinedChannelEvent);
};

export default registerEvents;
