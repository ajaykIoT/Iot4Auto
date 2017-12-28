
var _ = require("underscore");
var moment = require("moment");
var dashDBClient = require('../dashDB');

var dashdbHelper = {
	insertTripRoutes : function(tripRoutes) {
		var tripIds = Object.keys(tripRoutes);
		dashDBClient.getConnection().then(function(db){
			console.log("connected .... .... ");
			var tripRoutersInfoTbl = dashDBClient.createTblInsertStmt('TRIP_ROUTES', db);
			
			_.each(tripIds, function(tripId, index){
				var tripRoute = tripRoutes[tripId];
				_.each(tripRoute.routes, function(route, index1){
				
					var m = moment(route.ts);
					var timestamp = m.format("YYYY-MM-DD HH:mm:ss");
					route.timestamp = timestamp;
			
					var values = dashDBClient.createOrderedValuesArray(tripRoutersInfoTbl.columns,  route);
					tripRoutersInfoTbl.stmt.executeNonQuery(values, function (err, ret){
						if (err) {console.error(err);}else{console.log("done ... ... ...");}
					});
				});
			
			});
		});
	},
	selectTripRoutes : function(from, to) {
		dashDBClient.getConnection().then(function(db){
			var select_triproutes = "select id, mo_id as device_id, trip_id as trip_id, MATCHED_LATITUDE as org_lat, MATCHED_LONGITUDE as org_lng, timestamp as org_ts,(select timestamp as last_ts from TRIP_ROUTES order by id desc FETCH FIRST 1 ROWS ONLY) from TRIP_ROUTES where TIMESTAMP_FORMAT(substr(TRIP_ROUTES.timestamp,1,10),'YYYY-MM-DD') >= '"+from+"' and TIMESTAMP_FORMAT(substr(TRIP_ROUTES.timestamp,1,10),'YYYY-MM-DD') <= '"+to+"'  order by id";
			console.log("----select_trips ", select_triproutes);
			var rows = db.querySync(select_triproutes);
			db.close(function(){});
			//next(rows);
			return rows;
			
		});
	},
	insertJobs : function(job_id, tenant_id, job_submit_time, from, to, job_status) {
		var tripIds = Object.keys(tripRoutes);
		dashDBClient.getConnection().then(function(db){
			console.log("connected .... .... ");
			var tripRoutersInfoTbl = dashDBClient.createTblInsertStmt('JOBS', db);
			var jobs = {};
			jobs.job_id = job_id;
			jobs.tenant_id = tenant_id;
			jobs.job_submit_time = job_submit_time;
			jobs.from_data = from;
			jobs.to_date = to;
			jobs.job_status = job_status;
			var values = dashDBClient.createOrderedValuesArray(tripRoutersInfoTbl.columns,  jobs);
			tripRoutersInfoTbl.stmt.executeNonQuery(values, function (err, ret){
				if (err) {console.error(err);}else{console.log("done ... ... ...");}
			});
		});
	},
}

module.exports = dashdbHelper;
