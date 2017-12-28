
var _ = require("underscore");
var async = require("async");
var Q = require("q");
var moment = require("moment");
var dashDBClient = require('../dashDB');
var behaviorNames = [
		"allBehavior",
		"Harsh acceleration",
		"Harsh braking",
		"Speeding",
		"Frequent stops",
		"Frequent acceleration",
		"Frequent braking",
		"Sharp turn",
		"Acceleration before turn",
		"Over-braking before exiting turn",
		"Fatigued driving"];

var dashdbHelper = {
	insertTripFeatures : function(db, tripDetailsInfoTbl, ctxSubTrip) {
		console.log("---dashdbHelper::insertTripFeatures---");
		var tripFeatures = ctxSubTrip.trip_features;

			console.log("<><><><ctxSubTrip.trip_idctxSubTrip.trip_id ", ctxSubTrip.trip_id);
			async.each(tripFeatures, function(tripFeature, callback) {
				tripFeature.trip_id = ctxSubTrip.trip_id;
	
				var values = dashDBClient.createOrderedValuesArray(tripDetailsInfoTbl.columns,  tripFeature);
				tripDetailsInfoTbl.stmt.executeNonQuery(values, function (err, ret){
					if (err) {
						console.error("error while inserting the record in trip_features table", err);
					}else{
						console.log("done Trip Features  insert... ... ...");
					}				
				});				
			}, function(err) {
				if( err ) {
				  console.log('dashdbHelper: error(insertTripFeatures): ' + err);
				} else {
				  console.log('Trip Features processed successfully');
				}
			});	
		//});
	},
	insertCtxFeatures : function(db, tripDetailsInfoTbl, ctxSubTrip){
		console.log("---dashdbHelper::insertCtxFeatures---");
		console.log("---ctxSubTrip ", ctxSubTrip);
		//dashDBClient.getConnection().then(function(db){
			console.log("insertCtxFeatures::connected .... .... ");
			//var tripDetailsInfoTbl = dashDBClient.createTblInsertStmt('CTX_FEATURES', db);
			var select_ctx_sub_trip = "SELECT ID as CTX_SUB_TRIPS_ID FROM CTX_SUB_TRIPS WHERE SUB_TRIP_ID='"+ctxSubTrip.sub_trip_id+"' and TRIP_ID='"+ctxSubTrip.trip_id+"'";
			console.log("---select_ctx_sub_trip 11 ", select_ctx_sub_trip);
			db.query(select_ctx_sub_trip, function (err, ids){
			
				console.log("-----------dashdbHelper::ctxFeatures::ids ", ids);
				
				var ctxFeatures = ctxSubTrip.ctx_features;
				
				async.each(ctxFeatures, function(ctxFeature, callback) {
					ctxFeature.ctx_sub_trips_avg_speed = ctxSubTrip.avg_speed;
					ctxFeature.tenant_id = 	ctxSubTrip.tenant_id;
					if(!ids[0]){
						console.log('insertCtxFeatures::Ctx Sub Trips not found for sub_trip_id='+ctxSubTrip.sub_trip_id);
					}else{
						// update trip_detail_id with database primary key
						ctxFeature.ctx_sub_trips_id = ids[0].CTX_SUB_TRIPS_ID;
						
						var values = dashDBClient.createOrderedValuesArray(tripDetailsInfoTbl.columns,  ctxFeature);
						console.log("----dashdbHelper::insertCtxFeatures::values ", values);
						tripDetailsInfoTbl.stmt.executeNonQuery(values, function (err, ret){
							if (err) {
								console.error("dashdbHelper::insertCtxFeatures::", err);
							}else{
								console.log("done ctx sub trip insert... ... ...");
							}
							//db.close(function(){});
							//next(null);
						});
					}
				}, function(err) {
					if( err ) {
					  console.log('dashdbHelper: error(insertCtxFeatures): ' + err);
					} else {
					  console.log('Ctx Features processed successfully');
					}
				});	
			});
		//});
	},
	insertDrivingBehavior : function(db, tripDetailsInfoTbl, ctxSubTrip){
		console.log("---dashdbHelper::insertDrivingBehavior---");
		
		var drivingBehaviorDetails = ctxSubTrip.driving_behavior_details;
		
		//console.log("---drivingBehaviorDetails ", drivingBehaviorDetails);
		
		//dashDBClient.getConnection().then(function(db){
			console.log("insertDrivingBehavior::connected .... .... ");
			//var tripDetailsInfoTbl = dashDBClient.createTblInsertStmt('DRIVING_BEHAVIOR_DETAILS', db);
			
			var select_ctx_sub_trip = "SELECT ID as CTX_SUB_TRIPS_ID FROM CTX_SUB_TRIPS WHERE SUB_TRIP_ID='"+ctxSubTrip.sub_trip_id+"' and TRIP_ID='"+ctxSubTrip.trip_id+"'";
			console.log("---select_ctx_sub_trip 22 ", select_ctx_sub_trip);
			db.query(select_ctx_sub_trip, function (err, ids){
				console.log("-----------dashdbHelper::insertDrivingBehavior::ids ", ids);
				if(!ids[0]){
					console.log('insertDrivingBehavior::Ctx Sub Trips not found for sub_trip_id='+ctxSubTrip.sub_trip_id);
				}else{
					
					async.each(drivingBehaviorDetails, function(drivingBehavior, callback) {
						// update trip_detail_id with database primary key
						drivingBehavior.ctx_sub_trips_id = ids[0].CTX_SUB_TRIPS_ID;
						drivingBehavior.driver_id = ctxSubTrip.driver_id;
						var values = dashDBClient.createOrderedValuesArray(tripDetailsInfoTbl.columns,  drivingBehavior);
						//console.log("----dashdbHelper::insertDrivingBehavior::values ", values);
						tripDetailsInfoTbl.stmt.executeNonQuery(values, function (err, ret){
							if (err) {
								console.error("dashdbHelper::insertDrivingBehavior::", err);
							}else{
								console.log("done DrivingBehavior insert... ... ...");
							}
							//db.close(function(){});
						});
					}, function(err) {
						if( err ) {
						  console.log('dashdbHelper: error(insertDrivingBehavior): ' + err);
						} else {
						  console.log('Driving Behavior Details processed successfully');
						}
					});	
				}		
			});	
		//});
	},
	
	insertCtxSubTrips : function(db, tripDetailsInfoTbl, ctxSubTrips, next) {
		console.log("---dashdbHelper::insertCtxSubTrips---");
		console.log("---ctxSubTrips ", ctxSubTrips);
		
			async.each(ctxSubTrips, function(ctxSubTrip, callback) {
				var select_trip = "SELECT ID as trip_id FROM TRIPS WHERE TRIP_ID='"+ctxSubTrip.trip_id+"'";
				var select_trip_detail = "SELECT ID as trip_detail_id FROM TRIP_DETAILS WHERE trip_uuid='"+ctxSubTrip.trip_uuid+"'";
				var select_user = "SELECT USERID as driver_id FROM USERS WHERE USERNAME='"+ctxSubTrip.driver_id+"'";
				var final_query = select_trip + ";" + select_trip_detail + ";" + select_user;
				console.log("---final_query ", final_query);
				db.query(final_query, function (err, ids){
				
					console.log("-----------ids ", ids);
					
					if(!ids[0] || !ids[0][0]){
						console.log('Trips not found for trip_id='+ctxSubTrip.trip_id);
						callback();
					}else if(!ids[1] || !ids[1][0]){
						console.log('Trip Details not found for trip_uuid='+ctxSubTrip.trip_uuid);
						callback();
					}else if(!ids[2] || !ids[2][0]){
						console.log('User not found for driver_id='+ctxSubTrip.driver_id);
						callback();
					}else{
						// update trip_id with database primary key
						ctxSubTrip.trip_id = ids[0][0].TRIP_ID;
						// update trip_detail_id with database primary key
						ctxSubTrip.trip_detail_id = ids[1][0].TRIP_DETAIL_ID;
						// update driver_id with database primary key
						ctxSubTrip.driver_id = ids[2][0].DRIVER_ID;
						var values = dashDBClient.createOrderedValuesArray(tripDetailsInfoTbl.columns,  ctxSubTrip);
						console.log("----values ", values);
						tripDetailsInfoTbl.stmt.executeNonQuery(values, function (err, ret){
							if (err) {
								console.error("dashdbHelper::insertCtxSubTrips::", err);
							}else{
								console.log("done ctx sub trip insert... ... ...");
								callback();
							}
							//db.close(function(){});
						});
					}
				});
			
			}, function(err) {
				if( err ) {
					next(err);
				  console.log('dashdbHelper: error(getSummary): ' + err);
				} else {
					next(null);
				  console.log('trip details processed successfully');
				}
				
			});
			
			
		//});
	},
	insertTripDetails : function(db, tripDetailsInfoTbl, tripDetails, next) {
		console.log("---dashdbHelper::insertTripDetails---");
		var self = this;
		//dashDBClient.getConnection().then(function(db){
			//console.log("insertTripDetails::connected .... .... ");
			//var tripDetailsInfoTbl = dashDBClient.createTblInsertStmt('TRIP_DETAILS', db);
			var select_trip = "SELECT ID as trip_id FROM TRIPS WHERE TRIP_ID='"+tripDetails.trip_id+"'";
			var select_user = "SELECT USERID as driver_id FROM USERS WHERE USERNAME='"+tripDetails.driver_id+"'";
			var final_query = select_trip + ";" + select_user;
			console.log("-----dashdbHelper::insertTripDetails::final_query", final_query);
			db.query(final_query, function (err, ids){
				console.log("----dashdbHelper::insertTripDetails::ids ",ids);
				if(!ids[0] || !ids[0][0]){
					console.log('Trips not found for trip_id='+tripDetails.trip_id);
				}else if(!ids[1] || !ids[1][0]){
					console.log('User not found for driver_id='+tripDetails.driver_id);
				}else{
					// update trip_id with database primary key
					tripDetails.trip_id = ids[0][0].TRIP_ID;
					// update driver_id with database primary key
					tripDetails.driver_id = ids[1][0].DRIVER_ID;
					console.log("------------updateDrivingScore--------------");
					self.updateDrivingScore(db, tripDetails.trip_id, tripDetails.trip_score.score);
					self.insertBehaviorScore(db, tripDetails.trip_id, tripDetails.trip_score);
					var values = dashDBClient.createOrderedValuesArray(tripDetailsInfoTbl.columns,  tripDetails);
					console.log("------------dashdbHelper::insertTripDetails::values ",values);
					tripDetailsInfoTbl.stmt.executeNonQuery(values, function (err, ret){
						if (err) {
							console.error("dashdbHelper::insertTripDetails::", err);
						}else{
							console.log("done trip details insert... ... ...");
						}
						db.close(function(){});
						next(null);
					});
				}
			});
		//});
			
	},
	insertTrips : function(trips, next) {
		console.log("---insertTrips---");
		var self = this;
		dashDBClient.getConnection().then(function(db){
			console.log("connected .... .... ");
			var tripsInfoTbl = dashDBClient.createTblInsertStmt('TRIPS', db);
			console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>trips ",trips);
			var already_processed = [];
			async.each(trips, function(trip, callback) {
				// check for duplicate entry
				var select_trip = "SELECT ID FROM TRIPS WHERE TRIP_ID='"+trip.trip_id+"'";
				db.query(select_trip, function (err, val) 
				{
					console.log("----check for duplidate trip entry ", val);
					if(val && val.length == 0){
						var select_job = "SELECT ID AS job_id FROM JOBS WHERE JOB_ID='"+trip.job_id+"'";
						var select_user = "SELECT USERID as driver_id FROM USERS WHERE USERNAME='"+trip.driver_id+"'";
						var select_car = "SELECT ID as car_id FROM CARS WHERE MO_ID='"+trip.mo_id+"'";
						var final_query = select_job + ";" + select_user + ";" + select_car;
						console.log("----final_query ", final_query);
						
						db.query(final_query, function (err, ids) 
						{
							if (err) {
								console.error("dashdbHelper::insertTrips_1::", err);
							} else {
								trip.trip_uuid = trip.id.trip_uuid;
								trip.tenant_id = trip.id.tenant_id;
								if(!ids[0] || !ids[0][0]){
									console.log('Jobs not found for job_id='+trip.job_id);
								}else if(!ids[1] || !ids[1][0]){
									console.log("User not found for driver_id='"+trip.driver_id+"'");
								}else if(!ids[2] || !ids[2][0]){
									console.log('Car not found for mo_id='+trip.mo_id);
								}else{
									trip.jobs_identity_fk = ids[0][0].JOB_ID;
									trip.generated_time = moment(trip.generated_time).format("YYYY-MM-DD HH:mm:ss");
									trip.start_time = moment(trip.start_time).format("YYYY-MM-DD HH:mm:ss");
									trip.end_time = moment(trip.end_time).format("YYYY-MM-DD HH:mm:ss");
									trip.driver_id = ids[1][0].DRIVER_ID;
									trip.carid = ids[2][0].CAR_ID;
									
									var values = dashDBClient.createOrderedValuesArray(tripsInfoTbl.columns,  trip);
									//console.log("----------values ", values);
									
									// check for duplicate entry
									//var select_trip = "SELECT ID FROM TRIPS WHERE TRIP_ID='"+trip.trip_id+"'";
									//db.query(select_trip, function (err, val) 
									//{
										//console.log("----check for duplidate trip entry ", val);
										//if(val && val.length == 0){
											tripsInfoTbl.stmt.executeNonQuery(values, function (err, ret){
												if (err) {
													console.error("dashdbHelper::insertTrips_2::", err);
												}else{
													console.log("done trip insert... ... ...");
													//callback();
												}
											});
										//}
										//callback();
									//});	
								}	
							}
							callback();
						});
					}else{
						console.log("----Trip Id "+trip.trip_id+" already processed");
						already_processed.push(trip.trip_id);
						callback();
					}
				});
			}, function(err) {
				if( err ) {
				  console.log('dashdbHelper: error(insertTrips): ' + err);
				  next(already_processed, err);
				} else {
				  console.log('processed trip successfully');
				  next(already_processed, null);
				}
			});	
		});
	},
	insertTripRoutes : function(tripRoutes, db, tripRoutersInfoTbl) {
		var tripIds = Object.keys(tripRoutes);
			_.each(tripIds, function(tripId, index){
				var tripRoute = tripRoutes[tripId];
					_.each(tripRoute.routes, function(route, index1){
					var m = moment(route.ts);
					var timestamp = m.format("YYYY-MM-DD HH:mm:ss");
					route.timestamp = timestamp;
							var values = dashDBClient.createOrderedValuesArray(tripRoutersInfoTbl.columns,  route);
							console.log("Inserting into Trip_routes", values);
							tripRoutersInfoTbl.stmt.executeNonQuery(values, function (err, ret){
								if (err) {
									console.error("dashdbHelper::insertTripRoutes::", err);
								}else{
									console.log("done trip routes insert... ... ...");
								}
							});
					
				});
			
			});		
	},
	selectTripRoutes : function(from, to, next) {
		console.log("---selectTripRoutes---");
		dashDBClient.getConnection().then(function(db){
			var select_trups = "select id, mo_id as device_id, trip_id as trip_id, MATCHED_LATITUDE as org_lat, MATCHED_LONGITUDE as org_lng, timestamp as org_ts,(select timestamp as last_ts from TRIP_ROUTES order by id desc FETCH FIRST 1 ROWS ONLY) from TRIP_ROUTES where TIMESTAMP_FORMAT(substr(TRIP_ROUTES.timestamp,1,10),'YYYY-MM-DD') >= '"+from+"' and TIMESTAMP_FORMAT(substr(TRIP_ROUTES.timestamp,1,10),'YYYY-MM-DD') <= '"+to+"'  order by id";
			console.log("----select_trups ", select_trups);
			var rows = db.querySync(select_trups);
			db.close(function(){});
			next(rows);
		});
	},
	getJob : function(job_id) {
		console.log("---getJob---");
		var deferred = Q.defer();
		dashDBClient.getConnection().then(function(db){
			var select_job = "SELECT * FROM JOBS WHERE JOB_ID='"+job_id+"'";
			console.log("----select_job ", select_job);
			db.query(select_job, function (err, rows) 
			{
				if (err) {
					deferred.reject({message: err.toString()});
				} else {
					deferred.resolve(rows);
				}
				db.close(function(){});
			});
		});
		return deferred.promise;
	},
	insertJob : function(job) {
		var deferred = Q.defer();
		dashDBClient.getConnection().then(function(db){
			console.log("connected .... .... ");
			var tripRoutersInfoTbl = dashDBClient.createTblInsertStmt('JOBS', db);
			var values = dashDBClient.createOrderedValuesArray(tripRoutersInfoTbl.columns,  job);
			tripRoutersInfoTbl.stmt.executeNonQuery(values, function (err, ret){
				if (err) {
					console.error(err);
					deferred.reject({message: err.toString()});
				}else{
					console.log("done jobs insert... ... ...");
					deferred.resolve({message: 'success'});
				}
				db.close(function(){});
			});
		});
		return deferred.promise;
	},
	updateJobStatus : function(job_id, job_status) {
		dashDBClient.getConnection().then(function(db){
			var update_job = "UPDATE JOBS SET JOB_STATUS='"+job_status+"' WHERE JOB_ID='"+job_id+"'"; 
			console.log("----UPDATE JOB ", update_job);
			db.querySync(update_job);
			db.close(function(){});
		});
	},
	updateDrivingScore : function(db, trip_id, trip_score) {
		console.log("updateDrivingScore :: trip_id "+trip_id+" trip_score " +trip_score);
		var update_job = "UPDATE TRIPS SET DRIVING_SCORE='"+trip_score+"' WHERE ID="+trip_id; 
		db.query(update_job, function (err, ret){
			if (err) {
				console.error("updateDrivingScore :: error " , err);
			}else{
				console.log("update driving score done... ... ...");

			}
		});
	},
	insertBehaviorScore : function(db, trip_id, trip_scores) {
		//console.log("------------dashdbHelper::insertBehaviorScore::trip_scores ", trip_scores);
		console.log("dashdbHelper::insertBehaviorScore :: trip_id "+trip_id);
		var tripRoutersInfoTbl = dashDBClient.createTblInsertStmt('BEHAVIOR_SCORE', db);
		behaviorNames.forEach(function(name){
			var scoring = trip_scores[name];
			scoring.trip_id = trip_id;
			scoring.behavior_name = name;
			scoring.total_time = (scoring.totalTime?scoring.totalTime:0);
			scoring.behavior_count = (scoring.count?scoring.count:0);
			scoring.behavior_score = (scoring.score?scoring.score:0);
			scoring.username = (trip_scores.username?trip_scores.username:0);
			scoring.query_date = (trip_scores.query_date?trip_scores.query_date:0);
			var values = dashDBClient.createOrderedValuesArray(tripRoutersInfoTbl.columns,  scoring);
			tripRoutersInfoTbl.stmt.executeNonQuery(values, function (err, ret){
				if (err) {
					console.error("dashdbHelper::insertBehaviorScore::", err);
				}else{
					console.log("done behavior score insert... ... ...");
				}
			});
		});
	},
	getUserByUsername : function(username) {
		console.log("---getUserByUsername---");
		var deferred = Q.defer();
		dashDBClient.getConnection().then(function(db){
			var select_user = "SELECT * FROM USERS WHERE USERNAME='"+username+"'";
			console.log("----select_job ", select_user);
			db.query(select_user, function (err, rows) 
			{
				if (err) {
					deferred.reject({message: err.toString()});
				} else {
					deferred.resolve(rows);
				}
				db.close(function(){});
			});
		});
		return deferred.promise;
	},
	getCarIdByMOId : function(mo_id) {
		console.log("---getUserByUsername---");
		var deferred = Q.defer();
		dashDBClient.getConnection().then(function(db){
			var select_car = "SELECT * FROM CARS WHERE MO_ID='"+mo_id+"'";
			console.log("----select_car ", select_car);
			db.query(select_car, function (err, rows) 
			{
				if (err) {
					deferred.reject({message: err.toString()});
				} else {
					deferred.resolve(rows);
				}
				db.close(function(){});
			});
		});
		return deferred.promise;
	},
	getConnection: function () {
		var deferred = Q.defer();
		console.log(" connecting ............");
		dashDBClient.getConnection().then(function(db){
			console.log(" Connected ");
			deferred.resolve(db);
		});
		return deferred.promise;
	},
	createTblInsertStmt : function(tableName, db){
		return dashDBClient.createTblInsertStmt(tableName, db);
	}
}

module.exports = dashdbHelper;
