const expect = require('chai').expect,
    sinon = require('sinon'),
    moment = require('moment'),
    CONFIG = require('../config'),
    responder = require('../api/common/responder'),
    Health = require('../api/health'),
    Test = require('../api/test'),
    noop = function () {
        return;
    },
    configStub = {
        url: 'http://www.ft.com/',
        summary: {
            name: 'FT.com',
            severity: 0,
            businessImpact: 'xyz',
            technicalSummary: 'xyz',
            panicGuide: 'xyz'
        }
    },
    resultStub = [{}],
    resultMock = {
        _links: {
            self: {
                href: 'xyz://xyz.com/xyz'
            }
        },
        checks: resultStub,
        description: CONFIG.DESCRIPTION,
        name: CONFIG.SYSTEM_CODE,
        requestTime: '2016-09-27T10:59:26Z',
        schemaVersion: 1,
        systemCode: CONFIG.SYSTEM_CODE
    };

beforeEach(function () {
    Health.prime(configStub, resultStub);
});

describe('API Health', function () {

    const timestamp = moment().utc().format(),
        requestMock = {
            get: noop,
            originalUrl: '/xyz',
            protocol: 'xyz'
        },
        responseMock = {
            header: noop,
            json: noop
        };

    resultMock.requestTime = timestamp;

    beforeEach(function () {
        sinon.stub(requestMock, 'get', function () {
            return 'xyz.com';
        });
        sinon.stub(responseMock, 'header');
        sinon.stub(responseMock, 'json');
    });

    afterEach(function () {
        sinon.assert.calledOnce(requestMock.get);
        sinon.assert.calledWith(requestMock.get, 'host');

        sinon.assert.calledThrice(responseMock.header);

        sinon.assert.calledOnce(responseMock.json);
        sinon.assert.calledWith(responseMock.json, resultMock);

        requestMock.get.restore();
        responseMock.header.restore();
        responseMock.json.restore();
    });

    it ('checks and provides an health state of the dependant services in correct format', function () {
        Health.check(requestMock, responseMock, timestamp);
    });

    // it('checks health state of the FT Six Degrees FE App (Prod) landing page') {
    //     expect(true).toEqual(true);
    // }
});

describe('API Test', function () {

    it('sends healthy response to client', function () {
        const timestamp = moment().format(),
            responseMock = {},
            responseDataMock = {
                status: 200,
                data: {
                    name: CONFIG.DESCRIPTION,
                    time: timestamp
                }
            };

        sinon.stub(responder, 'send', function (response, responseData) {
            expect(responseData).to.eql(responseDataMock);
        });

        Test.check({}, responseMock);

        sinon.assert.calledOnce(responder.send);
        sinon.assert.calledWith(responder.send, responseMock, responseDataMock);

        responder.send.restore();

    });

});


