//var config = require('../config/config');
var moment = require("moment");
//retrieves tripdetails fro json
exports.getTripDetails = function (jsonObject) {
	var tripdetails = {};
	
    try{
		  if(!isEmpty(jsonObject))
			{	  
			  tripdetails.trip_uuid = jsonObject.id.trip_uuid;
			  tripdetails.tenant_id = jsonObject.id.tenant_id;
			  tripdetails.end_altitude = jsonObject.end_altitude;
			  tripdetails.end_latitude = jsonObject.end_latitude;			  
			  tripdetails.end_longitude = jsonObject.end_longitude;			  
			  tripdetails.end_time = moment(jsonObject.end_time).format("YYYY-MM-DD HH:mm:ss");			  
			  tripdetails.generated_time = moment(jsonObject.generated_time).format("YYYY-MM-DD HH:mm:ss");		  
			  tripdetails.mo_id = jsonObject.mo_id;			  
			  tripdetails.driver_id = jsonObject.driver_id;			  
			  tripdetails.start_altitude = jsonObject.start_altitude;
			  tripdetails.start_latitude = jsonObject.start_latitude;			  
			  tripdetails.start_longitude = jsonObject.start_longitude;			  
			  //tripdetails.start_altitude = jsonObject.start_altitude;			  
			  tripdetails.start_time = moment(jsonObject.start_time).format("YYYY-MM-DD HH:mm:ss");
			  tripdetails.trip_id = jsonObject.trip_id;
				
			  tripdetails.trip_features = jsonObject.trip_features;	
			  tripdetails.trip_score 	= jsonObject.trip_score;
			  
			  tripdetails.trip_score.query_date	= moment(jsonObject.trip_score.query_date).format("YYYY-MM-DD HH:mm:ss");
			  
			}
		  
		  return tripdetails;
		  
		
    }
    catch(exception)
    {
		console.log("exception::"+exception);
       // res.status(config.HTTP_ERROR_CODES.INVALID_REQUEST).json({"message":messages.FILTER.INVALID_JSON});
    }
};
//retrieves array of subtrips object
exports.getCtxSubTrips = function (jsonObject) {

	var ctx_sub_trips = [];

    try{
		  if(!isEmpty(jsonObject))
			{	  
			 var lengthof_ctx_sub_trips = jsonObject.ctx_sub_trips.length;
		     for(var i = 0; i<lengthof_ctx_sub_trips; i++)
			  	{
					//ctx_sub_trips.push(jsonObject.ctx_sub_trips[i]);
					var obj = jsonObject.ctx_sub_trips[i];
					var ctx_sub_trip = {};
					ctx_sub_trip.trip_id = obj.trip_id;
					ctx_sub_trip.sub_trip_id = obj.id.sub_trip_id;
					ctx_sub_trip.tenant_id = obj.id.tenant_id;
					ctx_sub_trip.avg_speed = obj.avg_speed;
					ctx_sub_trip.end_latitude = obj.end_latitude;
					ctx_sub_trip.end_longitude = obj.end_longitude;
					ctx_sub_trip.end_time = moment(obj.end_time).format("YYYY-MM-DD HH:mm:ss");
					ctx_sub_trip.mo_id = obj.mo_id;
					ctx_sub_trip.driver_id = obj.driver_id;
					ctx_sub_trip.start_latitude = obj.start_latitude;
					ctx_sub_trip.start_longitude = obj.start_longitude;
					ctx_sub_trip.start_time =  moment(obj.start_time).format("YYYY-MM-DD HH:mm:ss");
					ctx_sub_trip.trip_uuid = obj.trip_uuid;
					
					// Driving Behavior Details Schema
					ctx_sub_trip.driving_behavior_details = obj.driving_behavior_details;
					
					for(var i = 0; i<ctx_sub_trip.driving_behavior_details.length; i++) {
						ctx_sub_trip.driving_behavior_details[i].start_time = 
							moment(ctx_sub_trip.driving_behavior_details[i].start_time).format("YYYY-MM-DD HH:mm:ss");
						ctx_sub_trip.driving_behavior_details[i].end_time = 
							moment(ctx_sub_trip.driving_behavior_details[i].end_time).format("YYYY-MM-DD HH:mm:ss");
						ctx_sub_trip.driving_behavior_details[i].generated_time = 
							moment(ctx_sub_trip.driving_behavior_details[i].generated_time).format("YYYY-MM-DD HH:mm:ss");
						ctx_sub_trip.driving_behavior_details[i].ctx_sub_trips_avg_speed = ctx_sub_trip.avg_speed;
					}

					// Ctx Features Schema
					ctx_sub_trip.ctx_features = obj.ctx_features;	
					
					ctx_sub_trips.push(ctx_sub_trip);
			  	}
				  
				return ctx_sub_trips; 
				  
			}
				  		
    }
    catch(exception)
    {
		console.log("exception::"+exception);
       // res.status(config.HTTP_ERROR_CODES.INVALID_REQUEST).json({"message":messages.FILTER.INVALID_JSON});
    }
};

//Retrieves Array of Ctx Features from diffrent ctx subtrips object
exports.getctxfeatures = function (jsonObject) {

	var ctx_features = [];

    try{
		  if(!isEmpty(jsonObject))
			{	  
			 var lengthof_ctx_sub_trips = jsonObject.ctx_sub_trips.length;
			
		     for(var i = 0; i<lengthof_ctx_sub_trips; i++)
			  	{
					var lengthof_ctx_features = jsonObject.ctx_sub_trips[i].ctx_features.length;
				
					for(var j =0;j<lengthof_ctx_features;j++)
					{
						ctx_features.push(jsonObject.ctx_sub_trips[i].ctx_features[j]);
					}
			  	}
				  return JSON.stringify(ctx_features); 				  
			}
				  		
    }
    catch(exception)
    {
		console.log("exception::"+exception);
       // res.status(config.HTTP_ERROR_CODES.INVALID_REQUEST).json({"message":messages.FILTER.INVALID_JSON});
    }
};

//Retrieves Array of DrivingBehavior from diffrent ctx subtrips object
exports.getDrivingBehavior = function (jsonObject) {

	var driving_behavior_details = [];

    try{
		  if(!isEmpty(jsonObject))
			{	  
			 var lengthof_ctx_sub_trips = jsonObject.ctx_sub_trips.length;
			
		     for(var i = 0; i<lengthof_ctx_sub_trips; i++)
			  	{
					var lengthof_driving_behaviors = jsonObject.ctx_sub_trips[i].driving_behavior_details.length;
				
					for(var j =0;j<lengthof_driving_behaviors;j++)
					{
						driving_behavior_details.push(jsonObject.ctx_sub_trips[i].driving_behavior_details[j]);
					}
			  	}
				  return JSON.stringify(driving_behavior_details); 				  
			}
				  		
    }
    catch(exception)
    {
		console.log("exception::"+exception);
       // res.status(config.HTTP_ERROR_CODES.INVALID_REQUEST).json({"message":messages.FILTER.INVALID_JSON});
    }
};


function isEmpty(obj) {
    if (obj == null) return true;
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;

    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }
    return true;
}

