'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'scrumtoolsio';
	//var applicationModuleVendorDependencies = ['ngResource', 'ngCookies',  'ngAnimate',  'ngTouch',  'ngSanitize',  'ui.router', 'ui.bootstrap', 'ui.utils'];
	var applicationModuleVendorDependencies = ['ngResource', 'ngAnimate', 'ui.router', 'ui.bootstrap', 'ui.utils', 'btford.socket-io', 'xeditable', 'checklist-model', 'ngDragDrop', 'highcharts-ng', 'cgNotify'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();
'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies)

.run(["editableOptions", function(editableOptions) {
  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
}]);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
/**
 * Created by ScrumTools on 11/25/14.
 */
'use strict';

// Use Application configuration module to register a new module
ApplicationConfiguration.registerModule('dailies');
'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('escritorio');

/**
 * Created by ScrumTools on 11/17/14.
 */
'use strict';

// Use Application configuration module to register a new module
ApplicationConfiguration.registerModule('phases');
/**
 * Created by ScrumTools on 10/16/14.
 */
'use strict';

// Use Application configuration module to register a new module
ApplicationConfiguration.registerModule('projects');
/**
 * Created by ScrumTools on 11/16/14.
 */
'use strict';

// Use Application configuration module to register a new module
ApplicationConfiguration.registerModule('sprints');
/**
 * Created by ScrumTools on 11/8/14.
 */
'use strict';

// Use Application configuration module to register a new module
ApplicationConfiguration.registerModule('stories');
/**
 * Created by ScrumTools on 11/18/14.
 */
'use strict';

// Use Application configuration module to register a new module
ApplicationConfiguration.registerModule('tasks');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');
'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]);
'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]).controller('SideBarController', ['$scope', '$rootScope', 'Authentication', 'Menus',
	function($scope, $rootScope, Authentication, Menus) {
		//console.log(Menus.getMenu('sidebar'));
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('sidebar');

		$scope.realClass = function(item){
			return (item.menuItemClass === 'dropdown')?'dropdown-submenu':item.menuItemClass;
		};

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		$scope.EmitEventFromMenu = function(evnt) {
			if(evnt.trim() !== ''){
				$rootScope.$broadcast(evnt, []);
			}
		};


		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
])

.controller('offCnvas', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {

		var Menu = Menus.getMenu('sidebar');
		function showSideBar (){
			$scope.ClassSdebar = 'totalH col-md-2 col-sm-3 hidden-xs';
			$scope.ClassCntent = 'col-md-10 col-sm-9 realContent';	
		}

		$scope.$on('FullInitSession', showSideBar);

		$scope.sttus = Menu.shouldRender(Authentication.user);
		if(!$scope.sttus){
			$scope.ClassSdebar = 'hide';
			$scope.ClassCntent = 'col-md-12 realContent';
		}else{
			showSideBar();
		}
	}
]);
'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication','$location',
	function($scope, Authentication,$location,$stateParams) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		if(Authentication.user){
			$location.path('/escritorio');
		}
	}
]);
'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu no existe');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position, opts) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);
			var ExistItem = false;
			opts = opts||{};

			for (var i = 0; i < this.menus[menuId].items.length; i++) {
				if (menuItemTitle === this.menus[menuId].items[i].title){
					this.menus[menuId].items[i].uiRoute = menuItemUIRoute || ('/' + menuItemURL);
					this.menus[menuId].items[i].link = menuItemURL;
					ExistItem = true;
				}
			}

			if(!ExistItem){			
				// Push new menu item
				this.menus[menuId].items.push({
					title: menuItemTitle,
					link: menuItemURL,
					menuItemType: menuItemType || 'item',
					menuItemClass: menuItemType,
					uiRoute: menuItemUIRoute || ('/' + menuItemURL),
					isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
					roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
					position: position || 0,
					items: [],
					shouldRender: shouldRender,
					EventSend: opts.EventSend||''
				});
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position, opts) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);
			opts = opts||{};
			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {


					var ExistItem = false;

					for (var i = 0; i < this.menus[menuId].items[itemIndex].items.length; i++) {
						if (menuItemTitle === this.menus[menuId].items[itemIndex].items[i].title){
							this.menus[menuId].items[itemIndex].items[i].uiRoute = menuItemUIRoute || ('/' + menuItemURL);
							this.menus[menuId].items[itemIndex].items[i].link = menuItemURL;
							ExistItem = true;
						}
					}

					if(!ExistItem){	
						// Push new submenu item
						this.menus[menuId].items[itemIndex].items.push({
							title: menuItemTitle,
							link: menuItemURL,
							uiRoute: menuItemUIRoute || ('/' + menuItemURL),
							isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
							roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
							position: position || 0,
							shouldRender: shouldRender,
							EventSend: opts.EventSend||''
						});
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');
		//Adding the sidebar menu
		this.addMenu('sidebar');
	}
]);
/**
 * Created by ScrumTools on 11/25/14.
 */
'use strict';


var dailiesApp = angular.module('dailies');

