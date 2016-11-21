const winston = require('../../winston-logger');

class ArticlesStorage {

    constructor(description) {
        this.storage = {};
        this.description = description;
    }

    get() {
        return this.storage;
    }

    cache(data) {
        winston.logger.info(this.description + ' Storing new data.');
        this.storage = data;
    }

}

module.exports = ArticlesStorage;
