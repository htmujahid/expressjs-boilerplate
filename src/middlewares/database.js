const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { database: databaseInstance } = require('../database/connection');
const { User } = require('../database/queries');
const roleSeeder = require('../database/seeders/role.seeder');
require('dotenv').config();

let superAdminCreated = false;
let indexesCreated = false;
let seedersExecuted = false;

async function createSuperAdmin() {
    const user = await User.getUserByEmail(process.env.SEED_ADMIN_EMAIL);
    if (!user) {
        await User.addSuperAdmin();
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
        // db.collection('roles').createIndex({ name: 1 }, { unique: true }),
        // db.collection('permissions').createIndex({ name: 1 }, { unique: true }),
    ]);

    indexesCreated = true;
}

const database = () => async (req, res, next) => {
    try {
        if (!indexesCreated) await createIndexes();
        // if (!seedersExecuted) {
        //     await roleSeeder();
        //     seedersExecuted = true;
        // }
        if (!superAdminCreated) await createSuperAdmin();
    } catch (error) {
        return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, httpStatus[httpStatus.INTERNAL_SERVER_ERROR]));
    }
    return await next();
};

module.exports = { database };
