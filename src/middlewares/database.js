const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { database: databaseInstance } = require('../database/connection');
const { addSuperAdmin, getUserByEmail } = require('../database/queries/user');
require('dotenv').config();

let superAdminCreated = false;
let indexesCreated = false;

async function createSuperAdmin() {
    const user = await getUserByEmail(process.env.SEED_ADMIN_EMAIL);
    if (!user) {
        await addSuperAdmin();
    }
    superAdminCreated = true;
}

async function createIndexes() {
    const db = await databaseInstance();
    // eslint-disable-next-line no-undef
    await Promise.all([
        db.collection('users').createIndex({
            username: 'text',
            firstName: 'text',
            lastName: 'text',
        }),
    ]);

    indexesCreated = true;
}

const database = () => async (req, res, next) => {
    try {
        if (!superAdminCreated) await createSuperAdmin();
        if (!indexesCreated) await createIndexes();
    } catch (error) {
        return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, httpStatus[httpStatus.INTERNAL_SERVER_ERROR]));
    }
    return await next();
};

module.exports = { database };
