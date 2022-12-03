import { App } from '@slack/bolt';

import getToken from '../middleware/getToken';
import inChannel from '../middleware/inChannel';
import lunchCommandCallback from './lunch';
import backCommandCallback from './back';
import brbCommandCallback from './brb';
import hereCommandCallback from './here';
import flipacoinCommandCallback from './flipacoin';
import chooseCommandCallback from './choose';

const registerCommands = (app: App) => {
  app.command('/lunch', getToken, inChannel, lunchCommandCallback);
  app.command('/back', getToken, inChannel, backCommandCallback);
  app.command('/bk', getToken, inChannel, backCommandCallback);
  app.command('/brb', getToken, inChannel, brbCommandCallback);
  app.command('/here', getToken, inChannel, hereCommandCallback);
  app.command('/flipacoin', getToken, inChannel, flipacoinCommandCallback);
  app.command('/choose', getToken, inChannel, chooseCommandCallback);
};

export default registerCommands;
