import { App } from '@slack/bolt';

import getToken from '../middleware/getToken';
import inChannel from '../middleware/inChannel';
import lunchCommandCallback from './lunch';
import backCommandCallback from './back';
import brbCommandCallback from './brb';
import hereCommandCallback from './here';

const registerCommands = (app: App) => {
  app.command('/lunch', getToken, inChannel, lunchCommandCallback);
  app.command('/back', getToken, inChannel, backCommandCallback);
  app.command('/bk', getToken, inChannel, backCommandCallback);
  app.command('/brb', getToken, inChannel, brbCommandCallback);
  app.command('/here', getToken, inChannel, hereCommandCallback);
};

export default registerCommands;
