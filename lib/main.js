var _						= require('lodash');
var debug					= require('debug')('i18nc:main');
var esprima					= require('esprima');
var escodegen				= require('escodegen');
var ASTCollecter			= require('./ast_collecter').ASTCollecter;
var astUtils				= require('./ast_utils');
var optionsUtils			= require('./options');
var i18nFunctionGenerator	= require('./i18n_function_generator');
var i18nFunctionParser		= require('./i18n_function_parser');


module.exports = function(code, options)
{
	options = optionsUtils.extend(options);

	var ast		= esprima.parse(code, {range: true});
	var collect	= new ASTCollecter(options).collect(ast);

	var defineFunctionArgAst;

	var newCode		= [];
	var dirtyWords	= [];
	var dealAst		= [];
	var tmpCode		= code;

	var codeTranslateWords =
	{
		DEFAULTS_words	: [],
		SUBTYPES_list	: {},
	};

	collect.i18nHanlderAst.forEach(function(item)
	{
		dealAst.push({type: 'i18nHandler', value: item});
	});

	if (!collect.i18nHanlderAst.length && options.insertToDefineHalder)
	{
		defineFunctionArgAst = collect.defineFunctionArgAst.sort(function(a, b)
			{
				return a.range[0] > b.range[0] ? 1 : -1;
			})[0];

		if (defineFunctionArgAst)
		{
			dealAst.push({type: 'defineFunctionArg', value: defineFunctionArgAst});
		}
	}

	collect.translateWordAsts.forEach(function(item)
	{
		codeTranslateWords.DEFAULTS_words = codeTranslateWords.DEFAULTS_words.concat(item.__i18n_replace_info__.translateWords);
		dealAst.push({type: 'translateWord', value: item});
	});
	

	collect.i18nArgs.filter(function(args)
		{
			return args && args[0];
		})
		.sort(function(a, b)
		{
			return a[0].range[0] > b[0].range[0] ? 1 : -1;
		})
		.forEach(function(args)
		{
			var args0 = args[0];
			var args1 = args[1];
			var args2 = args[2];

			if (!args0 || !args0.value) return;
			if (args0.type != 'Literal')
			{
				dirtyWords.push(escodegen.generate(args0, optionsUtils.escodegenOptions));
				return;
			}

			// 需要提取后面两个参数数据
			var wordInfo =
			{
				value: args0.value,
				subtype: args1 && astUtils.getConstValueFromAst(args1),
			};
			

			if (wordInfo.subtype)
			{
				var arr = codeTranslateWords.SUBTYPES_list[wordInfo.subtype]
					|| (codeTranslateWords.SUBTYPES_list[wordInfo.subtype] = []);
				arr.push(wordInfo);
			}
			else
			{
				codeTranslateWords.DEFAULTS_words.push(wordInfo.value);
			}
		});


	// i18n 函数插入时机
	// 如果原来有这个函数，就替换
	// 如果没有，就尝试查到第一个define内
	// 如果没有define，就直接插入到文件开头
	var i18nPlaceholders = [];
	var i18nPlaceholderNew = new I18NPlaceholder(null, codeTranslateWords, options);
	var fixIndex = 0;
	dealAst.sort(function(a, b)
		{
			return a.value.range[0] > b.value.range[0] ? 1 : -1;
		})
		.forEach(function(item)
		{
			var ast = item.value;
			var startPos = ast.range[0] - fixIndex;
			var endPos = ast.range[1] - fixIndex;

			switch(item.type)
			{
				case 'i18nHandler':
					var i18nPlaceholder = new I18NPlaceholder(ast, codeTranslateWords, options);
					newCode.push(tmpCode.slice(0, startPos), i18nPlaceholder);
					i18nPlaceholders.push(i18nPlaceholder);

					tmpCode = tmpCode.slice(endPos);
					fixIndex += endPos;
					break;

				case'defineFunctionArg':
					startPos = ast.body.range[0]+1-fixIndex;
					newCode.push(tmpCode.slice(0, startPos), '\n\n', i18nPlaceholderNew, '\n\n');

					tmpCode = tmpCode.slice(startPos);
					fixIndex += startPos;
					break;

				case 'translateWord':
					newCode.push(
						tmpCode.slice(0, startPos),
						escodegen.generate(ast.__i18n_replace_info__.newAst, optionsUtils.escodegenOptions)
					);

					tmpCode = tmpCode.slice(endPos);
					fixIndex += endPos;
					break;
			}
		});

	// 先整理获取到的翻译数据
	codeTranslateWords.DEFAULTS_words = _.uniq(codeTranslateWords.DEFAULTS_words);

	// 如果本来有i18n函数
	// 新创建的占位函数就设置成空
	if (collect.i18nHanlderAst.length)
	{
		i18nPlaceholderNew.toString = function(){return ''};
	}

	// 再输出最终代码
	var resultCode = newCode.join('')+tmpCode;

	// 如果没有define，并且没有原有的i18n函数
	// 就在文件头部增加新的i18nPlaceholder函数
	if (!defineFunctionArgAst && !collect.i18nHanlderAst.length)
	{
		resultCode = i18nPlaceholder +'\n\n'+ resultCode;
	}


	return {
		code				: resultCode,
		dirtyWords			: dirtyWords,
		codeTranslateWords	: codeTranslateWords,
	};
};


function I18NPlaceholder(oldAst, codeTranslateWords, options)
{
	this.oldAst				= oldAst;
	this.options			= options;
	this._parseResult		= null;
	this.codeTranslateWords	= codeTranslateWords;
}

_.extend(I18NPlaceholder.prototype,
	{
		toString: function()
		{
			var functionData = this.parse();
			var TRANSLATE_JSON = i18nFunctionGenerator.genTranslateJSONCode(functionData, this.options.dbData, this.codeTranslateWords);

			var renderData =
			{
				handlerName			: this.options.handlerName,
				FILE_KEY			: functionData.__FILE_KEY__,
				FUNCTION_VERSION	: functionData.__FUNCTION_VERSION__ || optionsUtils.I18NFunctionVersion,
				acceptLanguageCode	: this.options.acceptLanguageCode,
				TRANSLATE_JSON		: TRANSLATE_JSON,
			};

			debug('i18n fucntion renderdata: %o', renderData);

			return i18nFunctionGenerator.render(renderData);
		},
		parse: function()
		{
			if (!this._parseResult)
			{
				if (this.oldAst)
				{
					this._parseResult = i18nFunctionParser.parse(this.oldAst);
				}
				
				if (!this._parseResult || !this._parseResult.__FILE_KEY__)
				{
					this._parseResult =
					{
						__FILE_KEY__			: this.options.defaultFilekey,
						__FUNCTION_VERSION__	: optionsUtils.I18NFunctionVersion,
						__TRANSLATE_JSON__		: {}
					};
				}
			}

			return this._parseResult;
		},
	});
