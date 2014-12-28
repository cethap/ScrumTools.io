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