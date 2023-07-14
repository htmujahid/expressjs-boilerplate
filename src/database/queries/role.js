const { database } = require('../connection');

async function createRoles(roles) {
    const db = await database();
    try {
        const { insertedIds } = await db.collection('roles').insertMany(roles, { ordered: false });
        return insertedIds;
    } catch (error) {
        return error;
    }
}

async function getRoles() {
    const db = await database();
    return await db.collection('roles').find().toArray();
}

async function getRoleByName(name) {
    const db = await database();
    return await db.collection('roles').findOne({ name });
}

async function getRolePermissions(name) {
    const db = await database();

    const permissionNames = await db.collection('roles').aggregate([
        { $match: { name } },
        { $lookup: {
            from: 'role_permission',
            localField: '_id',
            foreignField: 'roleId',
            as: 'rolePermissions'
        }},
        { $unwind: '$rolePermissions' },
        { $lookup: {
            from: 'permissions',
            localField: 'rolePermissions.permissionId',
            foreignField: '_id',
            as: 'permission'
        }},
        { $unwind: '$permission' },
        { $project: { _id: 0, name: '$permission.name' } }
    ]).toArray();

    return permissionNames.map((permission) => permission.name);
}

module.exports = { createRoles, getRoles, getRoleByName, getRolePermissions };
