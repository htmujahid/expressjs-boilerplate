import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';
import { db } from '../../middlewares/database.middleware.js';
import process from '../../config/dotenv.js';

async function addUser({ firstName, lastName, email, password }) {
    const user = {
        emailVerified: false,
        email: email,
        firstName: firstName,
        lastName: lastName,
        role: 'user',
    };
    const hashedPassword = await bcrypt.hash(password, 10);
    const { insertedId } = await db.collection('users').insertOne({ ...user, password: hashedPassword });
    return insertedId;
}

async function getUser(id) {
    return db.collection('users').findOne({ _id: new ObjectId(id) }, { projection: dbProjectionUsers() });
}

async function getUserPassword(id) {
    const user = await db.collection('users').findOne({ _id: new ObjectId(id) }, { projection: { password: 1 } });
    return user ? user.password : null;
}

async function getUserByEmail(email) {
    return await db
        .collection('users')
        .findOne({ email }, { projection: dbProjectionUsers() })
        .then(user => user || null);
}

async function updateUser(id, data) {
    const { matchedCount } = await db.collection('users').updateOne(
        { _id: new ObjectId(id) },
        {
            $set: {
                ...data,
            },
        },
    );
    return !!matchedCount;
}

async function updateUserPassword(id, newPassword) {
    const password = await bcrypt.hash(newPassword, 10);
    await db.collection('users').updateOne({ _id: new ObjectId(id) }, { $set: { password } });
}

async function addSuperAdmin() {
    const password = await bcrypt.hash(process.env.SEED_ADMIN_PASS, 10);
    const user = {
        firstName: 'Super',
        lastName: 'Admin',
        email: process.env.SEED_ADMIN_EMAIL,
        password,
        role: 'admin',
        emailVerified: true,
    };
    return await db.collection('users').insertOne(user);
}

function dbProjectionUsers(prefix = '') {
    return {
        [`${prefix}password`]: 0,
        [`${prefix}emailVerified`]: 0,
    };
}

async function updateUserByEmail(email, data) {
    const { matchedCount } = await db.collection('users').updateOne(
        { email },
        {
            $set: {
                ...data,
            },
        },
    );
    return !!matchedCount;
}

function deleteUserByEmail(email) {
    return db.collection('users').deleteOne({ email });
}

export default {
    addUser,
    getUser,
    getUserPassword,
    getUserByEmail,
    updateUser,
    updateUserPassword,
    addSuperAdmin,
    updateUserByEmail,
    deleteUserByEmail,
};
