'use strict';

const PeopleData = require('../common/people-data'),
    personalisedPeopleArticlesParser = require('./articles');

class MentionedPeopleParser extends PeopleData {

    constructor() {
        super(personalisedPeopleArticlesParser);
    }
}

module.exports = new MentionedPeopleParser();
