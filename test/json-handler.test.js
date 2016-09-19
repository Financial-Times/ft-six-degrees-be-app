const JsonHandler = require('../api/common/json-handler');

module.exports = (vows, assert) => {
    vows.describe('JsonHandler').addBatch({
        'parses input and': {
            'returns Json object if correct string has been provided': function () {
                const parsed = JsonHandler.parse('{}', true);
                assert.equal(JSON.stringify(parsed), JSON.stringify({}));
            },
            'returns null if incorrect string has been provided': function () {
                const parsed = JsonHandler.parse('{xyz}', true);
                assert.equal(parsed, null);
            }
        }
    }).run();
};

