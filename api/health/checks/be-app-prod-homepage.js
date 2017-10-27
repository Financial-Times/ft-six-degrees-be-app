'use strict';

module.exports = {
	url: 'http://ft-six-degrees-be-app-prod.herokuapp.com/api/test',
	summary: {
		name: 'FT Six Degrees BE App (Prod) API test endpoint',
		severity: 3,
		businessImpact:
			'The FT Six Degrees BE App (Prod) not accessible to end users.',
		technicalSummary:
			'Tests if it is possible to get a response from the API.',
		panicGuide:
			'Check the app state at https://dashboard.heroku.com/apps/ft-six-degrees-be-app-prod or build state at https://circleci.com/gh/Financial-Times/ft-six-degrees-be-app'
	}
};
