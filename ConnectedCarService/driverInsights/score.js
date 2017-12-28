var _ = require("underscore");
var async = require('async');
var Q = require("q");
var request = require("request");
var cfenv = require("cfenv");
var fs = require("fs-extra");
var moment = require("moment");
var dashdbHelper = require("../dashDB/dashdbHelper");
var debug = require('debug')('analyze');
debug.log = console.log.bind(console);

var objToJson= { };
var exports = module.exports = {};


exports.calculateBehaviorScores = function(trip,scoring) {
    
	var behaviorNames = [
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

    	if(!trip.id){
			// not analyzed yet
			return scoring || {score:0};
		}
		var scoring = scoring || {
			totalTime: 0,
			allBehavior: {totalTime: 0, score:100}
		};
		var trip_total_time = trip.end_time - trip.start_time;
		scoring.totalTime += trip_total_time;
		
		behaviorNames.forEach(function(name){
			if(!scoring[name]){
				scoring[name] = {
					totalTime:0,
					count:0
				};
			}
		});
		// calculate time for each behavior in each sub trip
		var trip_total_badbehavior_time = 0;
		if (trip.ctx_sub_trips && trip.ctx_sub_trips.length > 0) {
			var subtripsarray = trip.ctx_sub_trips;
			// each sub trip
			var all_behaviors = [];
			subtripsarray.forEach(function(subtrip, subtripindex){
				var driving_behavior_details = subtrip.driving_behavior_details;
				if (driving_behavior_details && driving_behavior_details.length > 0) {
					// each behavior
					driving_behavior_details.forEach(function(bhr){
						var name = bhr.behavior_name;
						var behavior = scoring[name];
						behavior.totalTime += (bhr.end_time - bhr.start_time);
						behavior.count++;
						all_behaviors.push({s:bhr.start_time, e:bhr.end_time});
					});
				}
			});
			// gather all behaviors in this trip
			all_behaviors.sort(function(a,b){
				return a.s - b.s;
			});
			// remove dup time
			for(var i=all_behaviors.length-1;i>0;){
				if(all_behaviors[i-1].e > all_behaviors[i].s){
					if(all_behaviors[i-1].e < all_behaviors[i].e){
						all_behaviors[i-1].e = all_behaviors[i].e;
					}
					all_behaviors.splice(i,1);
					if(i == all_behaviors.length) i--;
				}else{
					i--;
				}
			}
			var totalBehaviorTime = 0;
			all_behaviors.forEach(function(t){
				totalBehaviorTime += t.e - t.s;
			});
			scoring.allBehavior.totalTime += totalBehaviorTime;
		}
		// calculate score for each behavior and behaviorTotal
		for (var pname in scoring) {
			if (pname !== "totalTime" && pname !== "score") {
				scoring[pname].score = Math.min((1.0 - (scoring[pname].totalTime / scoring.totalTime)) * 100.0, 100.0);
			}
		}
		// calculate score for this trip
		scoring.score = scoring.allBehavior.score;
		scoring.username = trip.driver_id;
		scoring.query_date = trip.generated_time;
				
		return scoring;


};