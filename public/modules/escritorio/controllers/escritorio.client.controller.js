'use strict';

angular.module('escritorio').controller('EscritorioController', ['$scope','Authentication','$location',
	function($scope,Authentication,$location) {
		if(Authentication.user === ''){
			$location.path('/');
		}
	}
]);