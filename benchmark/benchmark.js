'use strict';

var Benchmark = require('benchmark');


function getCacheVarByFunc()
{
	var self = getCacheVarByFunc;
	var cache = self.data || (self.data = {});
	var value = (function(cache){if (cache.gb){return cache.gb.lan}else if(typeof process == 'object'){cache.db = process}else{cache.gb = {}}})(cache);
	return value;
}

function getCacheVarByVarAndFunc()
{
	var self = getCacheVarByVarAndFunc;
	var cache = self.data || (self.data = {});
	var value = cache.gb && cache.gb.lan || (function(cache){if (cache.gb){return cache.gb.lan}else if(typeof process == 'object'){cache.db = process}else{cache.gb = {}}})(cache);
	return value;
}

function getCacheVarByEmptyVar()
{
	var self = getCacheVarByEmptyVar;
	var cache = self.data || (self.data = {});
	var value = cache.gb && cache.gb.lan;
	return value;
}

function getCacheVarByInitVar()
{
	var self = getCacheVarByInitVar;
	var cache = self.data || (self.data = {gb:{}});
	var value = cache.gb && cache.gb.lan;
	return value;
}

function getCacheVarBySetVar()
{
	var self = getCacheVarBySetVar;
	var cache = self.data || (self.data = {});
	if (!cache.gb) cache.gb = {};
	var value = cache.gb && cache.gb.lan;
	return value;
}

function globalFunc(cache)
{
	if (cache.gb){return cache.gb.lan}else if(typeof process == 'object'){cache.db = process}else{cache.gb = {}}
}

function getCacheVarByFunc()
{
	var self = getCacheVarByFunc;
	var cache = self.data || (self.data = {});
	var value = globalFunc(cache);
	return value;
}

var suite = new Benchmark.Suite;
suite.add('var&func', function()
	{
		getCacheVarByVarAndFunc();
	})
	.add('func', function()
	{
		getCacheVarByFunc();
	})
	.add('setvar', function()
	{
		getCacheVarBySetVar();
	})
	.add('initvar', function()
	{
		getCacheVarByInitVar();
	})
	.add('emptyvar', function()
	{
		getCacheVarByEmptyVar();
	})
	.add('globalfunc', function()
	{
		getCacheVarByFunc();
	})
	.on('cycle', function(event)
	{
		console.log(String(event.target));
	})
	.on('complete', function()
	{
		console.log('Fastest is ' + this.filter('fastest').map('name'));
	})
	.run();
