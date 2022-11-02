const User = require('../models/User');
const userTransactionLogic = require('../transactions/user.transactions');
const {maskData} = require('../helpers/securedata.helpers');
const {secureHashString} = require('../helpers/encryption.helpers');
const helpers = require('../helpers/helpers');
const {findUserById} = require("../transactions/user.transactions");
const {isUserAdmin} = require("../helpers/auth.helpers");

async function getAllUsers(req, res) {
    // todo: we only want users with an admin role to be able to access ALL users
    // req.user (jwttoken will contain this data when it is finished?)
    const tempUser = {
        
    };
    if (!isUserAdmin())
    try {
        const users = await User.findAll();
        console.log(users.length);
        res.status(201);
        res.json(users);
    } catch (e) {
        res.json({"error":e.code, "detail": e});
    }
}

async function findUser(req, res) {
    try {
        let user;
        if (req.query.id) {
            user = await userTransactionLogic.findUserById(req.query.id);
            if (user) {
                res.json(user);
                return;
            }
        }

        if (!user && req.query.username) {
            const user = await userTransactionLogic.findUserByUsername(req.query.username);
            if (user) {
                res.json(user);
                return;
            }
        }
        if (req.query.id || req.query.username) {
            res.status(404);
            res.json({"message": "The user could not be found or you don't have authorization to view.", "logtime": new Date()});
        } else {
            res.status(400);
            res.json({"message": "Required parameter is missing."});
        }
    } catch (e) {
        console.error("Error processing ", e);
        res.status(500);
        res.json({"message": "Something broke on our side, it's probably not your fault", "logtime": new Date()});
    }
}

async function createUser(req, res) {
    //all of the following fields is necessary to proceed
    const requiredFields = [
        {'name': 'firstname', 'minLen': 2, 'maxLen': 64, 'type': 'string'},
        {'name': 'lastname', 'minLen': 2, 'maxLen': 64, 'type': 'string'},
        {'name': 'password', 'minLen': 8, 'maxLen': 255, 'type': 'string'},
        {'name': 'username', 'minLen': 8, 'maxLen': 100, 'type': 'string'},
        {'name': 'email', 'minLen': 5, 'maxLen': 254, 'type': 'string'},
    ];
    const verifiedData = helpers.verifyRequiredFieldData(requiredFields, {'payload': req.body});
    if (verifiedData.missingOrInvalidFields && verifiedData.missingOrInvalidFields.length > 0) {
        res.status(400);
        res.json({
            "message": "Some data is invalid or missing",
            "missingOrInvalidFields": verifiedData.missingOrInvalidFields
        });
        return;
    }
    const data = {
        "firstname": req.body.firstname,
        "lastname": req.body.lastname,
        "password": req.body.password,
        "username": req.body.username,
        "email": req.body.email,
    };
    if (data.firstname && data.lastname && data.username && data.password && data.email) {
        try {
            //hash the password
            try {
                const hashedPassword = await secureHashString(data.password);
                if (hashedPassword === 'PASSWORD_NOT_HASHED') {
                    throw "Password could not be safely stored";
                }
                data.password = hashedPassword;
            } catch (err) {
                console.error(`Error hashing the password for db storage (${password})`, err);
                throw err;
            }

            const newUser = await userTransactionLogic.createUser(data);
            res.json(newUser);
            return;
        } catch (e) {
            console.error('Error in createUser : ', e);
            res.json({"error": e});
            return;
        }
    } else {
        const selects = {
            "required": "[firstname, lastname, username, password]",
            "included": {
                firstname,
                lastname,
                username,
                password
            }
        };
        vdata = await maskData(selects);
        res.json({
            "message": "Missing required data",
            ...vdata
        })
        return;
    }
}

async function updateUser(req, res) {
    const {firstname, lastname, id} = req.body;
    if (!id) {
        res.status(400);
        res.json({"message": "id is required"});
        return;
    }
    //one of the following fields is necessary to proceed
    const updatableFields = [
        {'name': 'firstname', 'minLen': 2, 'maxLen': 255, 'type': 'string'},
        {'name': 'lastname', 'minLen': 2, 'maxLen': 255, 'type': 'string'},
    ];
    const verifiedUpdatableData = helpers.verifyRequiredFieldData(updatableFields, {'payload': req.body});
    if (verifiedUpdatableData.missingOrInvalidFields && verifiedUpdatableData.missingOrInvalidFields.length > 1) {
        res.status(400);
        res.json({
            "message": "Request contains no updatable fields. At least one of the updatable fields must be in request",
            "missingUdatableFields": verifiedUpdatableData.missingOrInvalidFields
        });
        return;
    }

    try {
        let user = await findUserById(id);
        if (user) {
            await User.update({
                lastname,
                firstname,
            }, {
                where: {
                    id,
                }
            });
        }
        user = await findUserById(id);
        res.json(user);
    } catch (e) {
        console.error("Problem updating the user")
    }
}

async function deleteUser(req, res) {
    if(req.params.id) {
        try {
            const deleted = await userTransactionLogic.deleteUserById(req.params.id);
            if (deleted) {
                res.json({"message": "USER DELETED"});
                // return;
            } else {
                res.status(400);
                res.json({"message": "The user was not deleted. Does the user exist?", "logtime": new Date()});
                // return;
            }
        } catch (e) {
            console.error("Error deleting user.", e);
            res.status(500);
            res.json({"message": "We have encountered an error trying to delete the user", "logtime": new Date()});
        }
    }

}

module.exports = {
    findUser,
    createUser,
    updateUser,
    deleteUser,
    getAllUsers,
}
