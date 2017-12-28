var logger = require('../config/logger');
var request = require('request');
var dashboard = require('../models/dashboard');  
var map = require('../models/map');
const helper = require('./helpers/utility');

exports.getLastLocation  = function (req, res){
    
	logger.debug("DEV:Inside controller map.getLastLocation");
	var username = req.username;
	map.getLastLocation(req, res, function(err, results){
        if(err){
            //logger.debug("DEV:User already login in"+err);							
            //res.status(config.HTTP_ERROR_CODES.INVALID_REQUEST).json({ "message" : messages.REGISTRATION.ERR_USER_AUTH});
        } else{
			if(results) {
                //logger.debug("DEV:Record already present with details." + err);
                //res.status(config.HTTP_ERROR_CODES.INVALID_REQUEST).json({"message" : messages.REGISTRATION.DUP_USER});
				helper.sendResponse(res, err, results); 
            }
        }
    });
	logger.debug("DEV:done with controller  map.getLastLocation");
};