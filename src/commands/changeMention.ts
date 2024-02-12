import { Middleware, SlackCommandMiddlewareArgs } from '@slack/bolt/dist/types';
import { invalidChangeMentionParameters } from '../responses/commandResponses';
import { channels } from '../db';

const changeMentionCommandCallback: Middleware<SlackCommandMiddlewareArgs> = async ({
  command,
  ack,
  respond,
}) => {
  await ack();

  console.log(`⬇️ ${command.user_id} (${command.user_name}) invoked /change_mention (with text: ${command.text})`);

  // Mention types (all valid for this command):
  // special mentions (e.g. @here) -> <!here>
  // user mentions                 -> <@U02S5G1SN8M|benji>
  // bot/app mentions              -> <@U06JQ5XF89F|lunchbot2>
  // channel mentions              -> <#C03PN47NT09|>
  // user group mentions           -> <!subteam^S06JQ5XFA|frontend>

  const mentionRegex = /<(([@!#]|(!subteam\^))[A-Z0-9]+)(\|[a-z0-9]*)?>/i;

  if (command.text === '') {
    return invalidChangeMentionParameters(respond);
  }

  const args = command.text.split(' ');

  if (args.length !== 1) {
    return invalidChangeMentionParameters(respond);
  }

  const mention = args[0];
  if (!mentionRegex.test(mention)) {
    return invalidChangeMentionParameters(respond);
  }

  const channelInfo = {
    channelId: command.channel_id,
    teamId: command.team_id,
  };

  await channels.updateOne(channelInfo, { $set: { ...channelInfo, mention } }, { upsert: true });

  await respond({
    response_type: 'ephemeral',
    text: `Lunchbot will now mention ${mention} in its responses.`,
  });
};

export default changeMentionCommandCallback;
