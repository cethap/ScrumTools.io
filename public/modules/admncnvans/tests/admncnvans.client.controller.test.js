'use strict';

(function() {
	// Admncnvans Controller Spec
	describe('Admncnvans Controller Tests', function() {
		// Initialize global variables
		var AdmncnvansController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
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

		// Then we can start by loading the main application module
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

			// Initialize the Admncnvans controller.
			AdmncnvansController = $controller('AdmncnvansController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Admncnvan object fetched from XHR', inject(function(Admncnvans) {
			// Create sample Admncnvan using the Admncnvans service
			var sampleAdmncnvan = new Admncnvans({
				name: 'New Admncnvan'
			});

			// Create a sample Admncnvans array that includes the new Admncnvan
			var sampleAdmncnvans = [sampleAdmncnvan];

			// Set GET response
			$httpBackend.expectGET('admncnvans').respond(sampleAdmncnvans);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.admncnvans).toEqualData(sampleAdmncnvans);
		}));

		it('$scope.findOne() should create an array with one Admncnvan object fetched from XHR using a admncnvanId URL parameter', inject(function(Admncnvans) {
			// Define a sample Admncnvan object
			var sampleAdmncnvan = new Admncnvans({
				name: 'New Admncnvan'
			});

			// Set the URL parameter
			$stateParams.admncnvanId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/admncnvans\/([0-9a-fA-F]{24})$/).respond(sampleAdmncnvan);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.admncnvan).toEqualData(sampleAdmncnvan);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Admncnvans) {
			// Create a sample Admncnvan object
			var sampleAdmncnvanPostData = new Admncnvans({
				name: 'New Admncnvan'
			});

			// Create a sample Admncnvan response
			var sampleAdmncnvanResponse = new Admncnvans({
				_id: '525cf20451979dea2c000001',
				name: 'New Admncnvan'
			});

			// Fixture mock form input values
			scope.name = 'New Admncnvan';

			// Set POST response
			$httpBackend.expectPOST('admncnvans', sampleAdmncnvanPostData).respond(sampleAdmncnvanResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Admncnvan was created
			expect($location.path()).toBe('/admncnvans/' + sampleAdmncnvanResponse._id);
		}));

		it('$scope.update() should update a valid Admncnvan', inject(function(Admncnvans) {
			// Define a sample Admncnvan put data
			var sampleAdmncnvanPutData = new Admncnvans({
				_id: '525cf20451979dea2c000001',
				name: 'New Admncnvan'
			});

			// Mock Admncnvan in scope
			scope.admncnvan = sampleAdmncnvanPutData;

			// Set PUT response
			$httpBackend.expectPUT(/admncnvans\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/admncnvans/' + sampleAdmncnvanPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid admncnvanId and remove the Admncnvan from the scope', inject(function(Admncnvans) {
			// Create new Admncnvan object
			var sampleAdmncnvan = new Admncnvans({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Admncnvans array and include the Admncnvan
			scope.admncnvans = [sampleAdmncnvan];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/admncnvans\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleAdmncnvan);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.admncnvans.length).toBe(0);
		}));
	});
}());