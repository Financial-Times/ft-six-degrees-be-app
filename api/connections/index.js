'use strict';

const request = require('request'),
    moment = require('moment'),
    responder = require('../common/responder'),
    connectionsStorage = require('../../cache/connections.storage'),
    jsonHandler = require('../../utils/json-handler'),
    datesHandler = require('../../utils/dates-handler'),
    CONFIG = require('../../config');

function respond(response, data) {
    responder.send(response, {
        status: 200,
        data: data
    });
}

function fetch(key, uuid) {
    const datesRange = datesHandler.getRange(key),
        fromDate = datesRange[0],
        toDate = datesRange[1];

    return new Promise(function (resolve, reject) {
        request(CONFIG.URL.API.SIX_DEGREES_HOST + 'connectedPeople?minimumConnections=2&fromDate=' + fromDate + '&toDate=' + toDate + '&limit=50&contentLimit=20&uuid=' + uuid, {
            headers: {
                'Authorization': 'Basic ' + CONFIG.API_KEY.SIX_DEGREES
            }
        }, function (error, response, body) {
            if (error) {
                reject(error);
            } else {
                resolve(body);
            }
        });
    });
}

class Connections {

    get(req, res) {

        const key = req.params.key,
            uuid = req.params.uuid,
            today = moment().format('YYYY-MM-DD'),
            cached = connectionsStorage.get(today, uuid, key);

        if (cached) {
            respond(res, jsonHandler.parse(cached));
        } else {
            fetch(key, uuid).then(body => {
                connectionsStorage.cache(today, uuid, key, body);
                respond(res, jsonHandler.parse(connectionsStorage.get(today, uuid, key)));
            }).catch(error => {
                respond(res, error);
            });
        }

    }

}

module.exports = new Connections();
