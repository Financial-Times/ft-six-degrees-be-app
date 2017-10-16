'use strict';

const AnnotatedArticles = require('../common/annotated-articles'),
	mentionedPeopleArticlesStorage = require('../../cache/mentioned-people-articles-storage');

class MentionedPeopleArticles extends AnnotatedArticles {
	constructor() {
		super(
			'[parsers-mentioned-people-articles]',
			mentionedPeopleArticlesStorage
		);
	}
}

module.exports = new MentionedPeopleArticles();
