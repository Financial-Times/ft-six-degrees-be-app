'use strict';

const request = require('request'),
	CONFIG = require('../../config'),
	jsonHandler = require('../../utils/json-handler'),
	responder = require('../common/responder');

function fetch(sessionId) {
	return new Promise(function(resolve, reject) {
		request(
			{
				url: CONFIG.URL.API.FT_SESSIONS + sessionId,
				headers: {
					'X-Api-Key': CONFIG.API_KEY.FT_SESSIONS
				}
			},
			function(err, response) {
				if (err) {
					reject(err);
				} else {
					resolve(response.body);
				}
			}
		);
	});
}

function respond(response, data) {
	responder.send(response, {
		status: 200,
		data: data
	});
}

class Session {
	get(req, res) {
		fetch(req.params.key).then(response => {
			const session = jsonHandler.parse(response) || {},
				uuid = session.uuid;

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
