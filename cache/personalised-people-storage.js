'use strict';

const personalisedPeopleParser = require('../parsers/personalised-people/');
const personalisedPeopleArticlesStorage = require('./personalised-people-articles-storage');
const moment = require('moment');
const orderBy = require('lodash/orderBy');
const responder = require('../api/common/responder');
const winston = require('../winston-logger');
const jsonHandler = require('../utils/json-handler');
const datesHandler = require('../utils/dates-handler');

class PersonalisedPeopleStorage {
	constructor() {
		this.description = '[cache-personalised-people-storage]';
		this.storageOriginal = {};
		this.storageParsed = {};
		this.instance = 0;

		this.peopleParser = personalisedPeopleParser;
		this.articlesStorage = personalisedPeopleArticlesStorage;
	}

	addNumberOfArticles(key, clientRes, uuid) {
		const articles = this.articlesStorage.get(key, uuid);

		this.storageParsed[uuid][key].people.forEach(person => {
			articles.forEach(set => {
				if (set.id === person.id) {
					person.articles = set.content.length;
				}
			});
		});
		this.storageParsed[uuid][key].people = orderBy(this.storageParsed[uuid][key].people, ['articles', 'initials'], ['desc', 'asc']);

		if (clientRes) {
			responder.send(clientRes, {
				status: 200,
				data: this.storageParsed[uuid][key].people
			});
		}
	}

	triggerParser(data, key, clientRes, uuid) {
		const range = datesHandler.getRange(key, 'DD/MM/YYYY');

		this.storageParsed[uuid] = {};
		this.storageParsed[uuid][key] = Object.assign(
			{},
			{
				cache: {
					key,
					range: range[0] + ' to ' + range[1],
					instance: this.instance + 1,
					time: moment().unix()
				},
				people: jsonHandler.parse(data)
			}
		);

		this.peopleParser.handle(
			this.storageParsed[uuid][key].people,
			() => {
				this.addNumberOfArticles(key, clientRes, uuid);
			},
			key,
			uuid
		);
	}

	get(key, uuid) {
		return key ? this.storageParsed[uuid][key] : this.storageParsed[uuid];
	}

	cache(data, key, clientRes, uuid) {
		winston.logger.info(
			this.description +
			' New data detected for ' +
			key +
			', storing and parsing.\n\n' +
			data
		);
		this.storageOriginal[uuid] = {};
		this.storageOriginal[uuid][key] = data;
		this.triggerParser(data, key, clientRes, uuid);
	}
}

module.exports = new PersonalisedPeopleStorage();
