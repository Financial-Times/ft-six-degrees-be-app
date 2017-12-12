'use strict';

const fetch = require('node-fetch');
const moment = require('moment');
const responder = require('../common/responder');
const CONFIG = require('../../config');
const EnrichedContent = require('../../parsers/enriched-content');
const winston = require('../../winston-logger');

function getRecency(key) {
	const dateParams = key.split(' ');
	const fromDate = moment().subtract(
		parseInt(dateParams[1] ? dateParams[0] : 1, 10),
		dateParams[1] || 'months'
	);
	const now = moment();
	return now.diff(fromDate, 'days');
}

function getHistory(key, uuid, res) {
	const url = `${CONFIG.URL.API.FT_RECOMMENDATIONS_USERS}${uuid}/history?limit=50&recency=${getRecency(key)}&apiKey=${CONFIG.API_KEY.FT_RECOMMENDATIONS}`;
	return fetch(url)
		.then(resp => {
			if (!resp.ok) {
				responder.rejectNotFound(resp);
			}
			return resp.json();
		})
		.then(history => {
			if (history.response.articles.length > 0) {
				return history;
			}
			responder.send(res, {
				status: 200,
				data: []
			});
			return undefined;
		})
		.then(history => history && EnrichedContent.getPeople(res, history.response, key, uuid))
		.catch(error => {
			winston.logger.error(`[api-personalised-people] ${error}`);
			responder.rejectBadGateway();
		});
}

class PeopleHistory {
	get(req, res) {
		getHistory(req.params.key, req.params.uuid, res);
	}
}

module.exports = new PeopleHistory();
