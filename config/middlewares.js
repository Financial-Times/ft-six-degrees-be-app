'use strict';

const bodyParser = require('body-parser'),
    cors = require('./cors');
    //authS3O = require('s3o-middleware');

function configure(app) {
    //app.use(authS3O);
    app.use(cors);
    app.use(bodyParser.urlencoded({
        extended: false
    }));
}

module.exports = {
    configure: configure
};
