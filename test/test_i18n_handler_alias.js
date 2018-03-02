var fs					= require('fs');
var expect				= require('expect.js');
var i18nc				= require('../');
var autoTestUtils		= require('./auto_test_utils');
var requireAfterWrite	= autoTestUtils.requireAfterWrite('output_I18N_alias');


describe('#I18N_handler_alias', function()
{
	var exampleCode = require('./example/func_code').toString();
	it('#update', function()
	{
		var info = i18nc(exampleCode,
			{
				ignoreScanError: ['ObjectKey'],
				I18NHandlerName: 'I18NNew',
				I18NHandlerAlias: ['I18N'],
			});

		var content = 'module.exports = '+info.code;
		var otherContent = requireAfterWrite('i18n_alias_update.js', content, {readMode: 'string'});

		expect(autoTestUtils.code2arr(content)).to.eql(autoTestUtils.code2arr(otherContent));
	});

	it('#no_update', function()
	{
		var info = i18nc(exampleCode,
			{
				ignoreScanError: ['ObjectKey'],
				I18NHandlerName: 'I18NNew',
				I18NHandlerAlias: ['I18N'],
				codeModifiedArea: ['I18NHandler', 'TranslateWord'],
			});

		var content = 'module.exports = '+info.code;
		var otherContent = requireAfterWrite('i18n_alias_no_update.js', content, {readMode: 'string'});

		expect(autoTestUtils.code2arr(content)).to.eql(autoTestUtils.code2arr(otherContent));
	});
});
