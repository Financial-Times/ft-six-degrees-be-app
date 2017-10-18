'use strict';

const PeopleData = require('../common/people-data'),
	personalisedPeopleArticlesParser = require('./articles');

class PersonalisedPeopleParser extends PeopleData {
	constructor() {
		super(personalisedPeopleArticlesParser);
	}
}

module.exports = new PersonalisedPeopleParser();
