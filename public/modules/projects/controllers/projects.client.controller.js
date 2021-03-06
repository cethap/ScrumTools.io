/**
 * Created by ScrumTools on 10/19/14.
 */
'use strict';

var projectsApp = angular.module('projects');

projectsApp.value('initSideMenu', function(Menus,$stateParams){
        Menus.addMenuItem('sidebar', 'Panel principal', 'projects/'+$stateParams.projectId+'/escritorio', 'item', '/escritorio');
        //Menus.addMenuItem('sidebar', 'Tablero Producto', 'projects/'+$stateParams.projectId+'/stories', 'item', '/stories');
        Menus.addMenuItem('sidebar', 'Historias de usuario', 'projects/'+$stateParams.projectId+'/stories', 'item', '/stories');
        Menus.addMenuItem('sidebar', 'Sprints', 'projects/'+$stateParams.projectId+'/sprints');
        // Menus.addSubMenuItem('sidebar', 'sprints', 'Listar sprints', 'projects/'+$stateParams.projectId+'/sprints');
        // Menus.addSubMenuItem('sidebar', 'sprints', 'Nuevo sprint', 'projects/'+$stateParams.projectId+'/createSprint');
        Menus.addMenuItem('sidebar', 'Burndown', 'projects/'+$stateParams.projectId+'/escritorio', 'item', '/escritorio',null,null,0,{EventSend:'sprintBurnDownChartGeneral'});
        Menus.addMenuItem('sidebar', 'Opciones', 'opciones', 'dropdown', 'projects/'+$stateParams.projectId+'/opciones');
        Menus.addSubMenuItem('sidebar', 'opciones', 'Ver miembros', 'projects/'+$stateParams.projectId+'/miembros');
        Menus.addSubMenuItem('sidebar', 'opciones', 'Añadir miembros', 'projects/'+$stateParams.projectId+'/addMiembros');
                           //menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute,                  isPublic, roles, position, opts
        Menus.addSubMenuItem('sidebar', 'opciones', 'Rechazar proyecto', 'projects',null,null,null,0,{EventSend:'leaveProject'});    
});

