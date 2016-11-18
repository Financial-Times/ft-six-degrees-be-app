'use strict';

if (require('fs-extra').existsSync('.env.json')) {//eslint-disable-line no-sync
    require('dot-env');
}

const app = require('express')(),
    CONFIG = require('./config'),
    handlerFor404 = require('./middlewares/404'),
    middlewares = require('./middlewares'),
    Api = require('./api'),
    //Poller = require('./poller'),
    winston = require('./winston-logger');

app.listen(CONFIG.PORT, function () {
    winston.logger.info('[boot] Running server on port ' + CONFIG.PORT + '...');
});

middlewares.configure(app);
app.use(handlerFor404);

//Poller.init();

//app.all('/api/:command', Api.handle);
//app.all('/api/:command/:key', Api.handle);
//app.get('/__health', Api.healthcheck);

//Poller.init();




