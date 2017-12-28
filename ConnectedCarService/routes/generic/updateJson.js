var router = module.exports = require('express').Router();
var http = require('http');
const fs = require('fs');
var fetch = require('../../driverInsights/mapping/car_driver_mapping.json');
var fileObj = JSON.stringify(fetch);
var fileJsonObj = JSON.parse(fileObj);

console.log("fileobj",fileJsonObj);
router.post('/device/' , function(req,res) {

	console.log("Inside Function");	

	var deviceId = req.body.deviceId;
	var userName = req.body.userName;
	
	var extJsonObj = {[deviceId]:userName};

	//function of mapping for unique key value pair and concatenation 
	function jsonConcat(o1, o2) {
 		for (var key in o2) {
  		o1[key] = o2[key];
 		}
 		return o1;
	}

	var output = {};

	//calling jsonConcat Function
	output = jsonConcat(fileJsonObj, extJsonObj);
	
	var writeObj = JSON.stringify(output);

	//write the JSON file 
	fs.writeFile("././driverInsights/mapping/car_driver_mapping.json",writeObj, "utf8", function(err) {
	    if (err) throw err;
		console.log("File saved.");			
	});
	res.send(output);    
});