var dateFormat = require('dateformat');
var dashDBClient = require('../dashDB');

var objToJson= { };
var exports = module.exports = {};

var trips = {
	
	getTripIds : function(req, res,next) {
	  
	  var username = req.username;
	  var query = "Select TRIP_ID from TRIPS  INNER JOIN USERS ON TRIPS.DRIVER_ID = USERS.USERID "+
				  "where users.USERNAME='"+username+"'" ;			
	
	dashDBClient.getConnection().then(function(db){			
				db.query(query, function (err, rows) 
				{
					console.log("---------------rows ", rows);
					db.close(function(){});	
					if (err) {
						next(err);
					} else {
						next(null, rows);
					}
				});								
						
			});		
			
	},
	
	getUserTrips : function(req, res,next) {
	  
	  //Query Params
		var query = require('url').parse(req.url,true).query; 
		var tripid = 0;
		var trips_identity = 0;
		var username = req.username;
		var userid = req.userid;	
		
	   	var triproute = {};		
		
				
		var totaltrip_query = "SELECT t1.TRIP_ID, t2.Total_TRIPS  FROM (SELECT ROW_NUMBER() OVER(ORDER BY TRIP_ID) AS rn, TRIPS.*"  
			+ " FROM TRIPS where DRIVER_ID = '"+userid+"') as t1,"
			+ " (SELECT Count(*) AS Total_TRIPS from TRIPS where DRIVER_ID = '"+userid+"') as t2"
			+" WHERE rn BETWEEN '"+query.page+"' AND '"+query.page+"' AND DRIVER_ID = '"+userid+"'";					
		
		
		dashDBClient.getConnection().then(function(db){
				
			db.query(totaltrip_query, function (err, rows) 
			{
				console.log("---------------rows ", JSON.stringify(rows));
				if (rows) {							
					triproute.total_trips = rows[0].TOTAL_TRIPS;
					tripid = rows[0].TRIP_ID;
					
					var trip_route_query = "Select MATCHED_LONGITUDE as LNG, MATCHED_LATITUDE AS LAT,TIMESTAMP AS TS, TRIPS.ID from TRIP_ROUTES"
				   +" INNER JOIN TRIPS ON TRIP_ROUTES.TRIP_ID = TRIPS.TRIP_ID INNER JOIN USERS ON TRIPS.DRIVER_ID = USERS.USERID"  
				   +" WHERE USERS.USERNAME = '"+username+"' AND TRIP_ROUTES.TRIP_ID = '"+tripid+"' ORDER BY TS DESC" ;	
					
				
				db.query(trip_route_query, function (err, rows1) 
				{
					//console.log("---------------rows ", JSON.stringify(rows1));
					if (rows1) {
						trips_identity = rows1[0].ID;
						triproute.coordinates =  rows1;
						
					var trip_features_query = "Select replace(FEATURE_NAME,' ','_') as FEATURE_NAME,FEATURE_VALUE from TRIP_FEATURES WHERE" +" TRIP_ID = '"+trips_identity+"'"  
					+" UNION select replace(BEHAVIOR_NAME,' ','_') as FEATURE_NAME, SUM(BEHAVIOR_COUNT) AS FEATURE_VALUE from " 
					+"BEHAVIOR_SCORE " 
					+" where  TRIP_ID = '"+trips_identity+"'"
					+ " AND BEHAVIOR_NAME = 'Harsh braking' OR   BEHAVIOR_NAME = 'Harsh acceleration' GROUP BY  BEHAVIOR_NAME";
						
						db.query(trip_features_query, function (err, rows2) 
						{
					
							if (rows2) {							
								triproute.Features = rows2;
								next(null, triproute);				
								
								
							}
							
						});					
					}					
				});
				
			}
			else
			{
				next(null, null);
			}
							
		});
				
				
				
				
	});
}		

};

module.exports = trips;