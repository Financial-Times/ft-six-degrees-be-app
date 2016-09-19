var vows = require('vows'),
    assert = require('assert'),
    CONFIG = require('../config').get();

vows.describe('CONFIG').addBatch({
    'points at local machine': {
        'returns local IP': function () {
            assert.equal(CONFIG.URL, '127.0.0.1');
        }
    }
}).run();
