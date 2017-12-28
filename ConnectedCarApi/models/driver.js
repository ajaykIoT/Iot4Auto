var dashDBClient = require('../dashDB');
var helper = require('../controllers/helpers/utility');

var json = {};
var driver = {
	getDrivingScore : function(req, res, next, db) {
		var username = req.username;
		var userid = req.userid;	
		var query = "SELECT sum(DRIVING_SCORE) AS DRIVING_SCORE, count(1) AS TOTAL_COUNT from trips " +
		"where trips.DRIVER_ID="+userid;
		db.query(query, function (err, rows) 
		{
			if (err) {
				next(err);
			} else {
				next(null, rows);
			}
		});
	},
	
	getLastTripCoordinate : function(req, res, next, db){
		var userid = req.userid;	
		var username = req.username;
		var query = "select trip_details.END_LATITUDE, trip_details.END_LONGITUDE, trips.GENERATED_TIME from trips " + 
			"join trip_details on (trips.ID = trip_details.TRIP_ID) " + 
			"where trips.DRIVER_ID="+userid
			" order by trips.GENERATED_TIME desc " + 
			"FETCH FIRST 1 ROWS ONLY"
			
		console.log("---query ", query);
		db.query(query, function (err, rows) 
		{
			//console.log("---------------rows ", rows);
			if (err) {
				next(err);
			} else {
				next(null, rows);
			}
		});
	},
	getMilage:function(req, res, next, db)
	{
		var username = req.username;
		var userid = req.userid;
		var query = "SELECT SUM(TRIP_FEATURES.FEATURE_VALUE) as total_driving_milage FROM TRIP_FEATURES TRIP_FEATURES "
							+ "JOIN TRIPS TRIPS ON TRIP_FEATURES.TRIP_ID = TRIPS.ID "
							+ "where TRIPS.DRIVER_ID ="+userid
							+ " AND TRIP_FEATURES.FEATURE_NAME ='distance' "
							+ "GROUP BY TRIP_FEATURES.FEATURE_NAME";
							
        console.log("---query ", query);
        db.query(query, function (err, rows) 
		{
			//console.log("---------------rows ", rows);
			if (err) {
				next(err);
			} else {
				next(null, rows);
			}
		});
        
	},
  
	getDrivingHours:function(req, res, next, db)
	{
		var username = req.username;
		var userid = req.userid;
		var query = "SELECT SUM(TRIP_FEATURES.FEATURE_VALUE) as total_driving_hours FROM TRIP_FEATURES TRIP_FEATURES " 
							+ "JOIN TRIPS TRIPS ON TRIP_FEATURES.TRIP_ID = TRIPS.ID "
							+ "where TRIPS.DRIVER_ID ="+userid
							+ " AND TRIP_FEATURES.FEATURE_NAME ='time_span' "
							+ "GROUP BY TRIP_FEATURES.FEATURE_NAME";
				console.log("---query ", query);
		db.query(query, function (err, rows) 
		{
			//console.log("---------------rows ", rows);
			if (err) {
				next(err);
			} else {
				next(null, rows);
			}
		});
	},
	
	getDrivingScoreForaWeek:function(req, res, fromdate, todate,next,db)
	{
		var username = req.username;
	    var count = 0;
		var behaviorobject = {};
		
		var obj_avg_speed = {
		feature_name: "avg_speed",
		feature_value: 85
		
		};
		
		var obj_km_travelled = {
		feature_name: "total_km_travelled",
		feature_value: 8796
		}
		
		
		behaviorobject.driving_score_data = [];
		behaviorobject.driving_behavior = {};
		behaviorobject.trip_aggregates = [];
		
	
		var query1 = "SELECT DISTINCT VARCHAR_FORMAT (QUERY_DATE,'YYYY-MM-DD') as DATE,SUM(BEHAVIOR_SCORE)/count(*)"
		+" as TOTAL_SCORE FROM BEHAVIOR_SCORE WHERE USERNAME ='"+username+"'"
		+" AND BEHAVIOR_NAME ='allBehavior' AND VARCHAR_FORMAT (query_date,'YYYY-MM-DD') BETWEEN '"+fromdate+"'"  
		+" AND '"+ todate+"'"  + " GROUP BY VARCHAR_FORMAT (QUERY_DATE,'YYYY-MM-DD')";
		
		var query2 = "SELECT replace(BEHAVIOR_NAME,' ','_') as BEHAVIOR_NAME,SUM(BEHAVIOR_COUNT) as behavior_count from"
				   +" BEHAVIOR_SCORE"
				   +" where USERNAME ='"+username+"'"
				   +" AND VARCHAR_FORMAT (query_date,'YYYY-MM-DD') BETWEEN '"+fromdate+"'"  
				   +" AND '"+ todate+"'"  + " GROUP BY BEHAVIOR_NAME,USERNAME";
		
			console.log("---query ", query1);
			
			db.query(query1, function (err, rows1) 
			{
				console.log("---------------rows ", JSON.stringify(rows1));
				if (rows1) {
					//next(null, rows);	
					
					behaviorobject.driving_score_data = rows1;
					
				db.query(query2, function (err, rows2) 
				{
					console.log("---------------rows ", JSON.stringify(rows2));
					if (rows2) {
										
						behaviorobject.trip_aggregates.push(obj_avg_speed);
						behaviorobject.trip_aggregates.push(obj_km_travelled);
						behaviorobject.driving_behavior = rows2;
						next(null, behaviorobject);				
						
						
					}
					
				});
					
					
				}
				
			});
	
	},
	
	/*
	getDrivingScoreForaWeek:function(req, res, dates,next,db)
	{
		var username = req.username;
	    var rowArray = [];
		var count = 0;
		
	dates.forEach(function(date) {
		
		var query = "SELECT VARCHAR_FORMAT (TRIPS.GENERATED_TIME,'YYYY-MM-DD') as date,SUM(BS.BEHAVIOR_SCORE)/count(BS.BEHAVIOR_SCORE)"
                    +" as total_score FROM BEHAVIOR_SCORE BS"
					+" INNER JOIN TRIPS TRIPS ON BS.TRIP_ID = TRIPS.ID "
					+" INNER JOIN USERS USERS ON TRIPS.DRIVER_ID = USERS.USERID"
					+" where USERS.USERNAME ='"+username+"'"
					+" AND BS.BEHAVIOR_NAME ='allBehavior'"
					+" AND VARCHAR_FORMAT (TRIPS.GENERATED_TIME,'YYYY-MM-DD') ='"+date+"'"
					+" GROUP BY TRIPS.GENERATED_TIME, BS.BEHAVIOR_NAME  ORDER BY TRIPS.GENERATED_TIME desc FETCH FIRST 1 ROWS ONLY";
		
			
			console.log("---query ", query);
			
			db.query(query, function (err, rows) 
			{
				console.log("---------------rows ", JSON.stringify(rows));
				if (rows) {
					rowArray.push(rows)					
					count = count + 1;					
				}
				if(count == rowArray.length )
				{
					console.log("-----------------------count",count);
					next(null, rowArray);
					
				}
			});
			
		});			
	},
	*/
	
	getBehaviorCountForaWeek:function(req, res, fromdate, todate,next,db)
	{
		var username = req.username;
	    var count = 0;
		
	
		
		var query = "SELECT BEHAVIOR_NAME,SUM(BEHAVIOR_COUNT) as Behavior_Count,USERNAME from BEHAVIOR_SCORE"
				   +" where USERNAME ='"+username+"'"
				   +" AND VARCHAR_FORMAT (QUERY_DATE,'YYYY-MM-DD') BETWEEN '"+fromdate+"'"  
				   +" AND '"+ todate+"'"  + " GROUP BY BEHAVIOR_NAME,USERNAME";
		
			
			console.log("---query ", query);
			
			db.query(query, function (err, rows) 
			{
				console.log("---------------rows ", JSON.stringify(rows));
				if (rows) {
					next(null, rows);	
				}
				
			});
	
	},
	
	getTotalHarshBrakingforAWeek:function(req, res, next, db)
	{
		var username = req.username;
		var fromdate = req.params.start;
		var todate = req.params.end;
		
		
		var query = "SELECT SUM(BEHAVIOR_COUNT) as total_harsh_breaking FROM BEHAVIOR_SCORE BS"
					+"INNER JOIN TRIPS TRIPS ON BS.TRIP_ID = TRIPS.ID "
					+"INNER JOIN USERS USERS ON TRIPS.DRIVER_ID = USERS.USERID"
					+"where USERS.USERNAME ='"+username+"'+ AND BS.BEHAVIOR_NAME ='Harsh braking'"
					+"AND VARCHAR_FORMAT (TRIPS.GENERATED_TIME,'YYYY-MM-DD') BETWEEN '"+fromdate+"'" 
					+"AND'"+todate+"'+ GROUP BY BS.BEHAVIOR_NAME";
        
        console.log("---query ", query);
		db.query(query, function (err, rows) 
		{
			console.log("---------------rows ", rows);
			if (err) {
				next(err);
			} else {
				next(null, rows);
			}
		});
	},
	
	getTotalHarshAccelforAWeek:function(req, res, next, db)
	{
		var username = req.username;
		var fromdate = req.params.start;
		var todate = req.params.end;
		
		
		var query = "SELECT SUM(BEHAVIOR_COUNT) as total_harsh_acceleration FROM BEHAVIOR_SCORE BS"
					+"INNER JOIN TRIPS TRIPS ON BS.TRIP_ID = TRIPS.ID "
					+"INNER JOIN USERS USERS ON TRIPS.DRIVER_ID = USERS.USERID"
					+"where USERS.USERNAME ='"+username+"'+ AND BS.BEHAVIOR_NAME ='Harsh acceleration'"
					+"AND VARCHAR_FORMAT (TRIPS.GENERATED_TIME,'YYYY-MM-DD') BETWEEN '"+fromdate+"'" 
					+"AND'"+todate+"'+ GROUP BY BS.BEHAVIOR_NAME";
	
        
        console.log("---query ", query);
		db.query(query, function (err, rows) 
		{
			console.log("---------------rows ", rows);
			if (err) {
				next(err);
			} else {
				next(null, rows);
			}
		});
        
	},
	
	getAverageSpeedforAWeek:function(req, res, next, db)
	{
		var username = req.username;
		var fromdate = req.params.start;
		var todate = req.params.end;
		
		
		var query = "SELECT SUM(FEATURE_VALUE)/COUNT(FEATURE_VALUE) as weekly_average_speed FROM TRIP_FEATURES TF"
					+"INNER JOIN TRIPS TRIPS ON TF.TRIP_ID = TRIPS.ID"
					+"INNER JOIN USERS USERS ON TRIPS.DRIVER_ID = USERS.USERID"
					+"where USERS.USERNAME ='"+username+"'+ AND TF.FEATURE_NAME ='average_speed'"
					+"AND VARCHAR_FORMAT (TRIPS.GENERATED_TIME,'YYYY-MM-DD') BETWEEN '"+fromdate+"'" 
					+"AND'"+todate+"'+ GROUP BY TF.FEATURE_NAME";
					
		console.log("---query ", query);
		db.query(query, function (err, rows) 
		{
			console.log("---------------rows ", rows);
			if (err) {
				next(err);
			} else {
				next(null, rows);
			}
		});
        
        
	},
	
	getMilageforAWeek:function(req, res, next, db)
	{
		var username = req.username;
		var fromdate = req.params.start;
		var todate = req.params.end;
		
		
		var query = "SELECT SUM(FEATURE_VALUE)/COUNT(FEATURE_VALUE) as weekly_milage FROM TRIP_FEATURES TF"
					+"INNER JOIN TRIPS TRIPS ON TF.TRIP_ID = TRIPS.ID"
					+"INNER JOIN USERS USERS ON TRIPS.DRIVER_ID = USERS.USERID"
					+"where USERS.USERNAME ='"+username+"'+ AND TF.FEATURE_NAME ='distance'"
					+"AND VARCHAR_FORMAT (TRIPS.GENERATED_TIME,'YYYY-MM-DD') BETWEEN '"+fromdate+"'" 
					+"AND'"+todate+"'+ GROUP BY TF.FEATURE_NAME";
					
		
        console.log("---query ", query);
		db.query(query, function (err, rows) 
		{
			console.log("---------------rows ", rows);
			if (err) {
				next(err);
			} else {
				next(null, rows);
			}
		});
        
	},
	
	getDrivingScoreData: function(req, res, next, db) {
		
		var query = require('url').parse(req.url,true).query;
		
		var dates = helper.enumerateDaysBetweenDates(query.start,query.end);
		var scores = [];
		
		
		//Scores for a week
		dates.forEach(function(date) {
			scores.push(driver.getDrivingScoreForaDay(req,res,date,db));
		});
				
		
		
		
		var scorejson = {
			"driving_score_data": {
				"type": "array",
				"items": {            
					"$ref": "#/definitions/DrivingScoreData" 
				} 
			},
			"tips": {
				"type": "array",
				"items": {            
					"type": "string"
				} 
			}			
		}
		
		
		
		next(null, scores);
	}
};
 
 
module.exports = driver;

json = {
    "DRIVING_SCORE_DATA": [
        {
            "DATE": 1484138896000,
            "TOTAL_SCORE": 50.0
        },
        {
            "DATE": 1484139005000,
            "TOTAL_SCORE": 40.0
        },
        {
            "DATE": 1484138896000,
            "TOTAL_SCORE": 30.0
        }
    ],
    "DRIVING_BEHAVIOUR": {
        "HARSH_ACCELERATION": 100,
        "HARSH_BRAKING": 100,
        "AVG_SPEED": 87.3,
        "FREQUENT_STOPS": 80,
        "FREQUENT_ACCELERATION": 100,
        "FREQUENT_BRAKING": 90,
        "SHARP_TURN": 100,
        "ACCELERATION_BEFORE_TURN": 94,
        "OVER_BRAKING_BEFORE_EXITING_TURN": 94,
        "FATIGUED_DRIVING": 100,
        "TOTAL_KM_TRAVELLED": 100
    },
    "TIPS": [
        "TIPS1",
        "TIPS2",
        "TIPS3"
    ]
}
