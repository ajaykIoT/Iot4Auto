(function() {
	'use strict';

	angular.module('cca').controller('LoginController', LoginController);

	LoginController.$inject = [ '$scope', '$state','$rootScope','HTTPPOSTService', 'dialogs', '$cookies' ];

	function LoginController($scope, $state, $rootScope, HTTPPOSTService, dialogs, $cookies, $modalInstance) {

		$scope.login = {};
		var baseURL = 'https://connected-car-api.mybluemix.net/';
		var requestURL;
		$scope.loading = false;


		// $scope.openTermsCondition= function(){
		// 	dialogs.create('/dialogs/terms.html','LoginController',$scope.data);
		// }

		$scope.doLogin = function() {

			var payload = {};
			requestURL = baseURL + 'auth/custom';
			console.log("Inside do Login");
			payload = $scope.login;
					var newdata = window.btoa(payload.userName +':'+payload.password);
					console.log(newdata);
					var config = {
					headers : {'Content-type':'application/x-www-form-urlencoded',
								'access_token':newdata
								}}

			$scope.loading = true;
			HTTPPOSTService.post(requestURL,payload,config).then(function(response) {
				console.log('response',JSON.stringify(response));

				//console.log(response.message);
				if(response.statusText!="OK"){
					$scope.error=response.data.description;
					$scope.login = {};
					dialogs.notify('Login Failed', $scope.error );
				}
				else{
					$cookies.put('carname',response.data.user.car_name);
					$cookies.put('deviceId',response.data.user.mo_id);
					$cookies.put('driverName',response.data.user.first_name);
					$cookies.put('userName',response.data.user.username);
					$cookies.put('firstName',response.data.user.first_name);

					$state.go('cca.liveTracking');
				}
				$scope.login = {};
			}, function(data) {
				$scope.login = {};
				$scope.loading=false;
				dialogs.error('Error', 'An error has occured while login');
			});

		}

		$scope.doRegister= function() {
				$state.go('registration');
		}

		// $scope.agreed = function(){
		// 	console.log('agreed');
		// 	$scope.termCheckbox=true;
		// 	$modalInstance.close();
		// };
	}

	// angular.module('cca').run(['$templateCache',function($templateCache){

  	// 	$templateCache.put('/dialogs/terms.html','<div class="modal-header"><h4 class="modal-title">Terms and Conditons </h4></div><div class="modal-body"><span class="help-block">Terms amd condtions Terms amd condtions Terms amd condtions Terms amd condtions Terms amd condtions Terms amd condtionsTerms amd condtions Terms amd condtions.</span></div><div class="modal-footer"><button type="button" class="btn btn-default" ng-click="agreed()">I Agree</button></div>')
	// }]);

})();
