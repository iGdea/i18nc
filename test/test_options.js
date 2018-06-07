'use strict';

var expect = require('expect.js');
var optionsUtils = require('../lib/options');

describe('#options', function()
{
	describe('#extend', function()
	{
		it('#base', function()
		{
			expect(optionsUtils.extend({I18NHandlerName: 'i10n'}).I18NHandlerName)
				.to.be('i10n');
			expect(optionsUtils.extend().I18NHandlerName).to.be('I18N');
		});

		it('#no false', function()
		{
			expect(optionsUtils.extend({I18NHandlerName: null}).I18NHandlerName)
				.to.be('I18N');

			// 对cutWordReg 特殊处理
			expect(optionsUtils.extend({cutWordReg: null}).cutWordReg)
				.to.be(null);
		});

		it('#no extend', function()
		{
			expect(optionsUtils.extend({somekey: true}).somekey).to.be(undefined);
		});

		it('#sub extend', function()
		{
			var newOptions = optionsUtils.extend(
				{
					cutWordBeautify: {KeyTrim: false}
				});
			expect(newOptions.cutWordBeautify.KeyTrim).to.be(false);
			expect(newOptions.cutWordBeautify.RemoveTplComment).to.be(true);
		});

		it('#arr2obj', function()
		{
			var newOptions = optionsUtils.extend(
				{
					cutWordBeautify: ['RemoveTplComment']
				});
			expect(!!newOptions.cutWordBeautify.KeyTrim).to.be(false);
			expect(!!newOptions.cutWordBeautify.RemoveTplComment).to.be(true);
		});

		it('#originalOptions', function()
		{
			var originalOptions = {somekey: true};
			expect(optionsUtils.extend(originalOptions).originalOptions).to.be(originalOptions);
		});

	});
});
