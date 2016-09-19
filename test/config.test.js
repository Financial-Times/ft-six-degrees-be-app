const CONFIG = require('../config').get();

module.exports = (vows, assert) => {
    vows.describe('CONFIG').addBatch({
        'points at local machine': {
            'returns local IP': function () {
                assert.equal(CONFIG.URL, '127.0.0.1');
            }
        }
    }).run();
};
