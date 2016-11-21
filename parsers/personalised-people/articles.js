'use strict';

const AnnotatedArticles = require('../common/annotated-articles'),
    personalisedPeopleArticlesStorage = require('../../cache/personalised-people-articles-storage');

class PersonalisedPeopleArticles extends AnnotatedArticles {
    constructor() {
        super('[parsers-personalised-people-articles]', personalisedPeopleArticlesStorage);
    }
}

module.exports = new PersonalisedPeopleArticles();
