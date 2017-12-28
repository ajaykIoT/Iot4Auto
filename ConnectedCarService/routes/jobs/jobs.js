/*
 * REST apis for car devices
 */
var router = module.exports = require('express').Router();
var moment = require('moment');

var driverInsightsAnalyze = require('../../driverInsights/analyze');
var debug = require('debug')('jobs');
debug.log = console.log.bind(console);
var dashdbHelper = require("../../dashDB/dashdbHelper");
var dashDBClient = require('../../dashDB');
var scoring = {};
/**
 * generate job request.
 */
router.get('/job', /*authenticate, */function(req,res) {
	console.log("-------------routes/jobs::job--------------------");
	//var yesterday = moment().subtract(1, "days").format("YYYY-MM-DD");
	var today = moment().format("YYYY-MM-DD");
	driverInsightsAnalyze.sendJobRequest(today, today);
	res.status(200).json({"message": "success"}); 
});
/**
 * generate job summary for provided job_id
 */
router.get('/job/summary', /*authenticate, */function(req,res) {
	console.log("-------------routes/jobs::/job/summary/--------------------");
	var job_id = req.query.job_id;
	console.log("job summary request for job_id ",job_id);
	driverInsightsAnalyze.getSummaryList(job_id);
	res.status(200).json({"message": "success"}); 
});

router.get('/score', /*authenticate, */function(req,res) {
	console.log("-------------routes/score::score--------------------");
	dashDBClient.getConnection().then(function(db){	
		dashdbHelper.insertBehaviorScore(db,8, scoring);
		res.status(200).json({"message": "success"}); 
	});
});

scoring = 
{
  "totalTime": 104000,
  "allBehavior": {
    "totalTime": 11000,
    "score": 89.42307692307693
  },
  "Harsh acceleration": {
    "totalTime": 0,
    "count": 0,
    "score": 100
  },
  "Harsh braking": {
    "totalTime": 3000,
    "count": 3,
    "score": 97.11538461538461
  },
  "Speeding": {
    "totalTime": 7000,
    "count": 1,
    "score": 93.26923076923077
  },
  "Frequent stops": {
    "totalTime": 0,
    "count": 0,
    "score": 100
  },
  "Frequent acceleration": {
    "totalTime": 8000,
    "count": 1,
    "score": 92.3076923076923
  },
  "Frequent braking": {
    "totalTime": 0,
    "count": 0,
    "score": 100
  },
  "Sharp turn": {
    "totalTime": 0,
    "count": 0,
    "score": 100
  },
  "Acceleration before turn": {
    "totalTime": 0,
    "count": 0,
    "score": 100
  },
  "Over-braking before exiting turn": {
    "totalTime": 0,
    "count": 0,
    "score": 100
  },
  "Fatigued driving": {
    "totalTime": 0,
    "count": 0,
    "score": 100
  },
  "score": 89.42307692307693
}

