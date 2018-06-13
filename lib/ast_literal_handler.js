'use strict';

var _				= require('lodash');
var debug			= require('debug')('i18nc-core:ast_literal_handler');
var astUtils		= require('./ast_utils');
var astTpl			= require('./ast_tpl');
var wordsUtils		= require('./words_utils');

exports.LiteralHandler	= LiteralHandler;

function LiteralHandler(options)
{
	this.options = options;
}

_.extend(LiteralHandler.prototype,
{
	handle: function(ast)
	{
		var value = ast.value;
		if (!value) return;

		if (typeof value == 'string')
			return this._stringHandler(ast);
		else if (value instanceof RegExp)
			return this._regExpHandler(ast);
		else
			debug('ignore value init, val:%s, type:%s', value, typeof value);
	},
	_regExpHandler: function(ast)
	{
		var self = this;
		var regex = ast.regex;
		if (!regex || !regex.pattern || typeof regex.pattern != 'string') return;

		var value = regex.pattern; //.replace(/\\/g, '\\\\');
		var lineStrings = wordsUtils.splitValue2lineStrings(value, 'regexp', self.options);
		debug('regex value:%s split result:%o', value, lineStrings);
		if (!lineStrings) return;

		var literalAst = astUtils.asts2plusExpression(self._txts2asts(lineStrings));
		var args = [literalAst];
		if (regex.flags) args.push(astTpl.Literal(regex.flags));

		ast.__i18n_replace_info__ =
		{
			newAst			: astTpl.NewExpression('RegExp', args),
			translateWords	: wordsUtils.getTranslateWordsFromLineStrings(lineStrings)
		};

		return [ast];
	},

	_stringHandler: function(ast)
	{
		var self = this;
		var value = ast.value;
		var lineStrings = wordsUtils.splitValue2lineStrings(value, 'string', self.options);
		debug('value split result:%o', lineStrings);
		if (!lineStrings) return;

		// 整理最后的结果，进行输出
		var retArr;

		if (!retArr)
		{
			retArr =
				[{
					ast			: ast,
					lineStrings	: lineStrings,
				}];
		}

		return retArr.map(function(item)
			{
				var ast = item.ast;
				var newAst = astUtils.asts2plusExpression(self._txts2asts(item.lineStrings));
				if (!newAst) return;

				debug('literal new ast:%o', newAst);

				ast.__i18n_replace_info__ =
				{
					newAst			: newAst,
					translateWords	: wordsUtils.getTranslateWordsFromLineStrings(item.lineStrings)
				};

				return ast;
			})
			.filter(function(item)
			{
				return item;
			});
	},

	_txt2ast: function(txt, isTranslateWord)
	{
		return isTranslateWord
			? astTpl.CallExpression(this.options.I18NHandlerName, [astTpl.Literal(txt)])
			: astTpl.Literal(txt);
	},

	// 将文本结构体整理成ast的数组
	_txts2asts: function(txts)
	{
		if (!txts || !txts.length) return;

		var self = this;
		var tmpValue = '';
		var isTranslateWord;
		var result = [];

		txts.forEach(function(item)
		{
			if (!item || !item.value || item.ignore) return;
			if (item.disconnected)
			{
				if (tmpValue)
				{
					result.push(self._txt2ast(tmpValue, isTranslateWord));
					tmpValue = '';
				}

				result.push(self._txt2ast(item.value, item.translateWord));
			}
			else
			{
				if (tmpValue && isTranslateWord != item.translateWord)
				{
					if (tmpValue)
					{
						result.push(self._txt2ast(tmpValue, isTranslateWord));
						tmpValue = '';
					}
				}

				isTranslateWord = item.translateWord;
				tmpValue += item.value;
			}
		});

		if (tmpValue) result.push(self._txt2ast(tmpValue, isTranslateWord));

		return result;
	},
});
