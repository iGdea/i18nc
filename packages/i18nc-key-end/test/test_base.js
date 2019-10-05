'use strict';

var expect	= require('expect.js');
var i18nc	= require('i18nc-core');

require('../')(i18nc);

describe('#keyEnd', function()
{
	function txt2code(val)
	{
		var info = i18nc('var str="'+val+'";',
			{
				codeModifiedArea: ['TranslateWord'],
				pluginEnabled:
				{
					keyEnd: true
				}
			});
		return info.code.substr(8, info.code.length-9);
	}

	it('#base', function()
	{
		expect(txt2code('你好！出发了吗？第一点；第二点。出彩vs回家.111'))
			.to.be("I18N('你好！') + I18N('出发了吗？') + I18N('第一点；') + I18N('第二点。') + I18N('出彩vs回家.111')");
		expect(txt2code('你好!!出发了吗?不走吗'))
			.to.be("I18N('你好!!') + I18N('出发了吗?') + I18N('不走吗')");
		expect(txt2code('你好!!出发了吗?不走吗？'))
			.to.be("I18N('你好!!') + I18N('出发了吗?') + I18N('不走吗？')");
	});

});
