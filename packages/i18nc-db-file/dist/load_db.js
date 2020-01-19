"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(
	require("@babel/runtime/regenerator")
);

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _asyncToGenerator2 = _interopRequireDefault(
	require("@babel/runtime/helpers/asyncToGenerator")
);

var Promise = require("bluebird");

var fs = Promise.promisifyAll(require("fs"));

var glob = require("glob");

var path = require("path");

var debug = require("debug")("i18nc-db-file");

var i18ncPO = require("i18nc-po");

var i18ncDB = require("i18nc-db");

var stripBOM = require("strip-bom");

var extend = require("extend");

var globAsync = Promise.promisify(glob);
var ArrayConcat = Array.prototype.concat;
exports = module.exports = autoLoadDB;
exports.loaders = {
	".po": loadPOFile,
	".js": loadByRequireSync,
	".json": loadByRequireSync
};
exports.sync = autoLoadDBSync;
exports.loadersSync = {
	".po": loadPOFileSync,
	".js": loadByRequireSync,
	".json": loadByRequireSync
};

function autoLoadDB(_x) {
	return _autoLoadDB.apply(this, arguments);
}

function _autoLoadDB() {
	_autoLoadDB = (0, _asyncToGenerator2["default"])(
		/*#__PURE__*/
		_regenerator["default"].mark(function _callee2(inputs) {
			var dataArr;
			return _regenerator["default"].wrap(function _callee2$(_context2) {
				while (1) {
					switch ((_context2.prev = _context2.next)) {
						case 0:
							if (!Array.isArray(inputs)) inputs = [inputs];
							_context2.next = 3;
							return Promise.map(
								inputs,
								/*#__PURE__*/
								(function() {
									var _ref = (0,
									_asyncToGenerator2["default"])(
										/*#__PURE__*/
										_regenerator["default"].mark(
											function _callee(input) {
												var stats;
												return _regenerator[
													"default"
												].wrap(function _callee$(
													_context
												) {
													while (1) {
														switch (
															(_context.prev =
																_context.next)
														) {
															case 0:
																if (
																	!(
																		(0,
																		_typeof2[
																			"default"
																		])(
																			input
																		) ==
																		"object"
																	)
																) {
																	_context.next = 2;
																	break;
																}

																return _context.abrupt(
																	"return",
																	i18ncDB.update(
																		input
																	)
																);

															case 2:
																_context.next = 4;
																return fs.statAsync(
																	input
																);

															case 4:
																stats =
																	_context.sent;

																if (
																	!stats.isFile()
																) {
																	_context.next = 9;
																	break;
																}

																return _context.abrupt(
																	"return",
																	loadDBFile(
																		input
																	)
																);

															case 9:
																if (
																	!stats.isDirectory()
																) {
																	_context.next = 13;
																	break;
																}

																return _context.abrupt(
																	"return",
																	loadDBFiles(
																		input
																	)
																);

															case 13:
																throw new Error(
																	"Input Is Not File Or Directory"
																);

															case 14:
															case "end":
																return _context.stop();
														}
													}
												},
												_callee);
											}
										)
									);

									return function(_x5) {
										return _ref.apply(this, arguments);
									};
								})(),
								{
									concurrency: 5
								}
							);

						case 3:
							dataArr = _context2.sent;
							return _context2.abrupt(
								"return",
								extendDB(dataArr)
							);

						case 5:
						case "end":
							return _context2.stop();
					}
				}
			}, _callee2);
		})
	);
	return _autoLoadDB.apply(this, arguments);
}

function loadDBFile(_x2) {
	return _loadDBFile.apply(this, arguments);
}
/**
 * 从po文件中读取dbTranslateWords结构体
 */

