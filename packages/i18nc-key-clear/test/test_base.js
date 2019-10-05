'use strict';

var expect			= require('expect.js');
var i18nc			= require('i18nc');
var keyClear		= require('../');
var keyClearTest	= keyClear._test;
keyClear(i18nc);

describe('#keyClear', function()
{
	function txt2code(val)
	{
		var info = i18nc('var str="'+val+'";',
			{
				codeModifiedArea: ['TranslateWord'],
				pluginEnabled:
				{
					keyClear: true
				}
			});
		return info.code.substr(8, info.code.length-9);
	}

	it('#base', function()
	{
		expect(txt2code('中文<!--注释-->词典')).to.be("I18N('中文词典')");
		expect(txt2code('中文<!--<!--注释1-->词典<!--注释2-->-->查阅'))
			.to.be("I18N('中文词典') + '-->' + I18N('查阅')");
	});

	it('#commentIndexs', function()
	{
		expect(keyClearTest._commentIndexs('12<!-- 345 -->678'))
			.to.eql([2, 11]);
		expect(keyClearTest._commentIndexs('12<!-- <!-- 345 --> -->678'))
			.to.eql([2, 16]);
	});

});
