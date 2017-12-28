'use strict';
var Cloudant = require('cloudant');
var username = "9bc196ec-ccf6-4d5b-86d6-2f59ce42cae8-bluemix";
var password = "f85e9ba5a638a22ce9f61db0515dce634564c21a4c4cf3d13e75508b2a1586f3";
var cloudant = Cloudant({account:username, password:password});

const cloudantDB = require('../../db/cloudant');

function getAllDeviceData(payload,callback) {
    var deviceDb = cloudant.db.use('elevator_device_data')
    var optionsAlldata = {
        q: '*:*'
    };
    deviceDb.view('deviceData', 'getAllDevices', optionsAlldata, function(err, resultData) {
        if (err) {
            console.error(err);
            return err
        } else {
            var device_data = [];
            for(var a=0; a<resultData.rows.length;a++){
                //for(b=0; b<resultData.rows[a].key.TollPlazas.length;b++){
                    //resultData.rows[a].key.TollPlazas[b].AgencyId = resultData.rows[a].key.AgencyId;
                    //resultData.rows[a].key.TollPlazas[b].AgencyName = resultData.rows[a].key.AgencyName;

                    device_data.push(resultData.rows[a].key);
					var d = Date.parse(resultData.rows[a].key.plannedFor);				
				    device_data[a].plannedFor = new Date(d).toISOString(); 
                //}
            }
        return callback(null, device_data);
        }
    });
}
function updateDevice(deviceId, revert, callback) {
	cloudantDB.retrieveDataById('elevator_device_data', deviceId)
		.then(function (response) { 
			 var device = response; 
			 if(device == null){
				callback(null, {"message" : "Device not found for device id "+deviceId});
			 }else{
					cloudantDB.retrieveDataById('elevator_firmware_data', deviceId)
						.then(function (response) { 
							 var firmware = response; 
							 if(firmware == null){
								callback(null, {"message" : "Firmware not found for device id "+deviceId});
							 }
							 
							 var currentFirmware = firmware.currentFirmware;
							 var cfVersion = currentFirmware.versionNo;
							 var cfVersionInt = cfVersion.substring(1,cfVersion.length);
							 if(revert) {
								currentFirmware = firmware.baseFirmware;
								cfVersion = currentFirmware.versionNo;
								cfVersionInt = cfVersion.substring(1,cfVersion.length);
							 }
							 console.log("----cfVersionInt ", cfVersionInt);
							 
							 var cfTemperature = currentFirmware.temperature;
							 var cfPowerConsumption = currentFirmware.powerConsumption;
					
							var firmware = device.firmware;
							var firmwareInt = firmware.substring(1,firmware.length);
							console.log("----firmwareInt ", firmwareInt); 
							
							if(parseInt(cfVersionInt) > parseInt(firmwareInt) || revert){
								device.firmware = cfVersion;
								device.temperature = cfTemperature;
								device.PowerUsage = cfPowerConsumption;
								
								cloudantDB.updateData('elevator_device_data', deviceId, device)
								.then(function (response) { 
									//callback(null, device);
									if(revert){
										callback(null, {"message" : "Device successfully reset"});
									}else{
										callback(null, {"message" : "Device successfully upgraded"});
									}
								}).fail(function (err) { 
									console.log("Not able to update device from DB : " + err); 
									callback(null, null);
								});
								
							 }else{
								callback(null, {"message" : "Device is already up to data"});
							 }
							 
					}).fail(function (err) { 
							console.log("Not able to update device from DB : " + err); 
							callback(null, null);
					});
			 
			 }
			 //callback(null, docs);
	}).fail(function (err) { 
			console.log("Not able to update device from DB : " + err); 
			callback(null, err);
	});
}

function upgradeDevice(deviceId, callback) {
	//console.log("-----------upgradeDevice-----------------");
	updateDevice(deviceId, false, function(err, data) {     
	      callback(err, data);
	});
}

function resetDevice(deviceId, callback) {
	//console.log("-----------upgradeDevice-----------------");
	updateDevice(deviceId, true, function(err, data) {     
	      callback(err, data);
	});
}
function getDevice(deviceId, callback) {
	//console.log("-----------getDevice-----------------");
	cloudantDB.retrieveDataById('elevator_device_data', deviceId)
		.then(function (response) { 
			 var device = response; 
			 if(device == null){
				callback(null, {"message" : "Device not found for device id "+deviceId});
			 }else{
				callback(null, device);		
			 }
			 //callback(null, docs);
	}).fail(function (err) { 
			console.log("Not able to update device from DB : " + err); 
			callback(null, err);
	});
}
module.exports.getAllDeviceData = getAllDeviceData;
module.exports.upgradeDevice = upgradeDevice;
module.exports.resetDevice = resetDevice;
module.exports.getDevice = getDevice;