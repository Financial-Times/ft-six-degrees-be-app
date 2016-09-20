const expect = require('chai').expect,
    Cache = require('../api/common/cache'),
    CACHE_DEFAULT_PROPERTIES = ['people', 'connections', 'users'],
    DELAY = 1000;

describe('API Cache', function () {

    describe('contains storage property that', function () {

        it('should be an object', function () {
            expect(Cache.storage).to.be.an('object');
        });

        it('should have ' + CACHE_DEFAULT_PROPERTIES.length + ' properties that are empty objects by default', function () {
            expect(Cache).to.have.property('storage');

            CACHE_DEFAULT_PROPERTIES.map(property => {
                expect(Cache.storage).to.have.property(property);
                expect(Cache.storage[property]).to.be.empty; //eslint-disable-line no-unused-expressions
            });
        });

    });

    describe('contains handle property that', function () {

        it('should be a method', function () {
            expect(Cache.handle).to.be.a('function');
        });

        it('should not handle calls with incorrect id provided', function () {
            expect(Cache.handle('xyz')).to.equal(null);
        });

        it('should handle calls with correct id provided', function () {
            CACHE_DEFAULT_PROPERTIES.map(property => {
                expect(Cache.handle(property)).to.be.an('object');
            });
        });

    });

    describe('contains storage property that', function () {
        describe('contains properties that', function () {

            it('should have initial time / moment object stored in a start property after first handling', function () {
                CACHE_DEFAULT_PROPERTIES.map(property => {
                    expect(Cache.storage[property].start).to.be.an('object');
                });
            });

            it('should reset stored data and remove initial time if period is longer than provided', function () {
                this.timeout(DELAY);
                setTimeout(function () {
                    CACHE_DEFAULT_PROPERTIES.map(property => {
                        Cache.handle(property, 'second');
                        expect(Cache.storage[property]).to.be.empty; //eslint-disable-line no-unused-expressions
                    });
                }, DELAY);

            });

        });

    });

});
