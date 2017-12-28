(function() {
	'use strict';

	angular.module('cca').config(appRoute);

	appRoute.$inject = [ '$stateProvider', '$locationProvider',
			'$urlRouterProvider' ];

	function appRoute($stateProvider, $locationProvider, $urlRouterProvider) {

		$urlRouterProvider.otherwise('/');

		$stateProvider.state('login', {
			url : '/',
			templateUrl : 'app/component/login/login.component.html',
			controller : 'LoginController',
			data : { pageTitle: 'Login' },
		}).state('registration', {
			url : '/registration',
			templateUrl : 'app/component/registration/registration.component.html',
			controller : 'RegistrationController',
        	data : { pageTitle: 'Registration' },
		}).state('cca', {
			url : '/cca',
			templateUrl : 'app/component/main.component.html',
			controller : 'MainController'
		}).state('cca.liveTracking', {
			url : '/liveTracking',
			templateUrl : 'app/component/liveTracking/liveTracking.component.html',
			controller : 'LiveTrackingController',
			data : { pageTitle: 'Tracking' },
		}).state('cca.reports', {
			url : '/reports',
			templateUrl : 'app/component/reports/reports.component.html',
			controller : 'ReportsController',
			data : { pageTitle: 'Reports' },
		}).state('cca.sim', {
			url : '/simulator',
			templateUrl : 'app/component/sim/simulator.component.html',
			controller : 'SimController',
			data : { pageTitle: 'Simulator' },
		});

	}
})();