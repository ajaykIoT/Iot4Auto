var validator = require('../validator');
var Cron = require('./Cron');
var CronTime = require('./CronTime');

function Run(runtype, crons)
{
	this.setRunType(runtype);
	this.setCrons(crons);
}

Run.validateRunType = function(runtype, throwError)
{
	if(!validator.isString(runtype) || !validator.isEnum(runtype.toUpperCase(), ['SLOTTED', 'ALWAYS', 'EXACT']))
	{
		if(throwError == true)
			throw new Error("Run Type must be SLOTTED, ALWAYS or EXACT");
		return false;
	}
	return true;
}

Run.prototype.getRunType = function()
{
	Run.validateRunType(this.runtype, true);
	return this.runtype;
}

Run.prototype.setRunType = function(runtype)
{
	Run.validateRunType(runtype, true);
	this.runtype = runtype.toUpperCase();
}

Run.prototype.getCrons = function()
{
	if(!validator.isArrayOfObject(this.crons, 'Cron'))
		throw new Error("Data is Inconsistent. Crons must be an array of type Cron.");
	return this.crons;
}

Run.prototype.setCrons = function(crons)
{
	if(validator.isArrayOfObject(crons, 'Cron'))
		this.crons = crons;
	if(validator.isPresent(this.getRunType()) && this.getRunType() == 'ALWAYS')
	{
		if(validator.isArray(crons))
		{
			if(crons.length==1 && validator.isJSON(crons[0], ['interval']))
				this.crons = [Cron.createAlwaysCron(crons[0].interval)];
			else
				throw new Error("Inconsistent data provided.");
		}
		else if(validator.isString(crons))
			this.crons = [Cron.createAlwaysCron(crons)];
		else
			throw new Error("Always type requires interval to be string");
	}
	else if(validator.isPresent(this.getRunType()) && this.getRunType() == 'SLOTTED')
	{
		if(!validator.isArray(crons))
			throw new Error("Slotted type crons requires an array of crons.");
		this.crons = [];
		for(var indx in crons)
		{
			this.addCron(crons[indx]);
		}
	}
	else if(validator.isPresent(this.getRunType()) && this.getRunType() == 'EXACT')
	{
		if(!validator.isArray(crons))
			throw new Error("Exact type crons requires an array of crons strings.");
		this.crons = [];
		for(var indx in crons)
		{
			if(validator.isString(crons[indx]))
				this.crons.push(Cron.createExactCron(crons[indx]));
			else if(validator.isJSON(crons[indx], ['at']))
				this.crons.push(Cron.createExactCron(crons[indx].at));
			else
				throw new Error("Inconsistent data provided.");
		}
	}
	else
	{
		throw new Error("Run type is required. Run types can be ALWAYS, EXACT or SLOTTED.");
	}
}

Run.prototype.addCron = function(cron)
{
	if(validator.isPresent(this.getRunType()))
	{
		if(this.getRunType() == 'ALWAYS')
		{
			throw new Error("Always type cron can be updated not added.");
		}
		else if(this.getRunType() == 'SLOTTED')
		{
			if(validator.isJSON(cron, ['start', 'end', 'interval']))
				this.crons.push(Cron.createSlotCron(cron.start, cron.end, cron.interval));
			else if(validator.isObjectOfType(cron, 'Cron'))
				this.crons.push(cron);
			else
				throw new Error("Slotted type require start, end and interval.");
		}
		else if(this.getRunType() == 'EXACT')
		{
			if(validator.isString(cron))
				this.crons.push(Cron.createExactCron(cron));
			else if(validator.isObjectOfType(cron, 'Cron'))
				this.crons.push(cron);
			else
				throw new Error("Exact type crons requires a cron string.");
		}
	}
	else
	{
		throw new Error("Run type is required.");
	}
}

Run.prototype.removeCron = function(cron)
{
	if(validator.isPresent(this.getRunType()))
	{
		if(this.getRunType() == 'ALWAYS')
		{
			throw new Error("Always type cron can be updated not removed.");
		}
		else if(this.getRunType() == 'SLOTTED')
		{
			if(validator.isJSON(cron, ['start', 'end', 'interval']))
			{
				if(validator.isString(cron.start) && validator.isString(cron.end) && validator.isString(cron.interval))
				{
					var search = Cron.createSlotCron(cron.start, cron.end, cron.interval).toTime();
					for(var indx in this.crons)
					{
						if(search == this.crons[indx].toTime())
						{
							this.crons.splice(indx, 1);
							break;
						}
					}
				}
			}
			else
				throw new Error("Slotted type require start, end and interval.");
		}
		else if(this.getRunType() == 'EXACT')
		{
			if(validator.isString(cron))
			{
				var search = Cron.createExactCron(cron).toTime();
				for(var indx in this.crons)
				{
					if(search == this.crons[indx].toTime())
					{
						this.crons.splice(indx, 1);
						break;
					}
				}
			}
			else
				throw new Error("Exact type crons requires a cron string.");
		}
	}
}

