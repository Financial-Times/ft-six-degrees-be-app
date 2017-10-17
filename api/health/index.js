'use strict';

const CONFIG = require('../../config'),
	MODULE_CONFIG = {
		CHECKS_TIMEOUT: 30000,
		CHECKS_IN_PROGRESS: false
	},
	HEALTH_HEADERS = [
		{
			key: 'Cache-control',
			value: 'no-store'
		},
		{
			key: 'Content-Type',
			value: 'application/json'
		}
	],
	HEALTH_DATA = {
		schemaVersion: 1,
		systemCode: CONFIG.SYSTEM_CODE,
		name: CONFIG.SYSTEM_CODE,
		description: CONFIG.DESCRIPTION
	},
	fetch = require('node-fetch'),
	path = require('path'),
	moment = require('moment'),
	winston = require('../../winston-logger'),
	readFiles = require('../../utils/read-files');

let configs = {},
	results = {};

function getCheckSummary(id, result, output) {
	const { summary } = configs[id];
	return {
		id,
		name: summary.name,
		ok: result,
		severity: summary.severity,
		businessImpact: summary.businessImpact,
		technicalSummary: summary.technicalSummary,
		panicGuide: summary.panicGuide,
		checkOutput: output || 'none',
		lastUpdated: moment()
	};
}

function test(filename) {
	fetch(configs[filename].url)
		.then(() => {
			results[filename] = getCheckSummary(filename, true);
		})
		.catch(error => {
			winston.logger.warn(
				'[health] Problem with "' + filename + '"...\n' + error
			);
			results[filename] = getCheckSummary(filename, true, error);
		});
}

function getChecks() {
	let checks = [];

	Object.keys(results).forEach(filename => {
		checks.push(results[filename]);
	});

	if (!checks.length) {
		checks =
			'Health checks not yet performed, just deployed. Try again in 30 seconds...';
	}

	return checks;
}

(function init() {
	readFiles(
		path.join(__dirname, '/checks/'),
		filename => {
			configs[filename.replace('.js', '')] = require('./checks/' +
				filename);
		},
		error => {
			winston.logger.error(
				'[api-health] Error on attempt to read healthcheck configs from check folder! ' +
					error
			);
		}
	);

	if (
		!MODULE_CONFIG.CHECKS_IN_PROGRESS &&
		(!process.env.TEST || process.env.TEST.toString() !== 'true')
	) {
		MODULE_CONFIG.CHECKS_IN_PROGRESS = true;
		setInterval(() => {
			Object.keys(configs).forEach(filename => {
				test(filename);
			});
		}, MODULE_CONFIG.CHECKS_TIMEOUT);
	}
})();

module.exports = new class Health {
	prime(stubConfigs, stubResults) {
		configs = stubConfigs;
		results = stubResults;
	}

	check(req, response, timestamp) {
		const requestTime =
				timestamp ||
				moment()
					.utc()
					.format(),
			data = Object.assign({}, HEALTH_DATA, {
				checks: getChecks(),
				requestTime,
				_links: {
					self: {
						href:
							req.protocol +
							'://' +
							req.get('host') +
							req.originalUrl
					}
				}
			}),
			headers = [].concat(HEALTH_HEADERS).concat([
				{
					key: 'Content-Length',
					value: Buffer.byteLength(data, 'utf-8')
				}
			]);

		headers.forEach(header => {
			response.header(header.key, header.value);
		});

		response.json(data);
	}
}();
