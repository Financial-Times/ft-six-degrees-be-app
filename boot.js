(function () {
    'use strict';

    if (require('fs-extra').existsSync('.env.json')) {//eslint-disable-line no-sync
        require('dot-env');
    }

    const express = require('express'),
        handlerFor404 = require('./config/404'),
        middlewares = require('./config/middlewares'),
        Api = require('./api'),
        Poller = require('./poller'),
        app = express();

    middlewares.configure(app);

    app.all('/api/:command', Api.handle);
    app.all('/api/:command/:key', Api.handle);
    //app.get('/__health', Api.healthcheck);

    Poller.init();

    app.use(handlerFor404);

}());
