'use strict';

const fetch = require('node-fetch');
const uniqBy = require('lodash/uniqBy');
const winston = require('../../winston-logger');
const responder = require('../../api/common/responder');
const CONFIG = require('../../config');
const personalisedPeopleStorage = require('../../cache/personalised-people-storage');

function getEnrichedContent(article) {
	const url = `${CONFIG.URL.API.ENRICHED_CONTENT}${article.id}?apiKey=${CONFIG.API_KEY.FT_CONTENT}`;
	return fetch(url, { headers: { 'x-api-key': process.env.FT_API_KEY } })
		.then(res => res.ok && res.json());
}

const getAnnotationPredicate = predicate =>
	predicate.substring(predicate.lastIndexOf('/') + 1, predicate.length);

class EnrichedContent {
	getPeople(clientRes, history, key, uuid) {
		const articles = uniqBy(history.articles, 'id'),
			actions =
				articles && articles.length
					? articles.map(getEnrichedContent)
					: [],
			results = actions.length ? Promise.all(actions) : null;

		if (results) {
			results
				.then(enrichedcontent => {
					const annotatedPeople = [];

					enrichedcontent.forEach(content => {
						if (content) {
							content.annotations.forEach(annotation => {
								if (
									annotation.type === 'PERSON' &&
									getAnnotationPredicate(annotation.predicate) !==
									'hasAuthor' &&
									getAnnotationPredicate(annotation.predicate) !==
									'about' &&
									getAnnotationPredicate(annotation.predicate) !==
									'majorMentions'
								) {
									annotatedPeople.push({
										id: annotation.id,
										prefLabel: annotation.prefLabel
									});
								}
							});
						}
					});
					if (annotatedPeople.length > 0) {
						const uniqueAnnotatedPeople = uniqBy(annotatedPeople, 'id');
						personalisedPeopleStorage.cache(
							JSON.stringify(uniqueAnnotatedPeople),
							key,
							clientRes,
							uuid
						);
					} else {
						responder.send(clientRes, {
							status: 200,
							data: []
						});
					}
				})
				.catch(error => {
					winston.logger.error(
						'[parsers-mentioned-people-articles]\n\n' + error
					);
				});
		}
	}
}

module.exports = new EnrichedContent();
