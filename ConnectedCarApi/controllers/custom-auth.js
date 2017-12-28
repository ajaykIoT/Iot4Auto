//var jwt = require('jwt-simple');
const utility = require('./helpers/utility');
const users = require('../models/users');
var auth = {
	
   login: function(req, res) {
	console.log("-----------------login ");
	var token = getHeaderToken(req.headers);
	console.log('token[] ', token);
	if (token == null) {
       res.status(401);
		res.json({
		  "status": 401,
		   "message": "Invalid credentials"
		});
		return;
    }	
    var username = token[0]; //req.body.username || '';
    var password = token[1]; //req.body.password || '';
	if (username == '' || password == '') {
      res.status(401);
      res.json({
        "status": 401,
        "message": "Invalid credentials"
      });
      return;
    }
 
    // Fire a query to your DB and check if the credentials are valid
    auth.validate(username, password, function(err, user){
		var dbUserObj = user;
		if (!dbUserObj) { // If authentication fails, we send a 401 back
		  res.status(401);
		  res.json({
			"status": 401,
			"message": "Invalid credentials"
		  });
		  return;
		}
	 
		if (dbUserObj) {
		  //res.setHeader('Content-Type', 'application/json'); 
		  // If authentication is success, we will generate a token
		  // and dispatch it to the client
		  var tok = utility.getToken(dbUserObj);
		  
		  //res.statusCode = 200;
		  //res.end(JSON.stringify(tok || {}, null, 2));
		
		  res.json(tok);
		}
	});
  },
 
  validate: function(username, password, next) {
    // spoofing the DB response for simplicity
	users.authenticate(username, password, function(err, user) {
		if(err){
			next(err);
		}else if (user) {
			var dbUserObj = { // spoofing a userobject from the DB. 
				userid: user.USERID,
				username : username,
				first_name: user.FIRST_NAME,
				last_name: user.LAST_NAME,
				email: user.EMAIL,
				mo_id: user.MO_ID,
				car_name: user.CAR_NAME
			};
			next(null, dbUserObj);
		}else{
			next(err);
		}	
	});
  },
 
  validateUser: function(username) {
	console.log("username ", username);
    // spoofing the DB response for simplicity
    var dbUserObj = { // spoofing a userobject from the DB. 
      name: 'nitin',
      role: 'admin',
      username: username
    };
 
    return dbUserObj;
  }
}


getHeaderToken = function (headers) {
  console.log("headers.authorization ", headers.access_token);
  if (headers && headers.access_token) {
	var token = headers.access_token
	if(token.indexOf("Basic ") != -1){
		token = token.replace("Basic ", "");
	}
	//Authorization: Bearer base64_access_token_string
	var value = utility.base64_decode(token);
	//console.log("base64_decode ", value);
	var opt = value.split(':');
	return opt;
  } else {
	return null;
  }
};
 
module.exports = auth;