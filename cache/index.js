'use strict';

const MentionedPeopleStorage = require('./mentioned-people-storage'),
    PeopleArticlesStorage = require('./people-articles-storage'),
    storages = {
        'mentioned-people': MentionedPeopleStorage,
        'people-articles': PeopleArticlesStorage
    };

class Cache {

    get(storage, key) {
        return storages[storage].get(key);
    }

    store(storage, data, key) {
        storages[storage].cache(data, key);
    }

}

module.exports = new Cache();
