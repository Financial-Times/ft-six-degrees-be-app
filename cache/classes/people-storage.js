'use strict';

const moment = require('moment'),
    responder = require('../../api/common/responder'),
    winston = require('../../winston-logger'),
    jsonHandler = require('../../utils/json-handler'),
    datesHandler = require('../../utils/dates-handler');

class PeopleStorage {

    constructor(description, parser, articlesStorage) {
        this.description = description;

        this.storageOriginal = {
            day: [],
            week: [],
            month: [],
            year: []
        };
        this.storageParsed = {};
        this.instance = 0;

        this.peopleParser = parser;
        this.articlesStorage = articlesStorage;
    }

    addNumberOfArticles(key, clientRes) {
        const articles = this.articlesStorage.get();

        this.storageParsed[key].people.map(person => {
            articles.map(set => {
                if (set.id === person.id) {
                    person.articles = set.content.length;
                }
            });
        });

        if (clientRes) {
            responder.send(clientRes, {
                status: 200,
                data: this.storageParsed[key].people
            });
        }
    }

    triggerParser(data, key, clientRes) {

        const range = datesHandler.getRange(key, 'DD/MM/YYYY');

        this.storageParsed[key] = Object.assign({}, {
            cache: {
                key: key,
                range: range[0] + ' to ' + range[1],
                instance: this.instance + 1,
                time: moment().unix()
            },
            people: jsonHandler.parse(data)
            // people: data
        });

        this.peopleParser.handle(this.storageParsed[key].people, () => {
            this.addNumberOfArticles(key, clientRes);
        });
    }

    get(key) {
        return key ? this.storageParsed[key] : this.storageParsed;
    }

    cache(data, key) {
        if (data && this.storageOriginal[key] !== data) {
            winston.logger.info(this.description + ' New data detected for ' + key + ', storing and parsing.\n\n' + data);
            this.storageOriginal[key] = data;
            this.triggerParser(data, key);
        }
    }

}

module.exports = PeopleStorage;
