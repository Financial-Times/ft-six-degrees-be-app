'use strict';

const winston = require('../../winston-logger');

module.exports = new class JsonHandler {

    parse(body, nolog) {
        let bodyParsed = null;

        try {
            bodyParsed = JSON.parse(body);
        } catch (err) {
            if (!nolog) {
                winston.logger.error('Response body parser error:\n', err);
            }
        }

        return bodyParsed;
    }
};

