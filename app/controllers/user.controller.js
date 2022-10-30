const db = require('../configs/database');
const User = require('../models/User');
const authHelpers = require('../helpers/auth.helpers');

async function getAllUsers(req, res) {
    // at this time we only want users with an admin role to be able to access ALL users
    try {
        const users = await User.findAll();
        console.log(await users.length);
        res.status(201);
        res.json(users);
    } catch (e) {
        res.json({"error":e.code, "detail": e});
    }
}

async function findUserByUsername(req, res) {
    res.json({"message": "findUserByUsername under construction"});
}

async function findUserById(req, res) {
    res.json({"message": "findUserById under construction"});
}

async function findUser(req, res) {
    console.log(`req.params : ${JSON.stringify(req.params)}`);
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            const ret = {
                ...user.dataValues
            }
            ret.password = '*************';
            res.json(ret);
        } else {
            res.status(404);
            res.json({"message": "The user could not be found or you don't have authorization to view."});
        }
    } catch (e) {
        res.status(500);
        res.json({"message": "Something broke on our side, it's probably not your fault"});
    }
}

async function createUser(req, res) {
    res.json({"message": "createUser under construction"});
}

async function deleteUser(req, res) {
    res.json({"message": "deleteUser under construction"});
}

async function updateUser(req, res) {
    res.json({"message": "updateUser under construction"});
}

module.exports = {
    findUser,
    createUser,
    updateUser,
    deleteUser,
    getAllUsers,
}
