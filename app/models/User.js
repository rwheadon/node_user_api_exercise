const Sequelize = require('sequelize');
const db = require('../configs/database');

module.exports = (sequelize) => {
    sequelize.define('users', {
    // db.define('users', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        username: {
            type: Sequelize.STRING,
            unique: true
        },
        firstname: {
            type: Sequelize.STRING
        },
        lastname: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        },
        updatedAt: {
            field: 'updated_at',
            type: Sequelize.DATE
        },
        createdAt: {
            field: 'created_at',
            type: Sequelize.DATE
        }
    });
}


// const User = db.define('users', {
//     id: {
//         type: Sequelize.INTEGER,
//         primaryKey: true
//     },
//     username: {
//         type: Sequelize.STRING,
//         unique: true
//     },
//     firstname: {
//         type: Sequelize.STRING
//     },
//     lastname: {
//         type: Sequelize.STRING
//     },
//     email: {
//         type: Sequelize.STRING
//     },
//     password: {
//         type: Sequelize.STRING
//     },
//     updatedAt: {
//         field: 'updated_at',
//         type: Sequelize.DATE
//     },
//     createdAt: {
//         field: 'created_at',
//         type: Sequelize.DATE
//     }
// });
//
// module.exports = User;