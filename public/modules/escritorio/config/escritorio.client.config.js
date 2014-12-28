'use strict';

// Escritorio module config
angular.module('escritorio').run(['Menus',
	function(Menus) {
		Menus.addMenuItem('sidebar', 'Escritorio', 'escritorio', 'item', '/');
	}
]);