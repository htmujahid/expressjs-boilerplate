const { database } = require('../connection');

async function createPermissions(permissions) {
    const db = await database();
    try {
        const { insertedIds } = await db.collection('permissions').insertMany(permissions, { ordered: false });
        return insertedIds;
    } catch (error) {
        return null;
    }
}

async function getPermissions() {
    const db = await database();
    return await db.collection('permissions').find().toArray();
}

async function setPermissionToRole(role, permission) {
    const db = await database();
    const {_id: roleId} = await db.collection('roles').findOne({ name: role });
    const {_id: permissionId} = await db.collection('permissions').findOne({ name: permission });
    if (!roleId || !permissionId) return null;
    const { insertedId } = await db.collection('role_permission').insertOne({ roleId, permissionId });
    return insertedId;
}

module.exports = { createPermissions, getPermissions, setPermissionToRole };
