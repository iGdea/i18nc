'use strict';

const expect = require('expect.js');
const loader = require('../util/load_po_files');
const autoTestUtils = require('./auto_test_utils');

describe('#load_po_files', function() {
	describe('#autoLoadPOFiles', function() {
		describe('#async', function() {
			it('#file', function() {
				return loader
					.autoLoadPOFiles(__dirname + '/input/pofiles/en-US.po')
					.then(function(json) {
						const otherJson = autoTestUtils.requireAfterWrite(
							'autoLoadPOFiles_en-US.json',
							json
						);
						expect(json).to.eql(otherJson);
					});
			});

			it('#dir', function() {
				return loader
					.autoLoadPOFiles(__dirname + '/input/pofiles')
					.then(function(json) {
						const otherJson = autoTestUtils.requireAfterWrite(
							'autoLoadPOFiles_all.json',
							json
						);
						expect(json).to.eql(otherJson);
					});
			});
		});

		describe('#sync', function() {
			it('#file', function() {
				const json = loader.autoLoadPOFilesSync(
					__dirname + '/input/pofiles/en-US.po'
				);
				const otherJson = autoTestUtils.requireAfterWrite(
					'autoLoadPOFiles_en-US.json',
					json
				);
				expect(json).to.eql(otherJson);
			});

			it('#dir', function() {
				const json = loader.autoLoadPOFilesSync(
					__dirname + '/input/pofiles'
				);
				const otherJson = autoTestUtils.requireAfterWrite(
					'autoLoadPOFiles_all.json',
					json
				);
				expect(json).to.eql(otherJson);
			});
		});
	});
});
