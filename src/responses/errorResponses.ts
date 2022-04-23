import { RespondFn } from '@slack/bolt';

export const errorResponse = async (respond: RespondFn) => {
  await respond({
    response_type: 'ephemeral',
    blocks: [
      {
        type: 'section',
        text: {
          type: 'plain_text',
          text: "Looks like Lunchbot ran into an error. We've made someone aware and they'll look into the issue ASAP.",
        },
      },
    ],
  });
};

export const adminErrorResponse = async (respond: RespondFn, error: string) => {
  await respond({
    response_type: 'ephemeral',
    blocks: [
      {
        type: 'section',
        text: {
          type: 'plain_text',
          text: 'Looks like Lunchbot ran into an error.',
        },
      },
      {
        type: 'section',
        text: {
          type: 'plain_text',
          text: "As you're an admin, the error log is below:",
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `\`\`\`${error}\`\`\``,
        },
      },
    ],
  });
};
