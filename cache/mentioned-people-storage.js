'use strict';

const moment = require('moment'),
    winston = require('../winston-logger'),
    jsonHandler = require('../utils/json-handler'),
    mentionedPeopleParser = require('../parsers/mentioned-people/'),
    peopleArticlesStorage = require('./people-articles-storage'),
    datesHandler = require('../utils/dates-handler');
console.log('IN PEOPLE STORAGE');
class MentionedPeopleStorage {

    constructor() {
        this.storageOriginal = {
            day: [],
            week: [],
            month: [],
            year: []
        };
        this.storageParsed = {};
        this.instance = 0;
    }

    addNumberOfArticles(key) {
        const articles = peopleArticlesStorage.get();

        this.storageParsed[key].mentioned.map(person => {
            articles.map(set => {
                if (set.id === person.id) {
                    person.articles = set.content.length;
                }
            });
        });
    }

    triggerParser(data, key) {

        const range = datesHandler.getRange(key, 'DD/MM/YYYY');

        this.storageParsed[key] = Object.assign({}, {
            cache: {
                key: key,
                range: range[0] + ' to ' + range[1],
                instance: this.instance + 1,
                time: moment().unix()
            },
            mentioned: jsonHandler.parse(data)
        });

        mentionedPeopleParser.handle(this.storageParsed[key].mentioned, () => {
            this.addNumberOfArticles(key);
        });
    }

    get(key) {
        return key ? this.storageParsed[key] : this.storageParsed;
    }

    cache(data, key) {
        if (data && this.storageOriginal[key] !== data) {
            winston.logger.info('[cache-mentioned-people-storage] New data detected for ' + key + ', storing and parsing.\n\n' + data);
            this.storageOriginal[key] = data;
            this.triggerParser(data, key);
        }
    }

}

module.exports = new MentionedPeopleStorage();
