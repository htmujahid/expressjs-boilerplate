const allRoles = {
  user: [],
  admin: ['getUsers', 'manageUsers'],
};

const roles = Object.keys(allRoles);
// eslint-disable-next-line no-undef
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
