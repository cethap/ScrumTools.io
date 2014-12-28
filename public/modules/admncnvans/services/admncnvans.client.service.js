'use strict';

//Admncnvans service used to communicate Admncnvans REST endpoints
angular.module('admncnvans').factory('Admncnvans', ['$resource',
	function($resource) {
		return $resource('admncnvans/:admncnvanId', { admncnvanId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);