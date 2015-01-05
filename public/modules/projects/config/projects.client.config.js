/**
 * Created by J. Ricardo de Juan Cajide on 10/16/14.
 */
'use strict';

// Configuring the Proyectos module
angular.module('projects').run(['Menus',
    function(Menus) {
        // Set top bar menu items
        Menus.addMenuItem('sidebar', 'Proyectos', 'proyectos', 'dropdown', '/projects(/create)?');
        Menus.addSubMenuItem('sidebar', 'proyectos', 'Listar Proyectos', 'projects');
        Menus.addSubMenuItem('sidebar', 'proyectos', 'Nuevo Project', 'projects/create');
    }
]);