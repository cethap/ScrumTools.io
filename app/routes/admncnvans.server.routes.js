'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var admncnvans = require('../../app/controllers/admncnvans.server.controller');

	// Admncnvans Routes
	app.route('/admncnvans')
		.get(admncnvans.list)
		.post(users.requiresLogin, admncnvans.create);

	app.route('/admncnvans/:admncnvanId')
		.get(admncnvans.read)
		.put(users.requiresLogin, admncnvans.hasAuthorization, admncnvans.update)
		.delete(users.requiresLogin, admncnvans.hasAuthorization, admncnvans.delete);

	// Finish by binding the Admncnvan middleware
	app.param('admncnvanId', admncnvans.admncnvanByID);
};
