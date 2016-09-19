(function () {
    'use strict';

    const express = require('express'),
        bodyParser = require('body-parser'),
        fs = require('fs-extra'),
        //authS3O = require('s3o-middleware'),
        handlerFor404 = require('./404'),
        config = require('./config'),
        winston = require('./winston-logger'),
        cors = require('./cors'),
        API = require('./api'),
        CONFIG = config.get(),
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
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // Avoids DEPTH_ZERO_SELF_SIGNED_CERT error for self-signed certs
        if (fs.existsSync('.env.json')) {//eslint-disable-line no-sync
            require('dot-env');
        }

        initializeApp();

        server.listen(CONFIG.PORT, function () {
            winston.logger.info('[boot] Running server on port ' + CONFIG.PORT + '...');
        });

        app.get('/api/*', function (request, response) {
            API.handleGet(request, response);
        });

        app.post('/api/*', function (request, response) {
            API.handlePost(request, response);
        });

        app.use(handlerFor404);
    } ());

}());
