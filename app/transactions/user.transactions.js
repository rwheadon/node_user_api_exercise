const sequelize = require('sequelize');
const User = require('../models/User');
const secureDataHelpers = require('../helpers/securedata.helpers');

async function deleteUserById(userId) {
    try {
        const destroyed = await User.destroy({
            where: {
                id: userId,
            }
        });
        return destroyed>0;
        // const user = await User.findByPk(userId);
        // return !user;
    } catch (e) {
        console.error("Error deleting user.", e);
        return undefined;
    }
}

async function findUserById(userId) {
    try {
        const user = await User.findByPk(userId);
        if (user) {
            const ret = {
                ...user.dataValues
            }
            return await secureDataHelpers.maskData(ret);
        } else {
            return undefined;
        }
    } catch (e) {
        console.error("Error finding user by id.", e);
    }
}

async function findUserByUsername(username) {
    try {
        const user = await User.findOne({
            where: {
                username: {
                    [sequelize.Op.eq]: username,
                }
            }
        });
        if (user) {
            const ret = {
                ...user.dataValues
            }
            return await secureDataHelpers.maskData(ret);
        } else {
            return undefined;
        }
    } catch (e) {
        console.error("Error finding user by id.", e);
    }
}

async function createUser(data) {
    let createResult;
    try {
        createResult = await User.create(data);
    } catch (e) {
        const emessages = [];
        if (e.errors) {
            for (let i=0; i<e.errors.length; i++) {
                const vei = e.errors[i];
                emessages.push(vei.message);
            }
        }
        throw `Could not create new user due to ${e.name} : ${emessages}`;
    }
    return secureDataHelpers.maskData(createResult);
}

module.exports = {
    findUserById,
    findUserByUsername,
    deleteUserById,
    createUser,
}