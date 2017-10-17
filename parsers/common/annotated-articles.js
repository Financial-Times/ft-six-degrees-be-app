'use strict';

const fetch = require('node-fetch');
const uniqBy = require('lodash/uniqBy');
const datesHandler = require('../../utils/dates-handler');
const winston = require('../../winston-logger');

function getArticles(person, key) {
	const dates = key ? datesHandler.getRange(key) : ['', ''];
	const url = `${process.env.FT_API_URL}content?isAnnotatedBy=${person.id}&fromDate=${dates[0]}&toDate=${dates[1]}`;
	return fetch(url, { headers: { 'x-api-key': process.env.FT_API_KEY } })
		.then(res => res.ok && res.json())
		.then(content => {
			const uniqueContent = uniqBy(content, 'id');
			return {
				id: person.id,
				content: uniqueContent
			};
		});
}

class AnnotatedArticles {
	constructor(description, articlesStorage) {
		this.description = description;
		this.articlesStorage = articlesStorage;
	}

	handle(people, articlesCallback, key) {
		const actions =
				people && people.length
					? people.map(person => getArticles(person, key))
					: [],
			results = actions.length ? Promise.all(actions) : null;

		if (results) {
			results
				.then(articles => {
					this.articlesStorage.cache(articles, key);
					articlesCallback();
				})
				.catch(error => {
					winston.logger.error(this.description + '\n\n' + error);
				});
		}
	}
}

module.exports = AnnotatedArticles;