projectsApp.controller('ProjectsController', ['$scope', 'Authentication', 'Projects', '$location','$modal','$http',
    function($scope, Authentication, Projects, $location, $modal,$http) {
        $scope.authentication = Authentication;

        // If user is not signed in then redirect back home
        if (!$scope.authentication.user) $location.path('/');

        // Find a list  of projects
        $scope.projects = Projects.query();
        $scope.goToProject = function(p){
            $location.path('/projects/'+p+'/escritorio');
        };

        // Open a modal window
        $scope.modal = function (size, selectedProject) {
            var modalInstance = $modal.open({
                templateUrl: 'modules/projects/views/edit-project.client.view.html',
                controller: function ($scope, $modalInstance, project) {
                    $scope.project = project;

                    $scope.ok = function () {
                        //if (updateProjectForm.$valid) {
                            $modalInstance.close(selectedProject);
                        //}
                    };

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                },
                size: size,
                resolve: {
                    project: function () {
                        return selectedProject;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                //$log.info('Modal cerrado a las: ' + new Date());
            });
        };

        $scope.leaveProject = function(prjct){
            $http.put('/projects/' + prjct._id + '/leave').success(function(response) {
                // If successful project is removed of session
                prjct = null;
                // And redirect to the index page
                $location.path('/');
            }).error(function(response) {
                $scope.error = response.message;
            });            
        };

    }
]);

projectsApp.controller('ProjectsViewController', ['$scope', '$rootScope', '$stateParams', 'Authentication', 'Projects', 'Sprints','$modal', '$log', '$http', '$location','Menus','initSideMenu',
    function($scope, $rootScope, $stateParams, Authentication, Projects, Sprints, $modal, $log, $http, $location,Menus,initSideMenu) {
        $scope.authentication = Authentication;

        initSideMenu(Menus,$stateParams);
        // If user is not signed in then redirect back home
        if (!$scope.authentication.user) $location.path('/');

        if($stateParams.projectId){        
            // Get a project
            $scope.project =  Projects.get({
                projectId: $stateParams.projectId
            });
        }

        // Open a modal window
        $scope.modal = function (size, selectedProject) {

            var modalInstance = $modal.open({
                templateUrl: 'modules/projects/views/edit-project.client.view.html',
                controller: function ($scope, $modalInstance, project) {
                    $scope.project = project;

                    $scope.ok = function () {
                        //if (updateProjectForm.$valid) {
                            $modalInstance.close($scope.project);
                        //}
                    };

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                },
                size: size,
                resolve: {
                    project: function () {
                        return selectedProject;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                $log.info('Modal cerrado a las: ' + new Date());
            });
        };

        $rootScope.$on('leaveProject', function(event, mass){
            $http.put('/projects/' + $scope.project._id + '/leave').success(function(response) {
                // If successful project is removed of session
                $scope.project = null;

                // And redirect to the index page
                $location.path('/');
            }).error(function(response) {
                $scope.error = response.message;
            });
        });

        // Leave project
        // $scope.leave = function(selectedProject) {
        // };

        // Open a modal window to view members
        $scope.modalViewMembers = function (size, selectedProject) {

            var members = $http.get('/projects/' + selectedProject._id + '/members');

            $modal.open({
                templateUrl: 'modules/projects/views/members-project.client.view.html',
                controller: function ($scope, $modalInstance, users) {

                    $scope.users = users;

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                },
                size: size,
                resolve: {
                    users: function () {
                        return members.then(function (response) {
                            $scope.r = response.data;
                            return response.data;
                        });
                    }
                }
            });

        };

        // Open a modal window to add members
        $scope.modalAddMembers = function (size, selectedProject) {

            $modal.open({
                templateUrl: 'modules/projects/views/add-members-project.client.view.html',
                controller: function ($scope, $modalInstance, project) {
                    $scope.project = project;

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                },
                size: size,
                resolve: {
                    project: function () {
                        return selectedProject;
                    }
                }

            });
        };

        // Get sprints
        $scope.getSprints = function (project) {
            $scope.sprints = Sprints.query({ projectId: project._id });
        };

        $scope.sprintBurnDownChart = function (size, selectedProject) {

            var stories = $http.get('/projects/' + selectedProject._id + '/allStories');
            $modal.open({
                templateUrl: 'modules/projects/views/project-burndownchart.client.view.html',
                controller: ProjectBurnDownChartController,
                size: size,
                resolve: {
                    project: function () {
                        return selectedProject;
                    },
                    stories: function () {
                        return stories.then(function (response) {
                            return response.data;
                        });
                    }
                }
            });
        };


        $rootScope.$on('sprintBurnDownChartGeneral', function(event, mass){
            $scope.sprintBurnDownChart('lg',$scope.project);
        });


        var ProjectBurnDownChartController = function ($scope, $modalInstance, project, stories) {
            $scope.authentication = Authentication;

            // If user is not signed in then redirect back home
            if (!$scope.authentication.user) $location.path('/');

            $scope.stories = stories;

            $scope.ok = function () {
                $modalInstance.close(project);
            };

            var currentData = [],
                estimateData = [],
                currentStoryPoints = 0,
                totalStoryPoints = 0,
                today = new Date(),
                modified = false;

            function dayDiff(first, second) {
                return (second-first)/(1000*60*60*24);
            }

            var totalDays = dayDiff(new Date(project.startTime).getTime(), new Date(project.endTime).getTime()) + 1;
            var dayLabel = dayDiff(new Date(project.startTime).getTime(), new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()) + 1;

            angular.forEach(stories, function (story) {
                if (!story.storyFinished)
                    currentStoryPoints += story.storyPoint;
                totalStoryPoints += story.storyPoint;
            });

            var d = (totalStoryPoints / (totalDays - 1) );
            for (var k = 0; k < totalDays; k++) {
                if (k === 0)
                    estimateData.push(totalStoryPoints);
                else if (k + 1 === totalDays)
                    estimateData.push(0);
                else
                    estimateData.push(Math.round((estimateData[k-1] - d) * 100) / 100);
            }

            for (var j = 0; j <= project.projectBurnDownChart.length; j++) {
                if (!project.projectBurnDownChart.length || project.projectBurnDownChart.length < dayLabel) {
                    project.projectBurnDownChart.push({ storyPoints: currentStoryPoints, day: dayLabel});
                    modified = true;
                } else if (j < project.projectBurnDownChart.length  && project.projectBurnDownChart[j].day === dayLabel) {
                    if (project.projectBurnDownChart[j].storyPoints !== currentStoryPoints) {
                        project.projectBurnDownChart[j].storyPoints = currentStoryPoints;
                        modified = true;
                    }
                }

                if (j < project.projectBurnDownChart.length)
                    currentData.push(project.projectBurnDownChart[j].storyPoints);
            }

            if (modified)
                project.$update({ projectId: project._id });

            $scope.chartConfig = {
                options: {
                    chart: {
                        type: 'line',
                        zoomType: 'x'
                    }
                },
                series: [{
                    data: currentData, name: 'Actual', color: '#FF0000'
                }, {
                    data: estimateData, name: 'Estimado', color: '#66CCFF'
                }],
                title: {
                    text: ''
                },
                xAxis: {currentMin: 0, currentMax: totalDays, minRange: 1, title: { text: 'Dias' }},
                yAxis: {currentMin: 0, currentMax: totalStoryPoints, minRange: 2, title: { text: 'Puntos de usuario' }},
                loading: false,
                plotOptions: {
                    line: {
                        dataLabels: {
                            enabled: true
                        },
                        enableMouseTracking: false
                    }
                }
            };

        };

    }
]);

projectsApp.controller('ProjectsAddMembersController', ['$scope', '$stateParams', 'Authentication', 'ProjectsNonMembers', '$timeout', '$log', '$http', '$location','Menus','initSideMenu','notify',
    function($scope, $stateParams, Authentication, ProjectsNonMembers, $timeout, $log, $http, $location, Menus, initSideMenu,notify) {
        $scope.authentication = Authentication;

        initSideMenu(Menus,$stateParams);

        $scope.project = $stateParams.projectId;

        // $scope.cancel = function () {
        //     $modalInstance.dismiss('cancel');
        // };

        
        // If user is not signed in then redirect back home
        if (!$scope.authentication.user) $location.path('/');

        $scope.roles = [
            'SCRUM_MASTER',
            'PRODUCT_OWNER',
            'TEAM',
            'STAKEHOLDER'
        ];

        var timeout;
        //Genera Error javascript TypeError: fn is not a function
        $scope.$watch('username', function(newVal) {
            if (newVal) {
                if (timeout) $timeout.cancel(timeout);
                timeout = $timeout(
                    ProjectsNonMembers.nonMembers($stateParams.projectId, newVal)
                    .success(function (response) {
                        // the success function wraps the response in data
                        // so we need to call data.data to fetch the raw data
                        $scope.users = response;
                    }
                ), 350);
            }
        });

        // Add member to project
        $scope.addMember = function(selectedProject, user, role) {
            user.role = role;
            $http.put('/projects/' + selectedProject + '/join', {'users': [user]}).success(function(response) {
                $scope.users = null;
                notify({message:response.message, templateUrl:'modules/error/angular-notify.html'});
                $location.path('/projects/'+selectedProject+'/miembros');
            }).error(function(response) {
                $scope.error = response.message;
                notify({message:$scope.error, templateUrl:'modules/error/angular-notify.html'});
            });
        };
    }
]);


projectsApp.controller('MembersController', ['$scope', 'Projects', 'Authentication', '$location','$modal','$http', '$stateParams','Menus','initSideMenu',
    function($scope, Projects, Authentication, $location, $modal, $http,$stateParams,Menus,initSideMenu) {

            var members = $http.get('/projects/'+$stateParams.projectId+'/members');

            initSideMenu(Menus,$stateParams);

            members.then(function (response) {
                $scope.users = response.data;
                //$scope.$apply();
            });


            // $scope.cancel = function () {
            //     $modalInstance.dismiss('cancel');
            // };

            // $modal.open({
            //     templateUrl: 'modules/projects/views/members-project.client.view.html',
            //     controller: function ($scope, $modalInstance, users) {

            //         $scope.users = users;

            //         $scope.cancel = function () {
            //             $modalInstance.dismiss('cancel');
            //         };
            //     },
            //     size: 5,
            //     resolve: {
            //         users: function () {
            //             return members.then(function (response) {
            //                 $scope.r = response.data;
            //                 return response.data;
            //             });
            //         }
            //     }
            // });

    }
]);




projectsApp.controller('ProjectsCrUpController', ['$scope', 'Projects', 'Authentication', '$location','notify',
    function($scope, Projects, Authentication, $location, notify) {
        $scope.authentication = Authentication;

        // If user is not signed in then redirect back home
        if (!$scope.authentication.user) $location.path('/');

        $scope.create = function() {
            var project = new Projects({
                projectName: this.projectName,
                descriptionName: this.descriptionName,
                startTime: this.startTime,
                endTime: this.endTime
            });
            project.$save(function(response) {
                $location.path('projects/' + response._id + '/escritorio');

                $scope.projectName = '';
                $scope.descriptionName = '';
                $scope.startTime = '';
                $scope.endTime = '';

            }, function(errorResponse) {
                notify({message:errorResponse.data.message, templateUrl:'modules/error/angular-notify.html'});
                //$scope.error = errorResponse.data.message;
            });
        };

        $scope.today = function() {
            $scope.startTime = new Date();
        };

        $scope.clear = function () {
            $scope.startTime = null;
        };

        $scope.openStartDT = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.openedStartDT = true;
        };

        $scope.today = function() {
            $scope.endTime = new Date();
        };

        $scope.clear = function () {
            $scope.endTime = null;
        };

        $scope.openEndDT = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.openedEndDT = true;
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1,
            showWeeks:false
        };

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];

        $scope.update = function(updatedProject) {
            var project = updatedProject;

            project.$update(function(response) {

            }, function(errorResponse) {
                notify({message:errorResponse.data.message, templateUrl:'modules/error/angular-notify.html'});
                //$scope.error = errorResponse.data.message;
            });
        };

    }
]);