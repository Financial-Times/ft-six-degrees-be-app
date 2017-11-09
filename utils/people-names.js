'use strict';

const fs = require('fs');
const crypto = require('./crypto');
const winston = require('../winston-logger');

let names = null;

try {
	const encData = fs.readFileSync('./config/names.json', 'utf8');
	names = crypto.decrypt(encData);
} catch (e) {
	winston.logger.error('could not read names');
}

module.exports = JSON.parse(names);

