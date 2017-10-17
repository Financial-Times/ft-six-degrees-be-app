'use strict';

const fetch = require('node-fetch');
const CONFIG = require('../../config');
const responder = require('../common/responder');

function respond(response, data) {
	responder.send(response, {
		status: 200,
		data: data
	});
}

class Session {
	get(req, res) {
		fetch(`${CONFIG.URL.API.FT_SESSIONS}${req.params.key}`, {
			headers: { 'X-Api-Key': CONFIG.API_KEY.FT_SESSIONS }
		})
			.then(resp => resp.ok && resp.json())
			.then((session = {}) => {
				const { uuid } = session;

				if (uuid) {
					respond(res, {
						uuid: uuid
					});
				} else {
					responder.reject(res);
				}
			});
	}
}

module.exports = new Session();
