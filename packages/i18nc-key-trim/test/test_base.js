'use strict';

var expect	= require('expect.js');
var i18nc	= require('i18nc-core');

require('../')(i18nc);

describe('#keyTrim', function()
{
	function txt2code(val)
	{
		var info = i18nc('var str="'+val+'";',
			{
				codeModifiedArea: ['TranslateWord'],
				pluginEnabled:
				{
					keyTrim: true
				}
			});
		return info.code.substr(8, info.code.length-9);
	}

	it('#base', function()
	{
		expect(txt2code('<span>  中文 词典  </span>'))
				.to.be("'<span>  ' + I18N('中文 词典') + '  </span>'");
		expect(txt2code(' 中文词典')).to.be("' ' + I18N('中文词典')");
		expect(txt2code('中文词典 ')).to.be("I18N('中文词典') + ' '");
		expect(txt2code(' 中文词典 ')).to.be("' ' + I18N('中文词典') + ' '");
	});

});
