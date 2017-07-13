'use strict';

const request = require('request'),
    moment = require('moment'),
    responder = require('../common/responder'),
    connectionsStorage = require('../../cache/connections.storage'),
    jsonHandler = require('../../utils/json-handler'),
    datesHandler = require('../../utils/dates-handler'),
    CONFIG = require('../../config');

function respond(response, data) {
    responder.send(response, {
        status: 200,
        data: data
    });
}

function fetch(key, uuid) {
    const datesRange = datesHandler.getRange(key),
        fromDate = datesRange[0],
        toDate = datesRange[1];

    return new Promise(function (resolve, reject) {
    	let url = CONFIG.URL.API.SIX_DEGREES_HOST + 'connectedPeople?minimumConnections=2&fromDate=' + fromDate + '&toDate=' + toDate + '&limit=9&contentLimit=20&uuid=' + uuid + '&apiKey=' + CONFIG.API_KEY.SIX_DEGREES;
        request(url, function (error, response, body) {
            if (error) {
                reject(error);
            } else {
                resolve(body);
            }
        });
    });
}

function getImage(person) {
	return new Promise(function (resolve, reject) {
		request('https://en.wikipedia.org/w/api.php?action=query&titles=' + person.abbrName + '&prop=pageimages&format=json&pithumbsize=600', function (err, response, body) {

			if (err) {
				reject(err);
			} else {

				let key, url;

				body = jsonHandler.parse(body);

				if (body.query && body.query.pages) {
					for (key in body.query.pages) {
						if (body.query.pages.hasOwnProperty(key)) {
							url = body.query.pages[key].thumbnail ? body.query.pages[key].thumbnail.source : null;
						}
					}
				}

				resolve({
					url: url
				});
			}
		});
	});
}

function getNameInitials(prefLabel) {
	const initials = prefLabel.match(/\b\w/g) || [];
	return ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
}

function getAbbreviatedName(prefLabel) {
	const prefLabelArray = prefLabel.split(' '),
	      max = prefLabelArray.length;
	return prefLabelArray[0] + ' ' + prefLabelArray[max - 1];
}

class Connections {

    get(req, res) {

        const key = req.params.key,
            uuid = req.params.uuid,
            today = moment().format('YYYY-MM-DD'),
            cached = connectionsStorage.get(today, uuid, key);

        if (cached) {
            respond(res, jsonHandler.parse(cached));
        } else {
            fetch(key, uuid).then(body => {
				let connections = jsonHandler.parse(body)
					.map(conn => {
						conn.person = Object.assign({}, conn.person, {
							abbrName: getAbbreviatedName(conn.person.prefLabel),
							initials: getNameInitials(conn.person.prefLabel)
						});
						return conn;
					});
	            const actions = connections && connections.length ? connections.map(conn => getImage(conn.person)) : [],
	                  results = actions.length ? Promise.all(actions) : null;

	            if (results) {
		            results.then(images => {
			            images.map((img, index) => {
				            if (img && img.url) {
					            connections[index].person.img = img.url;
				            }
			            });
			            connectionsStorage.cache(today, uuid, key, JSON.stringify(connections));
			            respond(res, connections);
		            }).catch(error => {
			            winston.logger.error('[parsers-common-people-images]\n\n' + error);
		            });
	            }
            }).catch(error => {
                respond(res, error);
            });
        }

    }

}

module.exports = new Connections();
