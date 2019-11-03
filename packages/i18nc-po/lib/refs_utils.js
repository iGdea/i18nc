'use strict';

var _ = require('lodash');
var debug = require('debug')('i18nc-po:refs_utils');


var TYPES = exports.TYPES =
{
	BASE        : 0,
	// 比line，少了subkey，生成的key更加简单些
	SIMPLE_LINE : 1,
	SUBKEY     : 2,
	LINE        : 3,
}

exports.genOnlyFileKey = genOnlyFileKey;
function genOnlyFileKey(fileKey)
{
	var ret = [TYPES.BASE];
	if (fileKey) ret.push(fileKey);
	return ret.join(',');
}

exports.genSimpleSubkey = genSimpleSubkey;
function genSimpleSubkey(fileKey, subkey)
{
	var ret = [TYPES.SUBKEY];
	if (subkey)
		ret.push(subkey.length, subkey);
	else
		ret.push('');

	if (fileKey) ret.push(fileKey);
	return ret.join(',');
}

exports.genLineSubkey = genLineSubkey;
function genLineSubkey(fileKey, subkey, msgItems)
{
	if (!subkey || !msgItems || !msgItems.length) throw new Error('Error Input');

	var joinIndexs = [];
	var joinIndex = -1;
	var subkeys = [];
	msgItems.forEach(function(item)
	{
		if (item.subkey)
			subkeys.push(item.subkey.length, item.subkey);
		else
			subkeys.push('');

		if (joinIndex != -1) joinIndexs.push(joinIndex);
		joinIndex += item.msg.split('%p').length;
	});


	var ret = [TYPES.LINE];

	if (joinIndexs.length)
		ret.push(joinIndexs.length, joinIndexs.join(','));
	else
		ret.push(0);

	ret.push(subkeys.join(','), subkey.length, subkey);

	if (fileKey) ret.push(fileKey);
	return ret.join(',');
}

exports.genSimpleLineSubkey = genSimpleLineSubkey;
function genSimpleLineSubkey(fileKey, subkey, msgs)
{
	if (!subkey || !msgs || !msgs.length) throw new Error('Error Input');

	var joinIndexs = [];
	var joinIndex = -1;
	msgs.forEach(function(msg)
	{
		if (joinIndex != -1) joinIndexs.push(joinIndex);
		joinIndex += msg.split('%p').length;
	});


	var ret = [TYPES.SIMPLE_LINE];

	if (joinIndexs.length)
		ret.push(joinIndexs.length, joinIndexs.join(','));
	else
		ret.push(0);

	ret.push(subkey.length, subkey);

	if (fileKey) ret.push(fileKey);
	return ret.join(',');
}


exports.parse = parse;
function parse(refstr)
{
	var refstrArr = refstr.split(',');
	var ret;
	var type = +refstrArr[0];
	switch(type)
	{
		case TYPES.BASE:
			ret = {
				fileKey: refstr.substr(2),
			};
			break;

		case TYPES.LINE:
			var ret = _parseKey4LINE(refstr, refstrArr);
			break;

		case TYPES.SUBKEY:
			var ret = _parseKey4SUBKEY(refstr, refstrArr);
			break;

		case TYPES.SIMPLE_LINE:
			var ret = _parseKey4SimpleLINE(refstr, refstrArr);
			break;

		default:
			throw new Error('Ref String Type Is Not Support');
	}

	ret.type = type;

	return ret;
}

/**
 * 通过joinIndexs，将msgid和msgstr融合到一起
 */
exports.mixMsgsByJoinIndexs = mixMsgsByJoinIndexs;
function mixMsgsByJoinIndexs(info)
{
	var ret1 = _splitMsgByJoinIndexs(info.msgid, info);
	var ret2 = _splitMsgByJoinIndexs(info.msgstr, info);

	var result = {};
	_.each(ret1, function(arr1, subkey)
	{
		var arr2 = ret2[subkey];
		if (arr1.length != arr2.length)
		{
			throw new Error('Miss Message Separator');
		}

		// 排除空数组
		if (!arr1.length) return;
		if (arr1[arr1.length-1].split('%p').length != arr2[arr2.length-1].split('%p').length)
		{
			throw new Error('Miss Message Separator');
		}

		var obj = result[subkey] = {};
		arr1.forEach(function(val, index)
		{
			obj[val] = arr2[index];
		});
	});

	return result;
}



/**
 * 单纯简单的subkey解析
 */
function _parseKey4SUBKEY(refstr, refstrArr)
{
	if (!refstrArr) refstrArr = refstr.split(',');
	var subkeyInfo = _getStringFromArrayWidthLengthInfo(refstrArr.slice(1), 1);

	return {
		fileKey : refstrArr.slice(subkeyInfo.walkOffset+1).join(','),
		subkey : subkeyInfo.list[0] || '',
	};
}


/**
 * 将类似于 1,2,0,3,,3,sub,0,7,subkey,fileKey 这种路径
 * 解析成数据
 *
 * 数据格式依次为:
 *    1                  => 类型,
 *    2                  => joinIndex个数,
 *    0,3                => 具体的joinIndex
 *
 *    下面是 subkeys 分块部分
 *    (空)               => 第一个分段subkey为空
 *    3,sub              => 第二个分段是字符串长度为3，只为sub的subkey
 *    0                  => 第三个分段（最后一个分段）subkey为空，（一般使用留空表示，0是做兼容）
 *
 *    7,subkey          => 长度为7的subkey
 *    fileKey（剩下部分）  => 对应的fileKey值
 */
