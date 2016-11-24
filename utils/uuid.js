'use strict';

const apiAddress = 'http://api.ft.com/things/',
    ftAddress = 'http://www.ft.com/things/';

class Uuid {

    decorate(id) {
        return apiAddress + id;
    }

    extract(id) {
        return id.replace(apiAddress, '').replace(ftAddress, '');
    }
}

module.exports = new Uuid();
