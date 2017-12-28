(function() {
	'use strict';

	angular.module('cca').controller('RegistrationController', RegistrationController);

	RegistrationController.$inject = [ '$scope', '$state','HTTPPOSTService', 'dialogs' , '$window'];

	function RegistrationController($scope, $state, HTTPPOSTService, dialogs, $window) {
		
		var baseURL = 'https://connected-car-flow.mybluemix.net/api/v1/';
		var requestURL;
		$scope.regForm={};
		$scope.error='';
		$scope.error1='******';
			
		$scope.clearDetails = function () {
			$scope.regForm={};
			$state.go('login');
		}

		$scope.submitDetails =function(){
		
		var phone = $scope.regForm.MOBILE_NO;
			 if($scope.regForm.FIRST_NAME =="" || typeof ($scope.regForm.FIRST_NAME) == "undefined" || $scope.regForm.LAST_NAME =="" || typeof ($scope.regForm.LAST_NAME) == "undefined" || $scope.regForm.USERNAME =="" || typeof ($scope.regForm.USERNAME) == "undefined" || $scope.regForm.CAR_NAME =="" || typeof ($scope.regForm.CAR_NAME) == "undefined"  )
			 {
					dialogs.notify('Please enter string correctly', $scope.error1 );
				  return;
			 }
			 if(phone.length<10 || phone.length>13)
			 {
				dialogs.notify('Please enter mobile no correctly', $scope.error1 );
				  return;
			 }
			 
			  if($scope.regForm.EMAIL =="" || typeof ($scope.regForm.EMAIL) == "undefined")
			  {
						dialogs.notify('Please enter email correctly', $scope.error1 );
				  return;
			  }
					 
				$scope.error='';
				var payload = {};
				requestURL = baseURL + 'neUserRegistration';
				payload = $scope.regForm;
				console.log(payload.USERNAME);
				var config = {
					headers : {'Content-type':'application/json'}}
					
				HTTPPOSTService.post(requestURL, payload,config).then(function(response) {
				
					if(response.statusText!='OK'){
						$scope.error=response.data.description;
						dialogs.notify('Registration Failed', $scope.error );
					}				
					else{
						dialogs.notify('Registration Success', 'Registration done successfully');
						$state.go('login');
					}
					$scope.regForm = {};
				}, function(data) {
					$scope.regForm = {};
					dialogs.error('Error', 'An error has occured during registration');
				});
					
					var newdata = {
						deviceId : payload.MO_ID,
						userName: payload.USERNAME

					};
					console.log(newdata);

			//HTTPPOSTService.post("https://connected-car-service.mybluemix.net/driverinsights/mapping/device" , newdata,config).then(function(response) {
			HTTPPOSTService.post("http://localhost:1000/driverinsights/mapping/device" , newdata,config).then(function(response) {
			console.log(response);		

			});

		}
	}
})();