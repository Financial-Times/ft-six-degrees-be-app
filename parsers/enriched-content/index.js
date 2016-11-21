'use strict';

const request = require('request'),
    winston = require('../../winston-logger'),
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

class EnrichedContent {

    getPeople(clientRes, history, key) {
        const articles = history.articles,
            actions = articles && articles.length ? articles.map(getEnrichedContent) : [],
            results = actions.length ? Promise.all(actions) : null;

        if (results) {
            results.then(enrichedcontent => {
                const annotatedPeople = [];

                enrichedcontent.map(content => {
                    content.annotations.map(annotation => {
                        if (annotation.type === 'PERSON') {
                            let alreadyInAnnotatedArray = false;

                            annotatedPeople.map(annotatedPerson => {
                                if (annotatedPerson.id === annotation.id) {
                                    alreadyInAnnotatedArray = true;
                                }
                            });

                            if (!alreadyInAnnotatedArray) {
                                annotatedPeople.push({
                                    id: annotation.id,
                                    prefLabel: annotation.prefLabel
                                });
                            }
                        }
                    });
                });

                personalisedPeopleStorage.cache(JSON.stringify(annotatedPeople), key, clientRes);

            }).catch(error => {
                winston.logger.error('[parsers-mentioned-people-articles]\n\n' + error);
            });
        }


    }

}

module.exports = new EnrichedContent();
