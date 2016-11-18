'use strict';

const responder = require('../common/responder'),
    CONFIG = require('../../config'),
    winston = require('../../winston-logger'),
    cache = require('../../cache');
console.log('IN2');
function respond(response, data) {
    responder.send(response, {
        status: 200,
        data: data
    });
}

function checkStored(response, key) {
    const range = key || 'month',
        stored = cache.get('mentioned-people', range);

    if (stored && stored.mentioned) {
        respond(response, stored);
    } else {
        winston.logger.warn('[api-mentioned-people] No data stored for ' + range + '. Will try again in ' + CONFIG.SETTINGS.POLLER.INTERVAL / 1000 + ' seconds.');
        setTimeout(() => {
            checkStored(response, range);
        }, CONFIG.SETTINGS.POLLER.INTERVAL);
    }
}

class MentionedPeople {

    get(request, response) {
        checkStored(response, request.params.key);
    }

}

module.exports = new MentionedPeople();
