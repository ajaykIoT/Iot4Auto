var _ = require('underscore');
//var IOTF = require('lib/watsonIoT');
var ibmdb = require("ibm_db");
var Promise = require("bluebird");
var moment = require("moment");

Promise.config({
	// Enable warnings
	warnings: true,
	// Enable long stack traces
	longStackTraces: true,
	// Enable cancellation
	cancellation: true,
	// Enable monitoring
	monitoring: true
});


var dashDBClient = module.exports;
var VCAP_SERVICES;

if(!process.env.VCAP_SERVICES){
	VCAP_SERVICES = require('../vcap.json')
}else{
	VCAP_SERVICES = JSON.parse(process.env.VCAP_SERVICES);
}
//var env = JSON.parse(VCAP_SERVICES);
//var creds = env['dashDB'][0].credentials;
var creds = VCAP_SERVICES['dashDB'][0].credentials;
var connString = "DRIVER={DB2};DATABASE=" + creds.db + ";UID=" + creds.username + ";PWD=" + creds.password + ";HOSTNAME=" + creds.hostname + ";port=" + creds.port;
//var config = require('./config.json');
var pool = new ibmdb.Pool();


dashDBClient.init = _.once(function(){
	//create tables
	/*var tables = config.tables;
	var createTblPromise = [];
	_.each(tables, function(table){
		createTblPromise.push(dashDBClient.createTable(table.name, table.columns, table.generatedId, table.generatedIdName));
	});
	Promise.all(createTblPromise).finally(
			function(){//post init
				storeEvents();
				storeDeviceInfo();		
			});
	*/		
}); 

dashDBClient.getConnection = function(){
	return new Promise(function(resolve, reject) {
		pool.open(connString, function (err, db) {
			if (err){
				console.error(err);
				reject(err);
			}
			resolve(Promise.promisifyAll(db));			
		});
	});
};

/*
dashDBClient.execPredefinedQuery = function(queryName){
	return new Promise(function(resolve, reject) {
		if(!config.queries[queryName])
			reject({status: 404 , message: "query not found" });
		else{
			dashDBClient.getConnection().then(function(db){
				db.query(config.queries[queryName]).then(function(res){
					resolve(res);
				});
			});
		}
	});
};
*/

dashDBClient.genTimestamp = function(local) {
	var d = new Date();
	return  d.getFullYear() + "-" +
	("00" + (d.getMonth() + 1)).slice(-2) + "-" +
	("00" + d.getDate()).slice(-2) + " " +
	("00" + d.getHours()).slice(-2) + ":" +
	("00" + d.getMinutes()).slice(-2) + ":" +
	("00" + d.getSeconds()).slice(-2);
};

dashDBClient.createTblInsertStmt = function(tableName, db){
	var listcolumns = "select name from sysibm.syscolumns where tbname = '"+tableName+"' and generated = ''";
	var columns = _.pluck(db.querySync(listcolumns), "NAME");
	if(columns.length === 0)
		return null;
	var columnListWithQuotes = "";
	var questionMarks= ""
		_.each(columns, function(col, index){
			if(index !== 0){
				columnListWithQuotes += ",";
				questionMarks += ",";
			}
			columnListWithQuotes += "\"" + col + "\"";
			questionMarks += "?";		
		});
	var insertStatement = "insert into \""+ tableName +"\" (" + columnListWithQuotes + ") values("+questionMarks+")";
	console.log(insertStatement);
	var stmt = db.prepareSync(insertStatement);
	return {columns: columns, stmt: stmt};
};

dashDBClient.createOrderedValuesArray = function(columns, valuesObj){
	var values = [];
	var objKeys = _.keys(valuesObj).map(function(s){ return s.toUpperCase() });
	var objValues = _.values(valuesObj);
	for (var index = 0; index < columns.length; index++) {
		var col = columns[index];
		values[index] = null;
		var keyIndex = _.indexOf(objKeys, col);
		if(keyIndex !== -1){
			if(_.isBoolean(objValues[keyIndex])){
				values[index] = (objValues[keyIndex]) ? 1 : 0;
			} else{
				values[index] = objValues[keyIndex];
			}
		}		
	}
	return values;
};

