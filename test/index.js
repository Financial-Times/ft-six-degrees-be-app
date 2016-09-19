'use strict';

const vows = require('vows'),
    assert = require('assert');

require('./config.test')(vows, assert);
require('./json-handler.test')(vows, assert);
