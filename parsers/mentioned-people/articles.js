'use strict';

const request = require('request'),
    winston = require('../../winston-logger'),
    peopleArticlesStorage = require('../../cache/people-articles-storage');

function getArticles(person) {
    return new Promise(function (resolve, reject) {
        request('https://api.ft.com/content?isAnnotatedBy=' + person.id, {
            headers: {
                'x-api-key': 'vg9u6GResCWNIwqGCdNZVaL7RdEOCtGo'
            }
        }, function (error, response, content) {
            if (error) {
                reject(error);
            } else {
                resolve({
                    id: person.id,
                    content: JSON.parse(content)
                });
            }
        });
    });
}

class MentionedPeopleArticles {
    handle(people, articlesCallback) {
        const actions = people && people.length ? people.map(getArticles) : [],
            results = actions.length ? Promise.all(actions) : null;

        if (results) {
            results.then(articles => {
                peopleArticlesStorage.cache(articles);
                articlesCallback();
            }).catch(error => {
                winston.logger.error('[parsers-mentioned-people-articles]\n\n' + error);
            });
        }
    }
}

module.exports = new MentionedPeopleArticles();
