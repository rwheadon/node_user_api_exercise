const { Sequelize } = require('sequelize');

const dbname = 'gcitpoc';
const username = 'gcitpoc';
const password = 'gcitpoc';

// Passing parameters separately
module.exports = new Sequelize(dbname, username, password, {
    host: 'localhost',
    /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */
    dialect: 'mysql'
});