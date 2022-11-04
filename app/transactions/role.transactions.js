const sequelize = require('sequelize');
const uuid = require('uuid');
const { models } = require('../models');
const secureDataHelpers = require("../helpers/securedata.helpers");


async function getAllRoles() {
    return models.roles.findAll();
}

async function findRoleByIdWithAssociations(roleId) {
    try {
        return models.roles.findByPk(roleId, {
            include: [
                {
                    model: models.users,
                    as: "users",
                    attributes: ['id', 'username'],
                    through: {
                        attributes: ['expire_date'], // [] here will keep the nested user model from being displayed
                    }
                },
            ],
        });
    } catch (e) {
        console.error("Error finding role by id.", e);
    }
}

async function findRoleByCodenameWithAssociations(codename) {
    try {
        return models.roles.findOne({
            where: {
                codename: {
                    [sequelize.Op.eq]: codename,
                }
            },
            include: [
                {
                    model: models.users,
                    as: "users",
                    attributes: ['id', 'username'],
                    through: {
                        attributes: ['expire_date'], // [] here will keep the nested user model from being displayed
                    }
                },
            ],
        });
    } catch (e) {
        console.error("Error finding role by codename.", e);
    }
}

async function findRoleById(roleId) {
    try {
        return models.roles.findByPk(roleId);
    } catch (e) {
        console.error("Error finding role by id.", e);
    }
}

async function findRoleByCodename(codename) {
    try {
        return models.roles.findOne({
            where: {
                codename: {
                    [sequelize.Op.eq]: codename,
                }
            },
        });
    } catch (e) {
        console.error("Error finding role by codename.", e);
    }
}

async function findRole(data) {
    const {roleId, codename, associations} = data;
    let role;
    if (associations && associations.toUpperCase() === 'TRUE') {
        if (roleId) {
            role = await findRoleByIdWithAssociations(roleId);
        }
        if (!role && codename) {
            role = await findRoleByCodenameWithAssociations(codename);
        }
    } else {
        if (roleId) {
            role = await findRoleById(roleId);
        }
        if (!role && codename) {
            role = await findRoleByCodename(codename);
        }
    }

    if (role) {
        return role;
    } else {
        return undefined;
    }
}

async function findRoleWithAssociations(data) {
    console.log(`DATA : ${JSON.stringify(data)}`);
    const {roleId, codename} = data;
    let role;
    if (roleId) {
        role = await findRoleByIdWithAssociations(roleId);
    }
    if (!role && codename) {
        role = await findRoleByCodenameWithAssociations(codename);
    }

    if (role) {
        return role;
    } else {
        return undefined;
    }
}

async function createRole(data) {
    const {name, codename, description} = data;
    let createResult;
    try {
        createResult = await models.roles.create(data);
    } catch (e) {
        console.error(`ERROR in transaction.createUser : ${e}`);
        const emessages = [];
        if (e.errors) {
            for (const element of e.errors) {
                const vei = element;
                emessages.push(vei.message);
            }
        }
        throw `Could not create new role due to ${e.name} : ${emessages}`;
    }
    return createResult.dataValues;
}

async function updateRole(id, data) {
    const captiveFields = {};
    if (data.name) {captiveFields['name'] = data.name}
    if (data.description) {captiveFields['description'] = data.description}
    try {
        const updated = await models.roles.update(captiveFields, {
            where: {
                id,
            }
        });
        let updatedRole = {};
        if (updated && updated[0] > 0) {
            const roleResult = await models.roles.findOne({
                where: {
                    id,
                }
            });
            if (roleResult) {
                updatedRole = {
                    ...roleResult,
                }
            }
        }
    } catch (e) {
        console.error(`updateRole : Problem updating the role : ${e}`);
    }
    return updatedRole;
}

module.exports = {
    getAllRoles,
    findRole,
    createRole,

}