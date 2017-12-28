/* Node Modules */
var app = require('express')();
var bodyParser = require('body-parser');
//var async = require('async');
var cors = require('cors');
//var morgan = require('morgan');
//var uuid = require('node-uuid');
var CronJob = require('cron').CronJob;
var request = require('request');

// *** load environment variables *** //
require('dotenv').config();
  
/* Developer Modules */
var jobs = require('./jobs');						

app.use(cors());
app.use(bodyParser.json());

new CronJob('* * * * *', function(){
	jobs.schedular();
}, null, true, "Asia/Kolkata");

// Article APIs END
const port = normalizePort(process.env.PORT || 1000);

function normalizePort(val) {
	const port = parseInt(val, 10);
	if (isNaN(port)) {
		return val;
	}
	if (port >= 0) {
		return port;
	}
	return false;
}

app.listen(port, function(){
	console.log('Scheduer Started.');
	//console.log('Server is listening at: '+port);
});

// When Node process ends
//process.on('SIGINT', function() {  
  
//});