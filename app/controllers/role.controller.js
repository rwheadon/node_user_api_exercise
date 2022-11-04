const config = require('../configs/config');
const { models } = require('../models');
const helpers = require('../helpers/helpers');
const roleTransactionLogic = require('../transactions/role.transactions');
const uuid = require("uuid");
const {secureHashString} = require("../helpers/encryption.helpers");
const userTransactionLogic = require("../transactions/user.transactions");
const {maskData} = require("../helpers/securedata.helpers");

async function getAllRoles(req, res) {
    try {
        const roles = await roleTransactionLogic.getAllRoles();
        res.status(201);
        res.json(roles);
    } catch (e) {
        console.error(e);
        res.json({"error":e.code, "detail": e});
    }
}

async function findRole(req, res) {
    try {
        let role;
        const {id: roleId, codename, associations} = req.query;
        role = await roleTransactionLogic.findRole({roleId, codename, associations});
        if (role) {
            res.json(role);
            return;
        }
        if (roleId || codename) {
            res.status(404);
            res.json({"message": "The role could not be found.", "logtime": new Date()});
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

async function createRole(req, res) {
    console.log("createRole controller... ");
//all of the following fields is necessary to proceed
    const requiredFields = [
        {'name': 'name', 'minLen': 2, 'maxLen': 64, 'type': 'string'},
        {'name': 'description', 'minLen': 2, 'maxLen': 64, 'type': 'string'},
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
    const {name, description, codename} = req.body;
    const data = {
        "name": name,
        "codename": codename || uuid.v4(),
        "description": description,
    };
    if (data.name && data.codename && data.description) {
        try {
            const newRole = await roleTransactionLogic.createRole(data);
            res.json(newRole);
            // return;
        } catch (e) {
            console.error(`Error in createRole : ${e}`);
            res.json({"error": e});
            // return;
        }
    } else {
        return {
            "required": "[name, description]",
            "included": {
                name,
                description,
            }
        };
    }

}

async function updateRole(req, res) {
    const {roleId, name, codename, description} = req.body;
    if (!id) {
        res.status(400);
        res.json({"message": "id is required"});
        return;
    }

    //one of the following fields is necessary to proceed
    const updatableFields = config.updatableRoleFields;
    const verifiedUpdatableData = helpers.verifyRequiredFieldData(updatableFields, {'payload': req.body});
    if (verifiedUpdatableData.missingOrInvalidFields && verifiedUpdatableData.missingOrInvalidFields.length > 1) {
        res.status(400);
        res.json({
            "message": "Request contains no updatable fields. At least one of the updatable fields must be in request",
            "missingUdatableFields": verifiedUpdatableData.missingOrInvalidFields
        });
        return;
    }
    const storedRole = await roleTransactionLogic.findRole({roleId, codename});
}

async function deleteRole(req, res) {

}

module.exports = {
    getAllRoles,
    findRole,
    createRole,
    updateRole,
    deleteRole,
}