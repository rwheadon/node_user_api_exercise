const Sequelize = require('sequelize');
const db = require('../configs/database');

const Role = db.define('users', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        unique: true
    },
    description: {
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

module.exports = Role;