function _parseKey4LINE(refstr, refstrArr)
{
	if (!refstrArr) refstrArr = refstr.split(',');

	var joinLen = +refstrArr[1];
	if (isNaN(joinLen) || joinLen < 0) throw new Error('JoinIndexs Length Is Wrong');

	// headArr: 协议,joinLen,joinIndexs
	var headArr = refstrArr.slice(0, joinLen+2);

	var joinIndexs = headArr.slice(2).map(function(val)
		{
			val = +val;
			if (isNaN(val) || val < 0) throw new Error('JoinIndex Is Wrong');
			return val;
		});

	debug('joinIndexs len:%d, arr:%o', joinIndexs.length, joinIndexs);


	// tailArr 包含subkeys,subkey,fileKey
	var tailArr = refstrArr.slice(joinLen+2);
	// 开始解析定长数据
	// 注意：subkeys比joinIndex必定多一个（分隔和端的问题）
	// 再加上subkey，所以length+2
	var stringInfo = _getStringFromArrayWidthLengthInfo(tailArr, joinIndexs.length+2);

	var fileKey = tailArr.slice(stringInfo.walkOffset).join(',');
	var subkey = stringInfo.list.pop() || '';

	var subkeys = {};
	stringInfo.list.forEach(function(val, index)
	{
		if (val) subkeys[index] = val;
	});

	debug('fileKey:%s subkey:%s subkeys:%o', fileKey, subkey, subkeys);
	return {
		fileKey    : fileKey,
		subkey    : subkey,
		joinIndexs : joinIndexs,
		subkeys    : subkeys,
	};
}

// 比_parseKey4LINE 少了subkeys部分
function _parseKey4SimpleLINE(refstr, refstrArr)
{
	if (!refstrArr) refstrArr = refstr.split(',');

	var joinLen = +refstrArr[1];
	if (isNaN(joinLen) || joinLen < 0) throw new Error('JoinIndexs Length Is Wrong');

	// headArr: 协议,joinLen,joinIndexs
	var headArr = refstrArr.slice(0, joinLen+2);

	var joinIndexs = headArr.slice(2).map(function(val)
		{
			val = +val;
			if (isNaN(val) || val < 0) throw new Error('JoinIndex Is Wrong');
			return val;
		});

	debug('joinIndexs len:%d, arr:%o', joinIndexs.length, joinIndexs);


	// tailArr 包含subkeys,fileKey
	var tailArr = refstrArr.slice(joinLen+2);
	// 开始解析定长数据
	// 格式：字符串长度,字符串内容
	var stringInfo = _getStringFromArrayWidthLengthInfo(tailArr, 1);

	var fileKey = tailArr.slice(stringInfo.walkOffset).join(',');
	var subkey = stringInfo.list[0] || '';

	debug('fileKey:%s subkey:%s', fileKey, subkey);
	return {
		fileKey    : fileKey,
		subkey    : subkey,
		joinIndexs : joinIndexs,
	};
}

exports._getStringFromArrayWidthLengthInfo = _getStringFromArrayWidthLengthInfo;
function _getStringFromArrayWidthLengthInfo(originalArr, stringLen)
{
	var result = [];
	var originalArrLen = originalArr.length;
	var walkOffset = 0;

	debug('stringLen:%d originalArr:%o', stringLen, originalArr);

	while(stringLen--)
	{
		if (walkOffset >= originalArrLen) throw new Error('Join Indexs Is To Many');

		// 格式：字符串长度,字符串内容
		var strlen = +originalArr[walkOffset++];
		if (isNaN(strlen) || strlen < 0)
		{
			debug('strlen:%d, walkOffset:%d, originalArr:%o', strlen, walkOffset-1, originalArr);
			throw new Error('String Length Is Wrong');
		}

		if (strlen)
		{
			var strCnt = originalArr[walkOffset++];
			while(walkOffset < originalArrLen && strCnt.length < strlen)
			{
				debug('string contain `,`');
				strCnt += ','+originalArr[walkOffset++];
			}
			if (strCnt.length != strlen) throw new Error('String Length Is Wrong');
			result.push(strCnt);
		}
		else
		{
			// 写入一个null，用来记录index
			result.push(null);
		}
	}

	debug('originalArr len:%d, walkOffset:%d, result len:%d, result:%o',
		originalArrLen, walkOffset, result.length, result);

	return {
		list       : result,
		walkOffset : walkOffset,
	};
}


/**
 * 将字符串根据joinIndexs进行切分
 */
exports._splitMsgByJoinIndexs = _splitMsgByJoinIndexs;
function _splitMsgByJoinIndexs(msg, info)
{
	// 根据joinIndexs 切分msgid
	var result     = {'*': []};
	var tmpMsg     = [];
	var joinIndex  = 0;
	var joinIndexs = info.joinIndexs;
	var subkeys    = info.subkeys || {};

	msg.split('%p').forEach(function(msg, index)
	{
		tmpMsg.push(msg);
		if (joinIndexs[joinIndex] == index)
		{
			var subkey = subkeys[joinIndex] || '*';
			var subarr = result[subkey] || (result[subkey] = []);
			subarr.push(tmpMsg.join('%p'));

			joinIndex++;
			tmpMsg = [];
		}
	});

	if (tmpMsg.length)
	{
		var subkey = subkeys[joinIndex] || '*';
		var subarr = result[subkey] || (result[subkey] = []);
		subarr.push(tmpMsg.join('%p'));
	}

	return result;
}
