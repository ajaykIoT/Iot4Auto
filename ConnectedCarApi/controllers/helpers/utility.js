'use strict';
var jwt = require('jwt-simple');
var moment = require('moment');

var utility = {
	sendResponse : function sendResponse(response, err, result) {
	  response.setHeader('Content-Type', 'application/json'); 
	  if (err) { 
		response.statusCode = 500;      
		response.end(JSON.stringify(err || {}, null, 2));
	  } else {    
		response.statusCode = 200;
		 //var jsonData = { "data" :  result };
		 var jsonData = result;
		 response.end(JSON.stringify(jsonData || {}, null, 2).toLowerCase());
	  }  
	},
	getToken: function(user) {
		var expires = expiresIn(process.env.TOKEN_EXPIRES_IN); // 1 for one days
		var token = jwt.encode({
			exp: expires,
			userid: user.userid,
			username: user.username
		}, process.env.TOKEN_SECRET);
	 
		return {
			token: token,
			expires: expires,
			user: user
		};
    },
	decodeToken: function(token){
		return jwt.decode(token, process.env.TOKEN_SECRET);
	},
	
	getHeaderAccessToken: function (headers) {
	  console.log("headers.access_token ", headers.access_token);
	  if (headers && headers.access_token) {
		return headers.access_token;
	  } else {
		return null;
	  }
	},

	// function to encode data to base64 encoded string
	base64_encode: function base64_encode(data) {
		return new Buffer(data).toString('base64');
	},

	// function to create file from base64 encoded string
	base64_decode: function (base64data) {
		return new Buffer(base64data, 'base64').toString('utf-8');
	},
	
	//function to get all dates between 2 dates
	enumerateDaysBetweenDates: function(start, end) {
        var startDate = moment(start);
        var endDate = moment(end);
       
        var dates = [];
        startDate = startDate.add('days', 1);
	
        while(startDate.format('YYYY-MM-DD') !== endDate.format('YYYY-MM-DD')) {
                    
          dates.push(startDate.format('YYYY-MM-DD'));
          startDate = startDate.add('days', 1);
        }

    return dates;
  }

}


 
function expiresIn(numDays) {
  var dateObj = new Date();
  return dateObj.setDate(dateObj.getDate() + numDays);
}

module.exports = utility;