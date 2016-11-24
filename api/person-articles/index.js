'use strict';

const moment = require('moment'),
    request = require('request'),
    responder = require('../common/responder'),
    cache = require('../../cache'),
    contentStorage = require('../../cache/content-storage'),
    jsonHandler = require('../../utils/json-handler'),
    uuidUtils = require('../../utils/uuid'),
    CONFIG = require('../../config');

function respond(response, data) {
    responder.send(response, {
        status: 200,
        data: data
    });
}

function getSliced(articles) {
    articles = typeof articles === 'string' ? jsonHandler.parse(articles) : articles;
    return [].concat(articles).slice(0, 5);
}

function fetchSingle(item) {
    return new Promise(function (resolve, reject) {
        request(CONFIG.URL.API.CONTENT + 'content/' + uuidUtils.extract(item.id) + '?apiKey=' + CONFIG.API_KEY.FT_CONTENT, function (err, res) {
            if (err) {
                reject(err);
            } else {
                const body = jsonHandler.parse(res.body);

                if (body && body.mainImage && body.mainImage.id) {
                    const uuid = body.mainImage.id.replace('http', 'https').replace(CONFIG.URL.API.CONTENT + 'content/', '');

                    request({
                        url: CONFIG.URL.API.CONTENT + uuid + '?apiKey=' + CONFIG.API_KEY.FT_CONTENT
                    }, (imagesError, imagesResponse, imagesBody) => {
                        imagesBody = jsonHandler.parse(imagesBody);
                        if (imagesBody.members) {
                            const memberUuid = imagesBody.members[0].id.replace('http', 'https').replace(CONFIG.URL.API.CONTENT + 'content/', '');
                            request({
                                url: CONFIG.URL.API.CONTENT + memberUuid + '?apiKey=' + CONFIG.API_KEY.FT_CONTENT
                            }, (imageError, imageResponse, imageBody) => {
                                imageBody = jsonHandler.parse(imageBody);
                                body.binaryUrl = imageBody.binaryUrl;
                                body.imageUrl = body.binaryUrl;
                                resolve(body);
                            });
                        } else {
                            resolve(body);
                        }
                    });
                } else {
                    resolve(body);
                }
            }
        });
    });
}

function getAll(uuid, key, content, clientResponse) {

    const actions = content && content.map ? content.map(fetchSingle) : [],
        results = actions.length ? Promise.all(actions) : null;

    if (results) {
        results.then(articles => {
            contentStorage.cache(moment().format('YYYY-MM-DD'), uuid, key, articles);
            respond(clientResponse, getSliced(articles));
        }).catch(() => {
            responder.rejectBadGateway(clientResponse);
        });
    } else {
        respond(clientResponse, []);
    }

}

class PeopleArticles {

    get(req, res) {
        const date = moment().format('YYYY-MM-DD'),
            uuid = req.params.uuid,
            key = req.params.key,
            stored = contentStorage.get(date, uuid, key);

        if (!uuid) {
            responder.reject(res);
        } else {
            if (stored) {
                respond(res, getSliced(stored));
            } else {
                const mentionedPeopleArticles = cache.get('mentioned-people-articles'),
                    personalisedPeopleArticles = cache.get('personalised-people-articles'),
                    cachedArticles = [].concat(mentionedPeopleArticles, personalisedPeopleArticles),
                    articles = cachedArticles && cachedArticles.length ? cachedArticles.filter(set => {
                        return set.id === uuidUtils.decorate(uuid);
                    }) : [];

                if (articles.length) {
                    const content = [].concat(articles[0].content);
                    getAll(uuid, key, content, res);
                } else {
                    respond(res, []);
                }
            }
        }
    }
}

module.exports = new PeopleArticles();
