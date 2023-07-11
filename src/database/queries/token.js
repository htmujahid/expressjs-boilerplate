const { ObjectId } = require('mongodb');
const { database } = require('../connection');

async function createToken(token, userId, type, blacklisted = false, expires) {
    const db = await database();
    return await db.collection('tokens').insertOne({
        token,
        userId: new ObjectId(userId),
        type,
        blacklisted,
        expires,
        modifiedAt: new Date(),
        createdAt: new Date(),
    });
}

async function getToken(token, type, blacklisted = false) {
    const db = await database();
    return await db.collection('tokens').findOne({
        token,
        type,
        blacklisted,
    });
}

async function getTokensCount(userId, type = null) {
    const db = await database();
    if (type === null) {
        return await db.collection('tokens').countDocuments();
    }
    return await db.collection('tokens').countDocuments({
        userId: new ObjectId(userId),
        type,
    });
}

async function deleteToken(userId, type) {
    const db = await database();
    return await db.collection('tokens').deleteMany({
        userId: new ObjectId(userId),
        type,
    });
}

module.exports = {
    createToken,
    getToken,
    getTokensCount,
    deleteToken,
};
