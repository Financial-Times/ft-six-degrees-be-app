'use strict';

const request = require('request'),
	moment = require('moment'),
	isEmpty = require('lodash/isEmpty'),
	responder = require('../common/responder'),
	CONFIG = require('../../config'),
	EnrichedContent = require('../../parsers/enriched-content'),
	PersonalisedPeopleStorage = require('../../cache/personalised-people-storage'),
	winston = require('../../winston-logger');

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
	const url =
		CONFIG.URL.API.FT_RECOMMENDATIONS_USERS +
		uuid +
		'/history?limit=100&recency=' +
		getRecency(key) +
		'&apiKey=' +
		CONFIG.API_KEY.FT_RECOMMENDATIONS;
	return request(url, (error, resp, history) => {
		if (resp && resp.statusCode === 200) {
			EnrichedContent.getPeople(res, JSON.parse(history).response, key);
		} else if (!error && resp) {
			responder.rejectNotFound(res);
		} else {
			winston.logger.error(`[api-personalised-people] ${error}`);
			responder.rejectBadGateway();
		}
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
