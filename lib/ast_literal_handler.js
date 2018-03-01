var _					= require('lodash');
var debug				= require('debug')('i18nc-core:ast_literal_handler');
var astUtils			= require('./ast_utils');
var astTpl				= require('./ast_tpl');
var emitter				= require('./emitter').emitter;
var astComboLiteral		= require('./plugins/combo_literal/combo_literal');


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
					if (item.translateWord) translateWords.push(item.value);
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

		if (cutWordReg)
		{
			var splitTranslateWordArr = value.split(cutWordReg);
			if (splitTranslateWordArr.length > 1)
			{
				// 必然比splitTranslateWordArr少一个
				value.match(cutWordReg).forEach(function(val, index)
				{
					lineStrings.push(
						{translateWord: false, value: splitTranslateWordArr[index]},
						{translateWord: true, value: val}
					);
				});

				lineStrings.push({translateWord: false, value: splitTranslateWordArr.pop()});
			}
		}

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

		return lineStrings;
	},

	_warpTxt2caller: function(txt)
	{
		return astTpl.CallExpression(this.options.I18NHandlerName, [astTpl.Literal(txt)]);
	},

	// 将文本结构体整理成ast的数组
	_txts2asts: function(txts)
	{
		if (!txts || !txts.length) return;

		var firstValue;
		var isFirstTranslateWord;
		var nextValue;
		var endIndex = -1;

		txts.some(function(item, index)
		{
			if (!item || !item.value) return;

			if (!firstValue)
			{
				firstValue = item.value;
				isFirstTranslateWord = item.translateWord;
			}
			else if (!nextValue)
			{
				if (item.translateWord == isFirstTranslateWord)
				{
					firstValue += item.value;
				}
				else
				{
					nextValue = item.value;
				}
			}
			else
			{
				if (item.translateWord == isFirstTranslateWord)
				{
					endIndex = index;
					return true;
				}
				else
				{
					nextValue += item.value;
				}
			}
		});

		if (!firstValue) return;

		var result = [];
		result.push(isFirstTranslateWord ? this._warpTxt2caller(firstValue) : astTpl.Literal(firstValue));
		if (!nextValue) return result;

		result.push(isFirstTranslateWord ? astTpl.Literal(nextValue) : this._warpTxt2caller(nextValue));

		var children = endIndex != -1 && this._txts2asts(txts.slice(endIndex));
		if (children) result = result.concat(children);

		return result;
	},
});
