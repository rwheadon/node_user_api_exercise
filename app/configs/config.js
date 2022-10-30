const env = process.env.NODE_ENV; // 'development' or 'test'

const development = {
    app: {
        port: parseInt(process.env.DEV_APP_PORT) || 3082
    },
    db: {
        host: process.env.DEV_DB_HOST || 'localhost',
        password: process.env.DEV_DB_PW,
        name: process.env.DEV_DB_NAME || 'gcitpoc'
    }
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
    dev,
    test
};

module.exports = config[env];