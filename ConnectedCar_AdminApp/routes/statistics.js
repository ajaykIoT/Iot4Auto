'use strict';
var express = require('express');
const cloudant = require('../db/cloudant');
var router = express.Router();

router.get('/', function(req, res, next){

	var data = {
			"TotalInstalled" : {
				"total" : 454525,
				"percentage" : 70.1,
	      "description": "Sold in last week(70.1 5)"
			},
			"ElevatorsMaintenance" : {
				"total" : 4525,
				"percentage" : 25,
	      "description": "Maintenance done in last week(40.1 5)"
			},
			"TotalContractors" : {
				"total" : 1000,
				"percentage" : 41,
	      "description": "Total contractors in last week(20.1 5)"
			},
			"Errors" : {
				"total" : 245,
				"percentage" : 41,
	      "description": "Errors reported in last week(20.1 5)"
			}

		};
	
	res.json(data);
});

router.get('/workorder/status', function(req, res, next){
	console.log("---------elevators status-----------")
	
	var work_orders = [];
    
   
	cloudant.retrieveDocsByPageNo("elevator_workorder_details", 1, 10)
		.then(function (response) { 
			 var docs = response; 
			 console.log(" docs ", docs);
			 var value = docs.rows[0].value
			 var doc = docs.rows[0].doc;
			 var rows = docs.rows;
			 for(var i=0 ; i<rows.length ; i ++){
				 var work_order = {};
				 var obj = rows[i].doc;
				  work_order.id = 1001;
				  work_order.model = "KONE-1000";
				  work_order.elevator_no = "1000";
				  work_order.status = obj.Status;
				  work_order.contractor_name = "XYZ";
				  work_order.speed = "45s";
				  work_order.load = "54 kg";
				  work_order.Floor = "5";
				  work_order.Assignee = "G Reddy";
				   
				  work_orders.push(work_order)
			 }
			 
			 res.json(work_orders);
		}).fail(function (err) { 
			console.log("Not able to update locations from DB : " + err); 
			res.status(500).send("Locations not updated : " + err); 
		}); 
});

router.get('/map', function(req, res, next){
	
	// dummy JSON data
	var data = [
		            {
		                "name": "Guindy",
		                "state": "Tamil Nadu",
		                "city": "Chennai",
		                "zipcode": 410401,
		                "latitude": 13.0067492,
		                "longitude": 80.2022314
		            },
		            {
		                "name": "Kolapakkam",
		                "state": "Tamil Nadu",
		                "city": "Chennai",
		                "zipcode": 410401,
		                "latitude": 13.007786,
		                "longitude": 80.1440573
		            },
		            
		            {
		                "name": "Mugalivakkam",
		                "state": "Tamil Nadu",
		                "city": "Chennai",
		                "zipcode": 410401,
		                "latitude": 13.0219092,
		                "longitude": 80.155688
		            }
	            
	            ];
	res.json(data);
});

module.exports = router;