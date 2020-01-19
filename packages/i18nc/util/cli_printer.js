'use strict';

const _ = require('lodash');
const table = require('table');
const chalk = require('chalk');
const EMPTY_SYMBOL = '(empty)';
exports.colors = new chalk.constructor();

exports.defaultTableOptions = {
	border: table.getBorderCharacters('void'),
	columnDefault: {
		paddingLeft: 1,
		paddingRight: 1
	},
	drawHorizontalLine: function() {
		return 0;
	}
};

exports.printDirtyAndNewWords = printDirtyAndNewWords;
function printDirtyAndNewWords(dirtyWords, newlist, paddingLeft) {
	const list = _getNewWordsTableListData(newlist, true);
	list.push.apply(list, _getDirtyWordsTableListData(dirtyWords));
	list.sort(function(a, b) {
		return a.ast.range[0] > b.ast.range[0] ? 1 : -1;
	});

	return _printWordListTable(list, {
		paddingLeft: paddingLeft || 1
	});
}

exports.printDirtyWords = printDirtyWords;
function printDirtyWords(dirtyWords, paddingLeft) {
	const list = _getDirtyWordsTableListData(dirtyWords);

	return _printWordListTable(list, {
		paddingLeft: paddingLeft || 1
	});
}

exports.printNewWords = printNewWords;
function printNewWords(newlist, paddingLeft) {
	const list = _getNewWordsTableListData(newlist);

	return _printWordListTable(list, {
		paddingLeft: paddingLeft || 1
	});
}

exports.printRefs = printRefs;
function printRefs(info, paddingLeft) {
	const emptySymbol = exports.colors.gray(EMPTY_SYMBOL);
	const mainTableData = [
		[exports.colors.gray('type'), '' + info.type],
		[exports.colors.gray('fileKey'), info.fileKey || emptySymbol],
		[exports.colors.gray('subkey'), info.subkey || emptySymbol],
		[
			exports.colors.gray('joinIndexs'),
			(info.joinIndexs && info.joinIndexs.join(',')) || emptySymbol
		]
	];

	if (info.subkeys && Object.keys(info.subkeys).length) {
		mainTableData.push(['', ' ']);
		mainTableData.push([
			exports.colors.gray('subkeys'),
			exports.colors.gray('index')
		]);
		_.each(info.subkeys, function(val, key) {
			mainTableData.push([val, key]);
		});
	} else {
		mainTableData.push([exports.colors.gray('subkeys'), emptySymbol]);
	}

	return _printTable(mainTableData, {
		alignment: 'right',
		paddingLeft: paddingLeft || 1
	});
}

function _getDirtyWordsTableListData(dirtyWords) {
	const list = dirtyWords.list.map(function(item) {
		const ast = item.originalAst;

		return {
			ast: ast,
			loc: getAstLocStr(ast),
			value: item.code,
			reason: item.reason
		};
	});

	return list;
}

function _getNewWordsTableListData(newlist, reason) {
	const list = newlist.map(function(item) {
		const ast = item.originalAst;
		return {
			ast: ast,
			loc: getAstLocStr(ast),
			value: item.translateWords.join(','),
			reason: reason ? 'Words are not wrapped' : null
		};
	});

	return list;
}

function _printWordListTable(list, firstColumnStyle) {
	const mainTableData = list
		.map(function(item) {
			return [
				item.loc ? exports.colors.gray(item.loc) : ' ',
				item.value ? exports.colors.yellow(item.value) : ' ',
				item.reason || ' '
			];
		})
		.filter(function(arr) {
			return arr.join('').trim();
		});

	return _printTable(mainTableData, firstColumnStyle);
}

function _printTable(mainTableData, firstColumnStyle) {
	const tableOptions = _.extend({}, exports.defaultTableOptions, {
		columns: {
			0: firstColumnStyle
		}
	});

	if (table.table) return table.table(mainTableData, tableOptions);
	else return table.default(mainTableData, tableOptions);
}

exports.getAstLocStr = getAstLocStr;
function getAstLocStr(ast) {
	if (ast && ast.loc)
		return 'Loc:' + ast.loc.start.line + ',' + ast.loc.start.column;
	else return '';
}
