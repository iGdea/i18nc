'use strict';

const expect = require('expect.js');
const testReq = require('../');
testReq.ROOT_PATH = __dirname + '/output';

module.exports = checkResult;
function checkResult(type) {
	const requireAfterWrite = testReq(type);

	it('#json', function() {
		const data = { data: 1 };
		const otherData = requireAfterWrite('base.json', data);
		expect(data).to.eql(otherData);
	});

	describe('#string', function() {
		it('#base', function() {
			const data = 'var d = 1;';
			const otherData = requireAfterWrite('base_string.js', data);
			expect(data).to.eql(otherData);
		});

		it('#function', function() {
			let data = function code() {
				console.log(11);
			};

			data = data.toString();

			const otherData = requireAfterWrite('base_string_func.js', data);
			expect(testReq.code2arr(data)).to.eql(testReq.code2arr(otherData));
		});

		it('#function width outcode', function() {
			let data = function code() {
				console.log(11);
			};

			data = data.toString() + '\n var dd = 1;';

			const otherData = requireAfterWrite('base_string_func2.js', data);
			expect(testReq.code2arr(data)).to.eql(testReq.code2arr(otherData));
		});

		it('#module.exports', function() {
			const data = { num: 22 };
			const code = 'module.exports = ' + JSON.stringify(data);

			const otherData = requireAfterWrite('base_string_module.js', code);
			expect(data).to.eql(otherData);
		});
	});

	it('#function', function() {
		const data = function code() {
			console.log(11);
		};

		const otherData = requireAfterWrite('base_func.js', data);
		expect(testReq.code2arr(data)).to.eql(testReq.code2arr(otherData));
	});
}