dailiesApp.controller('DailyScrumController', ['$scope', '$stateParams', 'Authentication', '$location', 'Dailies', '$modal','notify',
    function ($scope, $stateParams, Authentication, $location, Dailies, $modal, notify) {
        $scope.authentication = Authentication;

        // If user is not signed in then redirect back home
        if (!$scope.authentication.user) $location.path('/');

        $scope.dailies = Dailies.query({ sprintId: $stateParams.sprintId},
            function(){},
            function(errorResponse){
                notify({message:errorResponse.data.message, templateUrl:'modules/error/angular-notify.html'});
            }
        );

        $scope.createDaily = function () {
            var ds = new Dailies({
                did: '',
                willDo: '',
                impediments: '',
                date: new Date(),
                sprintId: $stateParams.sprintId
            });

            ds.$save({ sprintId: $stateParams.sprintId }, function(daily) {
                $scope.dailies.push(daily);
            },function(errorResponse){
                notify({message:errorResponse.data.message, templateUrl:'modules/error/angular-notify.html'});
            });
        };

        $scope.editDaily = function ($event,size, selectedDaily) {
            $event.preventDefault();
            $modal.open({
                templateUrl: 'modules/dailies/views/view-daily.client.view.html',
                controller: ["$scope", "$modalInstance", "daily", function ($scope, $modalInstance, daily) {

                    $scope.daily = daily;

                    $scope.ok = function () {
                        $modalInstance.close($scope.daily);
                    };

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };

                }],
                size: size,
                resolve: {
                    daily: function () {
                        return selectedDaily;
                    }
                }
            });
        };
    }
]);

