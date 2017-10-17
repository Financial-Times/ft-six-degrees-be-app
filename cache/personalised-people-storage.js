'use strict';

const PeopleStorage = require('./classes/people-storage'),
	personalisedPeopleParser = require('../parsers/personalised-people/'),
	personalisedPeopleArticlesStorage = require('./personalised-people-articles-storage');

class PersonalisedPeopleStorage extends PeopleStorage {
	constructor() {
		super(
			'[cache-personalised-people-storage]',
			personalisedPeopleParser,
			personalisedPeopleArticlesStorage
		);
	}
}

module.exports = new PersonalisedPeopleStorage();
