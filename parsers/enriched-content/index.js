'use strict';

const request = require('request'),
    winston = require('../../winston-logger'),
    uniqBy = require('lodash/uniqBy'),
    CONFIG = require('../../config'),
    personalisedPeopleStorage = require('../../cache/personalised-people-storage');

function getEnrichedContent(article) {
    return new Promise(function (resolve, reject) {
        request(CONFIG.URL.API.ENRICHED_CONTENT + article.id + '?apiKey=' + CONFIG.API_KEY.FT_CONTENT, {
            headers: {
                'x-api-key': process.env.FT_API_KEY
            }
        }, function (error, response, content) {
            if (error) {
                reject(error);
            } else {
                resolve(JSON.parse(content));
            }
        });
    });
}

const getAnnotationPredicate = predicate => {
    return predicate.substring(predicate.lastIndexOf('/') + 1, predicate.length);
};

class EnrichedContent {

    getPeople(clientRes, history, key) {
        const articles = uniqBy(history.articles, 'id'),
            actions = articles && articles.length ? articles.map(getEnrichedContent) : [],
            results = actions.length ? Promise.all(actions) : null;

        if (results) {
            results.then(enrichedcontent => {
                let annotatedPeople = [];

                enrichedcontent.map(content => {
                    content.annotations.map(annotation => {
                        if (annotation.type === 'PERSON' && getAnnotationPredicate(annotation.predicate) !== 'hasAuthor') {
							annotatedPeople.push({
								id: annotation.id,
								prefLabel: annotation.prefLabel
							});
						}
                    });
                });
                const uniqueAnnotatedPeople = uniqBy(annotatedPeople, 'id');

                personalisedPeopleStorage.cache(JSON.stringify(uniqueAnnotatedPeople), key, clientRes);

            }).catch(error => {
                winston.logger.error('[parsers-mentioned-people-articles]\n\n' + error);
            });
        }


    }

}

module.exports = new EnrichedContent();
