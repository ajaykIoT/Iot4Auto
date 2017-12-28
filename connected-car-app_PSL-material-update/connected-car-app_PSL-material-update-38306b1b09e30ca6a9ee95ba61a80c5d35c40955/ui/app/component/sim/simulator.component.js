

(function () {
    'use strict';
    
    angular.module('cca').controller('SimController', SimController)

    SimController.$inject = ['$scope','$cookies'];

    function SimController($scope, $cookies) 
    {

        $scope.startSimulator = function () {
            console.log('check startSimulator');
            doFunction();
        }


        $scope.deviceId = $cookies.get('deviceId');
        $scope.driver_id = $cookies.get('userName');
        var xhr = new XMLHttpRequest();
        var markers = [];
        

        var thaneArray = [{ "title": 'Mumbai', "lat": '18.944397', "lng": '72.832167', "description": "Mumabai" }, { "title": 'Thane', "lat": '19.218331', "lng": '72.978090', "description": "Tahne" }];
        var kalyanArray = [{ "title": 'Mumbai', "lat": '18.944397', "lng": '72.832167', "description": "Mumabai" }, { "title": 'Kalyan', "lat": '18.959144', "lng": '72.830352', "description": "Kalyan" }];
        var naviMumArray = [{ "title": 'Mumbai', "lat": '18.944397', "lng": '72.832167', "description": "Mumabai" }, { "title": 'NaviMumbai', "lat": '19.032783', "lng": '73.029575', "description": "NaviMumbai" }];
        var vasaiArray = [{ "title": 'Mumbai', "lat": '18.944397', "lng": '72.832167', "description": "Mumabai" }, { "title": 'Vasai', "lat": '19.402227', "lng": '72.883302', "description": "Vasai" }];
        var miraArray = [{ "title": 'Mumbai', "lat": '18.944397', "lng": '72.832167', "description": "Mumabai" }, { "title": 'MiraBhayandar', "lat": '19.285850', "lng": '72.903107', "description": "MiraBhayandar" }];
        var dadarArray = [{"title": 'Mumbai', "lat": '18.944397', "lng": '72.832167', "description": "Mumabai"}, { "title": 'Dadar', "lat": '18.957200', "lng": '72.819700', "description": "Dadar" }];
        var puneArray = [{"title": 'Mumbai', "lat": '18.944397', "lng": '72.832167', "description": "Mumabai"}, { "title": 'Pune', "lat": '18.516726', "lng": '73.856255', "description": "Pune" }];
        var mapOptions = {
            center: new google.maps.LatLng(19.143010, 73.044616),
            zoom: 10,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("dvMap"), mapOptions);
        var infoWindow = new google.maps.InfoWindow();
        var lat_lng = new Array();
        var latlngbounds = new google.maps.LatLngBounds();
        


        //When Click Button press this will run

       function doFunction() {
            var trip_id = Math.floor(Math.random()*10000000000);
            $cookies.put('trip_id',trip_id); 
             var driver_id = $cookies.get('userName');
          
            var selectedPoint = document.getElementById('end').value;
            var selectedDeviceid = document.getElementById('deviceid').value;
            // var selectedDeviceid= $scope.deviceId;
            // var selectedPoint= $scope.end;
            if (selectedPoint == "Thane") {
                markers = thaneArray;
            }
            else if (selectedPoint == "Kalyan") {
                markers = kalyanArray;
            }
            else if (selectedPoint == "NaviMumbai") {
                markers = naviMumArray;
            }
            else if (selectedPoint == "Vasai") {
                markers = vasaiArray;
            }
            else if (selectedPoint == "MiraBhayandar") {
                markers = miraArray;
            }
            else if (selectedPoint == "Dadar") {
                markers = dadarArray;
            }
            var endPoint = document.getElementById('start').value;
            var mapOptions = {
                center: new google.maps.LatLng(markers[0].lat, markers[0].lng),
                zoom: 10,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var map = new google.maps.Map(document.getElementById("dvMap"), mapOptions);
            var infoWindow = new google.maps.InfoWindow();
            var lat_lng = new Array();
            var latlngbounds = new google.maps.LatLngBounds();
            for (i = 0; i < markers.length; i++) {
                var data = markers[i];
                var myLatlng = new google.maps.LatLng(data.lat, data.lng);
                lat_lng.push(myLatlng);
                var marker = new google.maps.Marker({
                    position: myLatlng,
                    map: map,
                    title: data.title
                });
                latlngbounds.extend(marker.position);
                (function (marker, data) {
                    google.maps.event.addListener(marker, "click", function (e) {
                        infoWindow.setContent(data.description);
                        infoWindow.open(map, marker);
                    });
                })(marker, data);
            }
            map.setCenter(latlngbounds.getCenter());
            map.fitBounds(latlngbounds);

            //***********ROUTING****************//

            //Initialize the Path Array
            var path = new google.maps.MVCArray();

            //Initialize the Direction Service
            var service = new google.maps.DirectionsService();

            //Set the Path Stroke Color
            var poly = new google.maps.Polyline({ map: map, strokeColor: '#4986E7' });

            //Loop and Draw Path Route between the Points on MAP
            var drowArraypath = [];
            var countTime = 0;
            for (var i = 0; i < lat_lng.length; i++) {
                if ((i + 1) < lat_lng.length) {
                    var src = lat_lng[i];
                    //console.log(JSON.stringify(lat_lng[i]));
                    //console.log(lat_lng[i]);
                    var des = lat_lng[i + 1];
                    //console.log(JSON.stringify(lat_lng[i+1]));
                    path.push(src);
                    poly.setPath(path);
                    service.route({ origin: src, destination: des, travelMode: google.maps.DirectionsTravelMode.DRIVING }, function (result, status) {

                        if (status == google.maps.DirectionsStatus.OK) {
                            //console.log(JSON.stringify(result.routes[0].overview_path));
                            //sendGPSData(JSON.stringify(result.routes[0].overview_path));
                            for (var i = 0, len = result.routes[0].overview_path.length; i < len; i++) {
                                //console.log(result.routes[0].overview_path[i]);
                                setTimeout(function (y) {
                                    console.log(JSON.stringify(result.routes[0].overview_path[y]));
                                    path.push(result.routes[0].overview_path[y]);
                                    console.log(trip_id);
                                    sendGPSData(JSON.stringify(result.routes[0].overview_path[y]), selectedDeviceid,trip_id,driver_id);


                                }, i * 1000, i); // we're passing x
                            }





                        }
                    });
                }
            }
        

        }


        function sendGPSData(latAndlong, selectedDeviceid,trip_id,driver_id,speed,timestamp,trip_status) 
        {
           


            var arrayNew = JSON.parse(latAndlong);

                 var speed = (Math.random() * (200.00 - 100.00) + 0.02).toFixed(2)
              var data={
                    
                    "lat" : arrayNew.lat,
                   "lng" : arrayNew.lng,
                   "speed" : speed,
                   "timestamp" : new Date().toISOString(),
                    "trip_id": trip_id,
                    //"trip_status" : 1,
                    "driver_id": driver_id,
                    "deviceId" : selectedDeviceid,
            };
   
       var finaldata = {"ts":new Date().toISOString(),"d":data};
            
            xhr.open('POST', "https://connected-car-flow.mybluemix.net/track/"+selectedDeviceid, true);
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.send(JSON.stringify(finaldata));


        
        }
    }
})();