dailiesApp.controller('DailyScrumUpdateController', ['$scope', '$stateParams', 'Authentication', '$location', 'Dailies',
    function ($scope, $stateParams, Authentication, $location, Dailies) {
        $scope.authentication = Authentication;

        // If user is not signed in then redirect back home
        if (!$scope.authentication.user) $location.path('/');

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

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];

        $scope.update = function(updatedDaily) {
            var daily = updatedDaily;

            daily.$update({ sprintId: $stateParams.sprintId, dailyId: daily._id } ,function(response) {

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
    }
]);
/**
 * Created by ScrumTools on 11/25/14.
 */
'use strict';

//Dailies service used for communicating with the projects REST endpoints
angular.module('dailies').factory('Dailies', ['$resource',
    function($resource) {
        return $resource('sprints/:sprintId/dailies/:dailyId', { sprintId: '@sprintId', dailyId: '@dailyId' }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);
'use strict';

// Escritorio module config
angular.module('escritorio').run(['Menus',
	function(Menus) {
		Menus.addMenuItem('sidebar', 'Escritorio', 'escritorio', 'item', '/');
	}
]);
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
'use strict';

angular.module('escritorio').controller('EscritorioController', ['$scope','Authentication','$location',
	function($scope,Authentication,$location) {
		if(Authentication.user === ''){
			$location.path('/');
		}else{
      $scope.$emit('FullInitSession', {});
    }
	}
])

.controller('DatepickerDemoCtrl', ["$scope", function ($scope) {
  $scope.today = function() {
    $scope.dt = new Date();
  };
  $scope.today();

  $scope.clear = function () {
    $scope.dt = null;
  };

  // Disable weekend selection
  $scope.disabled = function(date, mode) {
    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
  };

  $scope.toggleMin = function() {
    $scope.minDate = $scope.minDate ? null : new Date();
  };
  $scope.toggleMin();

  $scope.open = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };

  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
  };

  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[0];
}]);
'use strict';

angular.module('escritorio').directive('escritorio', [
	function() {
		return {
			template: '<div></div>',
			restrict: 'E',
			link: function postLink(scope, element, attrs) {
				// Escritorio directive logic
				// ...

				element.text('this is the escritorio directive');
			}
		};
	}
]);
'use strict';

angular.module('escritorio').factory('Escritorio', [
	function() {
		// Escritorio service logic
		// ...

		// Public API
		return {
			someMethod: function() {
				return true;
			}
		};
	}
]);
/**
 * Created by ScrumTools on 11/17/14.
 */
'use strict';

//Phases service used for communicating with the projects REST endpoints
angular.module('phases').factory('Phases', ['$resource',
    function($resource) {
        return $resource('sprints/:sprintId/phases/:phaseId', { sprintId: '@sprintId', phaseId: '@phaseId' }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);
/**
 * Created by ScrumTools on 10/16/14.
 */
'use strict';

// Configuring the Proyectos module
angular.module('projects').run(['Menus',
    function(Menus) {
        // Set top bar menu items
        Menus.addMenuItem('sidebar', 'Proyectos', 'projects');
        // Menus.addSubMenuItem('sidebar', 'proyectos', 'Listar Proyectos', 'projects');
        // Menus.addSubMenuItem('sidebar', 'proyectos', 'Nuevo Proyecto', 'projects/create');
    }
]);
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
/**
 * Created by ScrumTools on 10/19/14.
 */
'use strict';

var projectsApp = angular.module('projects');

projectsApp.value('initSideMenu', function(Menus,$stateParams){
        Menus.addMenuItem('sidebar', 'Panel principal', 'projects/'+$stateParams.projectId+'/escritorio', 'item', '/escritorio');
        Menus.addMenuItem('sidebar', 'Historias de usuario', 'projects/'+$stateParams.projectId+'/stories', 'item', '/stories');
        Menus.addMenuItem('sidebar', 'Sprints', 'projects/'+$stateParams.projectId+'/sprints');
        // Menus.addSubMenuItem('sidebar', 'sprints', 'Listar sprints', 'projects/'+$stateParams.projectId+'/sprints');
        // Menus.addSubMenuItem('sidebar', 'sprints', 'Nuevo sprint', 'projects/'+$stateParams.projectId+'/createSprint');
        Menus.addMenuItem('sidebar', 'Estadistica Burndown', 'projects/'+$stateParams.projectId+'/escritorio', 'item', '/escritorio',null,null,0,{EventSend:'sprintBurnDownChartGeneral'});
        Menus.addMenuItem('sidebar', 'Opciones', 'opciones', 'dropdown', 'projects/'+$stateParams.projectId+'/opciones');
        Menus.addSubMenuItem('sidebar', 'opciones', 'Ver miembros', 'projects/'+$stateParams.projectId+'/miembros');
        Menus.addSubMenuItem('sidebar', 'opciones', 'Añadir miembros', 'projects/'+$stateParams.projectId+'/addMiembros');
        Menus.addSubMenuItem('sidebar', 'opciones', 'Rechazar proyecto', 'projects/'+$stateParams.projectId+'/purge');    
});

projectsApp.controller('ProjectsController', ['$scope', 'Authentication', 'Projects', '$location','$modal',
    function($scope, Authentication, Projects, $location, $modal) {
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
            console.log(selectedProject);
            var modalInstance = $modal.open({
                templateUrl: 'modules/projects/views/edit-project.client.view.html',
                controller: ["$scope", "$modalInstance", "project", function ($scope, $modalInstance, project) {
                    $scope.project = project;

                    $scope.ok = function () {
                        //if (updateProjectForm.$valid) {
                            $modalInstance.close(selectedProject);
                        //}
                    };

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                }],
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
                controller: ["$scope", "$modalInstance", "project", function ($scope, $modalInstance, project) {
                    $scope.project = project;

                    $scope.ok = function () {
                        //if (updateProjectForm.$valid) {
                            $modalInstance.close($scope.project);
                        //}
                    };

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                }],
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

        // Leave project
        $scope.leave = function(selectedProject) {
            $http.put('/projects/' + selectedProject._id + '/leave').success(function(response) {
                // If successful project is removed of session
                $scope.project = null;

                // And redirect to the index page
                $location.path('/');
            }).error(function(response) {
                $scope.error = response.message;
            });
        };

        // Open a modal window to view members
        $scope.modalViewMembers = function (size, selectedProject) {

            var members = $http.get('/projects/' + selectedProject._id + '/members');

            $modal.open({
                templateUrl: 'modules/projects/views/members-project.client.view.html',
                controller: ["$scope", "$modalInstance", "users", function ($scope, $modalInstance, users) {

                    $scope.users = users;

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                }],
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
                controller: ["$scope", "$modalInstance", "project", function ($scope, $modalInstance, project) {
                    $scope.project = project;

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                }],
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


        var ProjectBurnDownChartController = ["$scope", "$modalInstance", "project", "stories", function ($scope, $modalInstance, project, stories) {
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
                    data: estimateData, name: 'Estimated', color: '#66CCFF'
                }],
                title: {
                    text: ''
                },
                xAxis: {currentMin: 0, currentMax: totalDays, minRange: 1, title: { text: 'Days' }},
                yAxis: {currentMin: 0, currentMax: totalStoryPoints, minRange: 2, title: { text: 'Story Points' }},
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

        }];

    }
]);

projectsApp.controller('ProjectsAddMembersController', ['$scope', '$stateParams', 'Authentication', 'ProjectsNonMembers', '$timeout', '$log', '$http', '$location','Menus','initSideMenu',
    function($scope, $stateParams, Authentication, ProjectsNonMembers, $timeout, $log, $http, $location, Menus, initSideMenu) {
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
                $location.path('/projects/'+selectedProject+'/miembros');
            }).error(function(response) {
                $scope.error = response.message;
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
/**
 * Created by ScrumTools on 10/19/14.
 */
'use strict';

//Projects service used for communicating with the projects REST endpoints
angular.module('projects').factory('Projects', ['$resource', '$http',
    function($resource) {
        return $resource('projects/:projectId', { projectId: '@_id' }, {
            update: {
                method: 'PUT'
            }
        });
    }
])
    .factory('ProjectsNonMembers', ['$http',
    function($http) {
        var nonMembersRequest = function (projectId, username) {
            return $http.get('/projects/' + projectId + '/nonmembers/' + username);
        };

        return {
            nonMembers: function (projectId, username) { return nonMembersRequest(projectId, username); }
        };
    }
]);
/**
 * Created by ScrumTools on 10/16/14.
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
/**
 * Created by ScrumTools on 11/16/14.
 */
'use strict';


var sprintsApp = angular.module('sprints');

sprintsApp.controller('SprintsCreateUpdateController', ['$scope', '$stateParams', 'Authentication', 'Sprints', '$http', '$location', 'SocketSprint','notify',
    function ($scope, $stateParams, Authentication, Sprints, $http, $location, SocketSprint, notify) {

        $scope.authentication = Authentication;

        // If user is not signed in then redirect back home
        if (!$scope.authentication.user) $location.path('/');

        $scope.create = function() {
            var s = new Sprints({
                sprintName: this.sprintName,
                sprintDescription: this.sprintDescription,
                sprintStartTime: this.sprintStartTime,
                sprintEndTime: this.sprintEndTime
            });

            s.$save({ projectId: $stateParams.projectId }, function(sprint) {
                $location.path('projects/' + $stateParams.projectId + '/sprints/' + sprint._id + '/dashboard');

                $scope.sprintName = '';
                $scope.sprintDescription = '';
                $scope.sprintStartTime = '';
                $scope.sprintEndTime = '';

            }, function(errorResponse) {
                //$scope.error = errorResponse.data.message;
                notify({message:errorResponse.data.message, templateUrl:'modules/error/angular-notify.html'});
            });
        };

        $scope.today = function() {
            $scope.sprintStartTime = new Date();
        };

        $scope.clear = function () {
            $scope.sprintStartTime = null;
        };

        $scope.openStartDT = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.openedStartDT = true;
        };

        $scope.today = function() {
            $scope.sprintEndTime = new Date();
        };

        $scope.clear = function () {
            $scope.sprintEndTime = null;
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

        $scope.update = function(updatedSprint) {
            var sprint = updatedSprint;

            sprint.$update({ sprintId: updatedSprint._id }, function(response) {
                SocketSprint.emit('sprint.updated', {sprint: response, room: $stateParams.sprintId});
            }, function(errorResponse) {
                //$scope.error = errorResponse.data.message;
                notify({message:errorResponse.data.message, templateUrl:'modules/error/angular-notify.html'});
            });
        };
    }
]);

sprintsApp.controller('SprintslistController', ['$scope', '$stateParams','Sprints',
    function($scope,$stateParams,Sprints){
        $scope.sprints = Sprints.query({ projectId: $stateParams.projectId });
    }
]);


sprintsApp.controller('SprintsViewController', ['$scope', '$stateParams', 'Authentication', 'Sprints', 'Phases', 'Tasks', 'Stories', '$http', '$location', '$modal', 'SocketSprint', '$log',
    function ($scope, $stateParams, Authentication, Sprints, Phases, Tasks, Stories, $http, $location, $modal, SocketSprint, $log) {

        $scope.authentication = Authentication;

        // If user is not signed in then redirect back home
        if (!$scope.authentication.user) $location.path('/');

        $scope.stories = [];

        $scope.sprint =  Sprints.get({
            projectId: $stateParams.projectId,
            sprintId: $stateParams.sprintId
        });

        var tasks = [];
        // Get Stories and Tasks
        $http.get('/projects/' + $stateParams.projectId + '/sprints/' + $stateParams.sprintId + '/backlog').then(function (result) {
            angular.forEach(result.data, function (s) {
                $scope.stories.push( new Stories(s) );
                    Tasks.query({ storyId: s._id }, function (result) {
                        angular.forEach(result, function (t) {
                            tasks.push(t);
                        });
                    });
            });
            $scope.tasks = tasks;
        });

        $scope.editSprint = function (size, selectedSprint) {
            $modal.open({
                templateUrl: 'modules/sprints/views/edit-sprint.client.view.html',
                controller: ["$scope", "$modalInstance", "sprint", function ($scope, $modalInstance, sprint) {
                    $scope.sprint = sprint;

                    $scope.ok = function () {
                        $modalInstance.close($scope.sprint);
                    };

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                }],
                size: size,
                resolve: {
                    sprint: function () {
                        return selectedSprint;
                    }
                }
            });
        };

        $scope.sprintBurnDownChart = function (size, selectedSprint, setStories, setTasks) {
            $modal.open({
                templateUrl: 'modules/sprints/views/sprint-burndownchart.client.view.html',
                controller: SprintBurnDownChartController,
                size: size,
                resolve: {
                    sprint: function () {
                        return selectedSprint;
                    },
                    stories: function () {
                        return setStories;
                    },
                    tasks: function () {
                        return setTasks;
                    }
                }
            });
        };

        var SprintBurnDownChartController = ["$scope", "$modalInstance", "sprint", "stories", "tasks", function ($scope, $modalInstance, sprint, stories, tasks) {
            $scope.authentication = Authentication;
            // If user is not signed in then redirect back home
            if (!$scope.authentication.user) $location.path('/');

            $scope.stories = stories;

            $scope.ok = function () {
                $modalInstance.close(sprint);
            };

            var currentData = [],
                estimateData = [],
                currentHours = 0,
                totalHours = 0,
                today = new Date(),
                modified = false;

            function dayDiff(first, second) {
                return (second-first)/(1000*60*60*24);
            }

            var totalDays = dayDiff(new Date(sprint.sprintStartTime).getTime(), new Date(sprint.sprintEndTime).getTime()) + 1;
            var dayLabel = dayDiff(new Date(sprint.sprintStartTime).getTime(), new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()) + 1;

            angular.forEach(tasks, function (t) {
                if (!t.taskFinished)
                    currentHours += t.taskHours;
                totalHours += t.taskHours;
            });

            var d = (totalHours / (totalDays - 1) );
            for (var k = 0; k < totalDays; k++) {
                if (k === 0)
                    estimateData.push(totalHours);
                else if (k + 1 === totalDays)
                    estimateData.push(0);
                else
                    estimateData.push(Math.round((estimateData[k-1] - d) * 100) / 100);
            }

            for (var j = 0; j <= sprint.sprintBurnDownChart.length; j++) {
                if (!sprint.sprintBurnDownChart.length || sprint.sprintBurnDownChart.length < dayLabel) {
                    sprint.sprintBurnDownChart.push({ storyPoints: currentHours, day: dayLabel});
                    modified = true;
                } else if (j < sprint.sprintBurnDownChart.length  && sprint.sprintBurnDownChart[j].day === dayLabel) {
                    if (sprint.sprintBurnDownChart[j].storyPoints !== currentHours) {
                        sprint.sprintBurnDownChart[j].storyPoints = currentHours;
                        modified = true;
                    }
                }

                if (j < sprint.sprintBurnDownChart.length)
                    currentData.push(sprint.sprintBurnDownChart[j].storyPoints);
            }

            if (modified)
                sprint.$update({ sprintId: sprint._id });

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
                    data: estimateData, name: 'Estimated', color: '#66CCFF'
                }],
                title: {
                    text: ''
                },
                xAxis: {currentMin: 0, currentMax: totalDays, minRange: 1, title: { text: 'Days' }},
                yAxis: {currentMin: 0, currentMax: totalHours, minRange: 2, title: { text: 'Hours' }},
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

        }];

        $scope.sprintReview = function (size, selectedSprint, setStories) {
            $modal.open({
                templateUrl: 'modules/sprints/views/sprint-review.client.view.html',
                controller: ["$scope", "$modalInstance", "sprint", "stories", function ($scope, $modalInstance, sprint, stories) {
                    $scope.sprint = sprint;

                    $scope.stories = stories;

                    $scope.ok = function () {
                        $modalInstance.close($scope.sprint);
                    };

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                }],
                size: size,
                resolve: {
                    sprint: function () {
                        return selectedSprint;
                    },
                    stories: function () {
                        return setStories;
                    }
                }
            });
        };

        $scope.sprintRestrospective = function (size, selectedSprint) {
            $modal.open({
                templateUrl: 'modules/sprints/views/sprint-retrospective.client.view.html',
                controller: ["$scope", "$modalInstance", "sprint", function ($scope, $modalInstance, sprint) {
                    $scope.sprint = sprint;

                    $scope.ok = function () {
                        $modalInstance.close($scope.sprint);
                    };

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                }],
                size: size,
                resolve: {
                    sprint: function () {
                        return selectedSprint;
                    }
                }
            });
        };
    }
]);

sprintsApp.controller('SprintsDashboardController', ['$scope', '$stateParams', 'Authentication', 'Sprints', 'Phases', 'Tasks', 'Stories', '$http', '$location', '$modal', 'SocketSprint', '$log',
    function ($scope, $stateParams, Authentication, Sprints, Phases, Tasks, Stories, $http, $location, $modal, SocketSprint, $log) {

        var div = angular.element('.page-content-wrapper'),
            wrapScreenWidth = div.width(),
            wrapWidth = div.outerWidth(),
            listWidth = div.find('.innerwrap').outerWidth()+900;
            
        // div.on('mousemove', function(e) {
        //     var cPointX = e.pageX,
        //         dP = ((cPointX / wrapWidth));
        //     div.scrollLeft((listWidth * dP) - wrapScreenWidth);

        // });

        $scope.authentication = Authentication;

        // If user is not signed in then redirect back home
        if (!$scope.authentication.user) $location.path('/');

        $scope.tasks = [];
        $scope.stories = [];
        $scope.phases = Phases.query({ sprintId: $stateParams.sprintId });
        $scope.sprint =  Sprints.get({
            projectId: $stateParams.projectId,
            sprintId: $stateParams.sprintId
        });
        this.toggler = {};

        // Enter in a room
        SocketSprint.emit('sprint.room', $stateParams.sprintId);


        // Get Stories and Tasks
        $http.get('/projects/' + $stateParams.projectId + '/sprints/' + $stateParams.sprintId + '/backlog').then(function (result) {
            angular.forEach(result.data, function (s) {
                $scope.stories.push( new Stories(s) );
            });

            if ($scope.stories.length > 0){
                var tasks = [];

                angular.forEach($scope.stories, function (story) {

                    Tasks.query({ storyId: story._id }, function (result) {
                        angular.forEach(result, function (t) {
                            tasks.push(t);
                        });
                    });
                });

                $scope.tasks = tasks;
            }
        });

        $scope.createPhase = function () {
            var p = new Phases({
                phaseName: this.phaseName,
                position: $scope.phases.length
            });

            p.$save({ sprintId: $stateParams.sprintId }, function (phase) {
                $scope.phases.push(phase);
                SocketSprint.emit('phase.created', {phase: phase, room: $stateParams.sprintId});
            });
        };

        $scope.editPhase = function (phase) {
            phase.$update({ phaseId: phase._id } ,function (response) {
                SocketSprint.emit('phase.updated', {phase: response, room: $stateParams.sprintId});
            });
        };

        $scope.deletePhase = function (phase) {
            $scope.handleDeletedPhase(phase._id);
            SocketSprint.emit('phase.deleted', {id: phase._id, room: $stateParams.sprintId});
            phase.$remove({ sprintId: $stateParams.sprintId, phaseId: phase._id });
        };

        $scope.deleteTask = function (task) {
            $scope.handleDeletedTask(task._id);
            SocketSprint.emit('task.deleted', {id: task._id, room: $stateParams.sprintId});
            task.$remove({ taskId: task._id });
        };

        // Return US to PB
        $scope.movePB = function (story) {
            $scope.handleDeletedStory(story._id);
            SocketSprint.emit('story.returned', {id: story._id, room: $stateParams.sprintId});
            $scope.handleDeletedTaskByStory(story._id);
            SocketSprint.emit('task.returned', {id: story._id, room: $stateParams.sprintId});
            $http.put('/projects/' + $stateParams.projectId + '/stories/' + story._id + '/productBacklog');
        };

        // Move Tasks
        $scope.toggleState = function(event, ui, phase) {
            this.toggler.phaseId = phase._id;

            var length = $scope.phases.length - 1;
            if (phase._id === $scope.phases[length]._id)
                this.toggler.taskFinished = true;
            else this.toggler.taskFinished = false;

            var task = new Tasks(this.toggler);
            task.$update({ storyId: task.storyId, taskId: task._id });

            SocketSprint.emit('task.moved', {task: this.toggler, room: $stateParams.sprintId});

            $scope.handleMovedTask(this.toggler);
        };


        // Aux methods

        // Check if there are tasks in a phase
        $scope.existTasks = function (phase) {
            if (phase.position === 0) return true;

            var exist = false;
            angular.forEach($scope.tasks, function (task) {
                if (task.phaseId === phase._id) {
                    exist = true;
                }
            });
            return exist;
        };


        // Handlers of Phases, Tasks, Stories

        //Tasks
        $scope.handleUpdatedTask = function (task) {
            var oldTasks = $scope.tasks,
                newTasks = [];

            angular.forEach(oldTasks, function(t) {
                if(t._id === task._id) newTasks.push(new Tasks(task));
                else newTasks.push(t);
            });

            $scope.tasks = newTasks;
        };

        $scope.handleMovedTask = function (task) {
            var ndx = $scope.tasks.map(function(t) {return t._id;}).indexOf(task._id);
            $scope.tasks.push(task);
            $scope.tasks.splice(ndx, 1);

            this.toggler = {};
        };

        $scope.handleDeletedTask = function(id) {
            var oldTasks = $scope.tasks,
                newTasks = [];

            angular.forEach(oldTasks, function(task) {
                if(task._id !== id) newTasks.push(task);
            });

            $scope.tasks = newTasks;
        };

        $scope.handleDeletedTaskByStory = function(id) {
            var oldTasks = $scope.tasks,
                newTasks = [];

            angular.forEach(oldTasks, function(task) {
                if(task.storyId !== id) newTasks.push(task);
            });

            $scope.tasks = newTasks;
        };

        //Phases
        $scope.handleUpdatedPhase = function (phase) {
            var oldPhases = $scope.phases,
                newPhases = [];

            angular.forEach(oldPhases, function(p) {
                if(p._id === phase._id) newPhases.push(new Phases(phase));
                else newPhases.push(p);
            });

            $scope.phases = newPhases;
        };
        
        $scope.handleDeletedPhase = function(id) {
            var oldPhases = $scope.phases,
                newPhases = [];

            angular.forEach(oldPhases, function(phase) {
                if(phase._id !== id) newPhases.push(phase);
            });

            $scope.phases = newPhases;
        };

        //Stories
        $scope.handleUpdatedStory = function(story) {
            var oldStories = $scope.stories,
                newStories = [];

            angular.forEach(oldStories, function(s) {
                if (s._id === story._id) newStories.push(new Stories(story));
                else newStories.push(s);
            });

            $scope.stories = newStories;
        };

        $scope.handleDeletedStory = function(id) {
            var oldStories = $scope.stories,
                newStories = [];

            angular.forEach(oldStories, function(story) {
                if(story._id !== id) newStories.push(story);
            });

            $scope.stories = newStories;
        };

        // Modals

        $scope.editStory = function (size, selectedStory) {

            $modal.open({
                templateUrl: 'modules/stories/views/edit-story.client.view.html',
                controller: ["$scope", "$modalInstance", "story", function ($scope, $modalInstance, story) {
                    $scope.story = story;

                    $scope.ok = function () {
                        SocketSprint.emit('story.updated', {story: $scope.story, room: $stateParams.sprintId});
                        $modalInstance.close($scope.story);
                    };

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };

                }],
                size: size,
                resolve: {
                    story: function () {
                        return selectedStory;
                    }
                }
            });
        };

        $scope.addTask = function (size, selectedStory) {
            $modal.open({
                templateUrl: 'modules/tasks/views/add-task.client.view.html',
                controller: ["$scope", "$modalInstance", "story", function ($scope, $modalInstance, story) {

                    $scope.story = story;
                    
                    $scope.ok = function () {
                        $modalInstance.close();
                    };

                }],
                size: size,
                resolve: {
                    story: function () {
                        return selectedStory;
                    }
                }
            });
        };

        $scope.editTask = function (size, selectedTask) {

            $modal.open({
                templateUrl: 'modules/tasks/views/edit-task.client.view.html',
                controller: ["$scope", "$modalInstance", "task", function ($scope, $modalInstance, task) {
                    $scope.task = task;

                    $scope.ok = function () {
                        $modalInstance.close();
                    };

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                }],
                size: size,
                resolve: {
                    task: function () {
                        return selectedTask;
                    }
                }
            });
        };


        // Sockets

        //Phases
        SocketSprint.on('on.phase.created', function(phase) {
            $scope.phases.push( new Phases(phase) );
        });

        SocketSprint.on('on.phase.updated', function(phase) {
            $scope.handleUpdatedPhase(phase);
        });

        SocketSprint.on('on.phase.deleted', function(phase) {
            $scope.handleDeletedPhase(phase.id);
        });


        //Stories
        SocketSprint.on('on.story.updated', function(story) {
            $scope.handleUpdatedStory(story);
        });

        SocketSprint.on('on.story.returned', function(story) {
            $scope.handleDeletedStory(story.id);
        });


        //Tasks
        SocketSprint.on('on.task.created', function(task) {
            $scope.tasks.push( new Tasks(task));
        });

        SocketSprint.on('on.task.updated', function(task) {
            $scope.handleUpdatedTask(task);
        });

        SocketSprint.on('on.task.returned', function(data) {
            $scope.handleDeletedTaskByStory(data.id);
        });

        SocketSprint.on('on.task.moved', function(task) {
            $scope.handleMovedTask(task);
        });

        SocketSprint.on('on.task.deleted', function(task) {
            $scope.handleDeletedTask(task.id);
        });


        //Sprint
        SocketSprint.on('on.sprint.updated', function(sprint) {
            $scope.sprint = sprint;
        });



    }
]);
/**
 * Created by ScrumTools on 11/10/14.
 */
'use strict';

/*global io:false */

//socket factory that provides the socket service
/*angular.module('core').factory('Socket', ['socketFactory', '$location',
    function(socketFactory, $location) {
        return socketFactory({
            prefix: '',
            ioSocket: io.connect( $location.protocol() +'://' + $location.host() + ':' + $location.port() )
        });
    }
]);*/

angular.module('sprints').factory('SocketSprint', ["$rootScope", function($rootScope) {
    var socket = io('/sprints').connect();
    return {
        on: function(eventName, callback) {
            socket.on(eventName, function() {
                var args = arguments;
                $rootScope.$apply(function() {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function(eventName, data, callback) {
            socket.emit(eventName, data, function() {
                var args = arguments;
                $rootScope.$apply(function() {
                    if(callback) {
                        callback.apply(socket, args);
                    }
                });
            });
        }
    };
}]);
/**
 * Created by ScrumTools on 11/16/14.
 */
'use strict';

//Sprints service used for communicating with the stories REST endpoints
angular.module('sprints').factory('Sprints', ['$resource',
    function($resource) {
        return $resource('projects/:projectId/sprints/:sprintId', { projectId: '@projectId', sprintId: '@sprintId' }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);
/**
 * Created by ScrumTools on 11/9/14.
 */
'use strict';


var storiesApp = angular.module('stories');

storiesApp.directive('stickyNote', ['SocketPB', '$stateParams', function(SocketPB, $stateParams) {
    var linker = function(scope, element, attrs) {
        element.draggable({
            containment: '.containment-wrapper',
            stop: function(event, ui) {
                SocketPB.emit('story.moved', {
                    id: scope.story._id,
                    x: ui.position.left,
                    y: ui.position.top,
                    room: $stateParams.projectId
                });
                scope.story.storyPosX = ui.position.left;
                scope.story.storyPosY = ui.position.top;
                scope.story.$update({ storyId: scope.story._id });
            }
        });

        SocketPB.on('on.story.moved', function(story) {
            // Update if the same story
            if(story.id === scope.story._id) {
                element.animate({
                    left: story.x,
                    top: story.y
                });
            }
        });

        function priotiy(element, story) {
            switch(story.storyPriority) {
                case 'MUST': element.addClass('alert-danger'); break;
                case 'SHOULD': element.addClass('alert-warning'); break;
                case 'COULD': element.addClass('alert-info'); break;
                case 'WON\'T': element.addClass('alert-success'); break;
            }
        }

        // Some DOM initiation to make it nice
        element.css('left', scope.story.storyPosX + 'px');
        element.css('top', scope.story.storyPosY + 'px');
        priotiy(element, scope.story);
        element.fadeIn();
    };

    var controller = ["$scope", function($scope) {
        // Incoming
        SocketPB.on('on.story.updated', function(story) {
            // Update if the same story
            if(story._id === $scope.story._id) {
                $scope.story.storyTitle = story.storyTitle;
                $scope.story.storyDescription = story.storyDescription;
            }
        });
    }];

    return {
        restrict: 'A',
        link: linker,
        controller: controller,
        scope: {
            story: '='
        }
    };
}]);

storiesApp.controller('StoriesController', ['$scope', 'SocketPB', 'Stories', 'Authentication', '$location', '$stateParams', '$modal', '$http', 'Tasks',
    function($scope, SocketPB, Stories, Authentication, $location, $stateParams, $modal, $http, Tasks) {
        $scope.authentication = Authentication;

        // If user is not signed in then redirect back home
        if (!$scope.authentication.user) $location.path('/');

        $scope.stories = Stories.query({ projectId: $stateParams.projectId });

        // Enter in a room
        SocketPB.emit('story.room', $stateParams.projectId);

        // Incoming
        SocketPB.on('on.story.created', function(story) {
            $scope.stories.push( new Stories(story) );
        });

        SocketPB.on('on.story.updated', function(story) {
            $scope.handleUpdatedStory(story);
        });

        SocketPB.on('on.story.deleted', function(story) {
            $scope.handleDeletedStory(story.id);
        });

        // Outgoing
        $scope.createStory = function() {
            var s = new Stories({
                storyTitle: 'Nueva Historia',
                storyDescription: 'Descripción',
                storyValue: 1,
                storyPoint: 1,
                storyPosX: 70,
                storyPosY: 120
            });

            s.$save({ projectId: $stateParams.projectId }, function (story) {
                $scope.stories.push(story);
                SocketPB.emit('story.created', {story: story, room: $stateParams.projectId});
            });
        };

        $scope.deleteStory = function(story) {
            $scope.handleDeletedStory(story._id);
            SocketPB.emit('story.deleted', {id: story._id, room: $stateParams.projectId});
            story.$remove({ projectId: $stateParams.projectId, storyId: story._id });
        };

        $scope.handleDeletedStory = function(id) {
            var oldStories = $scope.stories,
                newStories = [];

            angular.forEach(oldStories, function(story) {
                if(story._id !== id) newStories.push(story);
            });

            $scope.stories = newStories;
        };

        $scope.handleUpdatedStory = function(story) {
            var oldStories = $scope.stories,
                newStories = [];

            angular.forEach(oldStories, function(s) {
                if (s._id === story._id) newStories.push(new Stories(story));
                else newStories.push(s);
            });

            $scope.stories = newStories;
        };

        // Outgoing
        $scope.updateStory = function(story) {
            story.$update({ storyId: story._id });
            SocketPB.emit('story.updated', {story: story, room: $stateParams.projectId});
        };


        $scope.letsPoker = function (size, selectedStory) {
            console.log(selectedStory.storyTitle);
            window.open('http://'+location.host+'/projects/'+selectedStory.projectId+'/stories/'+selectedStory._id+'/pokerscrum#proyecto='+selectedStory.projectId+'&nombre='+selectedStory.storyTitle);
            // function updateStoryList(story) {
            //     $scope.handleUpdatedStory(story);
            // }

            // $modal.open({
            //     templateUrl: 'modules/stories/views/edit-story.client.view.html',
            //     controller: function ($scope, $modalInstance, story) {
            //         $scope.story = story;

            //         $scope.ok = function () {
            //             SocketPB.emit('story.updated', {story: $scope.story, room: $stateParams.projectId});
            //             updateStoryList($scope.story);
            //             $modalInstance.close();
            //         };

            //         $scope.cancel = function () {
            //             $modalInstance.dismiss('cancel');
            //         };
            //     },
            //     size: size,
            //     resolve: {
            //         story: function () {
            //             return selectedStory;
            //         }
            //     }
            // });
        };

        $scope.editStory = function (size, selectedStory) {

            function updateStoryList(story) {
                $scope.handleUpdatedStory(story);
            }

            $modal.open({
                templateUrl: 'modules/stories/views/edit-story.client.view.html',
                controller: ["$scope", "$modalInstance", "story", function ($scope, $modalInstance, story) {
                    $scope.story = story;

                    $scope.ok = function () {
                        SocketPB.emit('story.updated', {story: $scope.story, room: $stateParams.projectId});
                        updateStoryList($scope.story);
                        $modalInstance.close();
                    };

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                }],
                size: size,
                resolve: {
                    story: function () {
                        return selectedStory;
                    }
                }
            });
        };
        
        $scope.moveToSprint = function (size, selectedStory) {

            var sprints = $http.get('/projects/' + $stateParams.projectId + '/sprintNotFinished');
            var moveStory = function (id) {
                $scope.handleDeletedStory(id);
            };
            
            $modal.open({
                templateUrl: 'modules/stories/views/move-to-sprint.client.view.html',
                controller: ["$scope", "$modalInstance", "sprints", "story", function ($scope, $modalInstance, sprints, story) {
                    $scope.sprints = sprints;

                    $scope.move = function (sprint) {
                        $http.put('/projects/' + $stateParams.projectId + '/storiesBacklog', {'story': story, 'sprintId': sprint._id}).success(function(response) {
                            moveStory(story._id);
                            SocketPB.emit('story.deleted', {id: story._id, room: $stateParams.projectId});
                            $modalInstance.close(story);
                        });
                    };

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                }],
                size: size,
                resolve: {
                    sprints: function () {
                        return sprints.then(function (response) {
                            return response.data;
                        });
                    },
                    story: function () {
                        return selectedStory;
                    }
                }
            });
        };
    }
]);

storiesApp.controller('StoriesEditController', ['$scope', '$stateParams', 'Authentication', '$location', '$http', '$log',
    function ($scope, $stateParams, Authentication, $location, $http, $log) {
        $scope.authentication = Authentication;

        // If user is not signed in then redirect back home
        if (!$scope.authentication.user) $location.path('/');

        $scope.priorities = [
            'MUST',
            'SHOULD',
            'COULD',
            'WON\'T'
        ];

        $http.get('/projects/' + $stateParams.projectId + '/members').then(function (response) {
            $scope.members = response.data;
        });

        $scope.showMembers = function (story) {
            var selected = [];
            angular.forEach($scope.members, function (m) {
                if (story.users.indexOf(m._id) >= 0) {
                    selected.push(m.username);
                }
            });
            return selected.length ? selected.join(', ') : 'No user assigned';
        };

        $scope.update = function (updatedStory) {
            var story = updatedStory;
            story.$update({ storyId: story._id });
        };

    }
]);
/**
 * Created by ScrumTools on 11/10/14.
 */
'use strict';

/*global io:false */

//socket factory that provides the socket service
/*angular.module('core').factory('Socket', ['socketFactory', '$location',
    function(socketFactory, $location) {
        return socketFactory({
            prefix: '',
            ioSocket: io.connect( $location.protocol() +'://' + $location.host() + ':' + $location.port() )
        });
    }
]);*/

angular.module('stories').factory('SocketPB', ["$rootScope", function($rootScope) {
    var socket = io('/stories').connect();
    return {
        on: function(eventName, callback) {
            socket.on(eventName, function() {
                var args = arguments;
                $rootScope.$apply(function() {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function(eventName, data, callback) {
            socket.emit(eventName, data, function() {
                var args = arguments;
                $rootScope.$apply(function() {
                    if(callback) {
                        callback.apply(socket, args);
                    }
                });
            });
        }
    };
}]);
/**
 * Created by ScrumTools on 11/8/14.
 */
'use strict';

//Stories service used for communicating with the stories REST endpoints
angular.module('stories').factory('Stories', ['$resource',
    function($resource) {
        return $resource('projects/:projectId/stories/:storyId', { projectId: '@projectId', storyId: '@storyId' }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);
/**
 * Created by ScrumTools on 11/21/14.
 */
'use strict';


var tasksApp = angular.module('tasks');


tasksApp.controller('TasksCreateUpdateController', ['$scope', '$stateParams', 'Authentication', '$location', 'Tasks', 'SocketSprint',
    function ($scope, $stateParams, Authentication, $location, Tasks, SocketSprint) {
        $scope.authentication = Authentication;

        // If user is not signed in then redirect back home
        if (!$scope.authentication.user) $location.path('/');

        $scope.priorities = [
            'VERY HIGH',
            'HIGH',
            'MEDIUM',
            'LOW',
            'VERY LOW'
        ];

        $scope.createTask = function (story) {
            var t = new Tasks({
                taskName: this.taskName,
                taskDescription: this.taskDescription,
                taskPriority: this.taskPriority,
                taskHours: this.taskHours,
                taskRemark: this.taskRemark,
                taskRuleValidation: this.taskRuleValidation
            });

            t.$save({ storyId: story._id }, function (task) {
                SocketSprint.emit('task.created', {task: task, room: story.sprintId});

                $scope.taskName = '';
                $scope.taskDescription = '';
                $scope.taskPriority = {};
                $scope.taskHours = '';
                $scope.taskRemark = '';
                $scope.taskRuleValidation = '';
            });
        };
        
        $scope.updateTask = function (updatedTask) {
            var task = updatedTask;

            task.$update({ storyId: task.storyId, taskId: task._id }, function(response) {
                SocketSprint.emit('task.updated', {task: response, room: $stateParams.sprintId});
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
    }
]);
/**
 * Created by ScrumTools on 11/18/14.
 */
'use strict';

//Phases service used for communicating with the projects REST endpoints
angular.module('tasks').factory('Tasks', ['$resource',
    function($resource) {
        return $resource('stories/:storyId/tasks/:taskId', { storyId: '@storyId', taskId: '@taskId' }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);
'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invalid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		});
	}
]);
'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication','notify',
	function($scope, $http, $location, Authentication, notify) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');
		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/escritorio');
			}).error(function(response) {
				console.log(response);
				notify({message:response.message, templateUrl:'modules/error/angular-notify.html'});
				//$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/escritorio');
			}).error(function(response) {
				notify({message:response.message, templateUrl:'modules/error/angular-notify.html'});
				//$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [
	function() {
		var _this = this;

		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);
'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);