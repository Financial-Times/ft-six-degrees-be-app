'use strict';

const winston = require('../winston-logger');

class JsonHandler {

    parse(body, nolog) {
        let bodyParsed = null;

        try {
            bodyParsed = JSON.parse(body);
        } catch (err) {
            if (!nolog) {
                winston.logger.error('[utils-json-parser] JSON parser error:\n' + err);
            }
        }

        return bodyParsed;
    }
}

module.exports = new JsonHandler();

