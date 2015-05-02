'use strict';

(function() {
	// Authentication controller Spec
	describe('AuthenticationController', function() {
		// Initialize global variables
		var AuthenticationController,
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
			AuthenticationController = $controller('AuthenticationController', {
				$scope: scope
			});
		}));

		it('$scope.signin() debe logear con un usuario y password correcto', function() {
			// Test expected GET request
			$httpBackend.when('POST', '/auth/signin').respond(200, 'Fred');

			scope.signin();
			$httpBackend.flush();

			// Test scope value
			expect(scope.authentication.user).toEqual('Fred');
			expect($location.url()).toEqual('/');
		});


		it('$scope.signin() deberia fallar al loguearse sin ningun dato', function() {
			// Test expected POST request
			$httpBackend.expectPOST('/auth/signin').respond(400, {
				'message': 'Falta de datos de logueo'
			});

			scope.signin();
			$httpBackend.flush();

			// Test scope value
			expect(scope.error).toEqual('Falta de datos de logueo');
		});


		it('$scope.signin() Debe fallar al loguearse con credenciales erroneas', function() {
			// Foo/Bar combo assumed to not exist
			scope.authentication.user = 'Foo';
			scope.credentials = 'Bar';

			// Test expected POST request
			$httpBackend.expectPOST('/auth/signin').respond(400, {
				'message': 'Unknown user'
			});

			scope.signin();
			$httpBackend.flush();

			// Test scope value
			expect(scope.error).toEqual('Unknown user');
		});

		it('$scope.signup() Se debe registrar con datos correctos', function() {
			// Test expected GET request
			scope.authentication.user = 'Fred';
			$httpBackend.when('POST', '/auth/signup').respond(200, 'Fred');

			scope.signup();
			$httpBackend.flush();

			// test scope value
			expect(scope.authentication.user).toBe('Fred');
			expect(scope.error).toEqual(undefined);
			expect($location.url()).toBe('/');
		});

		it('$scope.signup() Debe fallar al registrar un usuario repetido', function() {
			// Test expected POST request
			$httpBackend.when('POST', '/auth/signup').respond(400, {
				'message': 'Username already exists'
			});

			scope.signup();
			$httpBackend.flush();

			// Test scope value
			expect(scope.error).toBe('Username already exists');
		});
	});
}());