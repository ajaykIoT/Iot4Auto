

/*
var d = new Buffer("nitins:nitins").toString('base64');
console.log(" d " ,d);

var bcrypt = require("bcrypt-nodejs");
var hash = bcrypt.hashSync("nitins");

console.log(" --hash ", hash);

var c = bcrypt.compareSync("nitins", hash);

console.log("comp ", c);

*/
var count  = 0;
var moment = require("moment");
	// assign ts if missing
	var ts = moment( Date.now()).valueOf();
	
	//Adding warning logs for long trips
	if(count == 0)
	{
		start_time = moment(ts || Date.now()).valueOf();
	}
	count = count + 1;

	
	var diffTime = moment(new Date()).diff(start_time);
	var duration = moment.duration(diffTime);
	var  mins = duration.seconds();
	if(mins>15)
	{
		console.log("Trip duration is exceeding by the expected average trip duration", mins);
	}

    console.log("Trip duration is exceeding by the expected average trip duration", mins);
	//End Warning logs addition