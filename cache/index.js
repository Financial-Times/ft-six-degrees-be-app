'use strict';

const ContentStorage = require('./content-storage'),
	MentionedPeopleStorage = require('./mentioned-people-storage'),
	MentionedPeopleArticlesStorage = require('./mentioned-people-articles-storage'),
	PersonalisedPeopleArticlesStorage = require('./personalised-people-articles-storage'),
	storages = {
		'content-storage': ContentStorage,
		'mentioned-people': MentionedPeopleStorage,
		'mentioned-people-articles': MentionedPeopleArticlesStorage,
		'personalised-people-articles': PersonalisedPeopleArticlesStorage
	};

class Cache {
	get(storage, key, userId) {
		return storages[storage].get(key, userId);
	}

	store(storage, data, key) {
		storages[storage].cache(data, key);
	}
}

module.exports = new Cache();