Run.prototype.getJSON = function()
{
	var json = {};
	json.runtype = this.getRunType();
	var cronsList = this.getCrons();
	json.crons = [];
	for(var indx in cronsList)
	{
		json.crons[indx] = cronsList[indx].getJSON();
	}
	return json;
}

Run.prototype.getJSONMap = function(runtype, crons)
{
	var json = {};
	if(validator.isString(runtype))
		json[runtype] = this.getRunType();
	else
		json.runtype = this.getRunType();
	var cronsList = this.getCrons();
	var assignCrons = [];
	for(var indx in cronsList)
	{
		assignCrons[indx] = cronsList[indx].getJSON();
	}
	if(validator.isString(crons))
		json[crons] = assignCrons;
	else
		json.crons = assignCrons;
	return json;
}

Run.prototype.clone = function()
{
	var runtype = this.getRunType();
	var cronsList = this.getCrons();
	var crons = [];
	for(var indx in cronsList)
	{
		crons[indx] = cronsList[indx].clone();
	}
	var object = new Run(runtype, crons);
	return object;
}

Run.getObject = function(json)
{
	if(validator.isJSON(json, ['runtype']))
	{
		var object = null;
		if(json.runtype.toUpperCase()=='ALWAYS')
		{
			if(json.interval)
				object = new Run(json.runtype, json.interval);
			else if(json.crons)
				object = new Run(json.runtype, json.crons);
		}
		else if(json.runtype.toUpperCase()=='EXACT')
			object = new Run(json.runtype, json.crons);
		else if(json.runtype.toUpperCase()=='SLOTTED')
			object = new Run(json.runtype, json.crons);
		else
			throw new Error("Run Type must be SLOTTED, ALWAYS or EXACT");
		return object;
	}
	else
	{
		throw new Error('JSON object Invalid. Run types can be ALWAYS, EXACT or SLOTTED.');
	}
}

Run.prototype.canRun = function()
{
	var currentTime = new Date();
	var hour = currentTime.getHours();
	var minute = currentTime.getMinutes();
	var nextRun = this.nextRun(true);
	if(nextRun.isAny == true)
	{
		return nextRun.hour == hour && nextRun.minute==minute;
	}
	return false;
}

Run.prototype.nextRun = function(raw)
{
	var currentTime = new Date();
	var currHour = currentTime.getHours();
	var currMinute = currentTime.getMinutes();
	var currentMinutes = currHour * 60 + currMinute;
	var hour = Number.MAX_VALUE, minute = Number.MAX_VALUE, least = Number.MAX_VALUE;
	var at = [];
	if(this.getRunType() == 'EXACT')
	{
		var cronsList = this.getCrons();
		var at = [];
		for(var indx in cronsList)
		{
			at.push(cronsList[indx].at.getHour() * 60 + cronsList[indx].at.getMinute());
		}
	}
	else if(this.getRunType() == 'SLOTTED')
	{
		var cronsList = this.getCrons();
		console.log("Crons are :");
		console.log(cronsList);
		for(var cron in cronsList)
		{
			var cronStart = cronsList[cron].start.getHour() * 60 + cronsList[cron].start.getMinute();
			var cronInterval = cronsList[cron].interval.getHour() * 60 + cronsList[cron].interval.getMinute();
			var cronEnd = cronsList[cron].end.getHour() * 60 + cronsList[cron].end.getMinute();
			for(var time=cronStart; cronStart>cronEnd?time>=cronStart||time<=cronEnd:time>=cronStart&&time<=cronEnd; time=(time>=1440?time%1440:time+cronInterval))
			{
				at.push(time);
			}
		}
	}
	else if(this.getRunType() == 'ALWAYS')
	{
		var cronInterval = this.getCrons()[0].interval;
		var intervalMinutes = cronInterval.getHour() * 60 + cronInterval.getMinute();
		var mod = currentMinutes%intervalMinutes;
		var atMinutes = currentMinutes - (currentMinutes%intervalMinutes);
		if(mod!=0) atMinutes += intervalMinutes;
		at.push(atMinutes);
	}
	at.sort(function(a, b) {
	  return a - b;
	});
	for(var indx in at)
	{
		if(at[indx]>=currentMinutes)
		{
			least = at[indx];
			break;
		}
	}
	if(least==Number.MAX_VALUE && at.length>0)
	{
		least = at[0];
	}
	if(least == Number.MAX_VALUE)
	{
		if(raw==true)
		{
			return {"isAny": false};
		}
		return "-";
	}
	hour = Math.floor(least/60);
	minute = least - (hour*60);
	if(minute>60)
	{
		minute = minute%60;
		hour++;
	}
	hour = hour%24;
	if(raw==true)
	{
		return {"isAny": true, hour: hour, minute: minute};
	}
	var noon = "AM";
	if(hour>=12)
	{
		noon = "PM";
		hour = hour%12;
	}
	return (hour<10?("0"+hour):hour)+ ":" + (minute<10?("0"+minute):minute) + " " + noon;
}

module.exports = Run;