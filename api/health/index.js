'use strict';

const CONFIG = require('../../config').get(),
    responder = require('../common/responder'),
    moment = require('moment');

module.exports = new class Health {
    check(request, response, timestamp) {
        responder.send(response, {
            status: 200,
            data: {
                name: CONFIG.APP,
                active: true,
                time: timestamp || moment().format()
            }
        });
    }
};
