const { getAllUsers, findUser, createUser, updateUser, deleteUser } = require('./user.controller');
const { getAllRoles, findRole, createRole } = require('./role.controller');

module.exports = {
    getAllUsers,
    findUser,
    createUser,
    updateUser,
    deleteUser,
    getAllRoles,
    findRole,
    createRole,
}
