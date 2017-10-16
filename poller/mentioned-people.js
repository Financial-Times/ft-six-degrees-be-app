'use strict';

const fetch = require('node-fetch'),
	moment = require('moment'),
	CONFIG = require('../config'),
	cache = require('../cache'),
	winston = require('../winston-logger'),
	datesHandler = require('../utils/dates-handler');

function isToday(today, momentDate) {
	return momentDate.isSame(today, 'd');
}

function addDateRange(key) {
	const range = datesHandler.getRange(key);
	return `?fromDate=${range[0]}&toDate=${range[1]}`;
}

function store(data, key) {
	cache.store('mentioned-people', data, key);
}

class MentionedPeoplePoller {
	cleanup(today) {
		if (this.cached) {
			Object.keys(this.cached).forEach(key => {
				if (!isToday(today, moment(key, 'ddd MMM YYYY HH:mm:ss Z'))) {
					delete this.cached[key];
				}
			});
		}
	}

	get() {
		const url = `${CONFIG.URL.API.SIX_DEGREES_MENTIONED}?apiKey=${CONFIG
			.API_KEY.SIX_DEGREES}`;
		const today = moment().startOf('day'),
			keys = ['7 days', '14 days', 'month', '6 months'];
		let key;

		if (!this.counter || this.counter >= 4) {
			this.counter = 1;
		} else {
			this.counter += 1;
		}

		key = keys[this.counter - 1]; // eslint-disable-line prefer-const

		// if data already stored, do not trigger new fetch for 24 hrs
		if (!this.cached || !this.cached[today] || !this.cached[today][key]) {
			this.cleanup(today);
			fetch(`${url}&${addDateRange(key)}`)
				.then(res => res.ok && res.text())
				.then(response => {
					store(response, key);
					this.cached = this.cached || {};
					this.cached[today] = this.cached[today] || {};
					this.cached[today][key] = response;
				})
				.catch(err => {
					// if error, make poller to send request for the same dates again in the next iteration
					this.counter -= 1;
					winston.logger.error(
						`[poller-mentioned-people] Response error:\n${err}`
					);
				});
		}
	}

	start() {
		setInterval(() => {
			this.get();
		}, CONFIG.SETTINGS.POLLER.INTERVAL);
	}
}

module.exports = new MentionedPeoplePoller();
