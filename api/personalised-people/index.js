'use strict';

const fetch = require('node-fetch');
const moment = require('moment');
const isEmpty = require('lodash/isEmpty');
const responder = require('../common/responder');
const CONFIG = require('../../config');
const EnrichedContent = require('../../parsers/enriched-content');
const PersonalisedPeopleStorage = require('../../cache/personalised-people-storage');
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
	const url = `${CONFIG.URL.API.FT_RECOMMENDATIONS_USERS}${uuid}/history?limit=100&recency=${getRecency(key)}&apiKey=${CONFIG.API_KEY.FT_RECOMMENDATIONS}`;
	return fetch(url)
		.then(resp => {
			if (!resp.ok) {
				responder.rejectNotFound(resp);
			}
			return resp.json();
		})
		.then(history => EnrichedContent.getPeople(res, history.response, key))
		.catch(error => {
			winston.logger.error(`[api-personalised-people] ${error}`);
			responder.rejectBadGateway();
		});
}

class PeopleHistory {
	get(req, res) {
		const stored = PersonalisedPeopleStorage.get(req.params.key);
		if (!isEmpty(stored)) {
			responder.send(res, {
				status: 200,
				data: stored.people
			});
		} else {
			getHistory(req.params.key, req.params.uuid, res);
		}
	}
}

module.exports = new PeopleHistory();
