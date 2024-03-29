import { RespondFn } from '@slack/bolt';

export const needAuthorisation = async (respond: RespondFn) => {
  await respond({
    response_type: 'ephemeral',
    blocks: [
      {
        type: 'section',
        text: {
          type: 'plain_text',
          text: 'Hi! :wave:\nIt looks like this is your first time using Lunchbot. In order to use Lunchbot, you\'ll need to give it some permissions, in order to change your status. Click the link below to authorise Lunchbot, and then try that command again.',
          emoji: true,
        },
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              emoji: true,
              text: 'Authorise Lunchbot',
            },
            action_id: 'authorise',
            style: 'primary',
            url: `${process.env.SLACK_APP_URL}/slack/install`,
          },
        ],
      },
    ],
  });
};

export const needReauthorisation = async (respond: RespondFn) => {
  await respond({
    response_type: 'ephemeral',
    blocks: [
      {
        type: 'section',
        text: {
          type: 'plain_text',
          text: 'Oops - it looks like we need to re-authorise Lunchbot before you can use it again. If you keep seeing this, there\'s likely a server issue - so please let someone know!',
          emoji: true,
        },
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              emoji: true,
              text: 'Authorise Lunchbot',
            },
            action_id: 'authorise',
            style: 'primary',
            url: `${process.env.SLACK_APP_URL}/slack/install`,
          },
        ],
      },
    ],

  });
};

export const needAddedToChannel = async (respond: RespondFn) => {
  await respond({
    response_type: 'ephemeral',
    blocks: [
      {
        type: 'section',
        text: {
          type: 'plain_text',
          text: 'Oops! To use Lunchbot, it needs to be added to the channel you\'re using it in.',
          emoji: true,
        },
      },
    ],
  });
};

export const needAdminPerms = async (respond: RespondFn) => {
  await respond({
    response_type: 'ephemeral',
    blocks: [
      {
        type: 'section',
        text: {
          type: 'plain_text',
          text: 'This command can only be run by Lunchbot admins. If you think you should have access, please ask an existing admin to add you to the list.',
          emoji: true,
        },
      },
    ],
  });
};
