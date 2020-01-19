'use strict';

const _ = require('lodash');
const expect = require('expect.js');
const creator = require('../lib/create');
const i18nc = require('i18nc-core');
const autoTestUtils = require('./auto_test_utils');

describe('#create', function() {
	it('#base', function() {
		const onlyTheseLanguages = ['en-US', 'zh-HK'];
		const requireAfterWrite = autoTestUtils.requireAfterWrite(
			'output_create/base'
		);
		const output = creator.create(
			i18nc('alert("中文词典")', {
				isCheckClosureForNewI18NHandler: false
			}),
			{
				title: '第一份翻译稿v1.0',
				email: 'bacra.woo@gmail.com',
				onlyTheseLanguages: onlyTheseLanguages
			}
		);

		const otherPot = requireAfterWrite('lans.pot', output.pot, {
			mode: 'string'
		});
		expect(autoTestUtils.code2arr(output.pot)).to.eql(
			autoTestUtils.code2arr(otherPot)
		);

		const outputLans = [];
		_.each(output.po, function(content, filename) {
			outputLans.push(filename);
			const otherPo = requireAfterWrite(filename + '.po', content, {
				mode: 'string'
			});
			expect(autoTestUtils.code2arr(content)).to.eql(
				autoTestUtils.code2arr(otherPo)
			);
		});

		expect(onlyTheseLanguages.length).to.be(outputLans.length);
		expect(_.difference(outputLans, onlyTheseLanguages)).to.be.empty();
	});

	it('#no onlyTheseLanguages', function() {
		const requireAfterWrite = autoTestUtils.requireAfterWrite(
			'output_create/no_onlyTheseLanguages'
		);
		const output = creator.create(getInputData(), {
			title: '第一份翻译稿v1.0',
			email: 'bacra.woo@gmail.com'
		});

		const otherPot = requireAfterWrite('lans.pot', output.pot, {
			mode: 'string'
		});
		expect(autoTestUtils.code2arr(output.pot)).to.eql(
			autoTestUtils.code2arr(otherPot)
		);

		_.each(output.po, function(content, filename) {
			const otherPo = requireAfterWrite(filename + '.po', content, {
				mode: 'string'
			});
			expect(autoTestUtils.code2arr(content)).to.eql(
				autoTestUtils.code2arr(otherPo)
			);
		});
	});

	describe('#existedTranslateFilter', function() {
		function handler(type) {
			it('#' + type, function() {
				const requireAfterWrite = autoTestUtils.requireAfterWrite(
					'output_create/existedTranslateFilter/' + type
				);
				const output = creator.create(getInputData(), {
					existedTranslateFilter: type
				});

				const otherPot = requireAfterWrite('lans.pot', output.pot, {
					mode: 'string'
				});
				expect(autoTestUtils.code2arr(output.pot)).to.eql(
					autoTestUtils.code2arr(otherPot)
				);

				_.each(output.po, function(content, filename) {
					const otherPo = requireAfterWrite(filename + '.po', content, {
						mode: 'string'
					});
					expect(autoTestUtils.code2arr(content)).to.eql(
						autoTestUtils.code2arr(otherPo)
					);
				});
			});
		}

		handler('empty');
		handler('keep');
		handler('ignore');
	});
});

function getInputData() {
	const inputData = i18nc(require('./files/input.js').toString(), {
		dbTranslateWords: {
			'en-US': {
				'*': {
					DEFAULTS: {
						'简体': 'cn',
						'中文': 'zh'
					},
					SUBKEYS: {
						subkey: {
							'简体': 'zh'
						}
					}
				}
			},
			'zh-TW': {
				'*': {
					DEFAULTS: {
						'简体': '簡體'
					}
				}
			}
		}
	});

	return inputData;
}
