var _				= require('lodash');
var debug			= require('debug')('i18nc-core:ast_literal_handler');
var astUtils		= require('./ast_utils');
var astTpl			= require('./ast_tpl');
var emitter			= require('./emitter').emitter;
var astComboLiteral	= require('./plugins/combo_literal/combo_literal');
var cutwordBeautify	= require('./plugins/cutword_beautify/cutword_beautify');

exports.LiteralHandler	= LiteralHandler;

function LiteralHandler(options)
{
	this.options = options;
}

_.extend(LiteralHandler.prototype,
{
	handle: function(ast)
	{
		var self = this;
		var value = ast.value;
		// case 有可能不是string
		if (!value || typeof value != 'string') return;

		var lineStrings = self.split(value);
		if (!lineStrings) return;

		// 整理最后的结果，进行输出
		var retArr;
		var comboAsts = ast.__i18n_combo_asts__;

		if (comboAsts)
		{
			// 如果之前有进行combo操作，那么对ast进行尝试还原
			retArr = astComboLiteral.revert(lineStrings, comboAsts, self.options);
		}

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

				var translateWords = [];
				item.lineStrings.forEach(function(item)
				{
					if (item.translateWord && !item.ignore)
					{
						translateWords.push(item.value);
					}
				});

				ast.__i18n_replace_info__ =
				{
					newAst			: newAst,
					translateWords	: translateWords
				};

				return ast;
			})
			.filter(function(item)
			{
				return item;
			});
	},

	split: function(value)
	{
		var self = this;
		// 正则说明
		// 必须要有非accii之外的字符（比如：中文）
		// 同时包含非html标签的其他字符
		var lineStrings = [];
		var cutWordReg = self.options.cutWordReg;

		if (cutWordReg instanceof RegExp)
		{
			var splitTranslateWordArr = value.split(cutWordReg);
			if (splitTranslateWordArr.length > 1)
			{
				// 必然比splitTranslateWordArr少一个
				value.match(cutWordReg).forEach(function(val, index)
				{
					lineStrings.push(
						{translateWord: false, ignore: false, disconnected: false, value: splitTranslateWordArr[index]},
						{translateWord: true, ignore: false, disconnected: false, value: val}
					);
				});

				lineStrings.push({translateWord: false, ignore: false, disconnected: false, value: splitTranslateWordArr.pop()});
			}
		}

		if (!lineStrings.length)
		{
			lineStrings.push({translateWord: false, ignore: false, disconnected: false, value: value});
		}

		// 对分词进行美化
		if (self.options.cutWordBeautify.indexOf('RemoveTplComment') != -1)
			lineStrings = cutwordBeautify.removeTplComment(lineStrings, value);
		if (self.options.cutWordBeautify.indexOf('SplitByEndSymbol') != -1)
			lineStrings = cutwordBeautify.splitByEndSymbol(lineStrings);
		if (self.options.cutWordBeautify.indexOf('KeyTrim') != -1)
			lineStrings = cutwordBeautify.keyTrim(lineStrings);

		var emitData =
		{
			value				: value,
			options				: self.options,
			originalLineStrings	: lineStrings,
			lineStrings			: lineStrings,
		};
		emitter.emit('cutword', emitData);

		lineStrings = emitData.lineStrings;
		if (!lineStrings || !lineStrings.length) return;
		// 如果结果全部是不需要翻译的，也忽略
		if (!lineStrings.some(function(item){return item.translateWord && !item.ignore}))
		{
			debug('ignore no translateWord of lineStrings:%o', lineStrings);
			return;
		}

		return lineStrings;
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
