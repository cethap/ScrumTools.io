'use strict';

//Setting up route
angular.module('admncnvans').config(['$stateProvider',
	function($stateProvider) {
		// Admncnvans state routing
		$stateProvider.
		state('listAdmncnvans', {
			url: '/admncnvans',
			templateUrl: 'modules/admncnvans/views/list-admncnvans.client.view.html'
		}).
		state('createAdmncnvan', {
			url: '/admncnvans/create',
			templateUrl: 'modules/admncnvans/views/create-admncnvan.client.view.html'
		}).
		state('viewAdmncnvan', {
			url: '/admncnvans/:admncnvanId',
			templateUrl: 'modules/admncnvans/views/view-admncnvan.client.view.html'
		}).
		state('editAdmncnvan', {
			url: '/admncnvans/:admncnvanId/edit',
			templateUrl: 'modules/admncnvans/views/edit-admncnvan.client.view.html'
		});
	}
]);