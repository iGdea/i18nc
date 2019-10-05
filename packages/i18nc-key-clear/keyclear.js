'use strict';

var debug = require('debug')('i18nc-key-clear');

exports = module.exports = function(i18nc)
{
	i18nc.registerPlugin('keyClear', function(i18nc, settings, enabled)
	{
		debug('register keyclear for i18nc');
		i18nc.addListener('cutword', function(emitData)
		{
			if (emitData.options.pluginEnabled.keyClear)
			{
				debug('run by keyclear');
				emitData.result = keyClear(emitData.result, emitData.originalString);
			}
			else
			{
				debug('keyclear is not enabled');
			}
		});

		enabled.keyClear = false;
	});
};

exports.keyClear = keyClear;
function keyClear(lineStrings, value)
{
	var commentIndexs = _commentIndexs(value);
	debug('commentIndexs:%o', commentIndexs);
	if (!commentIndexs.length) return lineStrings;

	return _resplitLineStringsByCommentIndexs(lineStrings, commentIndexs);
}


exports._test =
{
	_commentIndexs: _commentIndexs
};

/**
 * 将字符串中html注释index找出来
 * 忽略不成对的注释标签
 */
function _commentIndexs(value)
{
	var commentAllIndexItems = [];
	var commentStartReg = /<!--/g;
	var commentEndReg = /-->/g;
	while(commentStartReg.test(value))
	{
		commentAllIndexItems.push({type: 'start', index: commentStartReg.lastIndex-4});
	}
	while(commentEndReg.test(value))
	{
		commentAllIndexItems.push({type: 'end', index: commentEndReg.lastIndex-3});
	}
	debug('comment item:%o', commentAllIndexItems);

	var isInComment = false;
	var isNotInited = false;
	var commentIndexs = [];
	commentAllIndexItems.sort(function(a, b)
		{
			return a.index > b.index ? 1 : -1;
		})
		.forEach(function(item)
		{
			if (isInComment && item.type == 'end')
			{
				isInComment = false;
				commentIndexs.push(item.index);
			}
			else if ((!isInComment || !isNotInited) && item.type == 'start')
			{
				isNotInited = true;
				isInComment = true;
				commentIndexs.push(item.index);
			}
			else
			{
				debug('ignore index:%d type:%s', item.index, item.type);
			}
		});

	// 如果只有开始，没有结束，就放过
	if (commentIndexs.length % 2)
	{
		debug('no end Index, pop start index');
		commentIndexs.pop();
	}

	return commentIndexs;
}


/**
 * 使用注释index，对lineStrings进行重新分组
 */
function _resplitLineStringsByCommentIndexs(lineStrings, commentIndexs)
{
	var result = [];
	var tmpComment = [];
	var hasDealIndex = 0;
	var commentIndex = commentIndexs.shift();
	var isCommentEmpety = false;
	var isInComment = false;


	function checkCommentIndexHandle(item, index)
	{
		if (!item || !item.value) return;
		var value = item.value;

		if (isCommentEmpety)
		{
			result.push(item);
			return;
		}

		function addResult(value, ignore)
		{
			result.push(
				{
					value: value,
					ignore: ignore || item.ignore,
					disconnected: item.disconnected,
					translateWord: item.translateWord,
				});
		}

		var endIndex = hasDealIndex+value.length;
		debug('chek comment index start, hasDealIndex:%d, isInComment:%s, item value:%s index:%d',
			hasDealIndex, isInComment, value, index);

		if (commentIndex <= endIndex)
		{
			// 当前是注释，准备离开
			// value长度可能会不足，需要从下一个item补长度
			if (isInComment)
			{
				// 3 为注释结束标志的长度
				var substrEndIndex = commentIndex - hasDealIndex+3;
				var endPart = value.slice(0, substrEndIndex);
				// 从下一个值中补长度到可以被裁剪
				var endPartLackLen = substrEndIndex - endPart.length;
				debug('endPartLackLen:%d', endPartLackLen);
				endPart += _addItemLackValue(lineStrings, index, endPartLackLen);
				debug('endPart:%s', endPart);

				tmpComment.push(endPart);
				addResult(tmpComment.join(''), true);

				// 清理转换参数
				tmpComment = [];
				value = value.slice(substrEndIndex);
				isInComment = false;
				hasDealIndex += endPart.length;
				if (!commentIndexs.length)
					isCommentEmpety = true;
				else
					commentIndex = commentIndexs.shift();
			}
			// 当前不是注释，进入注释队列收集模式
			// 也存在value长度不足的情况，但不需要从下一个item补
			else
			{
				var substrEndIndex = commentIndex - hasDealIndex;
				var startPart = value.slice(0, substrEndIndex);
				addResult(startPart);

				value = value.slice(substrEndIndex);
				isInComment = true;
				hasDealIndex += substrEndIndex;
				commentIndex = commentIndexs.shift();
			}

			// 继续递归
			if (value)
			{
				checkCommentIndexHandle(
					{
						value: value,
						ignore: item.ignore,
						disconnected: item.disconnected,
						translateWord: item.translateWord,
					}, index);
			}
		}
		else
		{
			if (isInComment)
				tmpComment.push(value);
			else
				addResult(value);

			hasDealIndex += value.length;
		}
	}

	lineStrings.forEach(function(item, index)
	{
		checkCommentIndexHandle(item, index);
	});

	if (!isCommentEmpety || tmpComment.length)
	{
		debug('result err, isCommentEmpety:%s, tmpComment:%o, lineStrings:%o',
			isCommentEmpety, tmpComment, lineStrings);
		throw new Error('Tpl Comment Is Not End');
	}

	return result;
}


/**
 * 需要裁剪的长度不足时，通过后面的item来补
 */
function _addItemLackValue(lineStrings, index, lackLen)
{
	if (!lackLen) return '';

	var result = '';
	for(index++; lackLen && index < lineStrings.length; index++)
	{
		var nextItem = lineStrings[index];
		if (!nextItem) continue;
		var addstr = nextItem.value.slice(0, lackLen);
		debug('addstr:%s', addstr);

		result += addstr;
		nextItem.value = nextItem.value.slice(addstr.length);
		lackLen -= addstr.length;
	}

	if (lackLen) throw new Error('LackValue Error');

	return result;
}
