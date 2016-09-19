(function () {
    'use strict';

    let CONFIG_INSTANCE;

    const CONFIG = {
            URL: '127.0.0.1',
            PORT: process.env.PORT || 8080,
            APP: 'FT Six Degrees BE Proxy App',
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

