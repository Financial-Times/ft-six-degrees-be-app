'use strict';

const moment = require('moment');

class DatesHandler {

    getRange(key, format) {
        format = format || 'YYYY-MM-DD';
        let dateParams = key.split(' ');

        const today = moment().startOf('day');
        const fromDate = moment(today).subtract(parseInt((dateParams[1] ? dateParams[0] : 1), 10), dateParams[1] || 'months');

        return [fromDate.format(format), today.format(format)];
    }
}

module.exports = new DatesHandler();
