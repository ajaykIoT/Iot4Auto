var logger = require('../config/logger');
var request = require('request');
var scoremodel = require('../models/weeklyscore');  
const helper = require('./helpers/utility');

var weeklyscore = {
	getWeeklyDrivingScore : function (req, res){
		
		logger.debug("DEV:Inside controller dashboard.getWeeklyScore");
		var username = req.username;     
		scoremodel.getWeeklyDrivingScore(req, res, function(err, results){
			
			if(err){
				//logger.debug("DEV:User already login in"+err);							
				//res.status(config.HTTP_ERROR_CODES.INVALID_REQUEST).json({ "message" : messages.REGISTRATION.ERR_USER_AUTH});
			} else{
				if(results) {
					helper.sendResponse(res, err, results); 
				}
			}
		});
		logger.debug("DEV:done with controller dashboard.getDashboardscore");
	},

	getWeeklyDrivingBehaviorCount : function (req, res){
		
		logger.debug("DEV:Inside controller dashboard.getWeeklyScore");
		var username = req.username;     
		console.log("inside getWeeklyDrivingBehaviorScore");
		scoremodel.getBehaviorCountForaWeek(req, res, function(err, results){
			
			if(err){
				logger.debug("DEV:User already login in"+err);							
				res.status(config.HTTP_ERROR_CODES.INVALID_REQUEST).json({ "message" : messages.REGISTRATION.ERR_USER_AUTH});
			} else{
				if(results) {
					helper.sendResponse(res, err, results); 
				}
			}
		});
		logger.debug("DEV:done with controller dashboard.getDashboardscore");
	}

};

module.exports = weeklyscore;
