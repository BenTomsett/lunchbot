import { RespondFn } from '@slack/bolt';

export const invalidLunchParameters = async (respond: RespondFn) => {
  await respond({
    response_type: 'ephemeral',
    text: 'Enter a command in the format `/lunch length (minutes|hours)`, for example `/lunch 30 minutes` or `/lunch 1 hour`.\nOr, just type `/lunch` to set yourself at lunch.',
  });
};
