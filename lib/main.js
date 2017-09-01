var _				= require('lodash');
var debug			= require('debug')('i18nc:main');
var extend			= require('extend');
var escodegen		= require('escodegen');
var ASTCollector	= require('./ast_collector').ASTCollector;
var I18NPlaceholder	= require('./i18n_placeholder').I18NPlaceholder;
var astUtils		= require('./ast_utils');
var optionsUtils	= require('./options');
var AST_FLAGS		= astUtils.AST_FLAGS;
var ArrayPush		= Array.prototype.push;


module.exports = function(code, options)
{
	options = optionsUtils.extend(options);

	var ast		= astUtils.parse(code);
	var scope	= new ASTCollector(options).collect(ast);

	scope = scope.squeeze(options.isInsertToDefineHalder);

	var startPos = scope.ast.range[0];
	var result;
	if (startPos)
	{
		result = scopeHanlder(scope, code.slice(startPos), code, options);
		result.code = code.slice(0, startPos)+result.code;
	}
	else
	{
		result = scopeHanlder(scope, code, code, options);
	}

	// 对返回的数据进行排序
	result.codeTranslateWords.DEFAULTS = result.codeTranslateWords.DEFAULTS.sort();
	var tmpSUBTYPES = {};
	_.each(result.codeTranslateWords.SUBTYPES, function(list, subtype)
	{
		tmpSUBTYPES[subtype] = list.sort();
	});
	result.codeTranslateWords.SUBTYPES = tmpSUBTYPES;


	// 对最后的代码，进行整理
	// 换行替换
	if (/\r\n/.test(code))
	{
		result.code = result.code.replace(/\r?\n/g, '\r\n');
	}

	return result;
}


