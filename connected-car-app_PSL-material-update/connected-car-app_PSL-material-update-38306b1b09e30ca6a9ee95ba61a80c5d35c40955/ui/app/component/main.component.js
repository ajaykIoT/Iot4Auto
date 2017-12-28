(function() {
	'use strict';

	angular.module('cca').controller('MainController', MainController);

	MainController.$inject = [ '$scope', '$state'];

	function MainController($scope, $state) {

		$scope.leftNavContent = [ {
			name : 'Tracking',
			tabName : 'Live Tracking',
			state : 'cca.liveTracking',
			iconName: 'my_location'
		}, {
			name : 'Reports',
			tabName : 'Reports',
			state : 'cca.reports',
			iconName: 'assessment'
		}];

		$scope.openLiveTracking = function(){
			$state.go('cca.liveTracking');
		};
	}
})();
