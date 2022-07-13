import { App } from '@slack/bolt';

import hasToken from '../middleware/hasToken';
import inChannel from '../middleware/inChannel';
import lunchCommandCallback from './lunch';
import backCommandCallback from './back';
import brbCommandCallback from './brb';
import hereCommandCallback from './here';

const registerCommands = (app: App) => {
  app.command('/lunch', hasToken, inChannel, lunchCommandCallback);
  app.command('/back', hasToken, inChannel, backCommandCallback);
  app.command('/brb', hasToken, inChannel, brbCommandCallback);
  app.command('/here', hasToken, inChannel, hereCommandCallback);
};

export default registerCommands;
