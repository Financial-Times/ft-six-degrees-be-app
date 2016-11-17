'use strict';

const moment = require('moment');

class Cache {
    constructor() {
        this.storage = {
            people: {},
            connections: {},
            users: {}
        };
    }

    handle(id, period) {

        let storage;

        if (id && this.storage[id]) {
            if (!this.storage[id].start) {
                this.storage[id].start = moment();
            } else {
                if (moment().isAfter(this.storage[id].start, period || 'day')) {
                    this.storage[id] = {};
                }
            }
            storage = this.storage[id];
        } else {
            storage = null;
        }

        return storage;
    }
}

module.exports = new Cache();
