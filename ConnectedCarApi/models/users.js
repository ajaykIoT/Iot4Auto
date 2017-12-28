var dashDBClient = require('../dashDB');
var bcrypt = require("bcrypt-nodejs");

var users = {
 
	authenticate: function(username, password, next){
		dashDBClient.getConnection().then(function(db){
			//var query = "SELECT USERID, USERNAME, PASSWORD, FIRST_NAME, LAST_NAME, EMAIL FROM USERS WHERE USERNAME='"+username+"' AND STATUS=1";
			var query = "SELECT U.USERID, U.USERNAME, U.PASSWORD, U.FIRST_NAME, U.LAST_NAME, U.EMAIL,C.MO_ID, C.CAR_NAME FROM USERS U INNER JOIN CARS C ON U.USERNAME = C.USERNAME WHERE U.USERNAME='"+username+"' AND U.STATUS=1";
			console.log("---query ", query);
			db.query(query, function (err, rows) 
			{
				//console.log("---------------rows ", rows);
				if (err) {
					next(err);
				} else {
					if(rows && rows.length > 0){
						var hash = rows[0].PASSWORD;
						if(bcrypt.compareSync(password, hash)){
							next(null, rows[0]);
						}else{
							next('invalid password', null);
						}
					}else{
						next('invalid username', null);
					}
				}
				db.close(function(){});
			});
			
		});
	},
	getAll: function(req, res, next) {
		var allusers = data; // Spoof a DB call
		next(null, allusers);
	}
};
 
var data = [{
  name: 'user 1',
  id: '1'
}, {
  name: 'user 2',
  id: '2'
}, {
  name: 'user 3',
  id: '3'
}];
 
module.exports = users;