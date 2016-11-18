// (function () {
//     'use strict';

//     if (require('fs-extra').existsSync('.env.json')) {//eslint-disable-line no-sync
//         require('dot-env');
//     }

//     const express = require('express'),
//         handlerFor404 = require('./config/404'),
//         middlewares = require('./config/middlewares'),
//         Api = require('./api'),
//         Poller = require('./poller'),
//         app = express();

//     middlewares.configure(app);

//     app.all('/api/:command', Api.handle);
//     app.all('/api/:command/:key', Api.handle);
//     //app.get('/__health', Api.healthcheck);

//     Poller.init();

//     app.use(handlerFor404);

// }());

(function () {
    'use strict';

    const express = require('express'),
        bodyParser = require('body-parser'),
        fs = require('fs-extra'),
        //authS3O = require('s3o-middleware'),
        handlerFor404 = require('./middlewares/404'),
        cors = require('./middlewares/cors'),
        CONFIG = require('./config'),
        winston = require('./winston-logger'),
        Api = require('./api'),
        app = express(),
        server = require('http').createServer(app);

    function initializeApp() {
        app.use(cors);
        //app.use(authS3O);
        app.use(bodyParser.urlencoded({
            extended: false
        }));
    }

    (function start() {

        if (fs.existsSync('.env.json')) {//eslint-disable-line no-sync
            require('dot-env');
        }

        initializeApp();

        server.listen(CONFIG.PORT, function () {
            winston.logger.info('[boot] Running server on port ' + CONFIG.PORT + '...');
        });

        app.all('/api/:command', Api.handle);
        app.all('/api/:command/:key', Api.handle);
        app.get('/__health', Api.healthcheck);

        app.use(handlerFor404);
    } ());

}());

