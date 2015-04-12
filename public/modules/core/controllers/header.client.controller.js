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