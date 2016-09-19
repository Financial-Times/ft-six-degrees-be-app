(function () {
    'use strict';

    const CONFIG = require('../../config').get(),
        responder = require('../common/responder'),
        moment = require('moment');

    function check(response) {
        responder.send(response, {
            status: 200,
            data: {
                name: CONFIG.APP,
                active: true,
                time: moment()
            }
        });
    }

    module.exports = {
        check: check
    };

}());
