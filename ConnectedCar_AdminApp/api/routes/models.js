'use strict';
var path = require('path');

var PATH = 'api/v1/models';
var VERSION = '1.0.0';
var model = require(path.join(__dirname, '../models/models'));

module.exports = function (server) {
  server.get({path: PATH, version: VERSION}, getModels);
  
  function getModels(req, res, next) {
    model.getAll(req.body, function(err, data) {     
      if (err) {
        res.send(401, null);
        return next();
      } else {
        res.send(200, data);
        return next();
      }
    })
  }
};