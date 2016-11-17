'use strict';

const MentionedPeoplePoller = require('./mentioned-people');

class Poller {

    init() {
        MentionedPeoplePoller.start();
    }

}

module.exports = new Poller();
