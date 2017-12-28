var async = require('async');
var request = require("request");

var config_baseURL = process.env.JobEndPoint+'/driverinsights/jobcontrol/job'; //'http://localhost:1000/driverinsights/jobcontrol/job';

var JobRequest = function(schedularCallback){
		console.log("-------------JobRequest---------------");
		var body = "{}";
		var options = {
			method: 'GET',
			url: config_baseURL
			//,
			//headers: {
			//	'Content-Type':'application/json; charset=UTF-8',
			//	"Content-Length": Buffer.byteLength(body)
			//},
			//body: body
		};
		console.log("Call JobRequest: " + JSON.stringify(options));
		var self = this;
		request(options, function(error, response, body){
			if(error){
				console.log("----error ",error);
			}else if(response){
				console.log("---response.statusCode ", response.statusCode);
			}
		});
	
}
module.exports.schedular = JobRequest;