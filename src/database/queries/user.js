const bcrypt = require('bcryptjs');
const { ObjectId } = require('mongodb');
const { database } = require('../connection');

async function getUserByEmail(email) {
    const db = await database();
    return db
        .collection('users')
        .findOne({ email }, { projection: dbProjectionUsers() })
        .then((user) => user || null);
}

async function getUserByEmailWithPassword(email) {
    const db = await database();
    return db
        .collection('users')
        .findOne({ email })
        .then((user) => user || null);
}

async function getUserByUsername(username) {
    const db = await database();
    return db
        .collection('users')
        .findOne({ username }, { projection: dbProjectionUsers() })
        .then((user) => user || null);
}

function dbProjectionUsers(prefix = '') {
    return {
        [`${prefix}password`]: 0,
    };
}

async function getUser(id) {
    const db = await database();
    const user = await db.collection('users').findOne(
        {
            _id: new ObjectId(id),
        },
        { projection: dbProjectionUsers() },
    );

    if (!user) return null;

    return {
        ...user,
        createdAt: undefined,
        modifiedAt: undefined,
    }
}

async function getUserWithPassword(id) {
    const db = await database();
    return await db.collection('users').findOne({
        _id: new ObjectId(id),
    });
}

async function updatePassword(id, password) {
    const db = await database();
    const newPassword = await bcrypt.hash(password, 10);

    const { matchedCount } = await db.collection('users').updateOne(
        {
            _id: new ObjectId(id),
        },
        { $set: { password: newPassword } },
    );
    return matchedCount;
}

async function updatePasswordByEmail(email, password) {
    const db = await database();
    const hashedPassword = await bcrypt.hash(password, 10);

    const { matchedCount } = await db.collection('users').updateOne(
        {
            email,
        },
        { $set: { password: hashedPassword } },
    );
    return matchedCount;
}

async function registerUser(user) {
    const db = await database();
    let password;
    if (user.password) password = bcrypt.hashSync(user.password, 10);
    else password = undefined;

    const newUser = {
        ...user,
        password,
        role: user.role || 'user',
        emailVerified: null,
        createdAt: new Date(),
        modifiedAt: new Date(),
    };

    const { insertedId } = await db.collection('users').insertOne(newUser);
    if (insertedId)
        return {
            _id: insertedId,
            ...newUser,
            password: undefined,
            createdAt: undefined,
            modifiedAt: undefined,
        }
    else return null;
}

async function registerVerifiedProviderUser(user) {
    const db = await database();
    const newUser = {
        ...user,
        role: user.role || 'user',
        emailVerified: new Date(),
        createdAt: new Date(),
        modifiedAt: new Date(),
    };

    const { insertedId } = await db.collection('users').insertOne(newUser);
    return insertedId;
}

async function registerManyUsers(users) {
    const db = await database();
    const newUsers = users.map((user) => ({
        ...user,
        password: bcrypt.hashSync(user.password, 10),
        emailVerified: null,
        createdAt: new Date(),
        modifiedAt: new Date(),
    }));

    const { insertedIds } = await db.collection('users').insertMany(newUsers);
    return insertedIds;
}

async function addSuperAdmin() {
    const db = await database();
    const password = await bcrypt.hash(process.env.SEED_ADMIN_PASS, 10);
    const user = {
        email: process.env.SEED_ADMIN_EMAIL,
        username: process.env.SEED_ADMIN_USERNAME,
        password,
        role: 'admin',
        emailVerified: new Date(),
    };
    const {insertedId} = await db.collection('users').insertOne(user);
    // if (insertedId) {
    //     await setUserRole(insertedId, 'admin');
    // }
    return insertedId;
}
async function updateUser(id, updatedData) {
    const db = await database();
    const updatedUser = { ...updatedData, modifiedAt: new Date() };

    const { matchedCount } = await db.collection('users').updateOne({ _id: new ObjectId(id) }, { $set: updatedUser });
    
    if (matchedCount){
        return {
            ...updatedData,
            password: undefined
        };
    }
    else return null;
}

async function deleteUser(id) {
    const db = await database();
    const { deletedCount } = await db.collection('users').deleteOne({
        _id: new ObjectId(id),
    });
    return deletedCount;
}

async function findUser(filter, options, userId) {
    const db = await database();
    const searchTerms = filter.name ? filter.name.split(' ') : [];

    const regexArray = searchTerms.map((term) => ({
        $or: [
            { name: { $regex: term, $options: 'i' } },
            { username: { $regex: term, $options: 'i' } },
            { firstName: { $regex: term, $options: 'i' } },
            { lastName: { $regex: term, $options: 'i' } },
        ],
    }));

    const query = {
        $and: [
            { _id: { $ne: new ObjectId(userId) } },
            ...(regexArray.length > 0 ? regexArray : []),
            { role: { $ne: 'admin' } },
            filter.role ? { role: { $eq: filter.role, $ne: 'admin' } } : {},
        ],
    };

    const projection = {
        createdAt: 0,
        modifiedAt: 0,
        password: 0,
        emailVerified: 0,
    };

    const sortOptions = {};
    if (options.sortBy) {
        const sortFields = options.sortBy.split(',');
        sortFields.forEach(field => {
          const [fieldName, sortOrder] = field.split(':');
          sortOptions[fieldName] = sortOrder === 'desc' ? -1 : 1;
        });
      }
    
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;

    // eslint-disable-next-line no-undef
    const [users, totalCount] = await Promise.all([
        db.collection('users')
            .find(query, { projection })
            .sort(sortOptions)
            .skip(skip)
            .limit(limit)
            .toArray(),
        db.collection('users')
            .countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
        page: page,
        data: users,
        limit,
        totalRecords: totalCount,
        totalPages: totalPages,
    };
}


async function verifyUserEmail(id) {
    const db = await database();
    const date = new Date();
    const user = await db.collection('users').updateOne(
        {
            _id: new ObjectId(id),
        },
        { $set: { emailVerified: date } },
    );
    return user.matchedCount ? date : null;
}

async function getUserRoles(userId) {
    const db = await database();
    const roles = await db.collection('user_role').find({ userId }).toArray();

    const roleIds = roles.map((role) => role.roleId);

    const roleNames = await db.collection('roles').find({ _id: { $in: roleIds } }).toArray();

    if (!roleNames.length) return []

    return roleNames.map((role) => role.name);
}


async function setUserRole(userId, name) {
    const db = await database();
    const role = await db.collection('roles').findOne({ name });
    if (!role) {
        return null;
    }
    const { insertedId } = await db.collection('user_role').insertOne({
        userId,
        roleId: role._id,
    });

    return insertedId;
}

module.exports = {
    getUserByEmail,
    getUserByEmailWithPassword,
    getUserByUsername,
    getUser,
    getUserWithPassword,
    updatePassword,
    updatePasswordByEmail,
    registerUser,
    registerManyUsers,
    registerVerifiedProviderUser,
    addSuperAdmin,
    updateUser,
    deleteUser,
    findUser,
    verifyUserEmail,
    getUserRoles,
    setUserRole,
};
