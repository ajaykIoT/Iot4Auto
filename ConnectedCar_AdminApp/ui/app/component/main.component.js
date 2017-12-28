(function() {
	'use strict';

	angular.module('cca').controller('MainController', MainController);

	MainController.$inject = [ '$scope', '$state'];

	function MainController($scope, $state) {

		$scope.leftNavContent = [ {
			name : 'Tracking',
			tabName : 'Live Tracking',
			state : 'cca.liveTracking',
			imgName : 'Tracking-icon',
			activeImgName : 'icon_tracking_selected',
		}, {
			name : 'Reports',
			tabName : 'Reports',
			state : 'cca.reports',
			imgName : 'Reports-icon',
			activeImgName : 'icon_reports_selected',
		}, {
			name : 'Simulator',
			tabName : 'Simulator',
			state : 'cca.sim',
			imgName : 'icon_simulator_nonselected',
			activeImgName : 'icon_simulator_selected',
		}];

		$scope.openLiveTracking = function(){
			$state.go('cca.liveTracking');
		}

		$scope.heading=" Welcome to connected car app!"; 
		$scope.information="connected car app POC will provide the basic features of the CCA application through a simple and user friendly mobile and web user interface."
		$scope.information2="To help you get accustomed, we will show you some tips that will point out how to make maximum use of cca Jio POC.";

		$scope.helpLoader_1=true;
		$scope.helpLoader_2=false;
		$scope.helpLoader_3=false;
		$scope.helpLoader_4=false;
		$scope.helpLoader_5=false;
		$scope.test=true;
		

		$scope.closeHelp = function(){
			
			$scope.helpLoader_2=false;
			$scope.helpLoader_1=false;
			$scope.helpLoader_3=false;
			$scope.helpLoader_4=false;
			$scope.helpLoader_5=false;
			$scope.test= $scope.helpLoader_5 || $scope.helpLoader_4 || $scope.helpLoader_3 || $scope.helpLoader_2 || $scope.helpLoader_1;
			// $scope.$apply(function(){ 
			// 	$scope.test=false;
			// });
			//$scope.test=false;
			
		}

		$scope.startHelp = function(){
			$scope.heading="Search Icon"; 
			$scope.information="This is the search icon, which can be used to search things around the application. This is not implemented in the cca Jio POC."
			$scope.helpLoader_1=false;
			$scope.helpLoader_2=true;
			
		}

		$scope.goNext = function(){
			if($scope.helpLoader_2==true &&  $scope.helpLoader_3==false ){
				$scope.helpLoader_3=true;
				$scope.helpLoader_2=false;
				$scope.heading="User Menu";
				$scope.information="In the POC,  only Logout option is available in the User Menu. Logged in user, can Log Out from the application from the “Log Out” option.";
		
			}
			else{

				if($scope.helpLoader_3==false && $scope.helpLoader_4 == true && $scope.helpLoader_5 == false)
				{
					$scope.information="This is the Start / End Trip Button, by clicking this user can Start tracking the Trip and End tracking the trip.";
					$scope.heading="Start / End Trip Button";
					$scope.helpLoader_4=false;
					$scope.helpLoader_3=false;
					$scope.helpLoader_5=true;
				}
				else{
				$scope.information="This is the Hamburger Menu, which contains the Navigation tabs as the option. Navigation between Live Tracking page and Reports Page can be done through this Menu.";
				$scope.heading="Hamburger Menu";
				$scope.helpLoader_2=false;
				$scope.helpLoader_3=false;
				$scope.helpLoader_4=true;
				}
				
			}
		}

	}

		
})();