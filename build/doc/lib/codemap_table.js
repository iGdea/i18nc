'use strict';

const _ = require('lodash');
const debug = require('debug')('i18nc-core:codemap_table');
const valsUtils = require('i18nc-options/lib/key_utils');
const ArrayPush = Array.prototype.push;

exports.table_names = table_names;
/**
 * @param  {Array}    tableInfo 必须带有name, 结构体为{name, info}
 * @param  {Function} render    渲染除了name之后其他的table
 * @return {Object}
 */
function table_names(tableInfo, render) {
	/*
	 * 汇总单个key包含的注释条数
	 * 方便后续计算rowspan
	 */
	let maxCollsLength = 0;
	function Key(name, parent) {
		const deep = parent ? parent.deep + 1 : -1;
		this.name = name;
		this.parent = parent;
		this.info = null;
		this.deep = deep;
		this.maxDeep = deep;
		this.child_count = 0;
		this.children = {};
		this.rendered = parent ? 'none' : 'all';
	}

	_.extend(Key.prototype, {
		renderParents: function() {
			const parent = this.parent;
			if (!parent) return '';

			return parent.renderSelfName(false);
		},
		renderSelfName: function(isCloseRight) {
			const type = this.rendered;

			switch (type) {
				case 'none': {
					let rowspan = this.child_count;
					if (this.info) rowspan++;
					let str;
					const leftCollsLength = maxCollsLength - this.deep;
					const colspan =
						isCloseRight && leftCollsLength > 1
							? ' colspan="' + leftCollsLength + '"'
							: '';

					if (rowspan == 1) {
						str = '<td' + colspan + '>' + this.name + '</td>';
						this.rendered = 'all';
					} else if (rowspan == 2) {
						str =
							'<td rowspan="' +
							rowspan +
							'"' +
							colspan +
							'>' +
							this.name +
							'</td>';
						this.rendered = 'all';
					} else {
						str = '<td' + colspan + '>' + this.name + '</td>';
						this.rendered = 'onlyone';
					}

					return this.renderParents() + str;
				}

				case 'onlyone': {
					let rowspan = this.child_count - 1;
					if (this.info) rowspan++;
					const str =
						rowspan == 1
							? '<td></td>'
							: '<td rowspan="' + rowspan + '"></td>';

					this.rendered = 'all';
					return this.renderParents() + str;
				}

				case 'all':
				default:
					return '';
			}
		},
		render: function() {
			const self = this;
			const result = [];

			// 直接输出
			// 需要计算之前已经输出的row
			if (self.info) {
				const str = [
					'<tr>',
					self.renderSelfName(true),
					render(self.info),
					'</tr>'
				].join('');

				result.push(str);
			}

			_.map(self.children, function(item) {
				return item;
			})
				.sort(function(a, b) {
					if (a.maxDeep == b.maxDeep) return a.name > b.name ? 1 : -1;
					else return a.maxDeep > b.maxDeep ? 1 : -1;
				})
				.forEach(function(item) {
					ArrayPush.apply(result, item.render());
				});

			return result;
		}
	});

	const tableContentMap = new Key();
	tableInfo.forEach(function(item) {
		const nameArr = item.name.split('.');
		item.nameArr = nameArr;
		let tmp = tableContentMap;
		const nameLen = nameArr.length;
		maxCollsLength = Math.max(maxCollsLength, nameLen);

		nameArr.forEach(function(subname) {
			let tmp2 = tmp.children[subname];
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
exports.table_1toN = function(mapData, oldTableName, newTableName) {
	// const maxOldKeyLen = 0;
	// const maxOldValLen = 0;
	const oldKeyMap = {};
	_.each(mapData, function(newKeys, oldKey) {
		const oldKeyInfo = valsUtils.str2keyVal(oldKey);
		const oldKeyVal = '' + oldKeyInfo.value;
		const oldKeyKey = oldKeyInfo.key;
		// maxOldKeyLen = Math.max(oldKeyKey.length, maxOldKeyLen);
		// maxOldValLen = Math.max(oldKeyVal.length, maxOldValLen);

		const arr = oldKeyMap[oldKeyKey] || (oldKeyMap[oldKeyKey] = []);
		arr.push({
			old_value: oldKeyVal,
			news: Array.isArray(newKeys) ? newKeys : [newKeys]
		});
	});

	// const oldKeyStr = new Array(maxOldKeyLen+1).join(' ');
	// const oldValStr = new Array(maxOldValLen+1).join(' ');

	const oneItemOldKeyArr = [];
	const moreItemOldKeyArr = [];
	_.each(oldKeyMap, function(olds, old_key) {
		const item = {
			old_key: old_key,
			olds: olds
		};
		if (olds.length > 1) moreItemOldKeyArr.push(item);
		else oneItemOldKeyArr.push(item);
	});

	const tableContentArr = oneItemOldKeyArr
		.sort(function(a, b) {
			return a.old_key > b.old_key ? 1 : -1;
		})
		.map(function(item) {
			const firstOldItem = item.olds[0];

			return (
				'<tr>' +
				'<td colspan="2"><code>' +
				item.old_key +
				'</code> = <code>' +
				firstOldItem.old_value +
				'</code></td>' +
				'<td>' +
				newItemsRender(firstOldItem.news) +
				'</td>' +
				'</tr>'
			);
		});

	moreItemOldKeyArr
		.sort(function(a, b) {
			return a.old_key > b.old_key ? 1 : -1;
		})
		.forEach(function(item) {
			item.olds = item.olds.sort(function(a, b) {
				return a.old_value > b.old_value ? 1 : -1;
			});

			const firstOldItem = item.olds[0];
			const arr = item.olds.map(function(oldItem, index) {
				if (!index) return;

				return (
					'<tr>' +
					'<td><code>' +
					oldItem.old_value +
					'</code></td>' +
					'<td>' +
					newItemsRender(oldItem.news) +
					'</td>' +
					'</tr>'
				);
			});

			arr[0] =
				'<tr>' +
				'<td rowspan="' +
				item.olds.length +
				'"><code>' +
				item.old_key +
				'</code></td>' +
				'<td><code>' +
				firstOldItem.old_value +
				'</code></td>' +
				'<td>' +
				newItemsRender(firstOldItem.news) +
				'</td>' +
				'</tr>';

			ArrayPush.apply(tableContentArr, arr);
		});

	return [
		'<table>',
		'\t<tr>',
		'\t\t<th colspan="2">' + oldTableName + '</th>',
		'\t\t<th>' + newTableName + '</th>',
		'\t</tr>',
		'\t' + tableContentArr.join('\n\t'),
		'</table>'
	].join('\n');
};

function newItemsRender(arr) {
	return arr
		.map(function(val) {
			const newKeyInfo = valsUtils.str2keyVal(val);
			return (
				'<code>' +
				newKeyInfo.key +
				'</code> = <code>' +
				newKeyInfo.value +
				'</code>'
			);
		})
		.join('<br/>');
}

/**
 * @param  {Array} arrs    [[td1, td2, ...]]
 * @param  {Array} headers [{name, align}]
 */
exports.table_md = function(arrs, headers) {
	const maxlens = [];
	const arrs2 = arrs.slice();
	arrs2.unshift(
		headers.map(function(item) {
			return item.name;
		})
	);
	arrs2.forEach(function(arr) {
		arr.forEach(function(str, index) {
			const len = strlen(str);
			const maxlen = maxlens[index];
			if (!maxlen || maxlen < len) maxlens[index] = len;
		});
	});

	const maxstr = maxlens.map(function(len) {
		return new Array(len + 1).join(' ');
	});

	const tableContentArr = [];
	const headerArr = [];
	arrs2.forEach(function(arr, index) {
		const trstr = arr
			.map(function(str, index) {
				const align = headers[index].align;
				const needstr = maxstr[index].substr(strlen(str));
				const tdstr = align == 'right' ? needstr + str : str + needstr;
				return ' ' + tdstr + ' ';
			})
			.join('|');

		const arr2 = index === 0 ? headerArr : tableContentArr;
		arr2.push('|' + trstr + '|');
	});

	const headerStr = maxlens
		.map(function(len, index) {
			let tdstr = new Array(len + 3).join('-');
			switch (headers[index].align) {
				case 'right':
					tdstr = tdstr.substr(1) + ':';
					break;
				case 'middle':
					tdstr = ':' + tdstr.substr(2) + ':';
					break;
				case 'left':
				default:
					tdstr = ':' + tdstr.substr(1);
			}

			return tdstr;
		})
		.join('|');

	headerArr.push('|' + headerStr + '|');

	return {
		tableContentArr: tableContentArr,
		content: headerArr.join('\n') + '\n' + tableContentArr.join('\n')
	};
};

function strlen(str) {
	/* eslint-disable no-control-regex */
	const match = str.match(/[^\u0000-\u007F]/g);
	let len = str.length;
	if (match) {
		const morelen = (match.length - match.length / 3) | 0;
		len += morelen;
		debug('ch morelen:%s str:%o', morelen, match);
	}
	return len;
}
