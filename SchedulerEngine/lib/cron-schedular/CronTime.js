var validator = require('../validator');


function CronTime(time)
{
	if(validator.isString(time))
	{
		var parsedTime = CronTime.parseTime(time);
		this.setHour(parsedTime.hour);
		this.setMinute(parsedTime.minute);
	}
	else if(validator.isJSON(time, ['hour', 'minute']))
	{
		this.setHour(time.hour);
		this.setMinute(time.minute);
	}
}

CronTime.parseTime = function(time)
{
	if(validator.isString(time))
	{
		var array = time.split(":");
		if(array.length!=2)
		{
			console.log(time);
			throw new Error("Time sent is incorrect : It must be hour:minute. ex., 4:45");
		}
		var hour = parseInt(array[0]);
		if(isNaN(hour) || hour>23 || hour<0)
		{
			throw new Error("Hour passed is Incorrect for time : " + time);
		}
		var minute = parseInt(array[1]);
		if(isNaN(minute) || minute>59 || minute<0)
		{
			throw new Error("Minute passed is Incorrect for time : "+time);
		}
		return { hour: hour, minute: minute };
	}
	else
	{
		throw new Error("Time sent is incorrect : It must be a string with format hour:minute. ex., 4:45");
	}
}

CronTime.prototype.toTime = function()
{
	return this.hour + ":" + this.minute;
}

CronTime.validateHour = function(hour, throwError)
{
	if(validator.isNumber(hour) && hour<=23 && hour>=0)
		return true;
	if(throwError == true)
		throw new Error("Data is Inconsistent. Hour must be a number between 0-23.");
	return false;
}

CronTime.prototype.getHour = function()
{
	CronTime.validateHour(this.hour, true);
	return this.hour;
}

CronTime.prototype.setHour = function(hour)
{
	if(CronTime.validateHour(hour, false))
		this.hour = hour;
	else
		this.hour = 0;
}

CronTime.validateMinute = function(minute, throwError)
{
	if(validator.isNumber(minute) && minute<=59 && minute>=0)
		return true;
	if(throwError == true)
		throw new Error("Data is Inconsistent. Minute must be a number between 0-59.");
	return false;
}

CronTime.prototype.getMinute = function()
{
	CronTime.validateMinute(this.minute, true);
	return this.minute;
}

CronTime.prototype.setMinute = function(minute)
{
	if(CronTime.validateMinute(minute, false))
		this.minute = minute;
	else
		this.minute = 0;
}

CronTime.prototype.getJSON = function()
{
	var json = {};
	json.hour = this.getHour();
	json.minute = this.getMinute();
	return json;
}

CronTime.prototype.getJSONMap = function(hour, minute)
{
	var json = {};
	if(hour)
		json[hour] = this.getHour();
	else
		json.hour = this.getHour();
	if(minute)
		json[minute] = this.getMinute();
	else
		json.minute = this.getMinute();
	return json;
}

CronTime.prototype.clone = function()
{
	var object = new CronTime(this.toTime());
	return object;
}

CronTime.getObject = function(time)
{
	if(validator.isString(time))
	{
		var object = new CronTime(time);
		return object;
	}
	else
	{
		throw new Error('JSON object Invalid. Require hour and minute.');
	}
}

module.exports = CronTime;