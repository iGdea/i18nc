'use strict';

var _ = require('lodash');
var debug = require('debug')('i18nc-core:codemap_table');
var valsUtils = require('../../../../lib/utils/options_vals');
var ArrayPush = Array.prototype.push;


exports.table_names = table_names;
/**
 * @param  {Array}    tableInfo 必须带有name, 结构体为{name, info}
 * @param  {Function} render    渲染除了name之后其他的table
 * @return {Object}
 */
function table_names(tableInfo, render)
{
	/*
	 * 汇总单个key包含的注释条数
	 * 方便后续计算rowspan
	 */
	var maxCollsLength = 0;
	function Key(name, parent)
	{
		var deep = parent ? parent.deep+1 : -1;
		this.name = name;
		this.parent = parent;
		this.info = null;
		this.deep = deep;
		this.maxDeep = deep;
		this.child_count = 0;
		this.children = {};
		this.rendered = parent ? 'none' : 'all';
	}

	_.extend(Key.prototype,
	{
		renderParents: function()
		{
			var parent = this.parent;
			if (!parent) return '';

			return parent.renderSelfName(false);

		},
		renderSelfName: function(isCloseRight)
		{
			var type = this.rendered;

			switch(type)
			{
				case 'none':
					var rowspan = this.child_count;
					if (this.info) rowspan++;
					var str;
					var leftCollsLength = maxCollsLength - this.deep;
					var colspan = isCloseRight &&  leftCollsLength > 1
						? ' colspan="'+leftCollsLength+'"' : '';

					if (rowspan == 1)
					{
						str = '<td'+colspan+'>'+this.name+'</td>';
						this.rendered = 'all';
					}
					else if (rowspan == 2)
					{
						str = '<td rowspan="'+rowspan+'"'+colspan+'>'+this.name+'</td>';
						this.rendered = 'all';
					}
					else
					{
						str = '<td'+colspan+'>'+this.name+'</td>';
						this.rendered = 'onlyone';
					}

					return this.renderParents()+str;

				case 'onlyone':
					var rowspan = this.child_count-1;
					if (this.info) rowspan++;
					var str = rowspan == 1
						? '<td></td>'
						: '<td rowspan="'+rowspan+'"></td>';

					this.rendered = 'all';
					return this.renderParents()+str;

				case 'all':
				default:
					return '';
			}
		},
		render: function()
		{
			var self = this;
			var result = [];

			// 直接输出
			// 需要计算之前已经输出的row
			if (self.info)
			{
				var str =
				[
					'<tr>',
						self.renderSelfName(true),
						render(self.info),
					'</tr>'
				]
				.join('');

				result.push(str);
			}


			_.map(self.children, function(item)
				{
					return item;
				})
				.sort(function(a, b)
				{
					if (a.maxDeep == b.maxDeep)
						return a.name > b.name ? 1 : -1;
					else
						return a.maxDeep > b.maxDeep ? 1 : -1;
				})
				.forEach(function(item)
				{
					ArrayPush.apply(result, item.render());
				});

			return result;
		}
	});

	var tableContentMap = new Key();
	tableInfo.forEach(function(item)
	{
		var nameArr = item.name.split('.');
		item.nameArr = nameArr;
		var tmp = tableContentMap;
		var nameLen = nameArr.length;
		maxCollsLength = Math.max(maxCollsLength, nameLen);

		nameArr.forEach(function(subname)
		{
			var tmp2 = tmp.children[subname];
			if (!tmp2) tmp2 = tmp.children[subname] = new Key(subname, tmp);
			tmp = tmp2;
			tmp.child_count++;
			tmp.maxDeep = Math.max(tmp.maxDeep, nameLen);
		});
		tmp.child_count--;
		tmp.info = item;
	});

	return {
		maxCollsLength: maxCollsLength,
		content: tableContentMap.render()
	};
}

/**
 * @param  {Object} mapData  {oldKey: [newKey]}
 */
