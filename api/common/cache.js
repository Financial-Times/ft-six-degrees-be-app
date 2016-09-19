'use strict';

const moment = require('moment');

module.exports = new class Cache {
    constructor() {
        this.storage = {
            people: {},
            connections: {},
            users: {}
        };
    }

    handle(id) {
        if (!this.storage[id].start) {
            this.storage[id].start = moment();
        } else {
            if (moment().isAfter(this.storage[id].start, 'day')) {
                this.storage[id] = {};
            }
        }
    }
};

