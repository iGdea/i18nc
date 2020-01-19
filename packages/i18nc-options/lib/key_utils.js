/**
 * 针对options，提供快速获取key和值的接口
 * 例如 options.getVal('I18NHandler.style.codeStyle');
 */

'use strict';

const _ = require('lodash');
const debug = require('debug')('i18nc-options:options_vals');

exports.KeyObj = KeyObj;

const KEY_ARRS = {};
function getKeys(key) {
	return KEY_ARRS[key] || (KEY_ARRS[key] = key.split('.'));
}

function KeyObj(options) {
	this.options = options;
	this._keyCache = {};
}

_.extend(KeyObj.prototype, {
	exists: function(key) {
		const keyCache = this._keyCache;
		if (key in keyCache) return true;

		this.getVal(key);

		return key in keyCache;
	},
	getVal: function(key) {
		const keyCache = this._keyCache;
		if (key in keyCache) return keyCache[key];

		let key2 = '';
		const items = getKeys(key);
		let prevVal = this.options;
		const exists = !_.some(items, function(name, index) {
			if (!prevVal) return true;

			if (key2) keyCache[key2] = prevVal;
			key2 += index === 0 ? name : '.' + name;
			if (name in prevVal) {
				prevVal = prevVal[name];
			} else if (index == items.length - 1 && Array.isArray(prevVal)) {
				debug('val is exists by array mode, key:%s', key);
				prevVal = prevVal.indexOf(name) != -1;
			} else {
				return true;
			}
		});

		if (exists) {
			keyCache[key] = prevVal;
			return prevVal;
		}
	},
	setVal: function(key, val) {
		const keyCache = this._keyCache;
		keyCache[key] = val;
		const items = getKeys(key);
		const len = items.length;
		let prevVal;

		if (len < 3 || !(prevVal = keyCache[items.slice(0, -1).join('.')])) {
			prevVal = this.options;
			for (let tmp, name, i = 0, key2 = '', t = len - 1; i < t; i++) {
				name = items[i];
				key2 += i === 0 ? name : '.' + name;
				tmp = prevVal[name];
				if (!tmp || typeof tmp != 'object')
					prevVal = prevVal[name] = {};
				else prevVal = tmp;

				keyCache[key2] = prevVal;
			}
		}

		const name = items[len - 1];
		if (Array.isArray(prevVal) && val === true) {
			prevVal.push(name);
			debug('set val in array mode, key:%s', key);
		} else {
			prevVal[name] = val;
		}
	}
});

const STR2KEYVAL = {};
exports.str2keyVal = str2keyVal;
function str2keyVal(key) {
	let ret = STR2KEYVAL[key];

	if (!ret) {
		const arr = key.split('=');
		let val = arr.pop();

		if (val == 'true') val = true;
		else if (val == 'false') val = false;

		ret = STR2KEYVAL[key] = {
			key: arr.join('='),
			value: val
		};
	}

	return ret;
}
