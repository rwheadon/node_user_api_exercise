const Sequelize = require('sequelize');
const db = require('../configs/database');

const UserRole = db.define('users_roles', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    userId: {
        type: Sequelize.STRING,
        field: 'user_id',
        unique: true
    },
    roleId: {
        field: 'role_id',
        type: Sequelize.STRING
    },
    expireDate: {
        field: 'expire_date',
        type: Sequelize.DATE
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

module.exports = UserRole;