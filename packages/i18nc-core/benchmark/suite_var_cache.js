'use strict';

const Benchmark = require('benchmark');

function getCacheVarByFunc() {
	const self = getCacheVarByFunc;
	const cache = self.data || (self.data = {});
	const value = (function(cache) {
		if (cache.gb) {
			return cache.gb.lan;
		} else if (typeof process == 'object') {
			cache.db = process;
		} else {
			cache.gb = {};
		}
	})(cache);
	return value;
}

function getCacheVarByVarAndFunc() {
	const self = getCacheVarByVarAndFunc;
	const cache = self.data || (self.data = {});
	const value =
		(cache.gb && cache.gb.lan) ||
		(function(cache) {
			if (cache.gb) {
				return cache.gb.lan;
			} else if (typeof process == 'object') {
				cache.db = process;
			} else {
				cache.gb = {};
			}
		})(cache);
	return value;
}

function getCacheVarByEmptyVar() {
	const self = getCacheVarByEmptyVar;
	const cache = self.data || (self.data = {});
	const value = cache.gb && cache.gb.lan;
	return value;
}

function getCacheVarByInitVar() {
	const self = getCacheVarByInitVar;
	const cache = self.data || (self.data = { gb: {} });
	const value = cache.gb && cache.gb.lan;
	return value;
}

function getCacheVarBySetVar() {
	const self = getCacheVarBySetVar;
	const cache = self.data || (self.data = {});
	if (!cache.gb) cache.gb = {};
	const value = cache.gb && cache.gb.lan;
	return value;
}

function globalFunc(cache) {
	if (cache.gb) {
		return cache.gb.lan;
	} else if (typeof process == 'object') {
		cache.db = process;
	} else {
		cache.gb = {};
	}
}

function getCacheVarByGlobalFunc() {
	const self = getCacheVarByFunc;
	const cache = self.data || (self.data = {});
	const value = globalFunc(cache);
	return value;
}

const suite = new Benchmark.Suite();
module.exports = suite
	.add('var&func', function() {
		getCacheVarByVarAndFunc();
	})
	.add('func', function() {
		getCacheVarByFunc();
	})
	.add('setvar', function() {
		getCacheVarBySetVar();
	})
	.add('initvar', function() {
		getCacheVarByInitVar();
	})
	.add('emptyvar', function() {
		getCacheVarByEmptyVar();
	})
	.add('globalfunc', function() {
		getCacheVarByGlobalFunc();
	})
	.on('cycle', function(event) {
		console.log(String(event.target));
	})
	.on('complete', function() {
		console.log('Fastest is ' + this.filter('fastest').map('name'));
	});
