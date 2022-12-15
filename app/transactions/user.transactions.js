const sequelize = require("sequelize");
// const User = require('../models/User');
const { models } = require("../models");
const secureDataHelpers = require("../helpers/securedata.helpers");

async function getAllUsers() {
  const users = await models.users.findAll({
    include: [
      {
        model: models.roles,
        as: "roles",
        // get fields from the roles model
        attributes: ["id", "name", "description"],
        // get fields from the users_roles model
        through: {
          // make users_roles attributes empty to hide the nested model
          // attributes: ['expire_date'],
          attributes: [],
        },
      },
    ],
  });
  return users;
}

async function deleteUserById(userId) {
  try {
    // const destroyed = await User.destroy({
    const destroyed = await models.users.destroy({
      where: {
        id: userId,
      },
    });
    return destroyed > 0;
  } catch (e) {
    console.error("Error deleting user.", e);
    return undefined;
  }
}

async function findUserById(userId) {
  try {
    // const user = await User.findByPk(userId);
    const user = await models.users.findByPk(userId, {
      include: [
        {
          model: models.roles,
          as: "roles",
          attributes: ["id", "name", "description"],
          through: {
            attributes: ["expireDate"], // this will keep the role model from being displayed
          },
        },
      ],
    });
    if (user) {
      const ret = {
        ...user.dataValues,
      };
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
    // const user = await User.findOne({
    const user = await models.users.findOne({
      where: {
        username: {
          [sequelize.Op.eq]: username,
        },
      },
      include: [
        {
          model: models.roles,
          as: "roles",
          attributes: ["id", "name", "description"],
          through: {
            attributes: ["expireDate"], // this will keep the role model from being displayed
          },
        },
      ],
    });
    if (user) {
      const ret = {
        ...user.dataValues,
      };
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
    createResult = await models.users.create(data);
    if (data.roles && data.roles.length > 0) {
      for (let i = 0; i < data.roles.length; i++) {
        // console.log(JSON.stringify(roles[i]));
      }
    }
  } catch (e) {
    console.error(`ERROR in transaction.createUser : ${e}`);
    const emessages = [];
    if (e.errors) {
      for (const element of e.errors) {
        const vei = element;
        emessages.push(vei.message);
      }
    }
    throw `Could not create new user due to ${e.name} : ${emessages}`;
  }
  return secureDataHelpers.maskData(createResult);
}

async function updateUser(id, data) {
  try {
    // captive field set
    const captiveFields = {};
    if (data.firstname) {
      captiveFields["firstname"] = data.firstname;
    }
    if (data.lastname) {
      captiveFields["lastname"] = data.lastname;
    }
    await models.users.update(captiveFields, {
      where: {
        id,
      },
    });
    return await findUserById(id);
  } catch (e) {
    throw `Could not update user due to : ${e.name}`;
  }
}

module.exports = {
  getAllUsers,
  findUserById,
  findUserByUsername,
  deleteUserById,
  createUser,
  updateUser,
};
