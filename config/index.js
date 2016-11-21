'use strict';

const PACKAGE_JSON = require('../package.json');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // Avoids DEPTH_ZERO_SELF_SIGNED_CERT error for self-signed certs

module.exports = {
    PORT: process.env.PORT || 8080,
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
    API_KEY: {
        FT_CONTENT: process.env.FT_API_KEY,
        FT_RECOMMENDATIONS: process.env.FT_RECOMMENDATIONS_API_KEY,
        FT_SESSIONS: process.env.FT_SESSIONS_API_KEY,
        SIX_DEGREES: process.env.API_KEY_SIX_DEGREES
    },
    URL: {
        API: {
            ENRICHED_CONTENT: process.env.FT_API_URL + 'enrichedcontent/',
            FT_RECOMMENDATIONS_USERS: process.env.FT_RECOMMENDATIONS_USERS_API_URL,
            FT_SESSIONS: process.env.FT_SESSIONS_API_URL,
            SIX_DEGREES_MENTIONED: process.env.API_URL_SIX_DEGREES_MENTIONED
        }
    },
    SETTINGS: {
        POLLER: {
            INTERVAL: process.env.POLLER_INTERVAL || 5000
        }
    }
};

