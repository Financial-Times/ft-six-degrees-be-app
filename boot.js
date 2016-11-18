(function () {
    'use strict';

    if (require('fs-extra').existsSync('.env.json')) {//eslint-disable-line no-sync
        require('dot-env');
    }

    const express = require('express'),
        CONFIG = require('./config'),
        //handlerFor404 = require('./config/404'),
        winston = require('./winston-logger'),
        app = express();

    app.listen(CONFIG.PORT, function () {
        winston.logger.info('[boot] Running server on port ' + CONFIG.PORT + '...');
    });

    require('./config/middlewares').configure(app);

    const Api = require('./api'),//eslint-disable-line one-var
        Poller = require('./poller');


    //app.all('/api/:command', Api.handle);
    //app.all('/api/:command/:key', Api.handle);
    //app.get('/__health', Api.healthcheck);

    //Poller.init();

    //app.use(handlerFor404);

}());
