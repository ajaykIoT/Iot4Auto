var tripRoutes = module.exports;

var _ = require("underscore");
var Q = require("q");
var async = require("async");
var debug = require('debug')('tripRoutes');
debug.log = console.log.bind(console);
var dashdbHelper = require("../dashDB/dashdbHelper");
var driverInsightsProbe = require("./probe.js");
var driverInsightsAnalyze = require('../driverInsights/analyze');
var schemas = require('./utility/schemas');
var moment = require('moment');

_.extend(tripRoutes, {

	db: null,
	_init: function(){
		
	},

	setJobId: function(job_id, from, to){
		console.log("-------------tripRoutes::setJobId--------------------");
		var jobs = {};
		jobs.job_id = job_id;
		jobs.tenant_id = driverInsightsProbe.driverInsightsConfig.tenant_id;
		jobs.job_submit_time = moment().format("YYYY-MM-DD HH:mm:ss");
		jobs.from_date = moment(from).format("YYYY-MM-DD HH:mm:ss");
		jobs.to_date = moment(to).format("YYYY-MM-DD HH:mm:ss");
		jobs.job_status = driverInsightsAnalyze.TRIP_ANALYSIS_STATUS.RUNNING.status;
		dashdbHelper.insertJob(jobs);
		
	},
	
	setJobStatus: function(job_id, status){
		dashdbHelper.updateJobStatus(job_id, status);
	},
	
	setTripsDetails : function(tripsDetail) {
		console.log("----------tripRoutes::setTripsDetails-------------");
		//console.log("----------tripRoutes::setTripsDetails::tripsDetail-------------",tripsDetail);
		dashdbHelper.getConnection().then(function(db){
			console.log("---------connected ");
			var stmt = dashdbHelper.createTblInsertStmt('TRIP_DETAILS', db);
			var ctxSubTripsStmt = dashdbHelper.createTblInsertStmt('CTX_SUB_TRIPS', db);
			var tripFeaturesStmt = dashdbHelper.createTblInsertStmt('TRIP_FEATURES', db);
			var ctxFeaturesStmt = dashdbHelper.createTblInsertStmt('CTX_FEATURES', db);
			var drivingBehaviorStmt = dashdbHelper.createTblInsertStmt('DRIVING_BEHAVIOR_DETAILS', db);
			_.each(tripsDetail, function(tripDetail, index){
			//async.each(tripsDetail, function(tripDetail, callback) {
				var details = schemas.getTripDetails(tripDetail);
				dashdbHelper.insertTripDetails(db, stmt, details, function(err){
					console.log("---->>>err1 ",err);
					if(!err){
					
						dashdbHelper.insertTripFeatures(db, tripFeaturesStmt, details);
						
						//console.log("---->>>err2 ",err);
						var ctxSubTrips = schemas.getCtxSubTrips(tripDetail);
						dashdbHelper.insertCtxSubTrips(db, ctxSubTripsStmt, ctxSubTrips, function(e){
							console.log("-------------done insertCtxSubTrips ");
							if(!e){
								async.each(ctxSubTrips, function(ctxSubTrip, callback) {
									
									details.trip_id = ctxSubTrip.trip_id;
									
									//dashdbHelper.insertTripFeatures(db, tripFeaturesStmt, details);
									
									dashdbHelper.insertCtxFeatures(db, ctxFeaturesStmt, ctxSubTrip);
									
									dashdbHelper.insertDrivingBehavior(db, drivingBehaviorStmt, ctxSubTrip);
									
									callback();
								}, function(err) {
									if( err ) {
									  console.log('analyze: error(getSummary): ' + err);
									} else {
									  console.log('trip details processed successfully');
									}
								});	
								
							}
						});
					}
					//callback();
				});
				
			//}, function(err) {
			//	if( err ) {
			//	  console.log('analyze: error(getSummary): ' + err);
			//	} else {
			//	  console.log('trip details processed successfully');
			//	}
			});	
		});
	}
	
});
tripRoutes._init();
