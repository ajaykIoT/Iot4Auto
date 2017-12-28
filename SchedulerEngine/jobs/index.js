var async = require('async');
var cronConfig = require('../cron-config.json');
var Run = require('../lib/cron-schedular/Run');
var modules = require('./modules');

var schedular = function()
{
	var run = Run.getObject(cronConfig.smsRunNew);
	if(run.canRun())
	{
		async.series([
			//modules.NextMeetingReminder.schedular,
			//modules.SurveyExpiration.schedular,
			modules.JobRequest.schedular
		], function(error){
			// Do Nothing
			console.log("Execution Complete");
		});
	}
}

module.exports.schedular = schedular;