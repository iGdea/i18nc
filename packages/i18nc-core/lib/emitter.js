'use strict';

const debug = require('debug')('i18nc-core:emitter');
const EventEmitter = require('events').EventEmitter;

/**
 * [Event List]
 *
 * loadTranslateJSON
 * 		获取 emitData.result (json) 作为返回值
 *
 * newTranslateJSON
 * 		获取 emitData.result (string) 作为返回值
 *
 * beforeScan
 * 		获取 emitData.result (ast) 作为返回值
 *
 * cutword
 * 		获取 emitData.result (array lineStrings) 作为返回值
 *
 * assignLineStrings
 * 		获取 emitData.value (array ast+lineStrings) 作为返回值
 */

const globalEmitter = new EventEmitter();
let tmpEmitter = null;
const EventEmit = globalEmitter.emit;

exports.clear = function() {
	tmpEmitter = null;
};

exports.new = function() {
	return (tmpEmitter = new EventEmitter());
};

exports.trigger = function() {
	EventEmit.apply(globalEmitter, arguments);
	if (tmpEmitter) EventEmit.apply(tmpEmitter, arguments);
};

exports.proxy = function(obj) {
	// 注意:
	// 不提供prependXXX once这些方法
	// 设计的时候，忽略添加的先后顺序
	// once容易出错，毕竟有scope等情况，容易导成误解
	[
		'on',
		'addListener',
		'removeListener',
		'removeAllListeners',
		'eventNames',
		'emit',
		'setMaxListeners',
		'listenerCount',
		'getMaxListeners'
	].forEach(function(name) {
		const handler = globalEmitter[name];
		if (typeof handler == 'function')
			obj[name] = handler.bind(globalEmitter);
		else debug('handler is not function:%s', name);
	});

	obj.off = function(eventName, handler) {
		if (handler)
			return globalEmitter.removeListener.apply(globalEmitter, arguments);
		else
			return globalEmitter.removeAllListeners.apply(
				globalEmitter,
				arguments
			);
	};
};
