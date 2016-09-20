(function () {
    'use strict';

    const responder = require('../api/common/responder'),
        Health = require('../api/health'),
        winston = require('../winston-logger');

    function handleGet(request, response) {
        const params = request.url.replace('/api/', '').split('/');

        if (params.length && params[0] !== '') {

            if (!process.env.TEST) {
                winston.logger.info('API GET /' + params[0] + '/' + (request.query && JSON.stringify(request.query) !== '{}' ? JSON.stringify(request.query) : ''));
            }

            switch (params[0]) {
            case 'health':
                Health.check(response);
                break;
            default:
                responder.reject(response);
                break;
            }

        } else {
            responder.reject(response);
        }
    }

    function handlePost(clientRequest, clientResponse) {
        const route = clientRequest.url.replace('/api/', ''),
            headers = clientRequest.headers;

        if (!process.env.TEST) {
            winston.logger.info('API POST request detected. Route: ' + route);
        }

        switch (route) {
        case 'test': (function () {
            return;
        }());
            break;
        default: (function () {
            responder.reject(clientResponse);
        }());
            break;
        }

    }

    module.exports = {
        handleGet: handleGet,
        handlePost: handlePost
    };
}());
