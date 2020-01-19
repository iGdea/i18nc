'use strict';

const Benchmark = require('benchmark');
const tpldata = ['args1', 'args2'];

function indexOfCheck(msg) {
	if (msg.indexOf('%') == -1) return msg;

	let replace_index = 0;
	return msg.replace(/%s|%\{.+?\}/g, function(all) {
		const newVal = tpldata[replace_index++];
		return newVal === undefined || newVal === null ? all : newVal;
	});
}

// lastIndex 在replace下无效
function indexOfSet(msg) {
	const index = msg.indexOf('%');
	if (index == -1) return msg;

	const reg = /%s|%\{.+?\}/g;
	reg.lastIndex = index;
	let replace_index = 0;
	return msg.replace(reg, function(all) {
		const newVal = tpldata[replace_index++];
		return newVal === undefined || newVal === null ? all : newVal;
	});
}

function indexOfNoset(msg) {
	const index = msg.indexOf('%');
	if (index == -1) return msg;

	const reg = /%s|%\{.+?\}/g;
	let replace_index = 0;
	return msg.replace(reg, function(all) {
		const newVal = tpldata[replace_index++];
		return newVal === undefined || newVal === null ? all : newVal;
	});
}

function regRepalce(msg) {
	let replace_index = 0;
	return msg.replace(/%s|%\{.+?\}/g, function(all) {
		const newVal = tpldata[replace_index++];
		return newVal === undefined || newVal === null ? all : newVal;
	});
}

function regSplit(msg) {
	const arr = msg.split(/(%s|%\{.+?\})/g);

	for (let i = arr.length; i--; ) {
		// 暂时不考虑老ie的bug
		if (i % 2) arr[i] = tpldata[(i / 2) | 0];
	}

	return arr.join('');
}

let suite = new Benchmark.Suite();
exports.noReplace = suite
	.add('indexOfCheck', function() {
		indexOfCheck('str');
	})
	.add('indexOfSet', function() {
		indexOfSet('str');
	})
	.add('indexOfNoset', function() {
		indexOfNoset('str');
	})
	.add('regRepalce', function() {
		regRepalce('str');
	})
	.add('regSplit', function() {
		regSplit('str');
	})
	.on('cycle', function(event) {
		console.log(String(event.target));
	})
	.on('complete', function() {
		console.log('Fastest is ' + this.filter('fastest').map('name'));
	});

suite = new Benchmark.Suite();
exports.doReplace = suite
	.add('indexOfCheck', function() {
		indexOfCheck('str %s');
	})
	.add('indexOfSet', function() {
		indexOfSet('str %s');
	})
	.add('indexOfNoset', function() {
		indexOfNoset('str %s');
	})
	.add('regRepalce', function() {
		regRepalce('str %s');
	})
	.add('regSplit', function() {
		regSplit('str %s');
	})
	.on('cycle', function(event) {
		console.log(String(event.target));
	})
	.on('complete', function() {
		console.log('Fastest is ' + this.filter('fastest').map('name'));
	});
