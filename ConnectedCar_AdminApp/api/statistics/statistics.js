'use strict';

var Cloudant_client = require('cloudant');
var path = require('path');
const cloudant = require('../../db/cloudant');


function getAll(payload,callback) {
  var data = [
              
              {
		                "name": "Gopalapuram",
		                "state": "Tamil Nadu",
		                "city": "Chennai",
		                "zipcode": 410401,
		                "latitude": 13.0500914,
		                "longitude": 80.2532516,
		                "info" : {
		                	"ElevatorsNo" : 5,
		                	"Issues" : "Worn Sheaves",
		                	"Location": "Gopalapuram",
		                	"Contact" : 59865656
		                }
		            },
		            {
		                "name": "Mylapore",
		                "state": "Tamil Nadu",
		                "city": "Chennai",
		                "zipcode": 410401,
		                "latitude": 13.0406923,
		                "longitude": 80.2719264,
		                "info" : {
		                	"ElevatorsNo" : 6,
		                	"Issues" : "Myapore",
		                	"Location": "Kolapakkam",
		                	"Contact" : 7345876345
		                }
		            },
		            
		            {
		                "name": "Mugalivakkam",
		                "state": "Tamil Nadu",
		                "city": "Chennai",
		                "zipcode": 410401,
		                "latitude": 13.0219092,
		                "longitude": 80.155688,
		                "info" : {
		                	"ElevatorsNo" : 2,
		                	"Issues" : "Noisy bearings",
		                	"Location": "Mugalivakkam",
		                	"Contact" : 8378857483
		                }
		            }
	            
	            ];
  
  callback(null, data);
}

function getStatistics(payload,callback) {
	
	var selector = {
			  "selector": {
				    "Status": {
				      "$eq": "Pending"
				    }
				  },
				  "fields": [
				    "_id",
				    "_rev"
				  ],
				  "sort": [
				    {
				      "CreatedDate": "desc"
				    }
				  ]
				}
	cloudant.retrieveDocsBySelector("elevator_workorder_details", selector)
	.then(function (response) { 
			 var docs = response; 
			 console.log(" >>>>--docs ", docs.docs.length);
		 
			  
		 	var data = {
					"TotalInstalled" : {
						"total" : 454525,
						"percentage" : 70.1
					},
					"ElevatorsMaintenance" : {
						"total" : 70,
						"percentage" : 25
					},
					"PredictiveMaintenance" : {
						"total" : 20,
						"percentage" : 41
					},
					"ErrorReported" : {
						"total" : 3,
						"percentage" : 45
					},
					"ElevatorsSurveilance" : {
						"total" : 1000,
						"percentage" : 41
					},
					"MonitorMaintenance" : {
						"total" : 30,
						"percentage" : 41
					},
					"TopFailures" : {
						"total" : 1,
						"percentage" : 41
					},
					"DeviceError" : {
						"total" : 8,
						"percentage" : 41
					}

				};
				callback(null, data);
			  
		 
		 
		 //res.json(work_orders);
	}).fail(function (err) { 
		console.log("Not able to update locations from DB : " + err); 
		callback(null, null);
		//res.status(500).send("Locations not updated : " + err); 
	});
	
	
}

function getInsights(payload,callback) {
	var items = [ {
                           name : 'Most Fault',
                           series: [{
                                  name: 'Most Fault',
                                  y: 45
                           },{
                                  name: 'Most Fault',
                                  y: 55
                           }]
                     }, {
                           name : 'Least Fault',
                           series: [{
                                  name: 'Least Fault',
                                  y: 25
                           },{
                                  name: 'Least Fault',
                                  y: 75
                           }]
                     }, {
                           name : 'Common Fault',
                           series: [{
                                  name: 'Common Fault',
                                  y: 55
                           },{
                                  name: 'Common Fault',
                                  y: 45
                           }]
                     } ];
                     
  var response = {};
  
  response.data = items;
	callback(null, response);
}

function getBar(payload,callback) {
	var data = [{
 "name": "Track Elevators",
 "data": [80, 168, 512, 580, 1003, 1481, 1481, 1481, 1237],
 "x_axis": ["2015", "2016", "2017"],
 "fix_state": ["Backup Issue", "Temperature", "Alerts"]
}];
	callback(null, data);
}

function getAlerts(payload,callback) {
	var alerts = [];
	var status = ['Normal', 'Critical', 'Warning', 'Information'];
	var view_params = {reduce: false};
	cloudant.view("alert_notifications", "kone", "allAlerts")
	.then(function (response) { 
		 var data = response; 
		 var sortedArray  = [];
		 if(data && data.rows){
			 data.rows.forEach(function(row) {
				  var alert = {};  
				  var d = Date.parse(row.key[0]);				
				  alert.CreateDate = new Date(d).toISOString();				  
				  alert.ElevatorId = row.key[1];
				  alert.WorkorderId = row.key[2];
				  alert.status = status[Math.floor((Math.random() * 3) + 1) - 1];
				  alerts.push(alert);
			});
			// sort the array according to desceding order of created date.
			 sortedArray  = alerts.sort(arraySortFunction("CreateDate"));
		 }
		 callback(null, sortedArray);
	}).fail(function (err) { 
		console.log("Not able to update locations from DB : " + err); 
		callback(null, err);
	});
}

    // desceding order array sort. 
	function arraySortFunction(prop) {
		return function (a, b) {
			if (a[prop] < b[prop]) {
				return 1;
			} else if (a[prop] > b[prop]) {
				return -1;
			}
			return 0;
		}
	}



/*
function getAlerts(payload,callback) {
	var cloudant = Cloudant_client({account:"9bc196ec-ccf6-4d5b-86d6-2f59ce42cae8-bluemix", password:"f85e9ba5a638a22ce9f61db0515dce634564c21a4c4cf3d13e75508b2a1586f3"});
  var db = cloudant.db.use('alert_notifications');
  var alerts = [];
  var view_params = {reduce: false};
  var status = ['Normal', 'Critical', 'Warning', 'Information'];
  
  db.view("kone", "allAlerts", view_params, function (err, data) {  
    if(err) {
      console.log(JSON.stringify(err));
      callback(err, null);
      return;
    }
    data.rows.forEach(function(row) {
      var alert = {};      
      
      alert.CreateDate = row.key[0];
      alert.ElevatorId = row.key[1];
      alert.WorkorderId = row.key[2];
      alert.status = status[Math.floor((Math.random() * 3) + 1) - 1];
      
      alerts.push(alert);
    });
    callback(err, alerts);
  });
}
*/

function getErrorsTrend(payload,callback) {
	var alerts = [];
  
  var alert = {};  
  alert.desc = "Spike in number of specific errors";
  alert.value = 40;  
  alerts.push(alert);
  
  var alert2 = {};
  alert2.desc = "Spike in number of specific errors by Model";
  alert2.value = 23;  
  alerts.push(alert2);
  
  var alert3 = {};
  alert3.desc = "Errors increased by 16% for KONE-1001 in last 4 weeks";
  alert3.value = 16;  
  alerts.push(alert3);
  
  callback(null, alerts);
}

module.exports.getAll = getAll;
module.exports.getStatistics = getStatistics;
module.exports.getInsights = getInsights;
module.exports.getBar = getBar;
module.exports.getAlerts = getAlerts;
module.exports.getErrorsTrend = getErrorsTrend;