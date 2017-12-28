'use strict';

function getAll(payload,callback) {
  var models = [];
  var model = {};
  
  model.id = 1001;
  model.name = "KONE-1000"
  
  models.push(model)
  
  model.id = 1002;
  model.name = "KONE-2000"
  
  models.push(model)
  
  callback(null, models);
}

module.exports.getAll = getAll