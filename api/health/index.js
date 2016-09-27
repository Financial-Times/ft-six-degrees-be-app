'use strict';

const CONFIG = require('../../config').get(),
    MODULE_CONFIG = {
        CHECKS_TIMEOUT: 30000,
        CHECKS_IN_PROGRESS: false
    },
    HEALTH_HEADERS = [{
        key: 'Cache-control',
        value: 'no-store'
    }, {
        key: 'Content-Type',
        value: 'application/json'
    }],
    HEALTH_DATA = {
        'schemaVersion': 1,
        'systemCode': CONFIG.SYSTEM_CODE,
        'name': CONFIG.SYSTEM_CODE,
        'description': CONFIG.DESCRIPTION
    },
    request = require('request'),
    moment = require('moment'),
    winston = require('../../winston-logger'),
    readFiles = require('../../utils/read-files');

let configs = {},
    results = {};

function getCheckSummary(id, result, output) {
    const summary = configs[id].summary;
    return {
        'id': id,
        'name': summary.name,
        'ok': result,
        'severity': summary.severity,
        'businessImpact': summary.businessImpact,
        'technicalSummary': summary.technicalSummary,
        'panicGuide': summary.panicGuide,
        'checkOutput': output || 'none',
        'lastUpdated': moment()
    };
}

function test(filename) {
    request(configs[filename].url, function (error) {
        if (!error) {
            winston.logger.info('[health] ' + 'Health check for \'' + filename + '\' successful.');
            results[filename] = getCheckSummary(filename, true);
        } else {
            winston.logger.warn('[health] Problem with \'' + filename + '\'...\n' + error);
            results[filename] = getCheckSummary(filename, true, error);
        }
    });
}

function getChecks() {
    let filename, checks = [];

    for (filename in results) {
        if (results.hasOwnProperty(filename)) {
            checks.push(results[filename]);
        }
    }

    if (!checks.length) {
        checks = 'Health checks not yet performed, just deployed. Try again in 30 seconds...';
    }

    return checks;
}

(function init() {

    readFiles(__dirname + '/checks/', (filename) => {
        configs[filename.replace('.js', '')] = require('./checks/' + filename);
    }, (error) => {
        winston.logger.error('[api-health] Error on attempt to read healthcheck configs from check folder! ' + error);
    });

    if (!MODULE_CONFIG.CHECKS_IN_PROGRESS && process.env.TEST !== true) {
        MODULE_CONFIG.CHECKS_IN_PROGRESS = true;
        setInterval(function () {
            let filename;

            for (filename in configs) {
                if (configs.hasOwnProperty(filename)) {
                    test(filename);
                }
            }
        }, MODULE_CONFIG.CHECKS_TIMEOUT);
    }

}());

module.exports = new class Health {

    prime(stubConfigs, stubResults) {
        configs = stubConfigs;
        results = stubResults;
    }

    check(req, response, timestamp) {

        const requestTime = timestamp || moment().utc().format(),
            data = Object.assign({}, HEALTH_DATA, {
                checks: getChecks(),
                requestTime: requestTime,
                _links: {
                    self: {
                        href: req.protocol + '://' + req.get('host') + req.originalUrl
                    }
                }
            }),
            headers = [].concat(HEALTH_HEADERS).concat([{
                key: 'Content-Length',
                value: Buffer.byteLength(data, 'utf-8')
            }]);

        headers.forEach(header => {
            response.header(header.key, header.value);
        });

        response.json(data);
    }
};
