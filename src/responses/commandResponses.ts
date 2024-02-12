import { RespondFn } from '@slack/bolt';

export const invalidLunchParameters = async (respond: RespondFn) => {
  await respond({
    response_type: 'ephemeral',
    text: 'Enter a command in the format `/lunch length (minutes|hours)`, for example `/lunch 30 minutes` or `/lunch 1 hour`.\nOr, just type `/lunch` to set yourself at lunch.',
  });
};

export const invalidChooseParameters = async (respond: RespondFn) => {
  await respond({
    response_type: 'ephemeral',
    text: 'Enter a command in the format `/choose options...`, for example `/choose hamburger pizza`. The options can be strings, numbers, or you can tag other users as an option. You must specify 2 or more options separated by spaces.',
  });
};
