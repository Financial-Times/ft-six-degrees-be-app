'use strict';

const PeopleData = require('../common/people-data'),
	mentionedPeopleArticlesParser = require('./articles');

class MentionedPeopleParser extends PeopleData {
	constructor() {
		super(mentionedPeopleArticlesParser);
	}
}

module.exports = new MentionedPeopleParser();
