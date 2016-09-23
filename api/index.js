'use strict';

const responder = require('../api/common/responder'),
    Health = require('../api/health'),
    winston = require('../winston-logger'),
    apiRoutes = {
        GET: {
            'health': Health.check
        },
        POST: {}
    };

module.exports = new class Api {
    handle(request, response) {
        const command = request.params.command,
            isApiRoute = request.url.indexOf('/api/') !== -1,
            requestMethod = request.method,
            routes = apiRoutes[requestMethod];

        if (isApiRoute && command) {

            if (!process.env.TEST) {
                winston.logger.info('API ' + requestMethod + ' request detected. Route: /' + command + '/');
            }

            if (routes[command]) {
                routes[command](request, response);
            } else {
                responder.reject(response);
            }

        } else {
            responder.reject(response);
        }
    }
};
