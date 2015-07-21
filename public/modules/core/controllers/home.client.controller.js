'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication','$location',
	function($scope, Authentication,$location,$stateParams) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		if(Authentication.user){
			$location.path('/projects');
		}
	}
]);