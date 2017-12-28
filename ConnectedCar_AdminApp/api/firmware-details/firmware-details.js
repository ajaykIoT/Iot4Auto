'use strict';
const cloudant = require('../../db/cloudant');

function getAll(payload,callback) {
  var firmwareArray = [];
   var firmwareObj = {};

 //console.log("Request come to firmware details page" ); 

  cloudant.view("elevator_firmware_data", "getFirmwareData", "getAllData")
	.then(function (response) { 
		 var docs = response; 		
		 var rows = docs.rows;

		// adding all the rows at now. 
        for(var a=0; a<rows.length;a++){
            firmwareArray.push(rows[a].key);
        }
		 callback(null, firmwareArray);

	}).fail(function (err) { 
		console.log("Issues while loading firmware Data : " + err); 
		callback(null, firmwareObj);
	});

  // hard coded data for testing. 
  // firmwareObj.id = 1001;  
  // firmwareObj.baseFirmware  = {"versionNo" : "1", "temperature" : 23, "powerConsumption" :"1200"};
  // firmwareObj.currentFirmware  = {"versionNo" : "2", "temperature" : 22, "powerConsumption" :"1000"};
}

module.exports.getAll = getAll