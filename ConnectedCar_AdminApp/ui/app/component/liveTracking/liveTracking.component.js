(function() {
	'use strict';

	angular.module('cca').controller('LiveTrackingController', LiveTrackingController);

	LiveTrackingController.$inject = [ '$scope','HTTPGETService',
			'HTTPPOSTService', '$rootScope', '$cookies', '$websocket','moment', '$localStorage' ];



	function LiveTrackingController($scope,HTTPGETService, HTTPPOSTService,
			$rootScope, $cookies, $websocket, moment, $localStorage) {

		var xhr = new XMLHttpRequest();
		$scope.realTimeData={
			'startTime':'',
			'currentTime':'00:00',
			'timeConsumed':'0',
			'currentLocation':'',
			'currentSpeed':'0',
			'distance':'0',
			'fuel_consumed':'0',
			'mileage' :'0',
			'start_fuel':''
		};

		$scope.trip_id=0;
		//$scope.realTimeData.currentTime=moment();
//		$scope.rotateAngle=12;

		$scope.mapData = {
				"layerId" : "trace",
				"layerType" : "line",
				"sourceName" : "trace",
				"featureType" : "LineString",
				"featureCoordinates" : [],//[ [-97.74678204618638, 30.398964110941044 ],[ -97.751156, 30.3983384 ]], //from API long, lat
				"isShowPopUP" : false,
				"location" : {
					"state" : "Maharashtra",
					"city" : "Pune",
					"zipcode" : 410401,
					"latitude" : 18.9766678,
					"longitude" : 72.8449593
				}
		};
		
		$scope.startTrip = function(){
			console.log('start trip');
			if($scope.deviceId){
				$scope.allowTripStart = false;
				$scope.mapData.resetMap();
				getTripId('start');
				$localStorage.latLongArray = [];
				$localStorage.starttime = null;	
						
			}
		}
		
		$scope.endTrip = function(){
			console.log('stopTrip');
			$scope.allowTripStart = true;
			getTripId('end');
			updateDriverDetails();
			changeTripStatus();
			$localStorage.starttime = null;
			$scope.realTimeData.startTime='';
			keepAlive(false);		

		}
		
		function changeTripStatus(){
			$scope.trip_id = $cookies.get('trip_id');
			console.log("Hello This is My Else Part");

			var requestURL = 'https://connected-car-flow.mybluemix.net/changeTripStatus/'+$scope.trip_id;
										HTTPGETService.get(requestURL).then(function(data) {
										}
                						);console.log($scope.trip_id); 
		           
		}

		function updateDriverDetails(){
			$scope.patchBoxContent[0].count=$scope.patchBoxContent[0].count+1;
			console.log("UpdateDriverDetails Trip Count " + $scope.patchBoxContent[0].count);
			$scope.patchBoxContent[1].count=$scope.patchBoxContent[1].count+Math.floor($scope.realTimeData.distance);
			console.log("Distance" + $scope.patchBoxContent[1].count );
			//$scope.patchBoxContent[2].count=$scope.patchBoxContent[2].count+Math.floor(($scope.realTimeData.start_fuel-$scope.realTimeData.fuel_consumed));
			
		}

		function getLiveData(wsData) {

			if (!$scope.realTimeData.startTime) {
				if ($localStorage.starttime == null) {
					$scope.realTimeData.startTime = wsData.d.timestamp;
					$localStorage.starttime = $scope.realTimeData.startTime;
					console.log("Time" + wsData.d.timestamp );
				} else {
					
					$scope.realTimeData.startTime = $localStorage.starttime;
					console.log("Time" + wsData.d.timestamp );
				}

			}

			/*if (!$scope.realTimeData.start_fuel) {
				$scope.realTimeData.start_fuel = wsData.fuel_level;
			}*/

			if (wsData.d.timestamp) {
				$scope.realTimeData.currentTime = wsData.d.timestamp;
			}

			/*if (wsData.fuel_level != fuelLevel) {
				$scope.realTimeData.fuel_consumed = wsData.fuel_level;
				var fuelLevel = wsData.fuel_level.fuel_level;
			}
*/
			if (wsData.d.speed != currSpeed) {
				$scope.realTimeData.currentSpeed = wsData.d.speed;
				var currSpeed = wsData.d.speed;
			}

			var starttime = moment($scope.realTimeData.startTime,
					"yyyy-MM-dd'T'HH:mm:ss'Z'");
			var currtime = moment($scope.realTimeData.currentTime,
					"yyyy-MM-dd'T'HH:mm:ss'Z'");
			$scope.realTimeData.timeConsumed = currtime.diff(starttime,
					'minutes');
			
			$scope.mapData.getDistance();
			$scope.patchBoxContent[1].count=$scope.realTimeData.distance;
			$scope.patchBoxContent[2].count=display();
			if($scope.patchBoxContent[2].count<10)
			{
				$scope.patchBoxContent[2].count=10;
			}

		}

		function getTripId(tripStatus){
			//$scope.login = {};
			var data = {};
			$scope.trip_id = $cookies.get('trip_id');
			var config = {
					headers : {'Content-type':'application/x-www-form-urlencoded',
							
								}} 
			//let requestURL =  'https://newytl.mybluemix.net/trip/'+$scope.deviceId+'/'+tripStatus; 
			console.log("Get Trip_id Function " + $scope.trip_id);
			//let requestURL =  'https://newytl.mybluemix.net/trip/'+$scope.deviceId; 
			let requestURL =  'https://connected-car-flow.mybluemix.net/trip/'+ $scope.trip_id;
			HTTPPOSTService.post(requestURL,data,config).then(function(data) {
				console.log("hello");
				console.log(JSON.stringify(data));
				
				if(data && tripStatus == 'start'){

					getDataFromWS();
					getLiveData(wsData);
				}
			}, function(data) {
				// on error
			});


		}



		let wsData;
		let latLong;
		let wsURL;
		function getDataFromWS(){
			console.log('getDataFromWS');
			
			
			wsURL = $websocket('wss://connected-car-flow.mybluemix.net/ws/data1');
			wsURL.onOpen(function(message) {
		   	  
		   	 console.log("Device Id IS " + $scope.deviceId);
		   	  setInterval(function() {
	           	 console.log("Ping");
	           	  wsURL.send({ping: '1'});
	           	   
				}, 350000);
			});
		     
			wsURL.onMessage(function(message) {

									  
												console.log("My Message Data " + message.data);

												wsData = JSON.parse(message.data);
												if(wsData.d)
												{
												latLong = [wsData.d.lng, wsData.d.lat];
												
												$scope.mapData.drawLiveRoute(latLong);
												


													$scope.retrieveGeoLocation(wsData.d.lat, wsData.d.lng, function (location) {
														if (location != currLocation && location != '') {
															$scope.realTimeData.currentLocation = location;
															var currLocation = $scope.realTimeData.currentLocation;
															getLiveData(wsData);
														}
													});


												}
										
									

				}
							
			);
		     
			wsURL.onClose(function(message) {
		   	  console.log('on close : ', message);
		   	  if(!$scope.allowTripStart){
		   		  keepAlive(true);
		   	  }
			});
		}
		
		function keepAlive(isAlive){
			if(isAlive){
				console.log('WS send');
				getDataFromWS();
			}else{
				wsURL.close(true);
				$scope.mapData.showPinsOnMap();
				$scope.mapData.fitBounds();
			}
		}

	
		function getTripStatus() {
			
			var data = {};
			var config = {
					headers : {'Content-type':'application/x-www-form-urlencoded',
							
								}} 


			var requestURL = 'https://connected-car-flow.mybluemix.net/trip/' + $scope.deviceId;
			HTTPGETService.get(requestURL,data,config).then(function(data) {
				
				if(data.status==200 && data.statusText=='OK')
				{
					let tripStatus = data.data.TRIP_STATUS;
					console.log(tripStatus)
					
						resumeTrip()
					
				}
				else
				{
					console.log(data)
				}

			}, function(data) {
				
			});
		}

		function resumeTrip() {
			$scope.allowTripStart = false
			getDataFromWS()
		}

		$scope.deviceId = $cookies.get('deviceId');
		//console.log('$scope.deviceId : ', $scope.deviceId);
		$scope.allowTripStart = true;
		//resumeTrip();
		getTripStatus()
		$scope.patchBoxContent = [ {
			name : 'No of Trips Made',
			count : '',
			bgColor : 'blue',
			txtcolor : 'text-white',
			imgName : 'icon_tripsmade'
		}, {
			name : 'Distance Travelled',
			count : '',
			unit : 'km',
			bgColor : 'green',
			txtcolor : 'text-white',
			imgName : 'icon_totalcars'
		}, {
			name : 'Fuel Consumption',
			count : '',
			unit : 'ltr',
			bgColor : 'purple',
			txtcolor : 'text-white',
			imgName : 'icon_fuel'
			
		}, {
			name : 'Errors Reported',
			count : '',
			bgColor : 'yellow',
			txtcolor : 'text-white',
			imgName : 'icon_error'
		} ];
		
		

		function getTotalTripCount() {
			var baseURL = 'https://connected-car-flow.mybluemix.net/';

			var requestURL = baseURL + 'tripCount/'+$scope.deviceId;
			HTTPGETService.get(requestURL).then(function(data) {
				console.log("Get Trip Count " + data.data.TRIP_COUNT);
				var a = parseInt(data.data.TRIP_COUNT);
				
				if(data.status==200 && data.statusText=='OK')
				{
					
					$scope.patchBoxContent[0].count = a ;
					console.log($scope.patchBoxContent[0].count);
					
					

				}else{
					$scope.patchBoxContent[0].count = 0;
				}

			}, function(data) {
				// on error
			});

			
		}
		getTotalTripCount();

		function decr()
			{
			 var cnt=100;
			 return function inner()
			 			{
			 				return (cnt=cnt - 0.0025);
			 			};
			}

		var a=decr();
	 	function display()
		{
  
  				return a();
		}




		
		
		// Retrieve location using latitude and longitude values
		$scope.retrieveGeoLocation = function(lat, lng, callback){
		       var geocoder = new google.maps.Geocoder();
		       var latlng = new google.maps.LatLng(lat, lng);
				var location = '';
				var arrAddress = [];

		       geocoder.geocode({ 'latLng': latlng }, function (results, status) {
		       		if (status == google.maps.GeocoderStatus.OK) {
		                       if (results[0]) {
//									
		                       	arrAddress = results[0].formatted_address.split(',');
		                       	location = arrAddress.splice(0,arrAddress.length - 2).toString();;
		                       } else {
		                           console.log('Location not found');
		                       }
		                   } else {
		                       console.log('Geocoder failed due to: ' + status);
		                   }	
							callback(location);
		           });				
		}
	}
})();

