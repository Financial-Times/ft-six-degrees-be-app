'use strict';

const moment = require('moment');
const responder = require('../../api/common/responder');
const winston = require('../../winston-logger');
const jsonHandler = require('../../utils/json-handler');
const { containsSameIds } = require('../../utils/storage');
const datesHandler = require('../../utils/dates-handler');
const orderBy = require('lodash/orderBy');

class PeopleStorage {
	constructor(description, parser, articlesStorage) {
		this.description = description;

		this.storageOriginal = {
			'7 days': [],
			'14 days': [],
			month: [],
			'6 months': []
		};
		this.storageParsed = {};
		this.instance = 0;

		this.peopleParser = parser;
		this.articlesStorage = articlesStorage;
	}

	addNumberOfArticles(key, clientRes) {
		const articles = this.articlesStorage.get(key);

		this.storageParsed[key].people.forEach(person => {
			articles.forEach(set => {
				if (set.id === person.id) {
					person.articles = set.content.length;
				}
			});
		});
		this.storageParsed[key].people = orderBy(this.storageParsed[key].people, ['articles', 'initials'], ['desc', 'asc']);

		if (clientRes) {
			responder.send(clientRes, {
				status: 200,
				data: this.storageParsed[key].people
			});
		}
	}

	triggerParser(data, key, clientRes) {
		const range = datesHandler.getRange(key, 'DD/MM/YYYY');

		this.storageParsed[key] = Object.assign(
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
			this.storageParsed[key].people,
			() => {
				this.addNumberOfArticles(key, clientRes);
			},
			key
		);
	}

	get(key) {
		return key ? this.storageParsed[key] : this.storageParsed;
	}

	cache(data, key, clientRes) {
		if (data && !containsSameIds(data, this.storageOriginal[key])) {
			winston.logger.info(
				this.description +
					' New data detected for ' +
					key +
					', storing and parsing.\n\n' +
					data
			);
			this.storageOriginal[key] = data;
			this.triggerParser(data, key, clientRes);
		}
	}
}

module.exports = PeopleStorage;
