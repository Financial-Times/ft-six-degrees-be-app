'use strict';

const _ = require('lodash');
const fetch = require('node-fetch');

const healthCheckModel = {
	id: 'session-api',
	name: 'Session API',
	ok: false,
	technicalSummary:
		'Used to get auth-ed user data',
	severity: 3,
	businessImpact: 'User data not available',
	checkOutput: '',
	panicGuide: `Check the health-check of the service (${process.env.FT_SESSIONS_API_URL})`,
	lastUpdated: new Date().toISOString()
};

exports.getHealth = () =>
	new Promise(resolve => {
		const currentHealth = _.clone(healthCheckModel);

		fetch(`${process.env.FT_SESSIONS_API_URL}asd`, {
			headers: { 'X-Api-Key': process.env.FT_SESSIONS_API_KEY }
		})
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
					'Session API is unreachable. Error: ' +
					(err && err.message ? err.message : '');
				resolve(currentHealth);
			});
	});
