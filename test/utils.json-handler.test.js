const expect = require('chai').expect,
    JsonHandler = require('../utils/json-handler');

function parse(string) {
    return JsonHandler.parse(string, true);
}

describe('API JsonHandler', function () {
    describe('parses input and', function () {

        it('should return json object if correct string has been provided', function () {
            expect(parse('{}')).to.be.an('object').and.to.be.empty; //eslint-disable-line no-unused-expressions
        });

        it('should return null if incorrect string has been provided', function () {
            expect(parse('{xyz}')).to.equal(null);
        });

    });
});


