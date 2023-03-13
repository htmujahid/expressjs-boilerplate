import { MongoClient } from 'mongodb';

import process from './dotenv.js';

global.mongo = global.mongo || {};

export async function getMongoClient() {
    if (!global.mongo.client) {
        global.mongo.client = new MongoClient(process.env.MONGODB_URI);
    }
    await global.mongo.client.connect();

    return global.mongo.client;
}
