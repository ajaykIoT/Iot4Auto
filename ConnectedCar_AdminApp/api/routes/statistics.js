'use strict';
var path = require('path');

var PATH = '/api/v1/statistics';
var VERSION = '1.0.0';
var model = require(path.join(__dirname, '../statistics/statistics'));

module.exports = function (server) {
  server.post({path: PATH, version: VERSION}, getStatistics);
  server.post({path: PATH+'/map', version: VERSION}, getModels);
  server.post({path: PATH+'/bar', version: VERSION}, getBar);
  server.post({path: PATH+'/insights', version: VERSION}, getInsights);  
  
  function getModels(req, res, next) {
    model.getAll(req.body, function(err, data) {
      if (err) {
        res.send(401, null);
        return next();
      } else {
        res.send(200, data);
        return next();
      }
    });
  }
  
  function getStatistics(req, res, next) {
	    model.getStatistics(req.body, function(err, data) {     
	      if (err) {
	        res.send(401, null);
	        return next();
	      } else {
	        res.send(200, data);
	        return next();
	      }
	    });
	  }
  
  function getInsights(req, res, next) {
    model.getInsights(req.body, function(err, data) {     
      if (err) {
        res.send(401, null);
        return next();
      } else {
        res.send(200, data);
        return next();
      }
    });
	}
  
  function getBar(req, res, next) {
    model.getBar(req.body, function(err, data) {     
      if (err) {
        res.send(401, null);
        return next();
      } else {
        res.send(200, data);
        return next();
      }
    });
	}
};
