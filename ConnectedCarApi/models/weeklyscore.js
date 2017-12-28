var dateFormat = require('dateformat');
var dashDBClient = require('../dashDB');
var driver = require("../models/driver");
const helper = require('../controllers/helpers/utility');

var weeklyscore ={

	getWeeklyDrivingScore : function(req, res,next) {
	  
			var query = require('url').parse(req.url,true).query; 		
			var objToJson = {};     		
			objToJson.DRIVING_SCORE_DATA = [];    
			
				dashDBClient.getConnection().then(function(db){			
					driver.getDrivingScoreForaWeek(req, res,query.start, query.end,function(err, rows){
						if(rows && rows.length > 0){
							objToJson.DRIVING_SCORE_DATA.push(rows);
						}
					next(null, rows);					
				},db);									
				db.close(function(){});			
			});		
			
	},
	
	getBehaviorCountForaWeek : function(req, res,next) {
	  
			var query = require('url').parse(req.url,true).query; 
						
				dashDBClient.getConnection().then(function(db){			
					driver.getBehaviorCountForaWeek(req, res,query.start, query.end,function(err, rows){
						if(rows && rows.length > 0){
								next(null, rows);
						}
									
				},db);									
				db.close(function(){});			
			});		
			
	}
};

module.exports = weeklyscore;
