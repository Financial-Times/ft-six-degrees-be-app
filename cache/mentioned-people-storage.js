'use strict';

const PeopleStorage = require('./classes/people-storage'),
    mentionedPeopleParser = require('../parsers/mentioned-people/'),
    mentionedPeopleArticlesStorage = require('./mentioned-people-articles-storage');

class MentionedPeopleStorage extends PeopleStorage {

    constructor() {
        super('[cache-mentioned-people-storage]', mentionedPeopleParser, mentionedPeopleArticlesStorage);
    }

}

module.exports = new MentionedPeopleStorage();
