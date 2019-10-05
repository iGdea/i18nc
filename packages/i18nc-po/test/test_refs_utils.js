'use strict';

var expect    = require('expect.js')
var refsUtils = require('../lib/refs_utils');

describe('#refs_utils', function()
{
	describe('#generate', function()
	{
		it('#genOnlyFileKey', function()
		{
			expect(refsUtils.genOnlyFileKey('fileKey')).to.be('0,fileKey');
			expect(refsUtils.genOnlyFileKey()).to.be('0');
		});

		it('#genSimpleSubtype', function()
		{
			expect(refsUtils.genSimpleSubtype('fileKey', 'subtype')).to.be('2,7,subtype,fileKey');
			expect(refsUtils.genSimpleSubtype('fileKey')).to.be('2,,fileKey');
		});

		it('#genSimpleLineSubtype', function()
		{
			expect(refsUtils.genSimpleLineSubtype('fileKey', 'subtype', ['msg1']))
				.to.be('1,0,7,subtype,fileKey');
			expect(refsUtils.genSimpleLineSubtype('', 'subtype', ['msg1']))
				.to.be('1,0,7,subtype');
			expect(refsUtils.genSimpleLineSubtype('fileKey', 'subtype', ['msg1', 'msg2']))
				.to.be('1,1,0,7,subtype,fileKey');
			expect(refsUtils.genSimpleLineSubtype('fileKey', 'subtype', ['msg1', 'msg2%pMsg3']))
				.to.be('1,1,0,7,subtype,fileKey');
			expect(refsUtils.genSimpleLineSubtype('fileKey', 'subtype', ['msg1%pMsg2', 'msg3']))
				.to.be('1,1,1,7,subtype,fileKey');
			expect(refsUtils.genSimpleLineSubtype('fileKey', 'subtype', ['msg1%pMsg2', 'msg3%pMsg4']))
				.to.be('1,1,1,7,subtype,fileKey');
			expect(refsUtils.genSimpleLineSubtype('fileKey', 'subtype', ['msg1%pMsg2', 'msg3%pMsg4', 'msg5']))
				.to.be('1,2,1,3,7,subtype,fileKey');
		});

		it('#genLineSubtype', function()
		{
			expect(refsUtils.genLineSubtype('fileKey', 'subtype', [{msg: 'msg1'}]))
				.to.be('3,0,,7,subtype,fileKey');
			expect(refsUtils.genLineSubtype('', 'subtype', [{msg: 'msg1'}]))
				.to.be('3,0,,7,subtype');
			expect(refsUtils.genLineSubtype('fileKey', 'subtype', [{msg: 'msg1'}, {msg: 'msg2'}]))
				.to.be('3,1,0,,,7,subtype,fileKey');
			expect(refsUtils.genLineSubtype('fileKey', 'subtype', [{msg: 'msg1'}, {msg: 'msg2%pMsg3'}]))
				.to.be('3,1,0,,,7,subtype,fileKey');
			expect(refsUtils.genLineSubtype('fileKey', 'subtype', [{msg: 'msg1%pMsg2'}, {msg: 'msg3'}]))
				.to.be('3,1,1,,,7,subtype,fileKey');
			expect(refsUtils.genLineSubtype('fileKey', 'subtype', [{msg: 'msg1%pMsg2'}, {msg: 'msg3%pMsg4'}]))
				.to.be('3,1,1,,,7,subtype,fileKey');
			expect(refsUtils.genLineSubtype('fileKey', 'subtype', [{msg: 'msg1%pMsg2'}, {msg: 'msg3%pMsg4'}, {msg: 'msg5'}]))
				.to.be('3,2,1,3,,,,7,subtype,fileKey');

			expect(refsUtils.genLineSubtype('', 'subtype', [{msg: 'msg1', subkey: 'sub'}]))
				.to.be('3,0,3,sub,7,subtype');
		});

		it('#error', function()
		{
			expect(function(){refsUtils.genLineSubtype(null, 'subtype')}).to.throwError(/Error Input/);
			expect(function(){refsUtils.genLineSubtype(null, 'subtype', [])}).to.throwError(/Error Input/);
		});
	});


	describe('#parse', function()
	{
		describe('#type0', function()
		{
			it('#base', function()
			{
				expect(refsUtils.parse('0')).to.eql(
					{
						type: 0,
						fileKey : '',
					});

				expect(refsUtils.parse('0,fileKey')).to.eql(
					{
						type: 0,
						fileKey : 'fileKey',
					});

				expect(refsUtils.parse('0,fileKey1,fileKey2')).to.eql(
					{
						type: 0,
						fileKey : 'fileKey1,fileKey2',
					});
			});
		});

		describe('#type1', function()
		{
			it('#base', function()
			{
				expect(refsUtils.parse('1,0,7,subtype,fileKey1,fileKey2')).to.eql(
					{
						type: 1,
						fileKey: 'fileKey1,fileKey2',
						subtype: 'subtype',
						joinIndexs: []
					});
			});

			it('#joinIndexs', function()
			{
				expect(refsUtils.parse('1,1,0,7,subtype,fileKey')).to.eql(
					{
						type: 1,
						fileKey: 'fileKey',
						subtype: 'subtype',
						joinIndexs: [0]
					});

				expect(refsUtils.parse('1,2,0,1,7,subtype,fileKey')).to.eql(
					{
						type: 1,
						fileKey: 'fileKey',
						subtype: 'subtype',
						joinIndexs: [0, 1]
					});

				expect(refsUtils.parse('1,1,1,7,subtype,fileKey')).to.eql(
					{
						type: 1,
						fileKey: 'fileKey',
						subtype: 'subtype',
						joinIndexs: [1]
					});

				expect(refsUtils.parse('1,2,1,2,7,subtype,fileKey')).to.eql(
					{
						type: 1,
						fileKey: 'fileKey',
						subtype: 'subtype',
						joinIndexs: [1, 2]
					});
			});
		});

		describe('#type2', function()
		{
			it('#base', function()
			{
				expect(refsUtils.parse('2,')).to.eql(
					{
						type: 2,
						fileKey: '',
						subtype: ''
					});
				expect(refsUtils.parse('2,0')).to.eql(
					{
						type: 2,
						fileKey: '',
						subtype: ''
					});
				expect(refsUtils.parse('2,0,')).to.eql(
					{
						type: 2,
						fileKey: '',
						subtype: ''
					});
				expect(refsUtils.parse('2,0,fileKey')).to.eql(
					{
						type: 2,
						fileKey: 'fileKey',
						subtype: ''
					});
				expect(refsUtils.parse('2,7,subtype,')).to.eql(
					{
						type: 2,
						fileKey: '',
						subtype: 'subtype'
					});
				expect(refsUtils.parse('2,7,subtype,fileKey')).to.eql(
					{
						type: 2,
						fileKey: 'fileKey',
						subtype: 'subtype'
					});
				expect(refsUtils.parse('2,7,subtype,fileKey1,fileKey2')).to.eql(
					{
						type: 2,
						fileKey: 'fileKey1,fileKey2',
						subtype: 'subtype'
					});
			});
		});

		describe('#type3', function()
		{
			it('#base', function()
			{
				expect(refsUtils.parse('3,0,,7,subtype,fileKey1,fileKey2')).to.eql(
					{
						type: 3,
						fileKey: 'fileKey1,fileKey2',
						subtype: 'subtype',
						joinIndexs: [],
						subkeys: {}
					});
			});

			it('#joinIndexs', function()
			{
				expect(refsUtils.parse('3,1,0,,,7,subtype,fileKey')).to.eql(
					{
						type: 3,
						fileKey: 'fileKey',
						subtype: 'subtype',
						joinIndexs: [0],
						subkeys: {}
					});

				expect(refsUtils.parse('3,2,0,1,,,,7,subtype,fileKey')).to.eql(
					{
						type: 3,
						fileKey: 'fileKey',
						subtype: 'subtype',
						joinIndexs: [0, 1],
						subkeys: {}
					});

				expect(refsUtils.parse('3,1,1,,,7,subtype,fileKey')).to.eql(
					{
						type: 3,
						fileKey: 'fileKey',
						subtype: 'subtype',
						joinIndexs: [1],
						subkeys: {}
					});

				expect(refsUtils.parse('3,2,1,2,,,2,ab,7,subtype,fileKey')).to.eql(
					{
						type: 3,
						fileKey: 'fileKey',
						subtype: 'subtype',
						joinIndexs: [1, 2],
						subkeys:
						{
							2: 'ab'
						}
					});
			});
		});

		describe('#error', function()
		{
			function expHanlder(str, errmsg)
			{
				expect(function(){refsUtils.parse(str)}).to.throwError(errmsg);
			}

			it('#type', function()
			{
				expHanlder('4', /Ref String Type Is Not Support/);
			});

			it('#joinIndex', function()
			{
				expHanlder('3,a,1', /JoinIndexs Length Is Wrong/);
				expHanlder('3,-1,1', /JoinIndexs Length Is Wrong/);
				expHanlder('3,1,a', /JoinIndex Is Wrong/);
				expHanlder('3,1,-1', /JoinIndex Is Wrong/);
			});

			it('#subtype', function()
			{
				expHanlder('3,0,a,subtype', /String Length Is Wrong/);
				expHanlder('3,0,-1,subtype', /String Length Is Wrong/);
				expHanlder('3,0,6,subtype', /String Length Is Wrong/);
				expHanlder('3,0,8,subtype', /String Length Is Wrong/);
			});

			it('#fileKey', function()
			{
				expHanlder('3,0,1,a;', /String Length Is Wrong/);
				expHanlder('3,0,1,a;a', /String Length Is Wrong/);
			});
		});
	});

	describe('#getStringFromArrayWidthLengthInfo', function()
	{
		it('#base', function()
		{
			expect(refsUtils._getStringFromArrayWidthLengthInfo([3, 'sub', 3], 1))
				.to.eql({list: ['sub'], walkOffset: 2});
			expect(refsUtils._getStringFromArrayWidthLengthInfo([3, 'sub', '', 2, 'sb'], 3))
				.to.eql({list: ['sub', null, 'sb'], walkOffset: 5});
			expect(refsUtils._getStringFromArrayWidthLengthInfo([7, 'sub', 'sub', 2, 'sb'], 2))
				.to.eql({list: ['sub,sub', 'sb'], walkOffset: 5});
		});

		it('#error', function()
		{
			expect(function()
				{
					refsUtils._getStringFromArrayWidthLengthInfo([3, 'sub'], 2);
				})
				.throwError(/Join Indexs Is To Many/);

			expect(function()
				{
					refsUtils._getStringFromArrayWidthLengthInfo(['a', 'sub'], 1);
				})
				.throwError(/String Length Is Wrong/);
		});
	});

	describe('#splitMsgByJoinIndexs', function()
	{
		it('#base', function()
		{
			expect(refsUtils._splitMsgByJoinIndexs('msg1%pMsg2', {joinIndexs: [0]}))
				.to.eql({'*': ['msg1', 'Msg2']});
			expect(refsUtils._splitMsgByJoinIndexs('msg1%pMsg2%pMsg3', {joinIndexs: [0]}))
				.to.eql({'*': ['msg1', 'Msg2%pMsg3']});
			expect(refsUtils._splitMsgByJoinIndexs('msg1%pMsg2%pMsg3', {joinIndexs: [1]}))
				.to.eql({'*': ['msg1%pMsg2', 'Msg3']});
			expect(refsUtils._splitMsgByJoinIndexs('msg1%pMsg2%pMsg3', {joinIndexs: [0,1]}))
				.to.eql({'*': ['msg1', 'Msg2', 'Msg3']});
			expect(refsUtils._splitMsgByJoinIndexs('msg1%pMsg2%pMsg3', {joinIndexs: [0,1,2]}))
				.to.eql({'*': ['msg1', 'Msg2', 'Msg3']});
			expect(refsUtils._splitMsgByJoinIndexs('msg1%pMsg2', {joinIndexs: [0, 3]}))
				.to.eql({'*': ['msg1', 'Msg2']});
		});

		it('#subkeys', function()
		{
			expect(refsUtils._splitMsgByJoinIndexs('msg1%pMsg2%pMsg3',
				{
					joinIndexs: [0,1,2],
					subkeys: {1: 'sub1'}
				}))
				.to.eql(
				{
					'*': ['msg1', 'Msg3'],
					'sub1': ['Msg2']
				});
		});
	});


	describe('#mixMsgsByJoinIndexs', function()
	{
		it('#base', function()
		{
			expect(refsUtils.mixMsgsByJoinIndexs(
				{
					msgid: 'msg1%pMsg2',
					msgstr: '消息1%p消息2',
					joinIndexs: [0],
					subkeys: {}
				}))
				.to.eql(
				{
					'*': {'msg1': '消息1', 'Msg2': '消息2'}
				});
		});

		it('#subkeys', function()
		{
			expect(refsUtils.mixMsgsByJoinIndexs(
				{
					msgid: 'msg1%pMsg2%pMsg2',
					msgstr: '消息1%p消息2%p消息3',
					joinIndexs: [0,1],
					subkeys: {1: 'sub1'}
				}))
				.to.eql(
				{
					'*': {'msg1': '消息1', 'Msg2': '消息3'},
					'sub1': {'Msg2': '消息2'}
				});

			expect(refsUtils.mixMsgsByJoinIndexs(
				{
					msgid: 'msg1%pMsg2%pMsg2',
					msgstr: '消息1%p消息2%p消息3',
					joinIndexs: [0,1],
					subkeys: {2: 'sub2'}
				}))
				.to.eql(
				{
					'*': {'msg1': '消息1', 'Msg2': '消息2'},
					'sub2': {'Msg2': '消息3'}
				});
		});

		it('#error', function()
		{
			expect(function()
				{
					refsUtils.mixMsgsByJoinIndexs({msgid: 'msg1', msgstr: '消息1%p消息2', joinIndexs: [0], subkeys: []});
				})
				.to.throwError(/Miss Message Separator/);

			expect(function()
				{
					refsUtils.mixMsgsByJoinIndexs({msgid: 'msg1%pmsg2%pmsg3', msgstr: '消息1%p消息2', joinIndexs: [0], subkeys: []});
				})
				.to.throwError(/Miss Message Separator/);
		});
	});
});
