'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Admncnvan = mongoose.model('Admncnvan'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, admncnvan;

/**
 * Admncnvan routes tests
 */
describe('Admncnvan CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Admncnvan
		user.save(function() {
			admncnvan = {
				name: 'Admncnvan Name'
			};

			done();
		});
	});

	it('should be able to save Admncnvan instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Admncnvan
				agent.post('/admncnvans')
					.send(admncnvan)
					.expect(200)
					.end(function(admncnvanSaveErr, admncnvanSaveRes) {
						// Handle Admncnvan save error
						if (admncnvanSaveErr) done(admncnvanSaveErr);

						// Get a list of Admncnvans
						agent.get('/admncnvans')
							.end(function(admncnvansGetErr, admncnvansGetRes) {
								// Handle Admncnvan save error
								if (admncnvansGetErr) done(admncnvansGetErr);

								// Get Admncnvans list
								var admncnvans = admncnvansGetRes.body;

								// Set assertions
								(admncnvans[0].user._id).should.equal(userId);
								(admncnvans[0].name).should.match('Admncnvan Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Admncnvan instance if not logged in', function(done) {
		agent.post('/admncnvans')
			.send(admncnvan)
			.expect(401)
			.end(function(admncnvanSaveErr, admncnvanSaveRes) {
				// Call the assertion callback
				done(admncnvanSaveErr);
			});
	});

	it('should not be able to save Admncnvan instance if no name is provided', function(done) {
		// Invalidate name field
		admncnvan.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Admncnvan
				agent.post('/admncnvans')
					.send(admncnvan)
					.expect(400)
					.end(function(admncnvanSaveErr, admncnvanSaveRes) {
						// Set message assertion
						(admncnvanSaveRes.body.message).should.match('Please fill Admncnvan name');
						
						// Handle Admncnvan save error
						done(admncnvanSaveErr);
					});
			});
	});

	it('should be able to update Admncnvan instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Admncnvan
				agent.post('/admncnvans')
					.send(admncnvan)
					.expect(200)
					.end(function(admncnvanSaveErr, admncnvanSaveRes) {
						// Handle Admncnvan save error
						if (admncnvanSaveErr) done(admncnvanSaveErr);

						// Update Admncnvan name
						admncnvan.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Admncnvan
						agent.put('/admncnvans/' + admncnvanSaveRes.body._id)
							.send(admncnvan)
							.expect(200)
							.end(function(admncnvanUpdateErr, admncnvanUpdateRes) {
								// Handle Admncnvan update error
								if (admncnvanUpdateErr) done(admncnvanUpdateErr);

								// Set assertions
								(admncnvanUpdateRes.body._id).should.equal(admncnvanSaveRes.body._id);
								(admncnvanUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Admncnvans if not signed in', function(done) {
		// Create new Admncnvan model instance
		var admncnvanObj = new Admncnvan(admncnvan);

		// Save the Admncnvan
		admncnvanObj.save(function() {
			// Request Admncnvans
			request(app).get('/admncnvans')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Admncnvan if not signed in', function(done) {
		// Create new Admncnvan model instance
		var admncnvanObj = new Admncnvan(admncnvan);

		// Save the Admncnvan
		admncnvanObj.save(function() {
			request(app).get('/admncnvans/' + admncnvanObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', admncnvan.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Admncnvan instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Admncnvan
				agent.post('/admncnvans')
					.send(admncnvan)
					.expect(200)
					.end(function(admncnvanSaveErr, admncnvanSaveRes) {
						// Handle Admncnvan save error
						if (admncnvanSaveErr) done(admncnvanSaveErr);

						// Delete existing Admncnvan
						agent.delete('/admncnvans/' + admncnvanSaveRes.body._id)
							.send(admncnvan)
							.expect(200)
							.end(function(admncnvanDeleteErr, admncnvanDeleteRes) {
								// Handle Admncnvan error error
								if (admncnvanDeleteErr) done(admncnvanDeleteErr);

								// Set assertions
								(admncnvanDeleteRes.body._id).should.equal(admncnvanSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Admncnvan instance if not signed in', function(done) {
		// Set Admncnvan user 
		admncnvan.user = user;

		// Create new Admncnvan model instance
		var admncnvanObj = new Admncnvan(admncnvan);

		// Save the Admncnvan
		admncnvanObj.save(function() {
			// Try deleting Admncnvan
			request(app).delete('/admncnvans/' + admncnvanObj._id)
			.expect(401)
			.end(function(admncnvanDeleteErr, admncnvanDeleteRes) {
				// Set message assertion
				(admncnvanDeleteRes.body.message).should.match('User is not logged in');

				// Handle Admncnvan error error
				done(admncnvanDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Admncnvan.remove().exec();
		done();
	});
});