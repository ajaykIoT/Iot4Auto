'use strict';
const cloudant = require('../../db/cloudant');

function getAll(payload,callback) {
  var work_orders = [];
  var work_order = {};
  cloudant.view("elevator_workorder_details", "GetWORecord", "sortWO")
	.then(function (response) { 
		 var docs = response;
		 var sortedArray  = [];		 
		 if(docs && docs.rows){
			 var rows = docs.rows;
			 for(var i=0 ; i < rows.length ; i ++){
					var work_order = {};
					var obj = rows[i].key;
					work_order.workOrderId = obj[2];
					work_order.model = "KONE-1000";
					work_order.elevator_no = obj[1] || "1000";
					work_order.status = obj[3];
					work_order.contractor_name = "XYZ";
					work_order.speed = "45s";
					work_order.load = "54 kg";
					work_order.Floor = "5";
					work_order.Assignee = obj[5];			   
					var d = Date.parse(obj[0]);				
					work_order.created_date = new Date(d).toISOString();
					work_orders.push(work_order);	  
			 }
			 // sort the array according to desceding order of created date. 
			 sortedArray  = work_orders.sort(arraySortFunction("created_date"));
		}
		callback(null, sortedArray);
		
	}).fail(function (err) { 
		console.log("Not able to update locations from DB : " + err); 
		callback(null, work_orders);
	});

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
}

module.exports.getAll = getAll