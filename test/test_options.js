var expect = require('expect.js');
var optionsUtils = require('../lib/options');

describe('#options', function()
{
	it('#extend', function()
	{
		var newOptions = optionsUtils.extend(
			{
				I18NHandlerName: null,
				codeModifiedArea: null,
			});

		expect(newOptions.I18NHandlerName).to.be('I18N');
		expect(newOptions.codeModifiedArea).to.eql(['I18NHandler', 'translateWord', 'I18NHandlerAlias']);
		expect(optionsUtils.extend().I18NHandlerName).to.be('I18N');
		expect(optionsUtils.extend({somekey: true}).somekey).to.be(undefined);

		var originalOptions = {somekey: true};
		expect(optionsUtils.extend(originalOptions).originalOptions).to.be(originalOptions);
	});
});
