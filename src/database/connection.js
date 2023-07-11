const { MongoClient } = require('mongodb');
const logger = require('../config/logger');
require('dotenv').config();

global.mongo = global.mongo || {};

let db;

async function getMongoClient() {
    if (!global.mongo.client) {
        global.mongo.client = new MongoClient(process.env.MONGODB_URI);
        logger.info('Connected to MongoDB');
    }

    await global.mongo.client.connect();

    return global.mongo.client;
}

async function database() {
    const dbClient = await getMongoClient();
    if (!db) db = await dbClient.db(process.env.MONGODB_DB);
    return db;
}

async function closeDatabaseConnection() {
    if (global.mongo.client) {
        await global.mongo.client.close();
        logger.info('Disconnected from MongoDB');
        delete global.mongo.client;
        db = null;
    }
}

module.exports = {
    database,
    closeDatabaseConnection,
};
