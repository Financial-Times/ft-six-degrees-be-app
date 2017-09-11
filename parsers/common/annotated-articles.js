'use strict';

const request = require('request'),
      uniqBy = require('lodash/uniqBy'),
      datesHandler = require('../../utils/dates-handler'),
    winston = require('../../winston-logger');

function getArticles(person, key) {
    const dates = key ? datesHandler.getRange(key) : ['', ''];
    return new Promise(function (resolve, reject) {
        request(process.env.FT_API_URL + 'content?isAnnotatedBy=' + person.id + '&fromDate=' + dates[0] + '&toDate=' + dates[1], {
            headers: {
                'x-api-key': process.env.FT_API_KEY
            }
        }, function (error, response, content) {
            if (error) {
                reject(error);
            } else {
                const uniqueContent = uniqBy(JSON.parse(content), 'id').filter(item => item.hasOwnProperty('id'));
                resolve({
                    id: person.id,
                    content: uniqueContent
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

    handle(people, articlesCallback, key) {

        const actions = people && people.length ? people.map(person => getArticles(person, key)) : [],
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
