(function() {
	'use strict';

	angular.module('cca').run(appRun);

	appRun.$inject = [ '$rootScope'];

	function appRun($rootScope) {
		$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
			$rootScope.currState = toState.name;
			$rootScope.currPageTitle = toState.data.pageTitle;
			console.log('$scope.currState : ', $rootScope.currState);
		});
	}
})();