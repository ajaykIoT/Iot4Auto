var dateFormat = require('dateformat');
var dashDBClient = require('../dashDB');
var driver = require("../models/driver");

exports.getDashboard = function(req, res, next) {
    
	var username = req.username;
	var objToJson = {};
	objToJson.user_info = {};
	objToJson.user_info.username = username;
	objToJson.wifi_signal_status = "Strong";
	objToJson.car_issues_count = 2;
	dashDBClient.getConnection().then(function(db){
		objToJson.driving_scores = {};
		objToJson.driving_scores.total_driving_score = {}; 
		objToJson.total_trips = 0;
		driver.getDrivingScore(req, res, function(err, result){
		if(!err) {
				if(result && result.length > 0){
					var score = result[0].DRIVING_SCORE;
					var total = result[0].TOTAL_COUNT;
					var avgScore = score/total;
					
					objToJson.driving_scores.total_driving_score.score = avgScore; 
					objToJson.driving_scores.total_driving_score.score_limit = 100; 
					objToJson.total_trips = total?parseFloat(total):0;
				}
			}else{
				console.error("Dashboard::getDrivingScore::Error", err);
			}
			driver.getLastTripCoordinate(req, res, function(err, result){
				if(!err) {
					if(result && result.length > 0){
						objToJson.last_trip_coordinate = {};
						var lat = result[0].END_LATITUDE;
						var lng = result[0].END_LONGITUDE;
						objToJson.last_trip_coordinate.lat = lat?parseFloat(lat):0; 
						objToJson.last_trip_coordinate.lng = lng?parseFloat(lng):0; 
					}
				}else{
					console.error("Dashboard::getLastTripCoordinate::Error", err);
				}
				driver.getMilage(req, res, function(err, result){
					if(!err) {
						if(result && result.length > 0){
							var milege = result[0].TOTAL_DRIVING_MILAGE;
							objToJson.driving_scores.total_mileage = milege?parseFloat(milege):0;
						}
					}else{
						console.error("Dashboard::getLastTripCoordinate::Error", err);
					}	
					driver.getDrivingHours(req, res, function(err, result){
						if(!err) {
							if(result && result.length > 0){
								var hours = result[0].TOTAL_DRIVING_HOURS;
								objToJson.driving_scores.total_driving_hours = hours?parseFloat(hours):0;
							}
						}else{
							console.error("Dashboard::getLastTripCoordinate::Error", err);
						}	
						db.close(function(){});
						next(null, objToJson); 
					}, db);
				}, db);	
			}, db);	
		}, db);
	});
};