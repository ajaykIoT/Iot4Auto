const carModels = require('../models/car');
const helper = require('./helpers/utility');
var dashDBClient = require('../dashDB');

var car = {
 
  getIssues: function(req, res) {
	
	carModels.getIssues(req, res, function(err, result) {
		helper.sendResponse(res, err, result); 
	});
  },
  
  carpair: function(req, res) {
		dashDBClient.getConnection().then(function(db){			
			carModels.carpair(req, res,function(err, result){
						if(result.length > 0){
								helper.sendResponse(res, err, result);
						}				
				},db);									
				db.close(function(){});			
			});		
	
	/*carModels.getIssues(req, res, function(err, result) {
		helper.sendResponse(res, err, result); 
	});
	*/
  }
  
};

 
module.exports = car;