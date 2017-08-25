'use strict';

const moment = require('moment');

class DatesHandler {

    getRange(key, format) {
        format = format || 'YYYY-MM-DD';
        let dateParams = key.split(' ');

        let fromDate = null;
        const today = moment().startOf('day').format(format);
        if (dateParams.length < 2 || isNaN(parseInt(dateParams[0], 10))) {
            fromDate = moment().subtract(1, 'month');
        } else {
	        fromDate = moment()
		        .subtract(parseInt(dateParams[0] || 1, 10), dateParams[1] || 'months');
        }

        return [fromDate.format(format), today];
    }
}

module.exports = new DatesHandler();
