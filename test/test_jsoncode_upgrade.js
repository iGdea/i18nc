'use strict';

var _					= require('lodash');
var expect				= require('expect.js');
var i18nc				= require('../');
var autoTestUtils		= require('./auto_test_utils');
var requireAfterWrite	= autoTestUtils.requireAfterWrite('jsoncode_upgrade');

describe('#jsoncode upgrade', function()
{
	describe('#v1', function()
	{
		var code = require('./files/casefile/i18n_handler/i18n_handler_jsoncode_v1').toString();
		var info = i18nc(code);
		var funcTranslateWords = info.allFuncTranslateWords();
		var dbTranslateWords =
		{
			version: 2,
			data:
			{
				'*': funcTranslateWords.toJSON()
			}
		};
		var funcTranslateWordsList = funcTranslateWords.words();
		code += '\n\n'
			+_.map(funcTranslateWordsList.DEFAULTS, function(val)
			{
				return 'I18N("'+val+'")';
			})
			.join('\n')
			+'\n\n'
			+_.map(funcTranslateWordsList.SUBTYPES, function(vals, subtype)
			{
				return vals.map(function(val)
				{
					return 'I18N("'+val+'", "'+subtype+'")';
				})
				.join('\n');
			})
			.join('\n');


		it('#complete', function()
		{
			var info = i18nc(code,
				{
					dbTranslateWords: dbTranslateWords,
				});

			// JSON.stringify 的时候，会把数组里面的 undefined 转成 null
			// 这里就提前转一下
			// 导致的结果是，生成的json文件里面，是null表示
			var myJSON = JSON.parse(JSON.stringify(autoTestUtils.JsonOfI18ncRet(info)));
			var outputJSON = requireAfterWrite('v1_complete.json', myJSON);
			var otherCode = requireAfterWrite('v1_complete.js', autoTestUtils.wrapCode4pkg(info.code));

			expect(myJSON).to.eql(outputJSON);
			expect(autoTestUtils.code2arr(''+info)).to.eql(autoTestUtils.code2arr(otherCode));
		});

		it('#partial', function()
		{
			var info = i18nc(code,
				{
					dbTranslateWords: dbTranslateWords,
					I18NHandler:
					{
						upgrade: {checkVersion: false}
					}
				});
			var outputJSON = requireAfterWrite('v1_partial.json', autoTestUtils.JsonOfI18ncRet(info));
			var otherCode = requireAfterWrite('v1_partial.js', autoTestUtils.wrapCode4pkg(info.code));

			expect(autoTestUtils.JsonOfI18ncRet(info)).to.eql(outputJSON);
			expect(autoTestUtils.code2arr(''+info)).to.eql(autoTestUtils.code2arr(otherCode));
		});
	});
});
