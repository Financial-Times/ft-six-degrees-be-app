'use strict';

class ContentStorage {
    constructor() {
        this.storage = {};
    }

    cleanup(date) {
        let key;
        for (key in this.storage) {
            if (this.storage.hasOwnProperty(key)) {
                if (key !== date) {
                    delete this.storage[key];
                }
            }
        }
    }

    get(date, uuid, key) {

        const currentStorage = this.storage[date];
        let storage;

        if (currentStorage && currentStorage[uuid]) {
            storage = currentStorage[uuid][key];
        }

        this.cleanup(date);

        return storage;
    }

    cache(date, uuid, key, data) {
        this.storage[date] = this.storage[date] || {};
        this.storage[date][uuid] = this.storage[date][uuid] || {};

        if (!this.storage[date][uuid][key] || this.storage[date][uuid][key] !== data) {
            this.storage[date][uuid][key] = data;
        }
    }
}

module.exports = new ContentStorage();
