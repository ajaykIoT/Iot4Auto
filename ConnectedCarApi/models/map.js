var dashDBClient = require('../dashDB');
var driver = require("../models/driver");

exports.getLastLocation = function(req, res, next) {
	var username = req.username;
	var objToJson = {};
	dashDBClient.getConnection().then(function(db){
		driver.getLastTripCoordinate(req, res, function(err, result){
			if(!err) {
				if(result && result.length > 0){
					objToJson.last_location = {};
					var lat = result[0].END_LATITUDE;
					var lng = result[0].END_LONGITUDE;
					objToJson.last_location.lat = lat?parseFloat(lat):0; 
					objToJson.last_location.lng = lng?parseFloat(lng):0; 
					next(null, objToJson);
				}
			}else{
				console.error("Dashboard::getLastTripCoordinate::Error", err);
				next(err, null);
			}
		}, db);
	});
};