dashDBClient.listTablesSync = function(){
	return dashDBClient.getConnection().then(function(db){
		var listTbls = "select Name from sysibm.systables where CREATOR = '" + creds.username.toUpperCase() + "';";
		var tables = _.pluck(db.querySync(listTbls), "NAME");	
		db.close(function(){});
		return tables;
	});
};

dashDBClient.getTableColumns = function(tableName){
	return dashDBClient.getConnection().then(function(db){
		var listcolumns = "select name from sysibm.syscolumns where tbname = '"+tableName+"' and generated = ''";
		var columns = _.pluck(db.querySync(listcolumns), "NAME");
		db.close(function(){});
		return columns;
	});
};

dashDBClient.createTable = function(tableName, columns, generatedId, generatedIdName){
	var ct = dashDBClient.createTableStmt(tableName, columns, generatedId, generatedIdName);
	console.log(ct);
	dashDBClient.getConnection().then(function(db){
		db.query(ct).then(function(res){
			console.log(res);
			db.close(function(){});
		}).catch(function(e){
			console.error(e);
		});
	})
};

dashDBClient.createTableStmt = function(tableName, columns, generatedId, generatedIdName){
	var ct = "CREATE TABLE " + tableName + "(\n";
	if(generatedId){
		var idName = (generatedIdName)? generatedIdName : "ID";
		ct +=   idName + " INTEGER GENERATED ALWAYS AS IDENTITY,"
	}
	_.each(columns,function(col, index){
		ct += col.name + " " + col.type;
		if(col.required)
			ct += " NOT NULL";
		if(col.isKey)
			ct += ", PRIMARY KEY (" +col.name + ")";
		if(columns.length !== index+1)
			ct += ",";
	});		
	ct += ")";
	return ct;	
};


//store iot events

function storeDeviceInfo(){
	dashDBClient.getConnection().then(function(db){
		var deviceInfoTbl =dashDBClient.createTblInsertStmt("DEVICE_INFO", db);
		updateDevicesInfo(db, deviceInfoTbl).then(function(){console.log("done")});

	});
}

function updateDevicesInfo(db, deviceInfoTbl, bookmark){	
	return new Promise(function(resolve, reject) {
		var opts = (bookmark) ? {"_bookmark" : bookmark} : {};
		IOTF.iotfAppClient.getAllDevices(opts).then(
				function onSuccess (response) {
					_.each(response.results, 
							function(resp){
						var colmValues = (resp.deviceInfo) ? resp.deviceInfo : {};
						colmValues.typeId = resp.typeId;
						colmValues.deviceId = resp.deviceId;
						var values =dashDBClient.createOrderedValuesArray(deviceInfoTbl.columns,  colmValues);
						deviceInfoTbl.stmt.executeNonQuery(values, function (err, ret){if (err) console.error(err);});

					});
					if(response.bookmark)
						return updateDevicesInfo(db, deviceInfoTbl, response.bookmark);
					else
						resolve();
				},
				function onError (error) {
					console.error(error);
					reject(error);
				});	


	});
}

function storeEvents(){	
	dashDBClient.getConnection().then(function(db){
		var evtTables = {};
		IOTF.on("+", function(payload, deviceType, deviceId, eventType, format){
			var tblName = (deviceType + "_" + eventType).toUpperCase();			
			if(evtTables[tblName] === undefined)
				evtTables[tblName] =dashDBClient.createTblInsertStmt(tblName, db);
			if(evtTables[tblName] === null)
				return;
			var evValues = _.clone(payload);
			evValues.deviceType = deviceType;
			evValues.deviceId = deviceId;
			evValues.eventType = eventType;
			evValues.timestamp =dashDBClient.genTimestamp();
			var values =dashDBClient.createOrderedValuesArray(evtTables[tblName].columns,  evValues);
			printKeyValue(evtTables[tblName].columns, values);
			evtTables[tblName].stmt.executeNonQuery(values,function (err, ret){
				if (err) 
					console.error(err);
			});
		});
	});
}


