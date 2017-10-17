'use strict';

const moment = require('moment');
const fetch = require('node-fetch');
const responder = require('../common/responder');
const cache = require('../../cache');
const contentStorage = require('../../cache/content-storage');
const datesHandler = require('../../utils/dates-handler');
const uuidUtils = require('../../utils/uuid');
const CONFIG = require('../../config');

function respond(response, data) {
	responder.send(response, {
		status: 200,
		data
	});
}

function fetchSingle(item, key) {
	const range = datesHandler.getRange(key);
	const url = `${CONFIG.URL.API.CONTENT}content/${uuidUtils.extract(
		item.id
	)}?fromDate=${range[0]}&toDate=${range[1]}&apiKey=${CONFIG.API_KEY
		.FT_CONTENT}`;
	return fetch(url)
		.then(res => res.ok && res.json())
		.then(body => {
			if (body && body.mainImage && body.mainImage.id) {
				const uuid = body.mainImage.id
					.replace('http', 'https')
					.replace(CONFIG.URL.API.CONTENT + 'content/', '');
				return fetch(
					`${CONFIG.URL.API.CONTENT}${uuid}?apiKey=${CONFIG.API_KEY
						.FT_CONTENT}`
				)
					.then(res => res.ok && res.json())
					.then(imagesBody => {
						if (imagesBody.members) {
							const memberUuid = imagesBody.members[0].id
								.replace('http', 'https')
								.replace(
									CONFIG.URL.API.CONTENT + 'content/',
									''
								);
							return fetch(
								`${CONFIG.URL.API
									.CONTENT}${memberUuid}?apiKey=${CONFIG
									.API_KEY.FT_CONTENT}`
							)
								.then(res => res.ok && res.json())
								.then(imageBody => {
									body.binaryUrl = imageBody.binaryUrl;
									body.imageUrl = body.binaryUrl;
									return body;
								});
						}
						return body;
					});
			}
			return body;
		});
}

function getAll(uuid, key, content, clientResponse) {
	const actions =
			content && content.map
				? content.map(item => fetchSingle(item, key))
				: [],
		results = actions.length ? Promise.all(actions) : null;

	if (results) {
		results
			.then(articles => {
				articles = articles.filter(a => a.hasOwnProperty('id'));
				contentStorage.cache(
					moment().format('YYYY-MM-DD'),
					uuid,
					key,
					articles
				);
				respond(clientResponse, articles);
			})
			.catch(() => {
				responder.rejectBadGateway(clientResponse);
			});
	} else {
		respond(clientResponse, []);
	}
}

class PeopleArticles {
	get(req, res) {
		const date = moment().format('YYYY-MM-DD'),
			{ uuid, key } = req.params,
			stored = contentStorage.get(date, uuid, key);

		if (!uuid) {
			responder.reject(res);
		} else if (stored) {
			respond(res, stored);
		} else {
			const mentionedPeopleArticles =
					cache.get('mentioned-people-articles', key) || [],
				personalisedPeopleArticles =
					cache.get('personalised-people-articles', key) || [],
				cachedArticles = [].concat(
					mentionedPeopleArticles,
					personalisedPeopleArticles
				),
				articles =
					cachedArticles && cachedArticles.length
						? cachedArticles.filter(
								set =>
									set.id && set.id === uuidUtils.decorate(uuid)
							)
						: [];

			if (articles.length) {
				const content = [].concat(articles[0].content);
				getAll(uuid, key, content, res);
			} else {
				respond(res, []);
			}
		}
	}
}

module.exports = new PeopleArticles();
