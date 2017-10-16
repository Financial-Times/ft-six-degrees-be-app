'use strict';

const app = require('express')(),
	CONFIG = require('./config'),
	handlerFor404 = require('./middlewares/404'),
	middlewares = require('./middlewares'),
	Api = require('./api'),
	Poller = require('./poller'),
	winston = require('./winston-logger');

app.listen(CONFIG.PORT, () => {
	winston.logger.info(`[boot] Running server on port ${CONFIG.PORT}...`);
});

middlewares.configure(app);

app.all('/api/:command', Api.handle);
app.all('/api/:command/:key', Api.handle);
app.all('/api/:command/:key/:uuid', Api.handle);
app.get('/__health', Api.healthcheck);

Poller.init();

app.use(handlerFor404);
