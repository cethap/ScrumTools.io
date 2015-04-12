/**
 * Created by ScrumTools on 10/16/14.
 */
'use strict';

// Setting up route
angular.module('projects').config(['$stateProvider',
    function($stateProvider) {
        // Articles state routing
        $stateProvider.
            state('listProjects', {
                url: '/projects',
                templateUrl: 'modules/projects/views/list-projects.client.view.html'
            }).
            state('createProject', {
                url: '/projects/create',
                templateUrl: 'modules/projects/views/create-project.client.view.html'
            }).
            state('viewProject', {
                url: '/projects/:projectId',
                templateUrl: 'modules/projects/views/view-project.client.view.html'
            }).
            state('viewProject.escritorio', {
                url: '/escritorio',
                templateUrl: 'modules/projects/views/desktop-project.cliente.view.html'
            }).            
            state('viewProject.listStories', {
                url: '/stories',
                templateUrl: 'modules/stories/views/list-stories.client.view.html'
            }).
            state('viewProject.createSprint', {
                url: '/createSprint',
                templateUrl: 'modules/sprints/views/create-sprint.client.view.html'
            }).
            state('viewProject.viewSprint', {
                url: '/sprints/:sprintId',
                templateUrl: 'modules/sprints/views/view-sprint.client.view.html'
            }).
            state('viewProject.viewSprint.dashboard', {
                url: '/dashboard',
                templateUrl: 'modules/sprints/views/sprint-dashboard.client.view.html'
            }).

            state('miembros', {
                url: '/projects/:projectId/miembros',
                templateUrl: 'modules/projects/views/members-project.client.view.html'
            }).


            state('addMiembros', {
                url: '/projects/:projectId/addMiembros',
                templateUrl: 'modules/projects/views/add-members-project.client.view.html'
            }).


            state('viewProject.viewSprint.listDailies', {
                url: '/dailies',
                templateUrl: 'modules/dailies/views/list-dailies.client.view.html'
            });
    }
]);