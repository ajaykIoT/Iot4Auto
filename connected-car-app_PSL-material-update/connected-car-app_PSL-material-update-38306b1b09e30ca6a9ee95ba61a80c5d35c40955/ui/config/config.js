/* jslint node: true */
'use strict';

var path = require('path');

var rootPath = path.normalize(__dirname + '/..');

var NODE_ENV = process.env.NODE_ENV || 'development';
var NODE_HOST = process.env.NODE_HOST || '127.0.0.1';
var NODE_PORT = process.env.PORT || 8080;
var MONGO_HOST = process.env.MONGO_HOST || '127.0.0.1';
var MONGO_PORT = process.env.MONGO_PORT || 27017;
var LOG_LEVEL = process.env.LOG_LEVEL || 'debug';

var APP_NAME = '';

var config = {
  development: {
    root: rootPath,
    app: {
      name: APP_NAME + NODE_ENV,
      address: NODE_HOST,
      port: NODE_PORT
    },
    db_historical: {
        host: "b1611753-b3bf-47ce-95f7-0c67cc1a61a7-bluemix.cloudant.com",
        port: 443,
        username: "b1611753-b3bf-47ce-95f7-0c67cc1a61a7-bluemix",
        password: "e0cddb23f5b90a6f590053fb3504e18dd3d6081354d53b6ec0a1c9afcc1054d4",
        url: "https://b1611753-b3bf-47ce-95f7-0c67cc1a61a7-bluemix:e0cddb23f5b90a6f590053fb3504e18dd3d6081354d53b6ec0a1c9afcc1054d4@b1611753-b3bf-47ce-95f7-0c67cc1a61a7-bluemix.cloudant.com",
        dbname:"ce-clm_historicaldb",
        name: APP_NAME + NODE_ENV
      },
      db_devicedata: {
        host: "b1611753-b3bf-47ce-95f7-0c67cc1a61a7-bluemix.cloudant.com",
        port: 443,
        username: "b1611753-b3bf-47ce-95f7-0c67cc1a61a7-bluemix",
        password: "e0cddb23f5b90a6f590053fb3504e18dd3d6081354d53b6ec0a1c9afcc1054d4",
        url: "https://b1611753-b3bf-47ce-95f7-0c67cc1a61a7-bluemix:e0cddb23f5b90a6f590053fb3504e18dd3d6081354d53b6ec0a1c9afcc1054d4@b1611753-b3bf-47ce-95f7-0c67cc1a61a7-bluemix.cloudant.com",
        dbname:"ce-clm_devicedatadb",
        name: APP_NAME + NODE_ENV
      },
	  db_datastore: {
        host: "b1611753-b3bf-47ce-95f7-0c67cc1a61a7-bluemix.cloudant.com",
        port: 443,
        username: "b1611753-b3bf-47ce-95f7-0c67cc1a61a7-bluemix",
        password: "e0cddb23f5b90a6f590053fb3504e18dd3d6081354d53b6ec0a1c9afcc1054d4",
        url: "https://b1611753-b3bf-47ce-95f7-0c67cc1a61a7-bluemix:e0cddb23f5b90a6f590053fb3504e18dd3d6081354d53b6ec0a1c9afcc1054d4@b1611753-b3bf-47ce-95f7-0c67cc1a61a7-bluemix.cloudant.com",
        dbname:"ce-clm_datastore",
        name: APP_NAME + NODE_ENV
      },
    db_workitem: {
      host: "b1611753-b3bf-47ce-95f7-0c67cc1a61a7-bluemix.cloudant.com",
      port: 443,
      username: "b1611753-b3bf-47ce-95f7-0c67cc1a61a7-bluemix",
      password: "e0cddb23f5b90a6f590053fb3504e18dd3d6081354d53b6ec0a1c9afcc1054d4",
      url: "https://b1611753-b3bf-47ce-95f7-0c67cc1a61a7-bluemix:e0cddb23f5b90a6f590053fb3504e18dd3d6081354d53b6ec0a1c9afcc1054d4@b1611753-b3bf-47ce-95f7-0c67cc1a61a7-bluemix.cloudant.com",
      dbname:"ce-clm_workitemdetails",
      name: APP_NAME + NODE_ENV
    },
    log: {
      name: APP_NAME + NODE_ENV,
      level: LOG_LEVEL
    }
  },
  test: {
    root: rootPath,
    app: {
      name: APP_NAME + NODE_ENV,
      address: NODE_HOST,
      port: NODE_PORT
    },
   db_historical: {
        host: "b1611753-b3bf-47ce-95f7-0c67cc1a61a7-bluemix.cloudant.com",
        port: 443,
        username: "b1611753-b3bf-47ce-95f7-0c67cc1a61a7-bluemix",
        password: "e0cddb23f5b90a6f590053fb3504e18dd3d6081354d53b6ec0a1c9afcc1054d4",
        url: "https://b1611753-b3bf-47ce-95f7-0c67cc1a61a7-bluemix:e0cddb23f5b90a6f590053fb3504e18dd3d6081354d53b6ec0a1c9afcc1054d4@b1611753-b3bf-47ce-95f7-0c67cc1a61a7-bluemix.cloudant.com",
        dbname:"ce-clm_historicaldb",
        name: APP_NAME + NODE_ENV
      },
      db_devicedata: {
        host: "b1611753-b3bf-47ce-95f7-0c67cc1a61a7-bluemix.cloudant.com",
        port: 443,
        username: "b1611753-b3bf-47ce-95f7-0c67cc1a61a7-bluemix",
        password: "e0cddb23f5b90a6f590053fb3504e18dd3d6081354d53b6ec0a1c9afcc1054d4",
        url: "https://b1611753-b3bf-47ce-95f7-0c67cc1a61a7-bluemix:e0cddb23f5b90a6f590053fb3504e18dd3d6081354d53b6ec0a1c9afcc1054d4@b1611753-b3bf-47ce-95f7-0c67cc1a61a7-bluemix.cloudant.com",
        dbname:"ce-clm_devicedatadb",
        name: APP_NAME + NODE_ENV
      },
	  db_datastore: {
        host: "b1611753-b3bf-47ce-95f7-0c67cc1a61a7-bluemix.cloudant.com",
        port: 443,
        username: "b1611753-b3bf-47ce-95f7-0c67cc1a61a7-bluemix",
        password: "e0cddb23f5b90a6f590053fb3504e18dd3d6081354d53b6ec0a1c9afcc1054d4",
        url: "https://b1611753-b3bf-47ce-95f7-0c67cc1a61a7-bluemix:e0cddb23f5b90a6f590053fb3504e18dd3d6081354d53b6ec0a1c9afcc1054d4@b1611753-b3bf-47ce-95f7-0c67cc1a61a7-bluemix.cloudant.com",
        dbname:"ce-clm_datastore",
        name: APP_NAME + NODE_ENV
      },
    db_workitem: {
      host: "b1611753-b3bf-47ce-95f7-0c67cc1a61a7-bluemix.cloudant.com",
      port: 443,
      username: "b1611753-b3bf-47ce-95f7-0c67cc1a61a7-bluemix",
      password: "e0cddb23f5b90a6f590053fb3504e18dd3d6081354d53b6ec0a1c9afcc1054d4",
      url: "https://b1611753-b3bf-47ce-95f7-0c67cc1a61a7-bluemix:e0cddb23f5b90a6f590053fb3504e18dd3d6081354d53b6ec0a1c9afcc1054d4@b1611753-b3bf-47ce-95f7-0c67cc1a61a7-bluemix.cloudant.com",
      dbname:"ce-clm_workitemdetails",
      name: APP_NAME + NODE_ENV
    },
    log: {
      name: APP_NAME + NODE_ENV,
      level: LOG_LEVEL
    }
  },
  production: {
    root: rootPath,
    app: {
      name: APP_NAME + NODE_ENV,
      address: NODE_HOST,
      port: NODE_PORT
    },
    db_historical: {
        host: "b1611753-b3bf-47ce-95f7-0c67cc1a61a7-bluemix.cloudant.com",
        port: 443,
        username: "b1611753-b3bf-47ce-95f7-0c67cc1a61a7-bluemix",
        password: "e0cddb23f5b90a6f590053fb3504e18dd3d6081354d53b6ec0a1c9afcc1054d4",
        url: "https://b1611753-b3bf-47ce-95f7-0c67cc1a61a7-bluemix:e0cddb23f5b90a6f590053fb3504e18dd3d6081354d53b6ec0a1c9afcc1054d4@b1611753-b3bf-47ce-95f7-0c67cc1a61a7-bluemix.cloudant.com",
        dbname:"ce-clm_historicaldb",
        name: APP_NAME + NODE_ENV
      },
      db_devicedata: {
        host: "b1611753-b3bf-47ce-95f7-0c67cc1a61a7-bluemix.cloudant.com",
        port: 443,
        username: "b1611753-b3bf-47ce-95f7-0c67cc1a61a7-bluemix",
        password: "e0cddb23f5b90a6f590053fb3504e18dd3d6081354d53b6ec0a1c9afcc1054d4",
        url: "https://b1611753-b3bf-47ce-95f7-0c67cc1a61a7-bluemix:e0cddb23f5b90a6f590053fb3504e18dd3d6081354d53b6ec0a1c9afcc1054d4@b1611753-b3bf-47ce-95f7-0c67cc1a61a7-bluemix.cloudant.com",
        dbname:"ce-clm_devicedatadb",
        name: APP_NAME + NODE_ENV
      },
	  db_datastore: {
        host: "b1611753-b3bf-47ce-95f7-0c67cc1a61a7-bluemix.cloudant.com",
        port: 443,
        username: "b1611753-b3bf-47ce-95f7-0c67cc1a61a7-bluemix",
        password: "e0cddb23f5b90a6f590053fb3504e18dd3d6081354d53b6ec0a1c9afcc1054d4",
        url: "https://b1611753-b3bf-47ce-95f7-0c67cc1a61a7-bluemix:e0cddb23f5b90a6f590053fb3504e18dd3d6081354d53b6ec0a1c9afcc1054d4@b1611753-b3bf-47ce-95f7-0c67cc1a61a7-bluemix.cloudant.com",
        dbname:"ce-clm_datastore",
        name: APP_NAME + NODE_ENV
      },
    db_workitem: {
      host: "b1611753-b3bf-47ce-95f7-0c67cc1a61a7-bluemix.cloudant.com",
      port: 443,
      username: "b1611753-b3bf-47ce-95f7-0c67cc1a61a7-bluemix",
      password: "e0cddb23f5b90a6f590053fb3504e18dd3d6081354d53b6ec0a1c9afcc1054d4",
      url: "https://b1611753-b3bf-47ce-95f7-0c67cc1a61a7-bluemix:e0cddb23f5b90a6f590053fb3504e18dd3d6081354d53b6ec0a1c9afcc1054d4@b1611753-b3bf-47ce-95f7-0c67cc1a61a7-bluemix.cloudant.com",
      dbname:"ce-clm_workitemdetails",
      name: APP_NAME + NODE_ENV
    },
    log: {
      name: APP_NAME + NODE_ENV,
      level: LOG_LEVEL
    }
  }
};

module.exports = config[NODE_ENV];
