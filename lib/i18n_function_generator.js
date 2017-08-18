var _				= require('lodash');
var fs				= require('fs');
var debug			= require('debug')('i18nc:i18n_function_generator');
var escodegen		= require('escodegen');
var template		= require('art-template');
var optionsUtils	= require('./options');
var tplContent		= fs.readFileSync(__dirname+'/i18n_function.tpl', {encoding: 'utf8'});
var functionTpl		= template.compile(tplContent);

exports.render = render;
function render(data)
{
	return functionTpl(data).trim();
}


exports.genTranslateJSONCode = genTranslateJSONCode;
function genTranslateJSONCode(data)
{
	var resultAst = {};

	return JSON.stringify({zh: {DEFAULTS:{}, SUBTYPES: {}}});

	return escodegen.generate(resultAst, optionsUtils.escodegenOptions);
}



/**
 * input: test/files/merge_translate_data.js
 * output: test/files/merge_translate_data_output.json
 *
 * 暴露接口仅测试使用
 */
exports._mergeTranslateData = _mergeTranslateData;
function _mergeTranslateData(mainData)
{
	var result = {};
	var codeTranslateWords = mainData.codeTranslateWords || {};
	var FILE_KEY = mainData.FILE_KEY;


	_.each(codeTranslateWords.DEFAULTS, function(word)
	{
		result.DEFAULTS[word] = _get('DEFAULTS', word, mainData, FILE_KEY);
	});

	_.each(codeTranslateWords.SUBTYPES, function(words, subtype)
	{
		var subresult = result[subtype] = {};
		_.each(words, function(word)
		{
			subresult[word] = _get('SUBTYPES', word, mainData, FILE_KEY, subtype);
		});
	});
}



function _get(maintype, word, mainData, FILE_KEY, subtype)
{
	var codeTranslates = {};
	var dbNormalTranslates = {};
	var dbFileKeyTranslates = {};
	var lans = {};

	_.each(mainData.dbTranslateWords, function(lan, lanInfo)
	{
		if (!lanInfo) return;

		var subLanInfo = lanInfo.normal && lanInfo.normal[maintype];
		if (subtype && subLanInfo) subLanInfo = subLanInfo[subtype];

		// 直接输出字符串，要进行in判断
		if (subLanInfo && word in subLanInfo)
		{
			lans[lan] = 1;
			dbNormalTranslates[lan] = subLanInfo[word];
		}

		var subLanInfo = lanInfo[FILE_KEY] && lanInfo[FILE_KEY][maintype];
		if (subtype && subLanInfo) subLanInfo = subLanInfo[subtype];

		// 获取到的是一个array对象
		// [xxxx, xxxx, xxxx]
		var translateWord = subLanInfo && subLanInfo[word];
		if (translateWord)
		{
			lans[lan] = 1;
			dbFileKeyTranslates[lan] = translateWord;
		}
	});

	_.each(mainData.codeTranslateWords, function(lan, lanInfo)
	{
		if (!lanInfo) return;

		var subLanInfo = lanInfo[maintype];
		if (subtype && subLanInfo) subLanInfo = subLanInfo[subtype];

		// 获取到的是一个array对象
		// [xxxx, xxxx]
		var translateWord = subLanInfo && subLanInfo[word];
		if (translateWord)
		{
			lans[lan] = 1;
			dbFileKeyTranslates[lan] = translateWord;
		}
	});


	// 对获取到的所有数据进行整理
	var result = {};
	Object.keys(lans).forEach(function(lan)
	{
		var codeTranslate = codeTranslates[lan];
		var dbFileKeyTranslate = dbFileKeyTranslates[lan];
		if (codeTranslate && codeTranslate.length > 1)
		{
			if (dbFileKeyTranslate
				&& dbFileKeyTranslate.db != codeTranslate[0])
			{
				codeTranslate = codeTranslate.slice();
				codeTranslate[2] = dbFileKeyTranslate.db
				result[lan] = codeTranslate;
			}
			else
			{
				result[lan] = codeTranslate;
			}
		}
		else if (dbFileKeyTranslate)
		{
			result[lan] = [dbFileKeyTranslate.db];
			if (!codeTranslate && 'custom' in dbFileKeyTranslate)
			{
				result[lan].unshift(dbFileKeyTranslate.custom);
			}
		}
		else if (lan in dbNormalTranslates)
		{
			result[lan] = [dbNormalTranslates[lan]];
		}
		else if (codeTranslate)
		{
			result[lan] = codeTranslate;
		}
	});
}



/**
 * input: test/files/translate_data.json
 * output: test/files/translate_data_ast.json
 *
 * 暴露接口仅测试使用
 */
exports._wordmap2ast = _wordmap2ast;
function _wordmap2ast(words)
{
	var result = [];

	// 先对object进行排序，保证尽可能少触发svn变更
	Object.keys(words).sort()
		.forEach(function(val)
		{
			var keyAstVals = _.map(words[val], function(val)
				{
					return _constVal2astWidthArray(val);
				})
				.filter(function(val)
				{
					return val;
				});

			if (!keyAstVals.length) return;


			var valueResult = keyAstVals.pop();
			for (var i = keyAstVals.length; i--;)
			{
				valueResult =
				{
					"type": "LogicalExpression",
					"operator": "||",
					"left": valueResult,
					"right": keyAstVals[i]
				}
			}


			result.push(
			{
				"type": "Property",
				"key":
				{
					"type": "Literal",
					"value": val,
				},
				"computed": false,
				"value": valueResult,
				"kind": "init",
				"method": false,
				"shorthand": false
			});
		});

	return {
		"type": "ObjectExpression",
		"properties": result
	};
}


function _constVal2astWidthArray(val)
{
	var type = typeof val;
	if (type == 'string' && !val)
	{
		return {
			"type": "ArrayExpression",
			"elements": []
		};
	}
	else if (type == 'undefined')
	{
		return {
			"type": "Literal",
			"value": '',
		};
	}
	else if (type != 'object')
	{
		return {
			"type": "Literal",
			"value": val,
		};
	}
	else
	{
		debug('ignore constval type: %o, val:%s', type, val);
	}
}

