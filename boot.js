'use strict';

const app = require('express')();
const apicache = require('apicache');
const CONFIG = require('./config');
const handlerFor404 = require('./middlewares/404');
const middlewares = require('./middlewares');
const Poller = require('./poller');
const Api = require('./api');
const winston = require('./winston-logger');

apicache.options({debug: true});
const cache = apicache.middleware;

app.listen(CONFIG.PORT, () => {
	winston.logger.info(`[boot] Running server on port ${CONFIG.PORT}...`);
});

middlewares.configure(app);

app.all('/api/:command', Api.handle);
app.all('/api/:command/:key', cache('30 minutes'), Api.handle);
app.all('/api/:command/:key/:uuid/:userId?', cache('20 minutes'), Api.handle);
app.get('/__health', Api.healthcheck);

Poller.init();

app.use(handlerFor404);
