'use strict';

const request = require('request'),
    responder = require('../common/responder'),
    CONFIG = require('../../config'),
    EnrichedContent = require('../../parsers/enriched-content'),
    PersonalisedPeopleStorage = require('../../cache/personalised-people-storage'),
    winston = require('../../winston-logger');

function getRecency(key) {
    let recency;
    console.warn('XXXXk', key);
    switch (key) {
    case 'year':
        recency = '365';
        break;
    case 'month':
        recency = '30';
        break;
    case 'week':
        recency = '7';
        break;
    case 'day':
        recency = '1';
        break;
    default:
        recency = '30';
        break;
    }
    return recency;
}

function getHistory(key, uuid, res) {
    request(CONFIG.URL.API.FT_RECOMMENDATIONS_USERS + uuid + '/history?limit=100&recency=' + getRecency(key) + '&apiKey=' + CONFIG.API_KEY.FT_RECOMMENDATIONS, function (error, resp, history) {
        if (resp && resp.statusCode === 200) {
            EnrichedContent.getPeople(res, JSON.parse(history).response, key);
        } else if (!error && resp) {
            responder.rejectNotFound(res);
        } else {
            winston.logger.error('[api-personalised-people] ' + error);
            responder.rejectBadGateway();
        }
    });
}

class PeopleHistory {

    get(req, res) {
        const stored = PersonalisedPeopleStorage.get(req.params.key);
        if (stored) {
            responder.send(res, {
                status: 200,
                data: stored.people
            });
        } else {
            getHistory(req.params.key, req.params.uuid, res);
        }
    }

}

module.exports = new PeopleHistory();
