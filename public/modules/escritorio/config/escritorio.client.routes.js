'use strict';

//Setting up route
angular.module('escritorio').config(['$stateProvider',
	function($stateProvider) {
		// Escritorio state routing
		$stateProvider.
		state('escritorio', {
			url: '/escritorio',
			templateUrl: 'modules/escritorio/views/escritorio.client.view.html'
		});
	}
]);