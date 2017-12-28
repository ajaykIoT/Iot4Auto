var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');

// *** load environment variables *** //
require('dotenv').config();

const mainConfig 	= require('./config/main-config.js');
const errorConfig = require('./config/error-config.js');

//Get port from environment and store in Express.
var port = process.env.VCAP_APP_PORT || 1000;

var app = express();
//set the app object to export so it can be required 
module.exports = app;

//var port = process.env.PORT || 1000;
app.set('port', port);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


  // *** config *** //  
mainConfig.init(app, express);
errorConfig.init(app);  

//add routes
app.use('/driverinsights/jobcontrol',       require('./routes/jobs'));
app.use('/driverinsights/mapping',          require('./routes/generic'));



// start server on the specified port and binding host
app.listen(port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + port);
});