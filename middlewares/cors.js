'use strict';

module.exports = (request, response, next) => {
	response.header('Access-Control-Allow-Origin', '*');
	response.header(
		'Access-Control-Allow-Methods',
		'GET,PUT,POST,DELETE,OPTIONS'
	);
	response.header(
		'Access-Control-Allow-Headers',
		'Content-Type,Authorization,withCredentials'
	);
	next();
};
