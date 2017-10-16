'use strict';

const moment = require('moment'),
	fetch = require('node-fetch'),
	responder = require('../common/responder'),
	connectionsStorage = require('../../cache/connections.storage'),
	jsonHandler = require('../../utils/json-handler'),
	datesHandler = require('../../utils/dates-handler'),
	winston = require('../../winston-logger'),
	CONFIG = require('../../config');

function respond(response, data) {
	responder.send(response, {
		status: 200,
		data
	});
}

function getConnections(key, uuid) {
	const datesRange = datesHandler.getRange(key),
		fromDate = datesRange[0],
		toDate = datesRange[1];

	const url = `${CONFIG.URL.API
		.SIX_DEGREES_HOST}connectedPeople?minimumConnections=2&fromDate=${fromDate}&toDate=${toDate}&limit=9&contentLimit=20&uuid=${uuid}&apiKey=${CONFIG
		.API_KEY.SIX_DEGREES}`;
	return fetch(url).then(res => res.json());
}

function getImage(person) {
	const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${person.abbrName}&prop=pageimages&format=json&pithumbsize=600`;
	return fetch(url)
		.then(res => res.json())
		.then(body => {
			let imgUrl;
			if (body.query && body.query.pages) {
				Object.keys(body.query.pages).forEach(key => {
					imgUrl = body.query.pages[key].thumbnail
						? body.query.pages[key].thumbnail.source
						: null;
				});
			}
			return {
				url: imgUrl
			};
		});
}

function getNameInitials(prefLabel) {
	const initials = prefLabel.match(/\b\w/g) || [];
	return ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
}

function getAbbreviatedName(prefLabel) {
	const prefLabelArray = prefLabel.split(' '),
		max = prefLabelArray.length;
	return `${prefLabelArray[0]} ${prefLabelArray[max - 1]}`;
}

class Connections {
	get(req, res) {
		const { key, uuid } = req.params,
			today = moment().format('YYYY-MM-DD'),
			cached = connectionsStorage.get(today, uuid, key);

		if (cached) {
			respond(res, jsonHandler.parse(cached));
		} else {
			getConnections(key, uuid)
				.then(rawConnections => {
					const connections = rawConnections.map(conn => {
						conn.person = Object.assign({}, conn.person, {
							abbrName: getAbbreviatedName(conn.person.prefLabel),
							initials: getNameInitials(conn.person.prefLabel)
						});
						return conn;
					});
					const actions =
							connections && connections.length
								? connections.map(conn => getImage(conn.person))
								: [],
						results = actions.length ? Promise.all(actions) : null;

					if (results) {
						results
							.then(images => {
								images.forEach((img, index) => {
									if (img && img.url) {
										connections[index].person.img = img.url;
									}
								});
								connectionsStorage.cache(
									today,
									uuid,
									key,
									JSON.stringify(connections)
								);
								respond(res, connections);
							})
							.catch(error => {
								winston.logger.error(
									'[parsers-common-people-images]\n\n' + error
								);
							});
					}
				})
				.catch(error => {
					respond(res, error);
				});
		}
	}
}

module.exports = new Connections();
