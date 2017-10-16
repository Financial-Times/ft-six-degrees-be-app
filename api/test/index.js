'use strict';

const CONFIG = require('../../config'),
	responder = require('../common/responder'),
	moment = require('moment');

module.exports = new class Test {
	check(request, response, timestamp) {
		responder.send(response, {
			status: 200,
			data: {
				name: CONFIG.DESCRIPTION,
				time: timestamp || moment().format()
			}
		});
	}
}();
