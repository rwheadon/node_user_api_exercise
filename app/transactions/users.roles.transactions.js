const sequelize = require('sequelize');
const { models } = require('../models');


async function associateUserToRole(userObject, roleObject, expireDate) {
    let associatedRole;
    if (roleObject && roleObject.id) {
        associatedRole = await associateUserToRoleByIds(userObject.id, roleObject.id, expireDate);
    } else if (roleObject && roleObject.codename) {
        // we need to get the role by codename
        const storedRole = models.roles.findOne({
            where: {
                "codename": roleObject.codename,
            }
        });
        if (storedRole && storedRole.id) {
            associatedRole = await associateUserToRoleByIds(userObject.id, storedRole.id, expireDate);
        }
    }
    return associatedRole;
}

async function associateUserToRoleByIds(usersId, rolesId, expireDate) {
    try {
        const existingUserRoles = await models.users_roles.findAll({
            where: {
                "userId": usersId,
            }
        });
        let existingRoleIds = [];
        if (existingUserRoles && existingUserRoles.length > 0) {
            for (let i = 0; i < existingUserRoles; i++) {
                existingRoleIds.push(existingUserRoles[i].roleId);
            }
        }
        if (existingRoleIds.indexOf(rolesId) < 0) {
            // we can build the association
            const createdRole = await models.users_roles.create({"userId": usersId, "roleId": rolesId, expireDate});
            console.log(`CREATED ASSOCIATION FOR ROLE : ${JSON.stringify(createdRole)}`);
            return createdRole;
        } else {
            // role is already linked
            return `roleId ${rolesId} is already linked to the user.`;
        }
    } catch (e) {
        console.log(`Problem associating role ${e}`);
        throw `Problem associating the user with a specified roleId. : ${rolesId}`;
    }
}

async function findUserRoleJoinRecord(userId, roleId) {
    try {
        const record = await models.users_roles.findOne({
            where: {
                userId,
                roleId,
            }
        });
        return record;
    } catch (e) {
        console.error(`Error : findUserRoleJoinRecord : Problem getting the users_roles record. ${e}`);
    }
}

async function updateUserRoleJoinRecord(data) {
    console.log(`************* updateUserRoleJoinRecord. ${JSON.stringify(data)}`);
    // const {userId, roleId, expireDate} = data;
    try {
        // const updatedRecord = await models.users_roles.update({
        // let matchingJoinRecord;
        const updatedRecord = await models.users_roles.update(
            {'expireDate': `${new Date(data.expireDate)}`},
            {
            where: {
                'userId': data.userId,
                'roleId': data.roleId,
            }}
        );
        // if (updatedRecord && updatedRecord.length && updatedRecord[0] > 0) {
        //     matchingJoinRecord = await models.users_roles.findOne({
        //         where: {
        //             'userId': data.userId,
        //             'roleId': data.roleId,
        //         }
        //     });
        //     if (matchingJoinRecord) {
        //         return matchingJoinRecord;
        //     }
        // }
        console.log(`********* updateUserRoleJoinRecord : updatedRecord : ${JSON.stringify(updatedRecord[0])}`);
        return updatedRecord[0];
    } catch (e) {
        console.error(`Error : updateUserRoleJoinRecord : Problem updating record. ${e}`);
        throw e;
    }
}

async function removeUserRoleAssociation(userId, roleId) {
    const rolesRemoved = models.users_roles.destroy({
        where: {
            userId,
            roleId
        }
    });
    console.log(`rolesRemoved : ${rolesRemoved}`);
    return rolesRemoved;
}

module.exports = {
    associateUserToRoleByIds,
    associateUserToRole,
    removeUserRoleAssociation,
    findUserRoleJoinRecord,
    updateUserRoleJoinRecord,
}