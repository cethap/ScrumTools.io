'use strict';

(function() {
	// Authentication controller Spec
	describe('ProjectsViewController', function() {
		// Initialize global variables
		var ProjectsViewController,
			scope,
			$httpBackend,
			$stateParams,
			$location;

		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Load the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Authentication controller
			ProjectsViewController = $controller('ProjectsViewController', {
				$scope: scope
			});
		}));


		it('$scope.modalViewMembers() should login with a correct user and password', function() {
			// Test expected GET request
			$httpBackend.when('GET','modules/projects/views/members-project.client.view.html').respond(200, 'Fred');
			$httpBackend.when('GET','/projects/1/members').respond(200, 'Fred');

			scope.modalViewMembers(2,{_id:1});
			//console.log(scope.a);

			$httpBackend.flush();
			// Test scope value
			expect(scope.r).toEqual('Fred');
		});

	});
}());