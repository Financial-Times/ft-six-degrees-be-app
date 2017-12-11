'use strict';

const _ = require('lodash');
const fetch = require('node-fetch');
const moment = require('moment');

const healthCheckModel = {
	id: 'recommended-reads-api',
	name: 'Recommended Reads API',
	ok: false,
	technicalSummary:
		"Used to provide data for Six Degrees Application based on user's reading history",
	severity: 2,
	businessImpact: 'Data not available',
	checkOutput: '',
	panicGuide: `Check the health-check of the service (${process.env.FT_RECOMMENDATIONS_USERS_API_URL})`,
	lastUpdated: new Date().toISOString()
};

const now = moment();
const from = moment().subtract(1, 'months');
const recency = now.diff(from, 'days');
const url = `${process.env.FT_RECOMMENDATIONS_USERS_API_URL}uuid/history?limit=1&recency=${recency}&apiKey=${process.env.FT_RECOMMENDATIONS_API_KEY}`;

exports.getHealth = () =>
	new Promise(resolve => {
		const currentHealth = _.clone(healthCheckModel);

		fetch(url)
			.then(() => {
				currentHealth.ok = true;
				resolve(_.omit(currentHealth, ['checkOutput']));
			})
			.catch(err => {
				if (err && err.response && err.response.status === 404) {
					currentHealth.ok = true;
					resolve(_.omit(currentHealth, ['checkOutput']));
					return;
				}

				currentHealth.ok = false;
				currentHealth.checkOutput =
					'Recommended Reads API is unreachable. Error: ' +
					(err && err.message ? err.message : '');
				resolve(currentHealth);
			});
	});
