var isError = function(error)
{
	return typeof error === 'object' && error !== null &&
      (Object.prototype.toString.call(error) === '[object Error]' || error instanceof Error);
}

var isPresent = function(object)
{
	return object && object!=null;
}

var isNumber = function(number)
{
	return !isNaN(number) && typeof number === 'number';
}

var isString = function(string)
{
	if(string && string!=null && typeof string=='string')
		return true;
	return false;
}

var isObjectOfType = function(value, type)
{
	if(isString(type) && value && value!=null && typeof value=='object' && value.constructor.name==type)
		return true;
	return false;
}

var isEnum = function(string, type)
{
	if(isString(string) && isArrayOfString(type))
	{
		return type.indexOf(string)!=-1;
	}
	return false;
}

var isArray = function(array)
{
	if(!array || array==null || typeof array!='object' || array.constructor.name != 'Array')
		return false;
	return true;
}

var isArrayOfString = function(array)
{
	if(!isArray(array))
		return false;
	for(var index in array)
	{
		var value = array[index];
		if(!isString(value))
		{
			return false;
		}
	}
	return true;
}

var isArrayOfObject = function(array, type)
{
	if(!isArray(array))
		return false;
	if(isString(type))
	{
		for(var index in array)
		{
			var value = array[index];
			if(!value || value==null || typeof value!='object' || value.constructor.name!=type)
			{
				return false;
			}
		}
	}
	return true;
}

var isJSON = function(json, properties)
{
	if(!json || json==null || typeof json!='object' || json.constructor.name != 'Object')
		return false;
	if(isArrayOfString(properties))
	{
		for(var index in properties)
		{
			var value = properties[index];
			if(!json.hasOwnProperty(value))
			{
				return false;
			}
		}
	}
	return true;
}


module.exports.isError = isError;
module.exports.isPresent = isPresent;
module.exports.isNumber = isNumber;
module.exports.isString = isString;
module.exports.isObjectOfType = isObjectOfType;
module.exports.isArray = isArray;
module.exports.isArrayOfString = isArrayOfString;
module.exports.isArrayOfObject = isArrayOfObject;
module.exports.isJSON = isJSON;
module.exports.isEnum = isEnum;