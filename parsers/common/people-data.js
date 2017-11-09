'use strict';

const PeopleImagesParser = require('./people-images');
const peopleNames = require('../../utils/people-names');
const Uuid = require('../../utils/uuid');

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
	return prefLabelArray[0] + ' ' + prefLabelArray[max - 1];
}

class PeopleData {
	constructor(peopleArticlesParser) {
		this.peopleArticlesParser = peopleArticlesParser;
	}

	handle(people, articlesCallback, key, uuid) {
		people.map(person => {
			const id = Uuid.extract(person.id);
			person.abbrName = getAbbreviatedName(id, person.prefLabel);
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
