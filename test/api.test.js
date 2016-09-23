const expect = require('chai').expect,
    sinon = require('sinon'),
    Api = require('../api'),
    responder = require('../api/common/responder'),
    apiInterfaceMethods = ['handle'];

describe('API', function () {

    describe('contains interface that', function () {

        it('should have ' + apiInterfaceMethods.length + ' properties to handle requests', function () {
            apiInterfaceMethods.map(method => {
                expect(Api).to.have.property(method);
            });
        });

    });

    apiInterfaceMethods.map(method => {

        describe('has ' + method + ' method that', function () {

            beforeEach(function () {
                sinon.stub(responder, 'reject');
            });

            afterEach(function () {
                sinon.assert.calledOnce(responder.reject);
                responder.reject.restore();
            });

            it ('rejects requests with no route provided', function () {
                Api.handle({
                    url: '/api/'
                });
            });

            it ('rejects requests with unrecognized routes', function () {
                Api.handle({
                    url: '/api/xyz'
                });
            });

        });

    });

});
