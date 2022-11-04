const env = process.env.NODE_ENV || 'development'; // 'development' or 'test'
const development = {
    app: {
        port: parseInt(process.env.DEV_APP_PORT) || 3082
    },
    db: {
        host: process.env.DEV_DB_HOST || 'localhost',
        password: process.env.DEV_DB_PW,
        name: process.env.DEV_DB_NAME || 'gcitpoc'
    },
    updatableUserFields: [
        {'name': 'firstname', 'minLen': 1, 'maxLen': 255, 'type': 'string'},
        {'name': 'lastname', 'minLen': 1, 'maxLen': 255, 'type': 'string'},
    ],
    updatableRoleFields: [
        {'name': 'name', 'minLen': 1, 'maxLen': 64, 'type': 'string'},
        {'name': 'description', 'minLen': 1, 'maxLen': 255, 'type': 'string'},
    ],


};
const test = {
    app: {
        port: parseInt(process.env.TEST_APP_PORT) || 3085
    },
    db: {
        host: process.env.TEST_DB_HOST || 'localhost',
        password: process.env.TEST_DB_PW,
        name: process.env.TEST_DB_NAME || 'gcitpoc_test'
    }
};

const config = {
    development,
    test
};

module.exports = config[env];