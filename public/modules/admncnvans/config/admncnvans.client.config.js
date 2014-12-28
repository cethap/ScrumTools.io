'use strict';

// Configuring the Articles module
angular.module('admncnvans').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('sidebar', 'Administrador Canvan', 'admncnvans', 'dropdown', '/admncnvans(/create)?');
		Menus.addSubMenuItem('sidebar', 'admncnvans', 'Listar Canvans', 'admncnvans');
		Menus.addSubMenuItem('sidebar', 'admncnvans', 'Nuevo Canvan', 'admncnvans/create');
	}
]);