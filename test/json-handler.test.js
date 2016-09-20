const expect = require('chai').expect,
    JsonHandler = require('../api/common/json-handler');

describe('JsonHandler', function () {
    describe('parses input and', function () {

        it('should return json object if correct string has been provided', function () {
            const parsed = JsonHandler.parse('{}', true);
            expect(JSON.stringify(parsed)).to.equal(JSON.stringify({}));
        });

        it('should return null if incorrect string has been provided', function () {
            const parsed = JsonHandler.parse('{xyz}', true);
            expect(parsed).to.equal(null);
        });

    });
});


