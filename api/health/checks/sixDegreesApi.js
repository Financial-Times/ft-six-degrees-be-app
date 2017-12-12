'use strict';

const _ = require('lodash');
const fetch = require('node-fetch');
const moment = require('moment');

const healthCheckModel = {
	id: 'six-degrees-api',
	name: 'Six Degrees API',
	ok: false,
	technicalSummary:
		'Used to provide data for Six Degrees Application - most mentioned people in articles',
	severity: 1,
	businessImpact: 'Data not available',
	checkOutput: '',
	panicGuide: `Check the health-check of the service (${process.env.API_URL_SIX_DEGREES}mostMentionedPeople/)`,
	lastUpdated: new Date().toISOString()
};

const today = moment().startOf('day');
const from = moment(today).subtract(1, 'months');
const dateFormat = 'YYYY-MM-DD';
const url = `${process.env.API_URL_SIX_DEGREES}mostMentionedPeople?apiKey=${process.env.API_KEY_SIX_DEGREES}&fromDate=${from.format(dateFormat)}&toDate=${today.format(dateFormat)}&limit=1`;

exports.getHealth = () =>
	new Promise(resolve => {
		const currentHealth = _.clone(healthCheckModel);

		fetch(url)
			.then((res) => {
				if (res && res.ok) {
					currentHealth.ok = true;
					currentHealth.lastUpdated = new Date().toISOString();
					resolve(_.omit(currentHealth, ['checkOutput']));
				}
			})
			.catch(err => {
				if (err && err.response) {
					currentHealth.ok = true;
					currentHealth.lastUpdated = new Date().toISOString();
					resolve(_.omit(currentHealth, ['checkOutput']));
					return;
				}

				currentHealth.ok = false;
				currentHealth.lastUpdated = new Date().toISOString();
				currentHealth.checkOutput =
					'Six Degrees API is unreachable. Error: ' +
					(err && err.message ? err.message : '');
				resolve(currentHealth);
			});
	});
