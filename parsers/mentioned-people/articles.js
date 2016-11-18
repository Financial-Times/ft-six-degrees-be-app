'use strict';

console.log('IN ARTICLES');

const request = require('request'),
    winston = require('../../winston-logger'),
    peopleArticlesStorage = require('../../cache/people-articles-storage');

function getArticles(person) {
    return new Promise(function (resolve, reject) {
        request(process.env.FT_API_URL + 'content?isAnnotatedBy=' + person.id, {
            headers: {
                'x-api-key': process.env.FT_API_KEY
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
