'use strict';

const expect = require('expect.js');
const valsUtils = require('../lib/key_utils');

describe('#key_utils', function() {
	describe('#KeyObj', function() {
		const options = {
			a0: { a1: { a2: [], a3: {}, a4: true, a5: true } }
		};
		const myKeys = new valsUtils.KeyObj(options);
		it('#exists', function() {
			expect(myKeys.exists('a0.a1')).to.be(true);
			expect(myKeys.exists('a0.a1.a2')).to.be(true);
			expect(myKeys.exists('a0.a1.a4')).to.be(true);
			expect(myKeys.exists('a0.a2')).to.be(false);
		});
		it('#getVal', function() {
			expect(myKeys.getVal('a0.a1')).to.be.an('object');
			expect(myKeys.getVal('a0.a1.a2')).to.be.an('array');
			expect(myKeys.getVal('a0.a1.a4')).to.be(true);
		});

		describe('#setVal', function() {
			it('#key exists', function() {
				myKeys.setVal('a0.a1.a5', 'val5');
				expect(myKeys.getVal('a0.a1.a5')).to.be('val5');
				expect(options.a0.a1.a5).to.be('val5');
			});

			it('#key not exists', function() {
				myKeys.setVal('a0.a10', 'val10');
				expect(myKeys.getVal('a0.a10')).to.be('val10');
				expect(options.a0.a10).to.be('val10');
			});

			it('#parent key not exists', function() {
				myKeys.setVal('a0.a11.a12', 'val12');
				expect(myKeys.getVal('a0.a11.a12')).to.be('val12');
				expect(options.a0.a11.a12).to.be('val12');
			});

			it('#root key not exists', function() {
				myKeys.setVal('b1.a2', 'val2');
				expect(myKeys.getVal('b1.a2')).to.be('val2');
				expect(options.b1.a2).to.be('val2');
			});
		});
	});

	it('#str2keyVal', function() {
		expect(valsUtils.str2keyVal('a.b=c')).to.eql({
			key: 'a.b',
			value: 'c'
		});
		expect(valsUtils.str2keyVal('a.b=true')).to.eql({
			key: 'a.b',
			value: true
		});
		expect(valsUtils.str2keyVal('a.b=c=true')).to.eql({
			key: 'a.b=c',
			value: true
		});
	});
});
