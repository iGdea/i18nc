var _				= require('lodash');
var fs				= require('fs');
var debug			= require('debug')('i18nc:i18n_function_generator');
var escodegen		= require('escodegen');
var template		= require('art-template');
var astUtils		= require('./ast_utils');
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
	var translateData = _to_TRANSLATE_DATA_fromat(_mergeTranslateData(data));
	debug('translateData:%o', translateData);

	var ast = _translateJSON2ast(translateData);
	if (ast)
		return escodegen.generate(ast, optionsUtils.escodegenOptions);
	else
		return '{}';
}



/**
 * 将TRANSLATE_DATA数据，转成ast表示
 * 
 * input: _to_TRANSLATE_DATA_fromat  运行结果
 * output: test/files/merge_translate_data.json
 *
 * 对数据进行重新编排
 * 暴露接口仅测试使用
 */
exports._translateJSON2ast = _translateJSON2ast;
function _translateJSON2ast(mainData)
{
	var resultPropertiesAst = [];

	_.each(Object.keys(mainData).sort(), function(lan)
	{
		var translateData = mainData[lan];
		var lanPropertiesAst = [];

		// 处理DEFAULTS
		var tmp = _wordmap2ast(translateData.DEFAULTS);
		if (tmp)
		{
			lanPropertiesAst.push(astUtils.PropertyAst('DEFAULTS', tmp));
		}


		// 处理 SUBTYPES
		if (translateData.SUBTYPES)
		{
			var tmpSubtypesPropertiesAst = _.map(Object.keys(translateData.SUBTYPES).sort(), function(subtype)
				{
					var tmp = _wordmap2ast(translateData.SUBTYPES[subtype]);
					if (!tmp) return;

					return astUtils.PropertyAst(subtype, tmp);
				})
				.filter(function(val)
				{
					return val;
				});

			if (tmpSubtypesPropertiesAst.length)
			{
				lanPropertiesAst.push(astUtils.PropertyAst('SUBTYPES', astUtils.ObjectExpressionAst(tmpSubtypesPropertiesAst)));
			}
		}

		if (lanPropertiesAst.length)
		{
			resultPropertiesAst.push(astUtils.PropertyAst(lan, astUtils.ObjectExpressionAst(lanPropertiesAst)));
		}
	});


	if (resultPropertiesAst.length)
	{
		return astUtils.ObjectExpressionAst(resultPropertiesAst);
	}
}



/**
 * 对mergeTranslateData的结果数据进行重新编排
 * 生成TRANSLATE_DATA的数据格式
 * 
 * input: _mergeTranslateData  运行结果
 * output: test/files/merge_translate_data_output.json
 *
 * 暴露接口仅测试使用
 */
exports._to_TRANSLATE_DATA_fromat = _to_TRANSLATE_DATA_fromat;
function _to_TRANSLATE_DATA_fromat(data)
{
	var result = {};
	_.each(data.DEFAULTS, function(lanData, word)
	{
		_.each(lanData, function(translateData, lan)
		{
			var lanObj = result[lan] || (result[lan] = {});
			var wordObj = lanObj.DEFAULTS || (lanObj.DEFAULTS = {});

			wordObj[word] = translateData;
		});
	});

	_.each(data.SUBTYPES, function(item, subtype)
	{
		_.each(item, function(lanData, word)
		{
			_.each(lanData, function(translateData, lan)
			{
				var lanObj = result[lan] || (result[lan] = {});
				var subtypeObj = lanObj.SUBTYPES || (lanObj.SUBTYPES = {});
				var wordObj = subtypeObj[subtype] || (subtypeObj[subtype] = {});

				wordObj[word] = translateData;
			});
		});
	});

	return result;
}



/**
 * 合并各个来源的数据
 * 根据参数来确定打包到code的数据
 * 
 * input: test/files/merge_translate_data.js
 * output: test/files/merge_translate_data_json.json
 *
 * 暴露接口仅测试使用
 */
exports._mergeTranslateData = _mergeTranslateData;
function _mergeTranslateData(mainData)
{
	// 先用一个不规范的数据保存，最后要把语言作为一级key处理
	var result = {DEFAULTS: {}, SUBTYPES: {}};
	var codeTranslateWords = mainData.codeTranslateWords || {};
	var FILE_KEY = mainData.FILE_KEY;


	_.each(codeTranslateWords.DEFAULTS, function(word)
	{
		result.DEFAULTS[word] = _getOneTypeListData('DEFAULTS', word, mainData, FILE_KEY);
	});

	_.each(codeTranslateWords.SUBTYPES, function(words, subtype)
	{
		var subresult = result.SUBTYPES[subtype] = {};
		_.each(words, function(word)
		{
			subresult[word] = _getOneTypeListData('SUBTYPES', word, mainData, FILE_KEY, subtype);
		});
	});

	return result;
}


/**
 * 针对单个type(DEFAULTS/SUBTYPES)，单个单词的 所有语言
 * 返回其翻译结果的数组
 *
 * 处理任务
 *     db下所有文件和指定文件的两份数据融合
 *     和函数中分析出来的数据融合
 */
