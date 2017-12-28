var CronTime = require('./CronTime');

function Cron(type)
{
	this.type = type;
	/*
		SLOTTED - start interval end (1-5 / 2)
		ALWAYS -  interval	(* / 2)
		EXACT - at	5
	*/
}

Cron.createSlotCron = function(start, end, interval)
{
	var cron = new Cron("SLOTTED");
	cron.start = new CronTime(start);
	cron.end = new CronTime(end);
	cron.interval = new CronTime(interval);
	return cron;
}

Cron.createAlwaysCron = function(interval)
{
	var cron = new Cron("ALWAYS");
	cron.interval = new CronTime(interval);
	return cron;
}

Cron.createExactCron = function(at)
{
	var cron = new Cron("EXACT");
	cron.at = new CronTime(at);
	return cron;
}

Cron.prototype.toTime = function()
{
	var time = "";
	if(this.type == 'SLOTTED')
	{
		time = this.start + ":" + this.end + ":" + this.interval;
	}
	else if(this.type == 'ALWAYS')
	{
		time = this.interval + "I";
	}
	else if(this.type == 'EXACT')
	{
		time = this.interval + "A";
	}
	return time;
}

Cron.prototype.getJSON = function()
{
	var json = {};
	if(this.type == 'SLOTTED')
	{
		json.start = this.start.getJSON();
		json.end = this.end.getJSON();
		json.interval = this.interval.getJSON();
	}
	else if(this.type == 'ALWAYS')
	{
		json.interval = this.interval.getJSON();
	}
	else if(this.type == 'EXACT')
	{
		json.at = this.at.getJSON();
	}
	return json;
}

Cron.prototype.clone = function()
{
	var object = null;
	if(this.type == 'SLOTTED')
	{
		object = new Cron("SLOTTED");
		object.start = this.start.clone();
		object.end = this.end.clone();
		object.interval = this.interval.clone();
	}
	else if(this.type == 'ALWAYS')
	{
		object = new Cron("ALWAYS");
		object.interval = this.interval.clone();
	}
	else if(this.type == 'EXACT')
	{
		object = new Cron("EXACT");
		object.at = this.at.clone();
	}
	return object;
}

module.exports.createSlotCron = Cron.createSlotCron;
module.exports.createAlwaysCron = Cron.createAlwaysCron;
module.exports.createExactCron = Cron.createExactCron;