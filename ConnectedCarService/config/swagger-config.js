(function(swaggerConfig) {

  'use strict';

  // *** swagger dependencies *** //
  var swaggerTools = require('swagger-tools');
  
  swaggerConfig.init = function(app, next) {

    // swaggerRouter configuration
	var options = {
	  controllers: './controllers',
	  useStubs: process.env.NODE_ENV === 'development' ? true : false // Conditionally turn on stubs (mock mode)
	};

	// The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
	var swaggerDoc = require('../swagger.json');

    // Initialize the Swagger middleware
    swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {
  
	  if((process.env.HOST == undefined) || (process.env.HOST == null)) {
		console.log("Error : Host name is not set in config.");
		process.exit(1);
	  }
	  
	  if(process.env.NODE_ENV == 'development'){
		swaggerDoc.host = 'localhost:' + app.get('port');
	  }else{
		swaggerDoc.host = process.env.HOST;
	  }
	  
	  // Interpret Swagger resources and attach metadata to request - must be first .in swagger-tools middleware chain
	  app.use(middleware.swaggerMetadata());
	  //app.use(cors());
	  
	  // Validate Swagger requests
	  app.use(middleware.swaggerValidator());

	  // Route validated requests to appropriate controller
	  app.use(middleware.swaggerRouter(options));

	  
	  // Serve the Swagger documents and Swagger UI
	  app.use(middleware.swaggerUi());
	  
	  next();
	  
  });

  };

})(module.exports);