function scopeHanlder(scope, tmpCode, orignalCode, options)
{
	var fixIndex	= scope.ast.range[0];
	var newCode		= [];
	var dirtyWords	= [];
	var dealAst		= [];

	var funcTranslateWords = {};
	var usedTranslateWords = {};
	var codeTranslateWords =
	{
		DEFAULTS	: [],
		SUBTYPES	: {},
	};

	scope.i18nHanlderAsts.forEach(function(item)
	{
		dealAst.push({type: 'i18nHandler', value: item});
	});

	scope.translateWordAsts.forEach(function(item)
	{
		codeTranslateWords.DEFAULTS = codeTranslateWords.DEFAULTS.concat(item.__i18n_replace_info__.translateWords);

		if (!astUtils.checkAstFlag(item, AST_FLAGS.SKIP_REPLACE))
		{
			dealAst.push({type: 'translateWord', value: item});
		}
	});

	scope.subScopes.forEach(function(item)
	{
		dealAst.push({type: 'scope', value: item.ast, scope: item});
	});


	scope.i18nArgs.filter(function(args)
		{
			return args && args[0];
		})
		// 排序是为了line类型的subtype
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
			var value = (''+args0.value).trim();
			if (!value)
			{
				debug('blank i18n args:%s', args0.value);
				return;
			}

			var subtype = args1 && astUtils.ast2constVal(args1);


			if (subtype)
			{
				var arr = codeTranslateWords.SUBTYPES[subtype]
					|| (codeTranslateWords.SUBTYPES[subtype] = []);

				arr.push(value);
			}
			else
			{
				codeTranslateWords.DEFAULTS.push(value);
			}
		});


	// 插入一个默认的翻译函数
	var i18nPlaceholderNew = new I18NPlaceholder(codeTranslateWords, orignalCode, options);
	var startPos = 0;
	if (scope.ast.type == 'BlockStatement')
	{
		startPos++;

		// 如果是在结构体内，那么至少要缩进一个tab
		var _originalI18nPlaceholderNewToString = i18nPlaceholderNew.toString;
		i18nPlaceholderNew.toString = function()
		{
			var str = _originalI18nPlaceholderNewToString.apply(this, arguments);
			if (!str) return str;

			var codeIndent = astUtils.codeIndent(scope.ast, orignalCode)+'\t';

			return str.split('\n')
				.map(function(val)
				{
					return val.trim() ? codeIndent+val : val;
				})
				.join('\n');
		};
	}
	newCode.push(tmpCode.slice(0, startPos), i18nPlaceholderNew);
	tmpCode = tmpCode.slice(startPos);
	fixIndex += startPos;


	// 逐个处理需要替换的数据
	var i18nPlaceholders = [];
	var scopeDatas = [];
	dealAst.sort(function(a, b)
		{
			return a.value.range[0] > b.value.range[0] ? 1 : -1;
		})
		.forEach(function(item)
		{
			var ast = item.value;
			var startPos = ast.range[0] - fixIndex;
			var endPos = ast.range[1] - fixIndex;

			newCode.push(tmpCode.slice(0, startPos));

			switch(item.type)
			{
				case 'i18nHandler':
					var i18nPlaceholder = new I18NPlaceholder(
							codeTranslateWords,
							orignalCode,
							options,
							ast
						);

					newCode.push(i18nPlaceholder);
					i18nPlaceholders.push(i18nPlaceholder);
					break;

				case 'translateWord':
					var myCode = escodegen.generate(ast.__i18n_replace_info__.newAst, optionsUtils.escodegenOptions);
					newCode.push(myCode);
					break;


				case 'scope':
					var scopeData = scopeHanlder(item.scope, tmpCode.slice(startPos, endPos), orignalCode, options);
					newCode.push(scopeData.code);
					scopeDatas.push(scopeData);
					break;

				default:
					debug('undefind type:%s ast:%o', item.type, ast);
					newCode.push(tmpCode.slice(startPos, endPos));
			}

			tmpCode = tmpCode.slice(endPos);
			fixIndex += endPos;
		});

	// 如果作用域中，已经有I18N函数
	// 那么头部插入的函数就不需要了
	if (i18nPlaceholders.length)
	{
		i18nPlaceholderNew.renderType = 'empty';
	}

	// 输出最终代码
	var resultCode = newCode.join('')+tmpCode;

	if (i18nPlaceholderNew.getRenderType() == 'complete'
		&& options.isClosureWhenInsertedHead
		&& scope.type != 'define factory')
	{
		resultCode = ';(function(){\n'+resultCode+'\n})();'
	}

	// 进行最后的附加数据整理、合并
	i18nPlaceholders.forEach(function(i18nPlaceholder)
	{
		var info = i18nPlaceholder.parse();
		var FILE_KEY = info.__FILE_KEY__;

		funcTranslateWords[FILE_KEY] = extend(true, {},
				funcTranslateWords[FILE_KEY],
				info.__TRANSLATE_JSON__
			);

		usedTranslateWords[FILE_KEY] = extend(true, {},
				usedTranslateWords[FILE_KEY],
				i18nPlaceholder.getTranslateJSON()
			);
	});

	_.each(scopeDatas, function(scopeData)
	{
		funcTranslateWords = extend(true, funcTranslateWords, scopeData.funcTranslateWords);
		usedTranslateWords = extend(true, usedTranslateWords, scopeData.usedTranslateWords);
		ArrayPush.apply(codeTranslateWords.DEFAULTS, scopeData.codeTranslateWords.DEFAULTS);
		_.each(scopeData.codeTranslateWords.SUBTYPES, function(list, subtype)
		{
			var arr = codeTranslateWords.SUBTYPES[subtype]
				|| (codeTranslateWords.SUBTYPES[subtype] = []);

			ArrayPush.apply(arr, list);
		});
	});


	return {
		code				: resultCode,
		dirtyWords			: dirtyWords,
		// 从代码中获取到的关键字
		codeTranslateWords	: codeTranslateWords,
		// 从i18n函数中解出来的翻译数据
		funcTranslateWords	: funcTranslateWords,
		// 当前使用的翻译数据
		usedTranslateWords	: usedTranslateWords,
	};
};
