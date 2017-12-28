
var dashDBClient = require('../dashDB');

var car = {
 
  getIssues: function(req, res, next) {
    var issues = [{ issue : "test", description : "test desc"}]; // Spoof a DB call
    next(null, issues);
  },
  
  carpair:function(req, res, next,db) {
	
		var username = req.username;
		var mo_id = req.body.deviceid;
		var mo_type = req.body.devicetype;
		var mo_token = req.body.devicetoken;
		var org_id = req.body.orgid;
		var carname = req.body.carname;
		
		/*removing other cars pairing, if any with the user*/
		var query_user_update = "UPDATE CARS set CAR_STATUS = 0 WHERE USERNAME = '"+username+"'"; 
		
		/*Creating a new car device`*/
		var query_device_create = 
		"INSERT INTO CARS ( MO_ID, MO_TYPE, MO_TOKEN, ORG_ID, CAR_NAME, CAR_STATUS, USERNAME,CREATED_ON,UPDATED_ON) "
		+"VALUES ('"+mo_id+"', '"+mo_type+"','"+mo_token+"','"+org_id+"','"+carname+"',1 ,'"+username+"',CURRENT TIMESTAMP,CURRENT"
		+ " TIMESTAMP)" ;
		
		/*Creating a new car device*/
		var query_device_update = 
		"UPDATE CARS  SET USERNAME = '"+username+"',CAR_STATUS = 1, UPDATED_ON = CURRENT TIMESTAMP WHERE MO_ID = '"+mo_id+"'";
		
		
		/*check if device already exist*/
		var query_ifExist = "select count(*) as exist from cars where MO_ID ='"+mo_id+"'";
		
			db.query(query_user_update, function (err, result) 
			{
				if (err) {
					console.error("update car device :: error " , err);
				}else{
					console.log("update car done... ... ...");
					db.query(query_ifExist, function (err1, rowexist) 
					{
						console.error("device exist value" , JSON.stringify(rowexist));
						if (err1) {
							console.error("insert car :: error " , err1);
							next(err1, null);
						}
						else{							
						if(rowexist[0].EXIST>0)						
							{	
						
								db.query(query_device_update, function (err2, rows) 
								{
									if (err2) {
										console.error("insert car :: error " , err2);
										next(err2, null);
									}else{
										var result = "{ success : \"Car Pairing with user success!\"}";
										next(null, result);	
										
										
									}
									
								});
							}
							else
							{
								db.query(query_device_create, function (err3, rows) 
								{
									if (err3) {
										console.error("insert car :: error " , err3);
										next(err3, null);
									}else{
										var result = "{ success : \"Car Pairing with user success!\"}";
										next(null, result);									
										
									}
									
								});
							}						
							
						}
						
					})
					
				}
				
			});
  }
};

 
module.exports = car;