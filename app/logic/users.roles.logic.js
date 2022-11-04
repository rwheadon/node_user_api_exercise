const roleTransactionLogic = require('../transactions/role.transactions');
const usersRolesTransactionLogic = require('../transactions/users.roles.transactions');

/*
*   this method will associate the user with an existing role
*   the role we seek after should be defined in the roles node of
*   the user.
*
*   Usable fields:
*       id
*       codename
*
*   {
*   ...
*       "roles": [
*           {"id": 1},
*           {"codename": "5f26709b-1775-4957-ad30-d8ad57985934", "expireDate": "2022-11-03 16:07:18"}
*       ],
*   ...
*   }
*
* returns:
*   JSON object of the associated roles.
* */
async function buildUserRoleAssociations(userObject, rolesObjectArray) {
    const associatedRoles = [];
    if (rolesObjectArray && rolesObjectArray.length > 0) {
        for (let i=0; i<rolesObjectArray.length; i++) {
            const roleInfo = rolesObjectArray[i];
            let role;
            const data = {
                "roleId": roleInfo.id,
                "codename": roleInfo.codename,
                "expireDate": roleInfo.expireDate,
            }

            try {
                const associatedRole = await usersRolesTransactionLogic.associateUserToRole(
                    userObject,
                    roleInfo,
                    roleInfo.expireDate
                );

                if (associatedRole) {
                    // get the real role
                    const storedRole = await roleTransactionLogic.findRole({
                        roleId: associatedRole.roleId,
                    })
                    associatedRoles.push(storedRole);
                }
            } catch (e) {
                console.error(`Could not associate the user with roleId ${roleInfo.id}. (NOT_FATAL)`);
            }
        }
    }
    return associatedRoles;
}

/*
* This function takes in the roles to:
*   update associations : {"id": 1, expireDate: "2022-11-03 15:50:00"}
*   remove associations : {"id": 1, "deleteAssociation": true}
*   add associations : {"id": 1, "expireDate": "2022-12-24 11:59:44"}
 */
async function updateUserRoleAssociation(userObject, roleObject) {
    // const thisRole = rolesObject[i];
    const responseData = {
        // "deleted": 0,
        // "updated": {},
        // "created": {},
    };

    try {
        if (!roleObject.id && roleObject.codename) {
            // fetch the role so we can inject the id
            const storedRole = await roleTransactionLogic.findRole({
                codename: roleObject.codename,
            });
            if (storedRole && storedRole.id) {
                roleObject['id'] = storedRole.id;
            }
        }
    } catch (e) {
        console.log("Error : updateUserRoleAssociation : Problem fetching role by codename");
    }

    console.log(`thisRole : ${JSON.stringify(roleObject)}`);

    try {
        if (roleObject.deleteAssociation && roleObject.deleteAssociation === true) {
            const numDeleted = await usersRolesTransactionLogic.removeUserRoleAssociation(userObject.id, roleObject.id);
            // rolesDeleted += numDeleted;
            responseData['deleted'] = numDeleted;
            console.log(`updateUserRoleAssociation responseData : ${JSON.stringify(responseData)}`);
            return responseData;
        }
    } catch (e) {
        console.error(e);

    }
    // add or update
    let existingAssociation;
    try {
        existingAssociation = await usersRolesTransactionLogic
            .findUserRoleJoinRecord(userObject.id, roleObject.id);
    } catch (e) {
        console.warn("Warning : updateUserRoleAssociation : No existing association");
    }
    // if we found an existing association then we proceed as doing an update
    if (existingAssociation && roleObject.expireDate) {
        const associationData = {
            "userId": existingAssociation.userId,
            "roleId": existingAssociation.roleId,
            "expireDate": roleObject.expireDate,
        };
        try {
            const updatedJoinRecord = await usersRolesTransactionLogic
                .updateUserRoleJoinRecord(associationData);
            responseData['updated'] = updatedJoinRecord;
            console.log(`updateUserRoleAssociation responseData : ${JSON.stringify(responseData)}`);
            return responseData;
        } catch (e) {
            console.log(
                `Error : updateUserRoleAssociations : Problem updating association ${
                    associationData}. moving on.`
            );
        }
    } if (!existingAssociation) {
        // proceed as adding a new association
        try {
            const createdAssociation = await usersRolesTransactionLogic.associateUserToRole(
                userObject,
                roleObject,
                roleObject.expireDate
            );
            // responseData['created'] = createdAssociation;
            responseData['created'] = createdAssociation ? 1 : 0;
            console.log(`updateUserRoleAssociation responseData : ${JSON.stringify(responseData)}`);
            return responseData;
        } catch (e) {
            console.error(`Error : updateUserRoleAssociation : Unable to add new association ${e}`);
        }
    }
    console.log(`updateUserRoleAssociation responseData : ${JSON.stringify(responseData)}`);
    return responseData;
}

async function updateUserRoleAssociations(userObject, rolesObject) {
    const resultObject = {};
    if (rolesObject.constructor === Array && rolesObject.length > 0) {
        let rolesDeleted = 0;
        let updatedRecords = 0;
        let newRecords = 0;
        for (let i=0; i < rolesObject.length; i++) {
            try {
                const responseData = await updateUserRoleAssociation(userObject, rolesObject[i]);
                console.log(`******** updateUserRoleAssociation responseData : ${JSON.stringify(responseData)}`);
                if (responseData && Object.keys(responseData).length) {
                    if (responseData.deleted && responseData.deleted > 0) {
                        rolesDeleted += responseData.deleted;
                    }
                    if (responseData.updated && responseData.updated > 0) {
                        // updatedRecords.push(responseData.updated);
                        updatedRecords += responseData.updated;
                    }
                    if (responseData.created) {
                        // newRecords.push(responseData.created);
                        newRecords += responseData.created;
                    }
                }
            } catch (e) {
                console.error(`Error : updateUserRoleAssociations : ${e}`);
            }
        }
        resultObject['deleted'] = rolesDeleted;
        resultObject['updated'] = updatedRecords;
        resultObject['created'] = newRecords;
    }
    return resultObject;
}

module.exports = {
    buildUserRoleAssociations,
    updateUserRoleAssociations,
}