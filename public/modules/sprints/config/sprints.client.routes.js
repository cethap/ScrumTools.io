/**
 * Created by J. Ricardo de Juan Cajide on 10/16/14.
 */
'use strict';

// Setting up route
angular.module('sprints').config(['$stateProvider',
    function($stateProvider) {
        // Articles state routing
        $stateProvider.
            state('viewProject.listSprint', {
                url: '/sprints',
                templateUrl: 'modules/sprints/views/list-sprints.client.view.html'
            });
    }
]);