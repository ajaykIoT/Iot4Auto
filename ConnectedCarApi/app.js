(function() {

  'use strict';

  // *** dependencies *** //
  const express = require('express');

  
  
  const mainConfig 	= require('./config/main-config.js');
  const errorConfig = require('./config/error-config.js');

  // *** express instance *** //
  const app = express();

  // Auth Middleware - This will check if the token is valid
  // Only the requests that start with /api/v1/* will be checked for the token.
  // Any URL's that do not follow the below pattern should be avoided unless you 
  // are sure that authentication is not needed
  app.all('/api/v1/*', [require('./middlewares/validateRequest')]);
  
  // *** config *** //  
  mainConfig.init(app, express);
  errorConfig.init(app);  
  
  module.exports = app;

}());
