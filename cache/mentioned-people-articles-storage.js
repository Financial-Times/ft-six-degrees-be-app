'use strict';

const ArticlesStorage = require('./classes/articles-storage');

class PeopleArticlesStorage extends ArticlesStorage {
	constructor() {
		super('[cache-mentioned-people-articles-storage]');
	}
}

module.exports = new PeopleArticlesStorage();
