var fs					= require('fs');
var expect				= require('expect.js');
var i18nc				= require('../');
var autoTestUtils		= require('./auto_test_utils');
var requireAfterWrite	= autoTestUtils.requireAfterWrite('I18N_alias_output');


describe('#I18N_alias', function()
{
	var exampleCode = require('./example/func_code').toString();
	it('#update', function()
	{
		var info = i18nc(exampleCode,
			{
				isIgnoreScanWarn: true,
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
				isIgnoreScanWarn: true,
				I18NHandlerName: 'I18NNew',
				I18NHandlerAlias: ['I18N'],
				codeModifiedArea: ['I18NHandler', 'translateWord'],
			});

		var content = 'module.exports = '+info.code;
		var otherContent = requireAfterWrite('i18n_alias_no_update.js', content, {readMode: 'string'});

		expect(autoTestUtils.code2arr(content)).to.eql(autoTestUtils.code2arr(otherContent));
	});
});
