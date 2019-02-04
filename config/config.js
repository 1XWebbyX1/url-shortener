const dotenv = require('dotenv');
dotenv.config();
const env = process.env.NODE_ENV; // 'dev' or 'test'
console.log(env);
const dev = {
 DBHost: process.env.DEV_DB_URI
};

const test = {
 DBHost: process.env.TEST_DB_URI
};

const config = {
 dev,
 test
};
console.log(config[env]);

module.exports = config[env];
