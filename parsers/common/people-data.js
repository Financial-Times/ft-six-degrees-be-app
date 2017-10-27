'use strict';

const PeopleImagesParser = require('./people-images');

function getNameInitials(prefLabel) {
	const initials = prefLabel.match(/\b\w/g) || [];
	return ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
}

function getAbbreviatedName(prefLabel) {
	const prefLabelArray = prefLabel.split(' '),
		max = prefLabelArray.length;
	return prefLabelArray[0] + ' ' + prefLabelArray[max - 1];
}

class PeopleData {
	constructor(peopleArticlesParser) {
		this.peopleArticlesParser = peopleArticlesParser;
	}

	handle(people, articlesCallback, key, uuid) {
		people.map(person => {
			person.abbrName = getAbbreviatedName(person.prefLabel);
			return person;
		});

		people.map(person => {
			person.initials = getNameInitials(person.prefLabel);
			return person;
		});

		PeopleImagesParser.handle(people)
			.then(() => {
				this.peopleArticlesParser.handle(people, articlesCallback, key, uuid);
			});
	}
}

module.exports = PeopleData;
