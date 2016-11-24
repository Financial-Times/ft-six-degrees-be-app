'use strict';

const responder = require('./common/responder'),
    Health = require('../api/health'),
    Test = require('../api/test'),
    Connections = require('./connections'),
    MentionedPeople = require('./mentioned-people'),
    PersonalisedPeople = require('./personalised-people'),
    PersonArticles = require('./person-articles'),
    Session = require('./user/session'),
    winston = require('../winston-logger'),
    apiRoutes = {
        GET: {
            'connections': Connections.get,
            'mentioned': MentionedPeople.get,
            'person-articles': PersonArticles.get,
            'people-history': PersonalisedPeople.get,
            'session': Session.get,
            'test': Test.check
        },
        POST: {}
    };

class Api {
    handle(request, response) {
        const command = request.params ? request.params.command : undefined,
            isApiRoute = request.url.indexOf('/api/') !== -1,
            requestMethod = request.method,
            routes = apiRoutes[requestMethod];

        if (isApiRoute && command) {

            if (!process.env.TEST) {
                winston.logger.info('[api] API ' + requestMethod + ' request detected. Route: /' + command + '/');
            }

            if (routes[command]) {
                routes[command](request, response);
            } else {
                responder.reject(response);
            }

        } else {
            responder.reject(response);
        }
    }

    healthcheck(request, response) {
        Health.check(request, response);
    }
}

module.exports = new Api();
