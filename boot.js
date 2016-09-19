(function () {
    'use strict';

    const express = require('express'),
        bodyParser = require('body-parser'),
        //authS3O = require('s3o-middleware'),
        handlerFor404 = require('./404'),
        config = require('./config'),
        winston = require('./winston-logger'),
        cors = require('./cors'),
        CONFIG = config.get(),
        app = express(),
        server = require('http').createServer(app);

    function initializeApp() {
        app.use(cors);
        //app.use(authS3O);
        app.use(bodyParser.urlencoded({
            extended: false
        }));
        console.warn('aa', CONFIG.APP_PATH);
        app.use('/', express.static(CONFIG.APP_PATH));
    }

    function start() {

        initializeApp();

        server.listen(CONFIG.PORT, function () {
            winston.logger.info('[boot] Running server on port ' + CONFIG.PORT + '...');
        });

        app.get('/api/test', function (request, response) {
            winston.logger.info('[boot] API GET Test request detected, handling.');
            response.json({});
        });

        app.use(handlerFor404);
    }

    module.exports = {
        start: start
    };

}());
