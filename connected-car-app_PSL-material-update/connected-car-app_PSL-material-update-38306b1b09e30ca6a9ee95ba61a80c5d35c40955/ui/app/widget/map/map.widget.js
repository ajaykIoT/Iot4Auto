(function() {
	'use strict';

	angular.module('cca').controller('MapController', MapController);

	MapController.$inject = ['$scope', '$localStorage'];

	function MapController($scope, $localStorage) {
		var map;
		var featureStructure = {};
		$scope.maploaded=true;
		let latLong;
		let featureData = {
				"data" : {
					"type" : "FeatureCollection",
					"features" : [{
						"type" : "Feature",
						"geometry" : {
							"type" : "LineString",
							"coordinates" : []
						},
						"properties": {
		                    //"icon": "car"
						}
					}]
				}
		};
		let pointData = {
			"data" : {
			    "type": "FeatureCollection",
			    "features": [{
			        "type": "Feature",
			        "geometry": {
			            "type": "Point",
			            "coordinates": []
			        }
			    }]
			}
		};
		let count = 0;
		let length = 0;
		let car;
		var latLongArray = [];

		var popup = new mapboxgl.Popup({
		    closeButton: false
		});

		/*function addFeatureToSource(mapObj){
			featureStructure = {
					"type" : "Feature",
					"geometry" : {
						"type" : mapObj.featureType,
						"coordinates" : mapObj.featureCoordinates
					},
					"properties": {
	                    //"icon": "car"
					}
				};

			if (mapObj.isReport) {
				console.log(mapObj.startLat)
				console.log(mapObj.startLong)
				map.addLayer({
					"id": "points",
					"type": "symbol",
					"source": {
						"type": "geojson",
						"data": {
							"type": "FeatureCollection",
							"features": [{
								"type": "Feature",
								"geometry": {
									"type": "Point",
									"coordinates": [mapObj.startLong, mapObj.startLat]
								},
								"properties": {
									"title": "Start",
									"icon": "monument"
								}
							}, {
								"type": "Feature",
								"geometry": {
									"type": "Point",
									"coordinates": [mapObj.endLong, mapObj.endLat]
								},
								"properties": {
									"title": "End",
									"icon": "monument"
								}
							}]
						}
					},
					"layout": {
						"icon-image": "{icon}-15",
						"text-field": "{title}",
						"text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
						"text-offset": [0, 0.6],
						"text-anchor": "top"
					}
				});


			}
			if(mapObj.isShowPopUP){
				featureStructure.properties['description'] = (
						"<div class='popUpContainer'>" +
						"<div class='popUpHeader'>" +
						"</div>" +
						"<div class='popUpBody'>" +
						"<p>Car: <b>"+mapObj.make+"</b></p>" +
						"<p>Driver: <b>"+mapObj.driver+"</b></p>" +
						"<p>Car No: <b>"+mapObj.carNo+"</b></p>" +
						"</div>" +
						"</div>");

				var car = document.createElement('div');
				car.className = 'marker';
//				console.log('rotate angle :',$scope.$parent.rotateAngle);
//				car.style.transform = 'rotate(' + $scope.$parent.rotateAngle + 'deg)';
				var popup = new mapboxgl.Popup({offset: 20})
					.setLngLat(featureStructure.geometry.coordinates)
		        	.setHTML(featureStructure.properties.description)

				new mapboxgl.Marker(car, {offset: [-15,-22]})
					.setLngLat(featureStructure.geometry.coordinates)
					.setPopup(popup)
					.addTo(map);
			}
		}

		function addSourceToMap(mapObj){
			map.addSource(mapObj.sourceName, {
				type : 'geojson',
				data : {
					"type" : "FeatureCollection",
					"features" : [featureStructure]
				}
			});
		}

		function addLayerToMap(mapObj){
			map.addLayer({
				"id" : mapObj.layerId,
				"type" : mapObj.layerType,
				"source" : mapObj.sourceName,
				"layout": (mapObj.sourceName == 'routing') ? {
		            "line-join": "round",
		            "line-cap": "round"
		        }: {},
		        "paint": (mapObj.sourceName == 'routing' ) ? {
		            "line-color": "#00b4ff",
		            "line-width": 8
		        } : {}
			});
		}*/

		$scope.loadMap = function(){

			mapboxgl.accessToken = 'pk.eyJ1Ijoic3dpemFyZCIsImEiOiJjaW5zNDF3dnQxMHBwdHFrajZpaDlmeGhhIn0.2xJtXDJoaY7iji7hI2PPxA';
			map = new mapboxgl.Map({
				container : 'map',
				style : 'mapbox://styles/mapbox/streets-v9',//stylePrep( style, 'route' ),//'mapbox://styles/mapbox/streets-v9',
				center : [ $scope.mapData.location.longitude, $scope.mapData.location.latitude ],
        zoom : 10
			});

			map.on('load', function() {
				map.resize();

				/*addFeatureToSource($scope.mapData);
				addSourceToMap($scope.mapData);
				addLayerToMap($scope.mapData);*/

				var nav = new mapboxgl.NavigationControl();
				map.addControl(nav, 'top-right');

				map.scrollZoom.disable();
				map.boxZoom.disable();
				map.doubleClickZoom.disable();
			});

			/*map.on('zoomstart', function (e) {
		        alert('zoom start');
		    });
		    map.on('zoomend', function (e) {
		        alert('zoom end');
		    });*/

		}

		$scope.mapData.drawLiveRoute = function(data){
			//console.log('latlong in map widget : ', data);
			if(data[0] && data[1]){
				if(count == 0){
					$localStorage.latLongArray.push(data);
//					featureData.data.features[0].geometry.coordinates.push(data);
//					pointData.data.features[0].geometry.coordinates.push(data);
					length = $localStorage.latLongArray.length - 1;
					pointData.data.features[0].geometry.coordinates = $localStorage.latLongArray[length];
					if(!map.getSource('markers')){
						map.addSource('markers', { type: "geojson", data: pointData.data });
						map.addLayer({
					        "id": "markers",
					        "type": "symbol",
					        "source": "markers",
					        "layout": {
					            "icon-image": "car-15",
					            "icon-size": 1.5
//					            "icon-rotate": 240
					        },
					        "paint": {
					            "icon-color" : "#ff0000"
					        }
					    });
					}

					featureData.data.features[0].geometry.coordinates = $localStorage.latLongArray;
					if(!map.getSource('trace')){
						map.addSource('trace', { type: 'geojson', data: featureData.data });
						map.addLayer({
				            "id": "trace",
				            "type": "line",
				            "source": "trace",
				            "paint": {
				                "line-color": "red",
				                "line-opacity": 0.75,
				                "line-width": 8
				            },
				            "layout": {
				                "line-join": "round",
				                "line-cap": "round"
				            },
				        });
					}
					map.jumpTo({ 'center': data, 'zoom': 14 });
			        map.setPitch(30);
					count++;
//					car = document.createElement('div');
//					car.className = 'marker';
					$scope.mapData.showPinsOnMap($localStorage.latLongArray[0]);
				}else{
					length = $localStorage.latLongArray.length - 1;
					if(data[0] != $localStorage.latLongArray[length][0]){
						$localStorage.latLongArray.push(data);
						length = $localStorage.latLongArray.length - 1;
						pointData.data.features[0].geometry.coordinates = $localStorage.latLongArray[length];
						map.getSource('markers').setData(pointData.data);
						featureData.data.features[0].geometry.coordinates = $localStorage.latLongArray;
						map.getSource('trace').setData(featureData.data);
						map.panTo($localStorage.latLongArray[length]);
						count++;
//						$scope.realTimeData.distance=(turf.lineDistance(featureData.data.features[0]).toLocaleString());
//						animate();
//						console.log('check rotate angle :',$scope.$parent.rotateAngle);
//						car.style.transform = 'rotate(' + $scope.$parent.rotateAngle + 'deg)';
						/*new mapboxgl.Marker(car, {offset: [-15,0], rotate: '90'})
							.setLngLat(data)
							.addTo(map);*/
					}
				}
			}
		}

		$scope.mapData.getDistance = function(){
			$scope.realTimeData.distance=(turf.lineDistance(featureData.data.features[0]).toLocaleString());
		}

		/*function animate() {
			pointData.data.features[0].geometry.coordinates = featureData.data.features[0].geometry.coordinates[length - 1];
	        map.getSource('point').setData(pointData.data);
	        if (pointData.data.features[0].geometry.coordinates[0] !== featureData.data.features[0].geometry.coordinates[length - 1]) {
	            requestAnimationFrame(animate);
	        }
	    }*/

		$scope.mapData.showPinsOnMap = function(data){
			let latLong = data;
			if(!data){
				latLong = featureData.data.features[0].geometry.coordinates[length];
			}

			if(latLong){
				var pin = document.createElement('div');
				pin.className = 'pinMarker';

//				let locationURL = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'+ data[0] + ',' +data[1] + '.json?access_token='+mapboxgl.accessToken;

				$scope.$parent.retrieveGeoLocation(latLong[1], latLong[0], function (location) {

					var popup = new mapboxgl.Popup({offset: 20})
						.setLngLat(latLong)
			        	.setHTML(location)

		        	new mapboxgl.Marker(pin, {offset: [-15,-22]})
						.setLngLat(latLong)
						.setPopup(popup)
						.addTo(map);
				});
			}
		}

		$scope.mapData.resetMap = function(){
			while(featureData.data.features[0].geometry.coordinates.length > 0) {
				featureData.data.features[0].geometry.coordinates.pop();
			}
			$scope.loadMap();
			count = 0;
		}

		$scope.mapData.fitBounds = function(){
			var bounds = featureData.data.features[0].geometry.coordinates.reduce(function(bounds, coord) {
	            return bounds.extend(coord);
	        }, new mapboxgl.LngLatBounds(featureData.data.features[0].geometry.coordinates[0], featureData.data.features[0].geometry.coordinates[0]));

	        map.fitBounds(bounds, {
	            padding: 20
	        });
		}

	}
})();
