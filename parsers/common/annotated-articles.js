'use strict';

const request = require('request'),
    winston = require('../../winston-logger');

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

class AnnotatedArticles {
    constructor(description, articlesStorage) {
        this.description = description;
        this.articlesStorage = articlesStorage;
    }

    handle(people, articlesCallback) {

        const actions = people && people.length ? people.map(getArticles) : [],
            results = actions.length ? Promise.all(actions) : null;

        if (results) {
            results.then(articles => {
                this.articlesStorage.cache(articles);
                articlesCallback();
            }).catch(error => {
                winston.logger.error(this.description + '\n\n' + error);
            });
        }
    }
}

module.exports = AnnotatedArticles;
