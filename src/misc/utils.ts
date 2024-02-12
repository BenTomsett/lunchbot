import { channels } from '../db';

const getChannelMention = async (channelId: string) => {
  const channel = await channels.findOne({
    channelId,
  });

  if (channel && channel.mention) {
    return channel.mention;
  }

  return '<!here>';
};

export default getChannelMention;
