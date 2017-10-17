'use strict';

const isString = require('lodash/isString');
const differenceBy = require('lodash/differenceBy');

const containsSameIds = (sourceArr, destArr) => {
	if (isString(sourceArr)) {
		sourceArr = JSON.parse(sourceArr);
	}
	if (isString(destArr)) {
		destArr = JSON.parse(destArr);
	}
	const diff = differenceBy(sourceArr, destArr, 'id');
	return diff.length === 0;
};

module.exports = {
	containsSameIds
};
