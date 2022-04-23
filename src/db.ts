import Keyv from 'keyv';

const { MONGO_HOST, MONGO_USER, MONGO_PASS } = process.env;

const uri = `mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}:27017/lunchbot`;

export const installations = new Keyv(uri, { collection: 'installations' });
export const userTokens = new Keyv(uri, { collection: 'userTokens' });
