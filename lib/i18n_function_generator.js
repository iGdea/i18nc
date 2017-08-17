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
function genTranslateJSONCode(functionData, dbData, codeTranslateWords)
{
	var resultAst = {};

	return JSON.stringify({DEFAULTS:{}, SUBTYPES: {}});

	return escodegen.generate(resultAst, optionsUtils.escodegenOptions);
}



/**
 * input: test/files/merge_translate_data.js
 * output: test/files/merge_translate_data_output.json
 *
 * 暴露接口仅测试使用
 */
exports._mergeTranslateData = _mergeTranslateData;
function _mergeTranslateData(functionData, dbData, codeTranslateWords)
{

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


			var valueResult = keyAstVals.shift();
			keyAstVals.forEach(function(item)
			{
				valueResult =
				{
					"type": "LogicalExpression",
					"operator": "||",
					"left": valueResult,
					"right": item
				}
			});


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
	else if (type != 'object')
	{
		return {
			"type": "Literal",
			"value": val,
		}
	}
	else
	{
		debug('ignore constval type: %o, val:%s', type, val);
	}
}

