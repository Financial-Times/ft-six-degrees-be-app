(function () {
    'use strict';

    const fs = require('fs-extra');

    if (fs.existsSync('.env.json')) {//eslint-disable-line no-sync
        require('dot-env');
    }

    require('./boot').start();

}());
