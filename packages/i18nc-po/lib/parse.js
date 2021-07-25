'use strict';

const _ = require('lodash');
const PO = require('pofile');
const debug = require('debug')('i18nc-po:parse');
const i18ncDB = require('i18nc-db');
const refsUtils = require('./refs_utils');

exports.parse = parse;
function parse(content) {
	const poInfo = PO.parse(content);
	const result = _po2translateDBData(poInfo);

	return i18ncDB.update(result);
}

function _po2translateDBData(poInfo) {
	const lan = poInfo.headers.Language;
	if (!lan) throw new Error('Language Not Found');

	const result = {};
	const fileKeyData = {};
	result[lan] = fileKeyData;

	poInfo.items.forEach(function(poItem) {
		if (!poItem.msgstr) return;
		let refs = poItem.references;
		if (!refs.length) refs = [undefined];

		const msgids = [];
		if (poItem.msgid) msgids.push(poItem.msgid);
		if (poItem.msgid_plural) msgids.push(poItem.msgid_plural);

		debug('msgids:%o, msgstr:%o, refs:%o', msgids, poItem.msgstr, refs);

		refs.forEach(function(ref) {
			msgids.forEach(function(msgid, index) {
				const msgstr = poItem.msgstr[index] || poItem.msgstr[0];
				_append_oneRef_msgid_msgstr(fileKeyData, ref, msgid, msgstr);
			});
		});
	});

	return result;
}

function _append_oneRef_msgid_msgstr(result, ref, msgid, msgstr) {
	if (!msgid || !msgstr) return;

	let info;
	if (!ref || ref.substr(0, 2) != '@@') debug('ignore ref for parse:%s', ref);
	else info = refsUtils.parse(ref.substr(2));

	if (!info) info = {};
	if (!info.fileKey) info.fileKey = '*';

	switch (info.type) {
		case refsUtils.TYPES.SUBKEY:
			_.set(result, [info.fileKey, 'SUBKEYS', info.subkey, msgid], msgstr);
			break;

		case refsUtils.TYPES.SIMPLE_LINE:
		case refsUtils.TYPES.LINE: {
			info.msgid = msgid;
			info.msgstr = msgstr;
			const translateData = refsUtils.mixMsgsByJoinIndexs(info);
			_.each(translateData, function(data, subkey) {
				subkey = subkey == '*' ? info.subkey : info.subkey + '@' + subkey;
				_.each(data, function(msgstr, msgid) {
					_.set(result, [info.fileKey, 'SUBKEYS', subkey, msgid], msgstr);
				});
			});
			break;
		}

		default:
		case refsUtils.TYPES.BASE:
			_.set(result, [info.fileKey, 'DEFAULTS', msgid], msgstr);
			break;
	}
}
