var winston = require('winston');
var dateFormat = require('dateformat');
winston.emitErrs = true;

var logger = expandErrors(new winston.Logger({
    transports: [
        new winston.transports.File({
            level: 'debug',
			name:'file.debug',
            filename: './logs/logs.log',
            handleExceptions: true,
	        humanReadableUnhandledException: true,
            json: true,
            //maxsize: 5242880, //5MB
			//maxsize: 1048576, //1MB
			maxsize: 10485760, //10MB
            //maxFiles: 5,
			maxFiles: 10,
            colorize: false,
			timestamp: function () {
				return dateFormat(new Date(), "dddd, mmmm dS, yyyy, h:MM:ss TT");
			},
        }),
		/*
		new winston.transports.File({
			name:'file.info',
            level: 'info',
            filename: './logs/info_logs.log',
            handleExceptions: true,
            humanReadableUnhandledException: true,
            json: true,
            maxsize: 5242880, //5MB
            maxFiles: 5,
            colorize: false,
			timestamp: function () {
				return dateFormat(new Date(), "dddd, mmmm dS, yyyy, h:MM:ss TT");
			},
        }),
				
		new winston.transports.File({
            level: 'error',
			name:'file.error',
            filename: './logs/error_logs.log',
            handleExceptions: true,
	     humanReadableUnhandledException: true,
            json: true,
            maxsize: 5242880, //5MB
            maxFiles: 5,
            colorize: false,
			timestamp: function () {
				return dateFormat(new Date(), "dddd, mmmm dS, yyyy, h:MM:ss TT");
			},
        }),*/
        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
	        humanReadableUnhandledException: true,
            json: false,
            colorize: true,
			timestamp: function () {
				return dateFormat(new Date(), "dddd, mmmm dS, yyyy, h:MM:ss TT");
			},
        })
    ],
	
	exceptionHandlers: [
		new winston.transports.File({ filename: './logs/exceptions.log' })
    ],	
	
    exitOnError: false
}));

module.exports = logger;
module.exports.stream = {
    write: function(message, encoding){
        logger.info(message);
    }
};

// Extend a winston by making it expand errors when passed in as the 
// second argument (the first argument is the log level).
function expandErrors(logger) {
  var oldLogFunc = logger.log;
  logger.log = function() {
    var args = Array.prototype.slice.call(arguments, 0);
    if (args.length >= 2 && args[1] instanceof Error) {
      args[1] = args[1].stack;
    }
	console.log(" ################ Inside Logger ##################");
    return oldLogFunc.apply(this, args);
  };
  return logger;
}