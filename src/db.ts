import { MongoClient } from 'mongodb';

const { MONGO_CONN_STRING } = process.env;
export const dbClient = new MongoClient(MONGO_CONN_STRING!);

export const installations = dbClient.db('lunchbot').collection('installations');
export const userTokens = dbClient.db('lunchbot').collection('userTokens');
