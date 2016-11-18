'use strict';

const winston = require('../winston-logger');

class PeopleArticlesStorage {

    constructor() {
        this.storage = {};
    }

    get() {
        return this.storage;
    }

    cache(data) {
        winston.logger.info('[cache-people-articles-storage] Storing new data.');
        this.storage = data;
    }

}

module.exports = new PeopleArticlesStorage();