exports.table_1toN = function(mapData, oldTableName, newTableName)
{
	// var maxOldKeyLen = 0;
	// var maxOldValLen = 0;
	var oldKeyMap = {};
	_.each(mapData, function(newKeys, oldKey)
	{
		var oldKeyInfo = valsUtils.str2keyVal(oldKey);
		var oldKeyVal = ''+oldKeyInfo.value;
		var oldKeyKey = oldKeyInfo.key;
		// maxOldKeyLen = Math.max(oldKeyKey.length, maxOldKeyLen);
		// maxOldValLen = Math.max(oldKeyVal.length, maxOldValLen);

		var arr = oldKeyMap[oldKeyKey] || (oldKeyMap[oldKeyKey] = []);
		arr.push(
		{
			old_value: oldKeyVal,
			news: Array.isArray(newKeys) ? newKeys : [newKeys]
		});
	});


	// var oldKeyStr = new Array(maxOldKeyLen+1).join(' ');
	// var oldValStr = new Array(maxOldValLen+1).join(' ');

	var oneItemOldKeyArr = [];
	var moreItemOldKeyArr = [];
	_.each(oldKeyMap, function(olds, old_key)
		{
			var item =
			{
				old_key: old_key,
				olds: olds,
			};
			if (olds.length > 1)
				moreItemOldKeyArr.push(item);
			else
				oneItemOldKeyArr.push(item);
		});

	var tableContentArr = oneItemOldKeyArr.sort(function(a, b)
		{
			return a.old_key > b.old_key ? 1 : -1;
		})
		.map(function(item)
		{
			var firstOldItem = item.olds[0];

			return '<tr>'
				+'<td colspan="2"><code>'+item.old_key+'</code> = <code>'+firstOldItem.old_value+'</code></td>'
				+'<td>'+newItemsRender(firstOldItem.news)+'</td>'
				+'</tr>';
		});

	moreItemOldKeyArr.sort(function(a, b)
		{
			return a.old_key > b.old_key ? 1 : -1;
		})
		.forEach(function(item)
		{
			item.olds = item.olds.sort(function(a, b)
			{
				return a.old_value > b.old_value ? 1 : -1;
			});

			var firstOldItem = item.olds[0];
			var arr = item.olds.map(function(oldItem, index)
				{
					if (!index) return;

					return '<tr>'
						+'<td><code>'+oldItem.old_value+'</code></td>'
						+'<td>'+newItemsRender(oldItem.news)+'</td>'
						+'</tr>';
				});

			arr[0] = '<tr>'
				+'<td rowspan="'+item.olds.length+'"><code>'+item.old_key+'</code></td>'
				+'<td><code>'+firstOldItem.old_value+'</code></td>'
				+'<td>'+newItemsRender(firstOldItem.news)+'</td>'
				+'</tr>';

			ArrayPush.apply(tableContentArr, arr);
		});

	return [
		'<table>',
			'\t<tr>',
				'\t\t<th colspan="2">'+oldTableName+'</th>',
				'\t\t<th>'+newTableName+'</th>',
			'\t</tr>',
			'\t'+tableContentArr.join('\n\t'),
		'</table>'
	].join('\n');

};


function newItemsRender(arr)
{
	return arr.map(function(val)
		{
			var newKeyInfo = valsUtils.str2keyVal(val);
			return '<code>'+newKeyInfo.key+'</code> = <code>'+newKeyInfo.value+'</code>';
		})
		.join('<br/>');
}


/**
 * @param  {Array} arrs    [[td1, td2, ...]]
 * @param  {Array} headers [{name, align}]
 */
exports.table_md = function(arrs, headers)
{
	var maxlens = [];
	var arrs2 = arrs.slice();
	arrs2.unshift(headers.map(function(item){return item.name}));
	arrs2.forEach(function(arr)
	{
		arr.forEach(function(str, index)
		{
			var len = strlen(str);
			var maxlen = maxlens[index];
			if (!maxlen || maxlen < len) maxlens[index] = len;
		});
	});

	var maxstr = maxlens.map(function(len)
	{
		return new Array(len+1).join(' ');
	});

	var tableContentArr = [];
	var headerArr = [];
	arrs2.forEach(function(arr, index)
	{
		var trstr = arr.map(function(str, index)
			{
				var align = headers[index].align;
				var needstr = maxstr[index].substr(strlen(str));
				var tdstr = align == 'right' ? needstr+str : str+needstr;
				return ' '+tdstr+' ';
			})
			.join('|');

		var arr = index === 0 ? headerArr : tableContentArr;
		arr.push('|'+trstr+'|');
	});

	var headerStr = maxlens.map(function(len, index)
	{
		var tdstr = new Array(len+3).join('-');
		switch(headers[index].align)
		{
			case 'right':
				tdstr = tdstr.substr(1)+':';
				break;
			case 'middle':
				tdstr = ':'+tdstr.substr(2)+':';
				break;
			case 'left':
			default:
				tdstr = ':'+tdstr.substr(1);
		}

		return tdstr;
	})
	.join('|');

	headerArr.push('|'+headerStr+'|');

	return {
		tableContentArr: tableContentArr,
		content: headerArr.join('\n')+'\n'+tableContentArr.join('\n')
	};
};


function strlen(str)
{
	/* eslint-disable no-control-regex */
	var match = str.match(/[^\u0000-\u007F]/g);
	var len = str.length;
	if (match)
	{
		var morelen = match.length - match.length/3|0;
		len += morelen;
		debug('ch morelen:%s str:%o', morelen, match);
	}
	return len;
}
