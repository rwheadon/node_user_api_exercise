const { getAllUsers, findUser, createUser, updateUser, deleteUser } = require('./user.controller');
const { fetchSomething } = require('./additional');

module.exports = {
    getAllUsers,
    findUser,
    createUser,
    updateUser,
    deleteUser,
    fetchSomething,
}
