/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var stats_model = require('./api/statistics/statistics');
var devices_model = require('./api/device-management/devices');
var workorder_model = require('./api/work-orders/work-orders');
var firmware_model = require('./api/firmware-details/firmware-details');
var express = require('express');

//Routes
var statistics_route 	= require('./routes/statistics');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();


app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'Origin, Accept, Accept-Version, Content-Length, Content-MD5,' +
	    ' Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token, Authorization');
	res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, POST, OPTIONS');
	res.setHeader('Access-Control-Expose-Headers', 'X-Api-Version, X-Request-Id, X-Response-Time');

	next();
});

// serve the files out of ./public as our main files
//app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/ui'));


app.post('/api/v1/statistics/details', function (req, res) {
	stats_model.getStatistics(req.body, function(err, data) {     
	      if (err) {
			res.status(401).send(null);		
		  } else {
			res.status(200).send(data);
		  }
	    });
});

app.post('/api/v1/statistics/map', function (req, res) {
	  stats_model.getAll(req.body, function(err, data) {     
	      if (err) {
			res.status(401).send(null);		
		  } else {
			res.status(200).send(data);
		  }
	    });
});

app.post('/api/v1/statistics/workorder', function (req, res) {
	workorder_model.getAll(req.body, function(err, data) {     
	      if (err) {
			res.status(401).send(null);		
		  } else {
			res.status(200).send(data);
		  }
	    });
});

app.post('/api/v1/statistics/insights', function (req, res) {
  stats_model.getInsights(req.body, function(err, data) {     
      if (err) {
		res.status(401).send(null);		
	  } else {
		res.status(200).send(data);
	  }
    });
});

app.post('/api/v1/statistics/bar', function (req, res) {
  stats_model.getBar(req.body, function(err, data) {     
      if (err) {
		res.status(401).send(null);		
	  } else {
		res.status(200).send(data);
	  }
    });
});

app.post('/api/v1/alerts', function (req, res) {
  stats_model.getAlerts(req.body, function(err, data) {     
      if (err) {
		res.status(401).send(null);		
	  } else {
		res.status(200).send(data);
	  }
    });
});

app.post('/api/v1/errors/trend', function (req, res) {
  stats_model.getErrorsTrend(req.body, function(err, data) {     
      if (err) {
		res.status(401).send(null);		
	  } else {
		res.status(200).send(data);
	  }
    });
});

app.post('/api/v1/device/getAllDeviceData', function (req, res) {
  devices_model.getAllDeviceData(req.body, function(err, data) {     
      if (err) {
		res.status(401).send(null);		
	  } else {
		res.status(200).send(data);
	  }
    });
});

app.get('/api/v1/device/:id', function (req, res) {
	var deviceId = req.params.id
	if(deviceId){
		devices_model.getDevice(deviceId, function(err, data) {     
		  if (err) {
			res.status(401).send(null);		
		  } else {
			res.status(200).send(data);
		  }
		});
	}else{
		res.status(401).send({"message" : "Device id not found"});
	}
});

app.get('/api/v1/device/:id/upgrade', function (req, res) {
	var deviceId = req.params.id
    devices_model.upgradeDevice(deviceId, function(err, data) {     
      if (err) {
		res.status(401).send(null);		
	  } else {
		res.status(200).send(data);
	  }
    });
});
app.get('/api/v1/device/:id/reset', function (req, res) {
	var deviceId = req.params.id
    devices_model.resetDevice(deviceId, function(err, data) {     
      if (err) {
		res.status(401).send(null);		
	  } else {
		res.status(200).send(data);
	  }
    });
});

app.post('/api/v1/devices/firmware', function (req, res) {
	firmware_model.getAll(req.body, function(err, data) {     
	      if (err) {
			res.status(401).send(null);		
		  } else {
			res.status(200).send(data);
		  }
	    });
});


//app.use('/api/v1/statistics', 	statistics_route);

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});

