const Sequelize = require('sequelize');
// const db = require('../configs/database');

module.exports = (sequelize) => {
    sequelize.define('roles', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING,
            unique: true
        },
        codename: {
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
}