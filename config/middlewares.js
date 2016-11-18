'use strict';

const bodyParser = require('body-parser'),
    CONFIG = require('./'),
    cors = require('./cors'),
    //authS3O = require('s3o-middleware'),
    winston = require('../winston-logger');

function configure(app) {
    //app.use(authS3O);
    app.use(cors);
    app.use(bodyParser.urlencoded({
        extended: false
    }));
    console.log('PORT', CONFIG.PORT, process.env.PORT);
    app.listen(CONFIG.PORT, function () {
        winston.logger.info('[boot] Running server on port ' + CONFIG.PORT + '...');
    });

}

module.exports = {
    configure: configure
};
