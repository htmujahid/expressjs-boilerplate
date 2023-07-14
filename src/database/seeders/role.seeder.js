const { Role, Permission } = require('../queries');

const roles = {
    admin: ['create-user', 'read-user', 'update-user', 'delete-user'],
    user: ['read-user', 'update-user'],
    customer: ['read-product'],
    manufacturer: [],
};

async function up() {
    await Role.createRoles(Object.keys(roles).map((name) => ({ name })));

    Object.keys(roles).forEach(async (role) => {
        await Permission.createPermissions(roles[role].map((permission) => ({ name: permission })));
    });

    Object.keys(roles).forEach(async (role) => {
        roles[role].forEach(async (permission) => {
            await Permission.setPermissionToRole(role, permission);
        });
    });
}

module.exports = up;
