'use strict';

const moment = require('moment');
const fetch = require('node-fetch');
const responder = require('../common/responder');
const connectionsStorage = require('../../cache/connections.storage');
const jsonHandler = require('../../utils/json-handler');
const datesHandler = require('../../utils/dates-handler');
const winston = require('../../winston-logger');
const Uuid = require('../../utils/uuid');
const peopleNames = require('../../utils/people-names');
const CONFIG = require('../../config');

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
		.SIX_DEGREES_HOST}connectedPeople?minimumConnections=2&fromDate=${fromDate}&toDate=${toDate}&contentLimit=20&uuid=${uuid}&apiKey=${CONFIG
		.API_KEY.SIX_DEGREES}`;
	return fetch(url).then(res => res.ok && res.json());
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

function getAbbreviatedName(id, prefLabel) {
	const nameItem = peopleNames.find(item => item.uuid === id);
	if (nameItem) {
		return nameItem.displayName;
	}
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
					if (!rawConnections) {
						respond(res, []);
					}
					const connections = rawConnections.map(conn => {
						const id = Uuid.extract(conn.person.id);
						conn.person = Object.assign({}, conn.person, {
							abbrName: getAbbreviatedName(id, conn.person.prefLabel),
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
