'use strict';

const fetch = require('node-fetch');
const winston = require('../../winston-logger');

function getImage(person) {
	return fetch(
		`https://en.wikipedia.org/w/api.php?action=query&titles=${person.abbrName}&prop=pageimages&format=json&pithumbsize=600`
	)
		.then(res => res.ok && res.json())
		.then(body => {
			let url;
			if (body.query && body.query.pages) {
				Object.keys(body.query.pages).forEach(key => {
					url = body.query.pages[key].thumbnail
						? body.query.pages[key].thumbnail.source
						: null;
				});
			}
			return { url };
		}).catch(() => {});
}

class PeopleImages {
	handle(people) {
		const actions = people && people.length ? people.map(getImage) : [],
			results = actions.length ? Promise.all(actions) : null;

		if (results) {
			results
				.then(images => {
					images.forEach((img, index) => {
						if (img && img.url) {
							people[index].img = img.url;
						}
					});
				})
				.catch(error => {
					winston.logger.error(
						'[parsers-common-people-images]\n\n' + error
					);
				});
		}
	}
}

module.exports = new PeopleImages();