function _getOneTypeListData(maintype, word, mainData, FILE_KEY, subtype)
{
	var funcTranslates = {};
	var dbNormalTranslates = {};
	var dbFileKeyTranslates = {};
	var lans = {};

	_.each(mainData.dbTranslateWords, function(lanInfo, lan)
	{
		if (!lanInfo) return;

		var subLanInfo = lanInfo['<allfile>'] && lanInfo['<allfile>'][maintype];
		if (subtype && subLanInfo) subLanInfo = subLanInfo[subtype];

		// 直接输出字符串，要进行in判断
		if (subLanInfo && word in subLanInfo)
		{
			lans[lan] = 1;
			// allfile 下都是字符串，不是数组
			// 要包一层数组
			// 原因：allfile是全局的，如果有修改，就应该具体到文件
			dbNormalTranslates[lan] = [ subLanInfo[word] ];
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

	_.each(mainData.funcTranslateWords, function(lanInfo, lan)
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
			funcTranslates[lan] = translateWord;
		}
	});

	var lans = Object.keys(lans);
	debug('word:%s, subtype:%s lans:%o, funcTranslates:%o, dbNormalTranslates:%o, dbFileKeyTranslates',
		word, subtype, lans, funcTranslates, dbNormalTranslates, dbFileKeyTranslates);


	// 对获取到的所有数据进行合并操作
	var result = {};
	lans.forEach(function(lan)
	{
		var funcTranslate = funcTranslates[lan];
		var dbFileKeyTranslate = dbFileKeyTranslates[lan];


		if (funcTranslate && funcTranslate.length
			&& dbFileKeyTranslate && dbFileKeyTranslate.length)
		{
			switch(funcTranslate.length)
			{
				case 0:
					result[lan] = dbFileKeyTranslate;
					break;

				case 1:
					result[lan] = dbFileKeyTranslate;
					break;

				case 2:
					if (dbFileKeyTranslate.length <= 2)
						result[lan] = funcTranslate;
					else
						result[lan] = dbFileKeyTranslate;
					break;

				case 3:
				default:
					var lanReuslt = result[lan] = funcTranslate.slice(0, 2);

					// 如果 >3，说明必定被用户修改过 (容错)
					// 将最后一个数据重置到用户修改位
					if (funcTranslate.length > 3)
					{
						lanReuslt[1] = funcTranslate.slice(-1)[0];
						debug('funcTranslate len >3, data:%o', funcTranslate);
					}


					// 如果dbFileKeyTranslate有3个
					// 可以不判断funcTranslate[0]，直接使用dbFileKeyTranslate[2]
					if (dbFileKeyTranslate.length == 3)
					{
						lanReuslt[2] = dbFileKeyTranslate[2];
					}
					break;
			}
		}
		// 只有funcTranslate的时候，只有len>1 才有用
		else if (funcTranslate && funcTranslate.length > 1)
		{
			var lanReuslt = result[lan] = funcTranslate.slice(0, 2);
			if (funcTranslate.length > 3)
			{
				lanReuslt[1] = funcTranslate.slice(-1)[0];
				debug('funcTranslate len >3, data:%o', funcTranslate);
			}
		}
		else if (dbFileKeyTranslate && dbFileKeyTranslate.length)
		{
			result[lan] = dbFileKeyTranslate;
		}
		else if (dbNormalTranslates[lan])
		{
			result[lan] = dbNormalTranslates[lan];
		}
		// 只有一个length的funcTranslate
		// 如果db里面没有数据了
		// 那么就当作删除处理
		// else if (funcTranslate)
		// {
		// 	result[lan] = funcTranslate;
		// }
	});

	return result;
}



/**
 * 将array表示的或关系转成ast表示
 * 
 * 注意：
 * array的顺序，第一个是最末尾的或，依次类推
 * 和写法上数序相反
 * 例如：
 * [c, b, a]  =>  a || b || c
 *
 * 
 * input: test/files/translate_data.json
 * output: test/files/translate_data_ast.json
 *
 * 暴露接口仅测试使用
 */
exports._wordmap2ast = _wordmap2ast;
function _wordmap2ast(words)
{
	if (!words) return;
	var result = [];

	// 先对object进行排序，保证尽可能少触发svn变更
	Object.keys(words).sort()
		.forEach(function(val)
		{
			var keyAstVals = _.map(words[val], function(val)
				{
					return astUtils.constVal2astWidthArray(val);
				})
				.filter(function(val)
				{
					return val;
				});

			if (!keyAstVals.length) return;


			var valueResult = keyAstVals.pop();
			for (var i = keyAstVals.length; i--;)
			{
				valueResult = astUtils.LogicalExpressionAst(valueResult, keyAstVals[i]);
			}


			result.push(astUtils.PropertyAst(val, valueResult));
		});

	return astUtils.ObjectExpressionAst(result);
}

