(function () {
    'use strict';

    const CONFIG = require('../../config').get(),
        responder = require('../common/responder'),
        jsonHandler = require('../common/json-handler');

    function check(response) {
        responder.send(response, {
            status: 200,
            data: {
                active: true
            }
        });
    }

    module.exports = {
        check: check
    };

}());
