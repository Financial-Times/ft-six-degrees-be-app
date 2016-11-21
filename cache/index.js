'use strict';

const MentionedPeopleStorage = require('./mentioned-people-storage'),
    MentionedPeopleArticlesStorage = require('./mentioned-people-articles-storage'),
    storages = {
        'mentioned-people': MentionedPeopleStorage,
        'people-articles': MentionedPeopleArticlesStorage
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
