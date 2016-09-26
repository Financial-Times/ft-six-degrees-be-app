(function () {
    'use strict';

    let CONFIG_INSTANCE;

    const PACKAGE_JSON = require('./package.json'),
        CONFIG = {
            URL: '127.0.0.1',
            PORT: process.env.PORT || 8080,
            SYSTEM_CODE: PACKAGE_JSON.name,
            DESCRIPTION: PACKAGE_JSON.description,
            VER: process.env.APP_VERSION,
            APP_PATH: process.env.APP_PATH,
            EXTENSIONS: {
                '.html': 'text/html',
                '.jsp': 'text/html',
                '.js': 'application/javascript',
                '.json': 'application/json',
                '.css': 'text/css',
                '.txt': 'text/plain',
                '.jpg': 'image/jpeg',
                '.gif': 'image/gif',
                '.png': 'image/png',
                '.ico': 'image/ico',
                '.ttf': 'font/ttf',
                '.eot': 'font/eot',
                '.otf': 'font/otf',
                '.woff': 'font/woff',
                '.map': 'application/octet-stream'
            },
            SETTINGS: {
                LOGGER: {
                    LEVEL: 'api'
                },
                RETRY: {
                    MAX_ATTEMPTS: 20
                }
            }
        },
        cmdArgs = [''];

    process.argv.forEach(function (val, index) {
        if (index > 1 && val) {
            cmdArgs.push(val);
        }
    });

    function get() {
        if (CONFIG_INSTANCE === undefined) {
            CONFIG_INSTANCE = CONFIG;
        }
        return CONFIG_INSTANCE;
    }

    function set(key, value) {
        if (CONFIG_INSTANCE === undefined) {
            CONFIG[key] = value;
        } else {
            CONFIG_INSTANCE[key] = value;
        }
    }

    module.exports = {
        get: get,
        set: set
    };

}());

