'use strict';

const winston = require('../../winston-logger');

class ArticlesStorage {
	constructor(description) {
		this.storage = {};
		this.description = description;
	}

	get(key) {
		return this.storage[key];
	}

	cache(data, key) {
		winston.logger.info(this.description + ' Storing new data.');
		this.storage[key] = data;
	}
}

module.exports = ArticlesStorage;
