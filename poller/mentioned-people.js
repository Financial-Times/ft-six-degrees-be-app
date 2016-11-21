'use strict';

const request = require('request'),
    CONFIG = require('../config'),
    cache = require('../cache'),
    winston = require('../winston-logger'),
    datesHandler = require('../utils/dates-handler');

function addDateRange(key) {
    const range = datesHandler.getRange(key);
    return '?fromDate=' + range[0] + '&toDate=' + range[1];
}

function store(data, key) {
    cache.store('mentioned-people', data, key);
}

function fetch(url) {
    return new Promise(function (resolve, reject) {
        request(url, {
            headers: {
                'Authorization': 'Basic ' + CONFIG.API_KEY.SIX_DEGREES
            }
        }, function (err, response) {
            if (err) {
                reject(err);
            } else {
                resolve(response.body);
            }
        });
    });
}

class MentionedPeoplePoller {

    get() {

        const keys = ['month', 'week', 'day', 'year'];
        let key;

        if (!this.counter || this.counter >= 4) {
            this.counter = 1;
        } else {
            this.counter += 1;
        }

        key = keys[this.counter - 1];//eslint-disable-line prefer-const

        fetch(CONFIG.URL.API.SIX_DEGREES_MENTIONED + addDateRange(key))
            .then(response => {
                store(response, key);
            })
            .catch(err => {
                this.counter -= 1; //if error, make poller to send request for the same dates again in the next iteration
                winston.logger.error('[poller-mentioned-people] Response error:\n' + err);
            });
    }

    start() {
        setInterval(this.get, CONFIG.SETTINGS.POLLER.INTERVAL);
    }

}

module.exports = new MentionedPeoplePoller();
