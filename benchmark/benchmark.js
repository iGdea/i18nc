'use strict';

var Benchmark = require('benchmark');


function noop(){}

function getCacheVarByFunc()
{
	var self = getCacheVarByFunc;
	var cache = self.data || (self.data = {});
	var value = (function(cache){if (cache.gb){return cache.gb.lan}else{cache.gb = {}}})(cache);
	noop(value);
}

function getCacheVarByVarAndFunc()
{
	var self = getCacheVarByVarAndFunc;
	var cache = self.data || (self.data = {});
	var value = (cache.gb && cache.gb.lan) || (function(cache){if (cache.gb){return cache.gb.lan}else{cache.gb = {}}})(cache);
	noop(value);
}

function getCacheVarByVar()
{
	var self = getCacheVarByVar;
	var cache = self.data || (self.data = {gb: {}});
	var value = cache.gb && cache.gb.lan;
	noop(value);
}


var suite = new Benchmark.Suite;
suite.add('func', function()
	{
		getCacheVarByFunc();
	})
	.add('var', function()
	{
		getCacheVarByVar();
	})
	.add('var&func', function()
	{
		getCacheVarByVarAndFunc();
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
