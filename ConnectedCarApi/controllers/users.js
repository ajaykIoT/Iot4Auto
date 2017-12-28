const usersModels = require('../models/users');
const helper = require('./helpers/utility');

var users = {
 
  getAll: function(req, res) {
	var test_param = req.swagger.params.test_param.value;
	console.log("---test_param ", test_param);
	
	var username=req.body.username;
	var password=req.body.password;
	console.log("---payload ", username);
	
    usersModels.getAll(req, res, function(err, result) {
		helper.sendResponse(res, err, result); 
	});
  }
  ,
  createAll: function(req, res) {
	var test_param = req.swagger.params.test_param.value;
	console.log("---test_param ", test_param);
	
	var username=req.body.username;
	var password=req.body.password;
	console.log("---payload ", username);
	
    usersModels.getAll(req, res, function(err, result) {
		helper.sendResponse(res, err, result); 
	});
  }
  
};
 
module.exports = users;