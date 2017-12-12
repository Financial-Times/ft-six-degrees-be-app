'use strict';

const Promise = require('bluebird');


const healthServices = [
	require('./checks/sixDegreesApi'),
	require('./checks/recommendedReadsApi'),
	require('./checks/sessionsApi')
];

let lastUpdated;
let lastResults;

let checkInProgress = false;
const timeout = (result) => new Promise(resolve => setTimeout(() => resolve(result), 10000));
const check = function () {
	if (checkInProgress) {
		return checkInProgress;
	}

	lastUpdated = new Date().getTime();

	const checksToRun = [];
	healthServices.forEach(function (healthService) {
		checksToRun.push(healthService.getHealth());
	});

	checkInProgress = Promise.any([Promise.all(checksToRun), timeout(lastResults)]).then((results) => {
		lastUpdated = new Date().getTime();
		lastResults = results;

		checkInProgress = false;
		return results;
	}).catch((err) => {
		checkInProgress = false;
		throw err;
	});
	return checkInProgress;
};

exports.getChecks = function () {
	if (lastResults && lastUpdated && (new Date().getTime() - lastUpdated < 60000)) {
		return new Promise((resolve) => {
			resolve(lastResults);
		});
	} else {
		return check();
	}
};
