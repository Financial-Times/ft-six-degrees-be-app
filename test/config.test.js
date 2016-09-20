const CONFIG = require('../config').get(),
    expect = require('chai').expect;

describe('CONFIG', function () {
    describe('points at local machine', function () {

        it('should return local IP', function () {
            expect(CONFIG.URL).to.equal('127.0.0.1');
        });

    });
});
