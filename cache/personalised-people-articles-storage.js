const ArticlesStorage = require('./classes/articles-storage');

class PeopleArticlesStorage extends ArticlesStorage {

    constructor() {
        super('[cache-personalised-people-articles-storage]');
    }

}

module.exports = new PeopleArticlesStorage();
