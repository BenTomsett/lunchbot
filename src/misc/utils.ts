import { channels } from '../db';

const getChannelMention = async (channelId: string) => {
  const channel = await channels.findOne({
    channelId,
  });

  if (channel && channel.mention) {
    if (channel.mention === 'nobody') {
      return '';
    }

    return `${channel.mention} -`;
  }

  return '<!here> - ';
};

export default getChannelMention;
