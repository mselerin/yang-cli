const APP_VERSION = require("./package.json").version;
const BUILD_DATE = new Date();

const defaultConfig = {
    version: `${APP_VERSION}`,
    buildDate: `${BUILD_DATE.toISOString()}`,
    production: true,
    apiUrl: '/api/',
    proxy: {}
};

module.exports = {
    dev: Object.assign({}, defaultConfig, {
        production: false,
        apiUrl: 'http://localhost:8080/api/'
    }),

    test: Object.assign({}, defaultConfig, {}),

    prod: Object.assign({}, defaultConfig, {}),
};
