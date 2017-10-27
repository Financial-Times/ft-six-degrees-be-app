'use strict';

module.exports = {
	url: 'http://six-degrees.ft.com/',
	summary: {
		name: 'FT Six Degrees FE App (Prod) landing page',
		severity: 3,
		businessImpact:
			'The FT Six Degrees FE App (Prod) not accessible to end users.',
		technicalSummary: 'Tests if it is possible to load the Front-End SPA.',
		panicGuide:
			'Check the app state at https://dashboard.heroku.com/apps/ft-six-degrees-fe-app-prod or build state at https://circleci.com/gh/Financial-Times/ft-six-degrees-fe-app'
	}
};
