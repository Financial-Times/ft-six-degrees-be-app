const CONFIG = require('../config'),
    expect = require('chai').expect;

describe('CONFIG', function () {
    describe('points at local machine', function () {

        it('should contain data for healthcheck - system code', function () {
            expect(CONFIG.SYSTEM_CODE).to.equal('ft-six-degrees-be-app');
        });

        it('should contain data for healthcheck - description', function () {
            expect(CONFIG.DESCRIPTION).to.equal('FT Six Degrees BE Proxy App');
        });

    });
});
