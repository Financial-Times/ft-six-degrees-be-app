const expect = require('chai').expect,
    sinon = require('sinon'),
    moment = require('moment'),
    CONFIG = require('../config').get(),
    responder = require('../api/common/responder'),
    Health = require('../api/health');

describe('API Health', function () {

    it('sends healthy response to client', function () {
        const timestamp = moment().format(),
            responseMock = {},
            responseDataMock = {
                status: 200,
                data: {
                    name: CONFIG.APP,
                    active: true,
                    time: timestamp
                }
            };

        sinon.stub(responder, 'send', function (response, responseData) {
            expect(responseData).to.eql(responseDataMock);
        });

        Health.check(responseMock);

        sinon.assert.calledOnce(responder.send);
        sinon.assert.calledWith(responder.send, responseMock, responseDataMock);

        responder.send.restore();

    });

});


