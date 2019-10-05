/**
 * 将不同版本的db数据，解析成统一的结构体
 */

'use strict';

var _			= require('lodash');
var debug		= require('debug')('i18nc-db:update');
var jsoncode	= require('i18nc-jsoncode');
var parserV2	= jsoncode.jsoncode.v2.parser;


module.exports = update;
function update(dbTranslateWords)
{
	if (!dbTranslateWords) return dbTranslateWords;

	if (!dbTranslateWords.version)
	{
		dbTranslateWords =
		{
			version: 1,
			data: dbTranslateWords
		};
	}

	debug('update version:%s', dbTranslateWords.version);

	var result = {};
	switch(dbTranslateWords.version)
	{
		case 1:
			_.each(dbTranslateWords.data || dbTranslateWords, function(item, lan)
			{
				if (lan == 'version') return;
				_.each(item, function(data, fileKey)
				{
					var obj = result[fileKey] || (result[fileKey] = {});
					obj[lan] = data;
				});
			});
			break;

		case 2:
			if (dbTranslateWords.data)
			{
				return dbTranslateWords;
			}
			else
			{
				// 为了去掉version，同时不修改原来的结构体
				// 如果修改，下次require会导致version判断错误
				_.each(dbTranslateWords, function(item, key)
				{
					if (key == 'version') return;
					result[key] = item;
				});
			}
			break;

		case 3:
			_.each(dbTranslateWords.data || dbTranslateWords, function(val, key)
			{
				if (key == 'version') return;
				result[key] = parserV2.codeJSON2translateJSON(val);
			});
			break;

		default:
			throw new Error('undefined dbTranslateWords Version');
	}

	return {
		version: 2,
		data: result
	};
}
