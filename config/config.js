
const env = process.env.NODE_ENV; // 'dev' or 'test'
console.log(env);
const dev = {
 DBHost: 'mongodb://user:password11@ds161764.mlab.com:61764/url_shortner_database'
};

const test = {
 DBHost: 'mongodb://user:password11@ds221155.mlab.com:21155/test_database'
};

const config = {
 dev,
 test
};
console.log(config[env]);

module.exports = config[env];
