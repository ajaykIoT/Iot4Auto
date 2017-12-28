var logger = require('../config/logger');
var request = require('request');
var tripsmodel = require('../models/trips');  
const helper = require('./helpers/utility');

var trips = {
getTripIds:function (req, res){
	
   logger.debug("DEV:Inside controller trips.getUserTrips");
		var username = req.username;     
		tripsmodel.getTripIds(req, res, function(err, results){
			
			if(err){
				logger.debug("DEV:Error retrieving tripids"+err);							
				//res.status(config.HTTP_ERROR_CODES.INVALID_REQUEST).json({ "message" : messages.REGISTRATION.ERR_USER_AUTH});
			} else{
				if(results) {
					helper.sendResponse(res, err, results); 
				}
			}
		});
		logger.debug("DEV:done with controller trips.getUserTrips");
},

getUserTrips:function (req, res){
		
	   logger.debug("DEV:Inside controller trips.getUserTrips");
	   var username = req.username;     
			tripsmodel.getUserTrips(req, res, function(err, results){
				
				if(err){
					logger.debug("DEV:Error retrieving tripids"+err);							
					//res.status(config.HTTP_ERROR_CODES.INVALID_REQUEST).json({ "message" : messages.REGISTRATION.ERR_USER_AUTH});
				} else{
					if(results) {
						helper.sendResponse(res, err, results); 
					}
				}
			});
			logger.debug("DEV:done with controller trips.getUserTrips");
	}
};
module.exports = trips;

