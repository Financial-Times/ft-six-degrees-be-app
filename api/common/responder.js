'use strict';

const winston = require('../../winston-logger');

class Responder {

    constructor() {
        this.badRequestParams = {
            'status': 400,
            'error': 'Bad request',
            'type': 'text/plain'
        };

        this.badGatewayParams = {
            status: 502,
            error: 'bad gateway'
        };

        this.unauthorizedRequestParams = {
            'status': 401,
            'error': 'Unauthorized',
            'type': 'text/plain'
        };
    }

    send(response, params, nolog) {
        if (response) {
            if (params.status === 200) {
                if (!nolog) {
                    winston.logger.info('Request ' + (params.description ? '\'' + params.description + '\' ' : '') + 'successful. Sending JSON response to client.');
                }
                response.json(params.data);
            } else {
                response.writeHead(params.status, {
                    'Content-Type': 'text/plain'
                });
                if (!nolog) {
                    winston.logger.error((params.description ? 'Request error: \'' + params.description + '\' ' : 'Error') + ', sending text response to client: ' + (params.error || 'unknown'));
                }
                response.end((params.error || 'unknown'));
            }
        }
    }

    reject(response) {
        this.send(response, this.badRequestParams);
    }

    rejectBadGateway(response) {
        this.send(response, this.badGatewayParams);
    }

    rejectUnauthorized(response) {
        this.send(response, this.unauthorizedRequestParams);
    }

}

module.exports = new Responder();
