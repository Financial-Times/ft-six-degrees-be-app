'use strict';

const cors = require('cors');
const expressWebService = require('@financial-times/express-web-service');
const healthcheck = require('../api/health');

function configure(app) {
	app.use(cors());
	app.use(
		expressWebService({
			about: {
				schemaVersion: 1,
				name: 'six-degrees-backend',
				purpose:
					'Provide a proxy api for Six Degrees Application',
				audience: 'public',
				primaryUrl: '',
				serviceTier: 'bronze'
			},
			goodToGoTest: () => true,
			healthCheck: () =>
				healthcheck
					.getChecks()
					.catch(err => {
						console.log(err);
						return [
							{
								name: 'Healthcheck',
								ok: false,
								severity: 2,
								businessImpact:
									'Some areas of the application might be unavailable due to this issue.',
								technicalSummary:
									'Healthcheck is not available.',
								panicGuide:
									'Check the logs of the application, try to restart it from heroku.',
								checkOutput: 'Healthcheck generation failed.',
								lastUpdated: new Date().toISOString()
							}
						];
					})
		})
	);
}

module.exports = {
	configure
};
