require('dotenv').config();
const { closeDatabaseConnection, database } = require('../../src/database/connection');

const setupTestDB = async () => {
    let db;
    beforeAll(async () => {
        db = await database();
    });

    beforeEach(async () => {
        const collections = await db.listCollections().toArray();

        for (const collection of collections) {
            await db.collection(collection.name).deleteMany();
        }
    });

    afterAll(async () => {
        const collections = await db.listCollections().toArray();

        for (const collection of collections) {
            await db.collection(collection.name).deleteMany();
        }
        
        await closeDatabaseConnection();
    });
};

module.exports = setupTestDB;
