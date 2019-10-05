'use strict';

var Promise = require('bluebird');
var mkdirp = Promise.promisify(require('mkdirp'));
var i18nc = require('i18nc-core');
var i18ncUtil = require('../util/fileresult');
var autoTestUtils = require('./auto_test_utils');

var OUTPUT_PATH = __dirname + '/output/';
var TMP_PATH = process.env.TEST_BUILD ? OUTPUT_PATH : __dirname + '/tmp/';

describe('#fileresult', function()
{
	describe('#mulitResult2POFiles', function()
	{
		var diffFiles = autoTestUtils.diffFiles(TMP_PATH + 'mulitResult2POFiles/', OUTPUT_PATH + 'mulitResult2POFiles/');

		before(function()
		{
			return mkdirp(TMP_PATH + 'mulitResult2POFiles');
		});

		it('#base', function()
		{
			var json1 = i18nc('talkme("中文")', {isCheckClosureForNewI18NHandler: false});
			var json2 = i18nc('I18N("简体")', {isCheckClosureForNewI18NHandler: false});
			var json3 = i18nc('I18N("简体", "subtype")', {isCheckClosureForNewI18NHandler: false});

			return i18ncUtil.mulitResult2POFiles(
				{
					json1: json1,
					json2: json2,
					json3: json3,
				},
				TMP_PATH + 'mulitResult2POFiles',
				{
					I18NHandler:
					{
						data:
						{
							onlyTheseLanguages: ['zh-TW', 'en-US']
						}
					}
				})
				.then(function()
				{
					return Promise.all(
					[
						diffFiles('lans.pot'),
						diffFiles('zh-TW.po'),
						diffFiles('en-US.po')
					]);
				});
		});
	});

});