function _loadDBFile() {
	_loadDBFile = (0, _asyncToGenerator2["default"])(
		/*#__PURE__*/
		_regenerator["default"].mark(function _callee3(file) {
			var extname, handler;
			return _regenerator["default"].wrap(function _callee3$(_context3) {
				while (1) {
					switch ((_context3.prev = _context3.next)) {
						case 0:
							extname = path.extname(file);
							handler = exports.loaders[extname];

							if (!handler) {
								_context3.next = 4;
								break;
							}

							return _context3.abrupt("return", handler(file));

						case 4:
						case "end":
							return _context3.stop();
					}
				}
			}, _callee3);
		})
	);
	return _loadDBFile.apply(this, arguments);
}

function loadDBFiles(_x3) {
	return _loadDBFiles.apply(this, arguments);
}

function _loadDBFiles() {
	_loadDBFiles = (0, _asyncToGenerator2["default"])(
		/*#__PURE__*/
		_regenerator["default"].mark(function _callee4(inputDir) {
			var files;
			return _regenerator["default"].wrap(function _callee4$(_context4) {
				while (1) {
					switch ((_context4.prev = _context4.next)) {
						case 0:
							debug("sacn dir:%s", inputDir);
							_context4.next = 3;
							return globAsync("**/*", {
								cwd: inputDir,
								nodir: true,
								absolute: true
							});

						case 3:
							files = _context4.sent;
							return _context4.abrupt(
								"return",
								Promise.map(
									files.sort(),
									function(file) {
										debug("load dir file:%s", file);
										return loadDBFile(file);
									},
									{
										concurrency: 5
									}
								)
							);

						case 5:
						case "end":
							return _context4.stop();
					}
				}
			}, _callee4);
		})
	);
	return _loadDBFiles.apply(this, arguments);
}

function loadPOFile(_x4) {
	return _loadPOFile.apply(this, arguments);
}

function _loadPOFile() {
	_loadPOFile = (0, _asyncToGenerator2["default"])(
		/*#__PURE__*/
		_regenerator["default"].mark(function _callee5(file) {
			var content;
			return _regenerator["default"].wrap(function _callee5$(_context5) {
				while (1) {
					switch ((_context5.prev = _context5.next)) {
						case 0:
							_context5.next = 2;
							return fs.readFileAsync(file, {
								encoding: "utf8"
							});

						case 2:
							content = _context5.sent;
							content = stripBOM(content);
							return _context5.abrupt(
								"return",
								i18ncPO.parse(content)
							);

						case 5:
						case "end":
							return _context5.stop();
					}
				}
			}, _callee5);
		})
	);
	return _loadPOFile.apply(this, arguments);
}

function autoLoadDBSync(inputs) {
	if (!Array.isArray(inputs)) inputs = [inputs];
	var dataArr = inputs.map(function(input) {
		if ((0, _typeof2["default"])(input) == "object")
			return i18ncDB.update(input);
		var stats = fs.statSync(input);
		if (stats.isFile()) return loadDBFileSync(input);
		else if (stats.isDirectory()) return loadDBFilesSync(input);
		else throw new Error("Input Is Not File Or Directory");
	});
	return extendDB(dataArr);
}

function loadDBFileSync(file) {
	var extname = path.extname(file);
	var handler = exports.loadersSync[extname];
	if (handler) return handler(file);
}
/**
 * 从po文件中读取dbTranslateWords结构体
 */

function loadDBFilesSync(inputDir) {
	debug("sacn dir:%s", inputDir);
	var files = glob.sync("**/*", {
		cwd: inputDir,
		nodir: true,
		absolute: true
	});
	return files.sort().map(loadDBFileSync);
}

function loadPOFileSync(file) {
	var content = fs.readFileSync(file, {
		encoding: "utf8"
	});
	content = stripBOM(content);
	return i18ncPO.parse(content);
}

function loadByRequireSync(file) {
	return i18ncDB.update(require(file));
}

function extendDB(dbs) {
	var arr = ArrayConcat.apply([true, {}], dbs);
	return extend.apply(null, arr);
}
//# sourceMappingURL=load_db.js.map
