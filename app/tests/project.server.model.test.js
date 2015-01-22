'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	Project = mongoose.model('Project');

/**
 * Globals
 */
var project, project2;

/**
 * Unit tests
 */
describe('Project Model Unit Tests:', function() {
	before(function(done) {
		project = new Project({
			projectName: 'Full',
			startTime: new Date(),
			endTime: new Date()
		});

		done();
	});

	describe('Metodo Guardar', function() {
		it('Debe no existir el proyecto de ejemplo', function(done) {
			Project.find({projectName:'Full'}, function(err, projects) {
				projects.should.have.length(0);
				done();
			});
		});

		it('Debe guardar sin problemas', function(done) {
			project.save(done);
		});

		it('Debe mostrar un error cuando intenta grabar proyecto sin nombre', function(done) {
			project.projectName = '';
			return project.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	after(function(done) {
		Project.find({projectName:'Full'}).remove().exec();
		done();
	});
});