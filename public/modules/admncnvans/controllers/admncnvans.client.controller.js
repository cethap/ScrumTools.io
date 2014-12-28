'use strict';

// Admncnvans controller
angular.module('admncnvans').controller('AdmncnvansController', ['$scope', '$stateParams', '$location', 'Authentication', 'Admncnvans',
	function($scope, $stateParams, $location, Authentication, Admncnvans) {
		$scope.authentication = Authentication;

		// Create new Admncnvan
		$scope.create = function() {
			// Create new Admncnvan object
			var admncnvan = new Admncnvans ({
				name: this.name
			});

			// Redirect after save
			admncnvan.$save(function(response) {
				$location.path('admncnvans/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Admncnvan
		$scope.remove = function(admncnvan) {
			if ( admncnvan ) { 
				admncnvan.$remove();

				for (var i in $scope.admncnvans) {
					if ($scope.admncnvans [i] === admncnvan) {
						$scope.admncnvans.splice(i, 1);
					}
				}
			} else {
				$scope.admncnvan.$remove(function() {
					$location.path('admncnvans');
				});
			}
		};

		// Update existing Admncnvan
		$scope.update = function() {
			var admncnvan = $scope.admncnvan;

			admncnvan.$update(function() {
				$location.path('admncnvans/' + admncnvan._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Admncnvans
		$scope.find = function() {
			$scope.admncnvans = Admncnvans.query();
		};

		// Find existing Admncnvan
		$scope.findOne = function() {
			$scope.admncnvan = Admncnvans.get({ 
				admncnvanId: $stateParams.admncnvanId
			});
		};
	}
]);