(function() {
	'use strict';

	angular.module('cca').config(appConfig);

	appConfig.$inject = ['dialogsProvider'];

	function appConfig(dialogsProvider) {
		
		dialogsProvider.setSize('sm');
//		$locationProvider.html5Mode(false);
//		$locationProvider.hashPrefix('!');
//		cfpLoadingBarProvider.parentSelector = '#loading-bar-container';
//		console.log('cfpLoadingBarProvider.parentSelector : ', cfpLoadingBarProvider.parentSelector);
//		cfpLoadingBarProvider.spinnerTemplate = '<div><span class="fa fa-spinner">Custom Loading Message...</div>';
	}
})();