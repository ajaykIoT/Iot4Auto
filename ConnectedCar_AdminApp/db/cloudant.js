var Cloudant = require('cloudant');
var extend = require('util')._extend;
var vcapServices = require('vcap_services');
var Q = require('q');
var config = extend({
    username: "9bc196ec-ccf6-4d5b-86d6-2f59ce42cae8-bluemix", //process.env.cloudant_username,
    password: "f85e9ba5a638a22ce9f61db0515dce634564c21a4c4cf3d13e75508b2a1586f3" //process.env.cloudant_password
}, vcapServices.getCredentials('cloudantNoSQLDB'));

// Initialize the library with my account.
var cloudant = Cloudant({
    account: config.username,
    password: config.password
});

// cloudant.db.list(function(err, allDbs) {
//     console.log('All my databases: %s', allDbs.join(', '))
// });

function retrieveDocData(rawData){
    var returnData = null;
    if(rawData!= null && rawData.rows != null && rawData.rows[0] != null){
        returnData = rawData.rows[0].doc;
    } else {
        console.warn("Error occured during conversation Doc retrival");
    }
    return returnData;
}

var obj = {
    retrieveData: function (dbname) {
        var db = cloudant.db.use(dbname);
        var deferred = Q.defer();
        db.list({ include_docs: true }, function (err, body) {
            if (!err) {
              console.log(body);
                deferred.resolve(body);
            } else {
              console.log(err);
                deferred.reject(err);
            }

        });
        return deferred.promise;
    },
    updateData: function (dbname, id, doc) {
        var db = cloudant.db.use(dbname);
        var deferred = Q.defer();
        db.insert(doc, function (err, body) {
            if (!err) {
                deferred.resolve(body);
            } else {
                deferred.reject(err);
            }

        });
        return deferred.promise;
    },
    insertData: function (dbname, doc) {
        var db = cloudant.db.use(dbname);
        var deferred = Q.defer();
        db.insert(doc, function (err, body) {
            if (!err) {
                deferred.resolve(body);
            } else {
                deferred.reject(err);
            }

        });
        return deferred.promise;
    },
    retrieveDataById: function (dbname, id) {
        console.log("Retrieving DOC for ID : " + id);
        var db = cloudant.db.use(dbname);
        var deferred = Q.defer();
        db.list({include_docs: true, key: id }, function (err, body) {
            if (!err) {
                var extractedDoc = retrieveDocData(body);
                deferred.resolve(extractedDoc);
            } else {
                deferred.reject(err);
            }

        });
        return deferred.promise;
    },
    //retiveDataByParameter function retrun all the documents for that parameter selector
    //before using this function you have to create index for type in database of cloudant
    retrieveDataByType: function(dbname, value){
      var db = cloudant.db.use(dbname);
      var deferred = Q.defer();
      db.find({"selector":{type:value}}, function (err, result) {
          if (!err) {
              var extractedDoc = result;
              deferred.resolve(extractedDoc);
          } else {
              deferred.reject(err);
          }
      });
      return deferred.promise;
    },

    retrieveDocsBySelector : function(dbname, selector){
      var db = cloudant.db.use(dbname);
      var deferred = Q.defer();
      //selector = JSON.stringify(selector);
      //console.log(selector);
      db.find(selector, function (err, body) {
        if (!err) {
            //console.log(body);
//            console.log(body);
            deferred.resolve(body);
        } else {
            console.log(err);
            deferred.reject(err);
        }
      });
      return deferred.promise;

    },
    /*
	    retrive a docs from DB with pageNo and PageSize
	  */
	  retrieveDocsByPageNo : function(dbname, pageNo, pageSize){
	    var db = cloudant.db.use(dbname);
	    var retrievedData = null;
	    var skipCount = (pageNo - 1) * pageSize;
	    var deferred = Q.defer();
	    db.list({ limit:pageSize , skip : skipCount, include_docs: true  }, function (err, body) {
	      if (!err) {
	          deferred.resolve(body);
	      } else {
	          deferred.reject(err);
	      }
	    });
	    return deferred.promise;
	  },
	  
/*retrieveDataFromIndex : function(dbname, docPath, indexName, query){
      var db = cloudant.db.use(dbname);
      var deferred = Q.defer();
      db.search(docPath, indexName, query, function(err, result) {
        // console.log(result);
        // console.log(JSON.stringify(result));
        deferred.resolve("OK");
      }).error(function(err){
          console.log('index error '+err);
          if (err) {
            console.log('Error in getting data from index -->>'+err);
            //throw er;
            deferred.reject(err);
          }
      });
      return deferred.promise;
}*/
	  retrieveDataFromIndex: function (dbname, docPath, indexName, query) {
        var db = cloudant.db.use(dbname);
        var deferred = Q.defer();
//        console.log("Cloudant search query : " + JSON.stringify(query));
        db.search(docPath, indexName, query, function (err, result) {
          //console.log(result);
          console.log('Data----');
            if(!err){
                deferred.resolve(result);
            } else{
                deferred.reject(err);
            }
        });
        return deferred.promise;
    },
    
    view: function (dbname, designname, view) {
        var db = cloudant.db.use(dbname);
        var deferred = Q.defer();
        db.view(designname, view, function (err, res) {
        	if(!err){
                deferred.resolve(res);
            } else{
                deferred.reject(err);
            }
    	});
        return deferred.promise;
    },
    
    viewWithParams: function (dbname, designname, view, view_params) {
        var db = cloudant.db.use(dbname);
        var deferred = Q.defer();
        db.view(designname, view, view_params, function (err, res) {
        	if(!err){
                deferred.resolve(res);
            } else{
                deferred.reject(err);
            }
    	});
        return deferred.promise;
    }
    
    

};
module.exports = obj;
