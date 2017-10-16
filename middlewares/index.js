'use strict';

const cors = require('cors');

function configure(app) {
	app.use(cors());
}

module.exports = {
	configure
};
