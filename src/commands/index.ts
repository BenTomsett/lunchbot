import { App } from '@slack/bolt';

import getToken from '../middleware/getToken';
import inChannel from '../middleware/inChannel';
import isAdmin from '../middleware/isAdmin';
import lunchCommandCallback from './lunch';
import backCommandCallback from './back';
import brbCommandCallback from './brb';
import hereCommandCallback from './here';
import flipacoinCommandCallback from './flipacoin';
import chooseCommandCallback from './choose';
import changeMentionCommandCallback from './changeMention';

const registerCommands = (app: App) => {
  console.info('Registering commands...');

  app.command('/lunch', getToken, inChannel, lunchCommandCallback);
  app.command('/back', getToken, inChannel, backCommandCallback);
  app.command('/bk', getToken, inChannel, backCommandCallback);
  app.command('/brb', getToken, inChannel, brbCommandCallback);
  app.command('/here', getToken, inChannel, hereCommandCallback);
  app.command('/flipacoin', getToken, inChannel, flipacoinCommandCallback);
  app.command('/choose', getToken, inChannel, chooseCommandCallback);

  app.command('/change_mention', getToken, inChannel, isAdmin, changeMentionCommandCallback);
};

export default registerCommands;
