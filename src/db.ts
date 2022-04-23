import Keyv from 'keyv';

export const installations = new Keyv('mongodb://localhost:27017/lunchbot', { collection: 'installations' });
export const userTokens = new Keyv('mongodb://localhost:27017/lunchbot', { collection: 'userTokens' });
