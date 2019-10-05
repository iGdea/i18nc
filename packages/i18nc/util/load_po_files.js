'use strict';

var Promise   = require('bluebird');
var fs        = Promise.promisifyAll(require('fs'));
var glob      = require('glob');
var debug     = require('debug')('i18nc:load_po_files');
var i18ncPO   = require('i18nc-po');
var stripBOM  = require('strip-bom');
var extend    = require('extend');
var globAsync = Promise.promisify(glob);

exports.autoLoadPOFiles = autoLoadPOFiles;
exports.loadPOFiles = loadPOFiles;
exports.loadPOFile = loadPOFile;

exports.autoLoadPOFilesSync = autoLoadPOFilesSync;
exports.loadPOFilesSync = loadPOFilesSync;
exports.loadPOFileSync = loadPOFileSync;

function autoLoadPOFiles(input)
{
	return fs.statAsync(input)
		.then(function(stats)
		{
			if (stats.isFile())
				return loadPOFile(input);
			else if (stats.isDirectory())
				return loadPOFiles(input);
			else
				throw new Error('Input Is Not File Or Directory');
		});
}

/**
 * 从po文件中读取dbTranslateWords结构体
 */
function loadPOFiles(inputDir)
{
	debug('sacn dir:%s', inputDir);
	return globAsync('**/*.po', {cwd: inputDir, nodir: true, absolute: true})
		.then(function(files)
		{
			return Promise.map(files, function(file)
			{
				debug('load po file:%s', file);
				return loadPOFile(file);
			},
			{
				concurrency: 5
			});
		})
		.then(function(arr)
		{
			arr.unshift(true);
			return extend.apply(null, arr);
		});
}

function loadPOFile(file)
{
	return fs.readFileAsync(file,
		{
			encoding: 'utf8'
		})
		.then(function(content)
		{
			content = stripBOM(content);
			return i18ncPO.parse(content);
		});
}



function autoLoadPOFilesSync(input)
{
	var stats = fs.statSync(input);

	if (stats.isFile())
		return loadPOFileSync(input);
	else if (stats.isDirectory())
		return loadPOFilesSync(input);
	else
		throw new Error('Input Is Not File Or Directory');
}

/**
 * 从po文件中读取dbTranslateWords结构体
 */
function loadPOFilesSync(inputDir)
{
	debug('sacn dir:%s', inputDir);
	var files = glob.sync('**/*.po', {cwd: inputDir, nodir: true, absolute: true});
	var arr = files.map(loadPOFileSync);
	arr.unshift(true);
	return extend.apply(null, arr);
}

function loadPOFileSync(file)
{
	var content = fs.readFileSync(file, {encoding: 'utf8'});
	content = stripBOM(content);
	return i18ncPO.parse(content);
}
