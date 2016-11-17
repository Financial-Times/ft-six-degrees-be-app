'use strict';

const PACKAGE_JSON = require('../package.json');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // Avoids DEPTH_ZERO_SELF_SIGNED_CERT error for self-signed certs

module.exports = {
    PORT: parseInt(process.env.PORT || 8080, 10),
    SYSTEM_CODE: PACKAGE_JSON.name,
    DESCRIPTION: PACKAGE_JSON.description,
    VER: process.env.APP_VERSION,
    APP_PATH: process.env.APP_PATH,
    TXT: {
        ERROR: {
            NO_DATA: 'Internal server error. No data available.'
        },
        SEARCH: {
            NO_RESULTS: 'No results found',
            SEARCH_AGAIN: 'Enter another location and search again',
            SEARCH_FOR_HOUSES: 'Search for houses and flats for sale across the UK'
        }
    },
    URL: {
        API: {
            SIX_DEGREES_MENTIONED: process.env.API_URL_SIX_DEGREES_MENTIONED
        }
    },
    SETTINGS: {
        POLLER: {
            INTERVAL: 5000
        }
    }
};

