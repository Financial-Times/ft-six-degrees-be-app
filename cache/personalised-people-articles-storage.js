'use strict';

const winston = require('../winston-logger');

class PeopleArticlesStorage {
	constructor() {
		this.storage = {};
		this.description = '[cache-personalised-people-articles-storage]';
	}

	get(key, uuid) {
		if (uuid && this.storage.hasOwnProperty(uuid)) {
			return this.storage[uuid][key];
		}
		return [];
	}

	cache(data, key, uuid) {
		winston.logger.info(this.description + ' Storing new data.');
		this.storage[uuid] = {};
		this.storage[uuid][key] = data;
	}
}

module.exports = new PeopleArticlesStorage();
