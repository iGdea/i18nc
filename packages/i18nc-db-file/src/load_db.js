'use strict';

const Promise     = require('bluebird');
const fs          = Promise.promisifyAll(require('fs'));
const glob        = require('glob');
const path        = require('path');
const debug       = require('debug')('i18nc-db-file');
const i18ncPO     = require('i18nc-po');
const i18ncDB     = require('i18nc-db');
const stripBOM    = require('strip-bom');
const extend      = require('extend');
const globAsync   = Promise.promisify(glob);
const ArrayConcat = Array.prototype.concat;

exports = module.exports = autoLoadDB;
exports.loaders =
{
	'.po': loadPOFile,
	'.js': loadByRequireSync,
	'.json': loadByRequireSync,
};

exports.sync = autoLoadDBSync;
exports.loadersSync =
{
	'.po': loadPOFileSync,
	'.js': loadByRequireSync,
	'.json': loadByRequireSync,
};



async function autoLoadDB(inputs)
{
	if (!Array.isArray(inputs)) inputs = [inputs];

	let dataArr = await Promise.map(inputs, async function(input)
		{
			if (typeof input == 'object') return i18ncDB.update(input);

			let stats = await fs.statAsync(input);

			if (stats.isFile())
				return loadDBFile(input);
			else if (stats.isDirectory())
				return loadDBFiles(input);
			else
				throw new Error('Input Is Not File Or Directory');
		},
		{
			concurrency: 5
		});

	return extendDB(dataArr);
}

async function loadDBFile(file)
{
	let extname = path.extname(file);
	let handler = exports.loaders[extname];
	if (handler) return handler(file);
}

/**
 * 从po文件中读取dbTranslateWords结构体
 */
async function loadDBFiles(inputDir)
{
	debug('sacn dir:%s', inputDir);

	let files = await globAsync('**/*', {cwd: inputDir, nodir: true, absolute: true})
	return Promise.map(files.sort(), function(file)
		{
			debug('load dir file:%s', file);
			return loadDBFile(file);
		},
		{
			concurrency: 5
		});
}

async function loadPOFile(file)
{
	let content = await fs.readFileAsync(file, {encoding: 'utf8'});

	content = stripBOM(content);
	return i18ncPO.parse(content);
}



function autoLoadDBSync(inputs)
{
	if (!Array.isArray(inputs)) inputs = [inputs];

	let dataArr = inputs.map(function(input)
	{
		if (typeof input == 'object') return i18ncDB.update(input);

		let stats = fs.statSync(input);

		if (stats.isFile())
			return loadDBFileSync(input);
		else if (stats.isDirectory())
			return loadDBFilesSync(input);
		else
			throw new Error('Input Is Not File Or Directory');
	});

	return extendDB(dataArr);
}


function loadDBFileSync(file)
{
	let extname = path.extname(file);
	let handler = exports.loadersSync[extname];
	if (handler) return handler(file);
}


/**
 * 从po文件中读取dbTranslateWords结构体
 */
function loadDBFilesSync(inputDir)
{
	debug('sacn dir:%s', inputDir);
	let files = glob.sync('**/*', {cwd: inputDir, nodir: true, absolute: true});
	return files.sort().map(loadDBFileSync);
}

function loadPOFileSync(file)
{
	let content = fs.readFileSync(file, {encoding: 'utf8'});
	content = stripBOM(content);
	return i18ncPO.parse(content);
}


function loadByRequireSync(file)
{
	return i18ncDB.update(require(file));
}

function extendDB(dbs)
{
	let arr = ArrayConcat.apply([true, {}], dbs);
	return extend.apply(null, arr);
}
