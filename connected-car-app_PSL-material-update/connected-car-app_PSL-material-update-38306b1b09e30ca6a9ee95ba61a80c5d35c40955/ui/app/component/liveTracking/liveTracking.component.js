(function() {
  'use strict';

  angular.module('cca').controller('LiveTrackingController', LiveTrackingController);

  LiveTrackingController.$inject = ['$scope', 'HTTPGETService',
    'HTTPPOSTService', '$rootScope', '$cookies', '$websocket', 'moment', '$localStorage', '$http'
  ];

  function LiveTrackingController($scope, HTTPGETService, HTTPPOSTService, $rootScope, $cookies, $websocket, moment, $localStorage, $http) {
    $scope.isTrip = false;
    $scope.isLoading = false;
    $scope.deviceId = $cookies.get('deviceId');
    $scope.driver_id = $cookies.get('userName');
    $scope.route = [];
    $scope.source = "";
    $scope.dest = "";
    var xhr = new XMLHttpRequest();

    $scope.realTimeData = {
      'startTime': '',
      'currentTime': '00:00',
      'timeConsumed': '0',
      'currentLocation': '',
      'currentSpeed': '0',
      'distance': '0',
      'fuel_consumed': '0',
      'mileage': '0',
      'start_fuel': ''
    };

    $scope.mapData = {
      "layerId": "trace",
      "layerType": "line",
      "sourceName": "trace",
      "featureType": "LineString",
      "featureCoordinates": [], //[ [-97.74678204618638, 30.398964110941044 ],[ -97.751156, 30.3983384 ]], //from API long, lat
      "isShowPopUP": false,
      "location": {
        "state": "Maharashtra",
        "city": "Mumbai",
        "zipcode": 410401,
        "latitude": 19.076000,
        "longitude": 72.877700
      }
    };

    //Hardcoding the intitation as API not available on server end.
    $scope.patchBoxContent = [{
        "title": "Total Trips Made",
        "value": 5,
        "unit": "",
        "icon": "directions_car"
      },
      {
        "title": "Distance Travelled",
        "value": 326.58,
        "unit": "km",
        "icon": "near_me"
      },
      {
        "title": "Fuel Consumption",
        "value": 4.78,
        "unit": "ltr",
        "icon": "local_gas_station"
      },
      {
        "title": "Errors Reported",
        "value": 0,
        "unit": "",
        "icon": "warning"
      }
    ];

    function startTrip() {
      console.log('start trip');
      if ($scope.deviceId) {
        $scope.allowTripStart = false;
        $scope.mapData.resetMap();
        getTripId('start');
        $localStorage.latLongArray = [];
        $localStorage.starttime = null;
      }
    }

    // Need to evaluate - Utkarsh

    $scope.endTrip = function() {
      $scope.isTrip = false;
      console.log('stopTrip');
      $scope.allowTripStart = true;
      getTripId('end');
      updateDriverDetails();
      changeTripStatus();
      $localStorage.starttime = null;
      $scope.realTimeData.startTime = '';
      keepAlive(false);

    }

    function changeTripStatus() {
      $scope.trip_id = $cookies.get('trip_id');
      console.log("Hello This is My Else Part");

      var requestURL = 'https://connected-car-flow.mybluemix.net/changeTripStatus/' + $scope.trip_id;
      HTTPGETService.get(requestURL).then(function(data) {});
      console.log($scope.trip_id);

    }

    function updateDriverDetails() {
      $scope.patchBoxContent[0].value = $scope.patchBoxContent[0].value + 1;
      //console.log("UpdateDriverDetails Trip Count " + $scope.patchBoxContent[0].count);
      $scope.patchBoxContent[1].value = $scope.patchBoxContent[1].value + Math.floor($scope.realTimeData.distance);
      //console.log("Distance" + $scope.patchBoxContent[1].count );
      //$scope.patchBoxContent[2].count=$scope.patchBoxContent[2].count+Math.floor(($scope.realTimeData.start_fuel-$scope.realTimeData.fuel_consumed));

    }

    function getLiveData(wsData) {

      if (!$scope.realTimeData.startTime) {
        if ($localStorage.starttime == null) {
          $scope.realTimeData.startTime = wsData.d.timestamp;
          $localStorage.starttime = $scope.realTimeData.startTime;
          console.log("Time" + wsData.d.timestamp);
        } else {

          $scope.realTimeData.startTime = $localStorage.starttime;
          console.log("Time" + wsData.d.timestamp);
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
      $scope.patchBoxContent[1].value = $scope.patchBoxContent[1].value + $scope.realTimeData.distance;
      $scope.patchBoxContent[2].value = $scope.patchBoxContent[2].value + 0.0025;
      // if($scope.patchBoxContent[2].count<10)
      // {
      //   $scope.patchBoxContent[2].count=10;
      // }
    }

    function getTripId(tripStatus) {
      //$scope.login = {};
      var data = {};
      $scope.trip_id = $cookies.get('trip_id');
      var config = {
        headers: {
          'Content-type': 'application/x-www-form-urlencoded',

        }
      }
      //let requestURL =  'https://newytl.mybluemix.net/trip/'+$scope.deviceId+'/'+tripStatus;
      console.log("Get Trip_id Function " + $scope.trip_id);
      //let requestURL =  'https://newytl.mybluemix.net/trip/'+$scope.deviceId;
      let requestURL = 'https://connected-car-flow.mybluemix.net/trip/' + $scope.trip_id;
      HTTPPOSTService.post(requestURL, data, config).then(function(data) {
        console.log("hello");
        console.log(JSON.stringify(data));

        if (data && tripStatus == 'start') {

          getDataFromWS();
          getLiveData(wsData);
        }
      }, function(data) {
        // on error
      });
    };

    let wsData;
    let latLong;
    let wsURL;

    function getDataFromWS() {
      console.log('getDataFromWS');

      wsURL = $websocket('wss://connected-car-flow.mybluemix.net/ws/data1');
      wsURL.onOpen(function(message) {

        console.log("Device Id IS " + $scope.deviceId);
        setInterval(function() {
          console.log("Ping");
          wsURL.send({
            ping: '1'
          });

        }, 350000);
      });

      wsURL.onMessage(function(message) {

        console.log("My Message Data " + message.data);
        wsData = JSON.parse(message.data);
        if (wsData.d) {
          latLong = [wsData.d.lng, wsData.d.lat];
          $scope.mapData.drawLiveRoute(latLong);

          $scope.retrieveGeoLocation(wsData.d.lat, wsData.d.lng, function(location) {
            if (location != currLocation && location != '') {
              $scope.realTimeData.currentLocation = location;
              var currLocation = $scope.realTimeData.currentLocation;
              getLiveData(wsData);
            }
          });
        }
      });

      wsURL.onClose(function(message) {
        console.log('on close : ', message);
        if (!$scope.allowTripStart) {
          keepAlive(true);
        }
      });
    };

    function keepAlive(isAlive) {
      if (isAlive) {
        console.log('WS send');
        getDataFromWS();
      } else {
        wsURL.close(true);
        $scope.mapData.showPinsOnMap();
        $scope.mapData.fitBounds();
      }
    };

    function getTripStatus() {
      var data = {};
      var config = {
        headers: {
          'Content-type': 'application/x-www-form-urlencoded',

        }
      }


      var requestURL = 'https://connected-car-flow.mybluemix.net/trip/' + $scope.deviceId;
      HTTPGETService.get(requestURL, data, config).then(function(data) {

        if (data.status == 200 && data.statusText == 'OK') {
          let tripStatus = data.data.TRIP_STATUS;
          console.log(tripStatus)

          resumeTrip()

        } else {
          console.log(data)
        }

      }, function(data) {

      });
    };

    function resumeTrip() {
			$scope.allowTripStart = false
			getDataFromWS()
		}



    AutocompleteDirectionsHandler.prototype.setupPlaceChangedListener = function(autocomplete, mode) {
      var me = this;
      autocomplete.addListener('place_changed', function() {
        var place = autocomplete.getPlace();
        if (!place.place_id) {
          window.alert("Please select an option from the dropdown list.");
          return;
        }
        if (mode === 'ORIG') {
          me.originPlaceId = place.place_id;
        } else {
          me.destinationPlaceId = place.place_id;
        }
        me.route();
      });
    };

    AutocompleteDirectionsHandler.prototype.route = function() {
      if (!this.originPlaceId || !this.destinationPlaceId) {
        return;
      }
      var me = this;

      this.directionsService.route({
        origin: {
          'placeId': this.originPlaceId
        },
        destination: {
          'placeId': this.destinationPlaceId
        },
        travelMode: 'DRIVING'
      }, function(response, status) {
        if (status === 'OK') {
          $scope.route = response.routes[0].overview_path;
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      });
    };

    function initMap() {
      new AutocompleteDirectionsHandler();
    }
    initMap();

    /**
     * @constructor
     */
    function AutocompleteDirectionsHandler() {
      this.originPlaceId = null;
      this.destinationPlaceId = null;
      this.travelMode = 'DRIVING';
      var originInput = document.getElementById('origin-input');
      var destinationInput = document.getElementById('destination-input');
      this.directionsService = new google.maps.DirectionsService;

      var originAutocomplete = new google.maps.places.Autocomplete(
        originInput, {
          placeIdOnly: true
        });
      var destinationAutocomplete = new google.maps.places.Autocomplete(
        destinationInput, {
          placeIdOnly: true
        });

      this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
      this.setupPlaceChangedListener(destinationAutocomplete, 'DEST');
    }

    function sendGPSData(latAndlong, selectedDeviceid, trip_id, driver_id) {
      var arrayNew = JSON.parse(latAndlong);
      var speed = (Math.random() * (200.00 - 100.00) + 0.02).toFixed(2)
      $scope.data = {
        "lat": arrayNew.lat,
        "lng": arrayNew.lng,
        "speed": speed,
        "timestamp": new Date().toISOString(),
        "trip_id": trip_id,
        //"trip_status" : 1,
        "driver_id": $scope.driver_id,
        "deviceId": $scope.deviceId,
      };
      var payload = {
        "ts": new Date().toISOString(),
        "d": $scope.data
      };

      var req = {
        method: 'POST',
        url: "https://connected-car-flow.mybluemix.net/track/" + $scope.deviceId,
        data: payload,
        headers: {
          'Content-Type': 'application/json'
        }
      }
      $http(req).then(function successCallback(response) {}, function errorCallback(response) {});

      // xhr.open('POST', "https://connected-car-flow.mybluemix.net/track/"+$scope.deviceId, true);
      // xhr.setRequestHeader("Content-type", "application/json");
      // xhr.send(JSON.stringify(finaldata));
    }

    $scope.stTrip = function() {
      $scope.isTrip = true;
      $scope.isLoading = false;
      console.log("Starting Trip");
      var trip_id = Math.floor(Math.random() * 10000000000);
      $cookies.put('trip_id', trip_id);
      startTrip();
      for (var i = 0, len = $scope.route.length; i < len; i++) {
        //console.log($scope.route[i]);
        setTimeout(function(y) {
          // 	console.log(JSON.stringify($scope.route[y]));
          // 	console.log(trip_id);
          sendGPSData(JSON.stringify($scope.route[y]), $scope.deviceId, trip_id, $scope.driver_id);
        }, i * 1000, i); // we're passing x
      }
    };

    $scope.canTrip = function() {
      $scope.isLoading = false;
      $scope.source = "";
      $scope.dest = "";
    };

    //Highcharts speed
    var gaugeOptions = {

      chart: {
        type: 'solidgauge'
      },

      title: null,

      pane: {
        center: ['50%', '85%'],
        size: '140%',
        startAngle: -90,
        endAngle: 90,
        background: {
          backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
          innerRadius: '60%',
          outerRadius: '100%',
          shape: 'arc'
        }
      },

      tooltip: {
        enabled: false
      },

      // the value axis
      yAxis: {
        stops: [
          [0.1, '#55BF3B'], // green
          [0.5, '#DDDF0D'], // yellow
          [0.9, '#DF5353'] // red
        ],
        lineWidth: 0,
        minorTickInterval: null,
        tickAmount: 2,
        title: {
          y: -70
        },
        labels: {
          y: 16
        }
      },

      plotOptions: {
        solidgauge: {
          dataLabels: {
            y: 5,
            borderWidth: 0,
            useHTML: true
          }
        }
      }
    };

    // The speed gauge
    var chartSpeed = Highcharts.chart('container-speed', Highcharts.merge(gaugeOptions, {
      yAxis: {
        min: 0,
        max: 200,
        title: {
          text: ''
        }
      },

      credits: {
        enabled: false
      },

      series: [{
        name: 'Speed',
        data: [0],
        dataLabels: {
          format: '<div style="text-align:center"><span style="font-size:22px;color:' +
            ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
            '<span style="font-size:12px;color:silver">km/h</span></div>'
        },
        tooltip: {
          valueSuffix: ' km/h'
        }
      }]

    }));

    setInterval(function() {
      // Speed
      var point;
      var newVal;

      if (chartSpeed) {
        point = chartSpeed.series[0].points[0];
        newVal = parseInt($scope.realTimeData.currentSpeed);
        if (newVal > 200) {
          newVal = 200;
        }
        if (newVal < 0) {
          newVal = 0;
        }
        point.update(newVal);
      }
    }, 1000);

    // Retrieve location using latitude and longitude values
    $scope.retrieveGeoLocation = function(lat, lng, callback) {
      var geocoder = new google.maps.Geocoder();
      var latlng = new google.maps.LatLng(lat, lng);
      var location = '';
      var arrAddress = [];

      geocoder.geocode({
        'latLng': latlng
      }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          if (results[0]) {
            //
            arrAddress = results[0].formatted_address.split(',');
            location = arrAddress.splice(0, arrAddress.length - 2).toString();;
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
