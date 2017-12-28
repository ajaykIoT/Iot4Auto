const driverModels = require('../models/driver');
const helper = require('./helpers/utility');
var dashDBClient = require('../dashDB');


var driver = {
 
  getMilage: function(req, res) {
    driverModels.getMilage(req, res, function(err, result) {
		helper.sendResponse(res, err, result); 
	});
  }
};
  
module.exports = driver;
