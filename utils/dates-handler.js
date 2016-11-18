'use strict';
console.log('IN DATES HANDLER');
// const moment = require('moment');

// class DatesHandler {

//     getRange(key, format = 'YYYY-MM-DD') {
//         const reference = moment(),
//             today = reference.clone().startOf('day').format(format),
//             yesterday = reference.clone().subtract(1, 'days').startOf('day').format(format),
//             weekAgo = reference.clone().subtract(7, 'days').startOf('day').format(format),
//             monthAgo = reference.clone().subtract(30, 'days').startOf('day').format(format),
//             yearAgo = reference.clone().subtract(365, 'days').startOf('day').format(format);

//         let fromDate;

//         switch (key) {
//         case 'day':
//             fromDate = yesterday;
//             break;
//         case 'month':
//             fromDate = monthAgo;
//             break;
//         case 'year':
//             fromDate = yearAgo;
//             break;
//         default:
//             fromDate = weekAgo;
//             break;
//         }

//         return [fromDate, today];
//     }
// }

// module.exports = new DatesHandler();
