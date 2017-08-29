I18NC
==================


[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Coveralls][coveralls-image]][coveralls-url]
[![NPM License][license-image]][npm-url]

# Install
```
npm install i18nc --save
```

# Useage

```
var i18nc = require('i18nc');
var ret = i18nc(code, options);

ret.code    // output code
ret.dirtyWords
ret.codeTranslateWords
ret.funcTranslateWords
ret.usedTranslateWords
```


# Example

### Input Code

```
var work = "global 中文1";
define(function()
{
	var word = I18N('define1 中文', 'in define');
});

define('define2', function()
{
	var word = 'define2 中文';
});

var work = "global 中文2";
function I18N(){}
```

### Output Code

````
var work = I18N('global 中文1');
define(function()
{
	var word = I18N('define1 中文', 'in define');
});

define('define2', function()
{
	var word = I18N('define2 中文');
});

var work = I18N('global 中文2');
function I18N(msg, subtype) {
	var self = I18N;

	var GLOBAL = self.__GLOBAL__ || (self.__GLOBAL__ = typeof window == "object" ? window : typeof global == "object" && global) || {};
	var LAN = GLOBAL.__i18n_lan__;

	if (!LAN) return msg;

	if (self.__TRANSLATE_LAN__ != LAN) {
		self.__TRANSLATE_LAN__ = LAN;
		var __FILE_KEY__ = "default_file_key";
		var __FUNCTION_VERSION__ = 2;

		var __TRANSLATE_JSON__ = {
				'en': {
					'DEFAULTS': {
						'define1 中文': 'define1 zh',
						'global 中文1': 'global zh1',
						'global 中文2': 'global zh2'
					},
					'SUBTYPES': {
						'in define': {
							'define1 中文': 'define1 zh in subtype'
						}
					}
				},
				'tw': {
					'DEFAULTS': {
						'define1 中文': 'define1 中文tw'
					}
				}
			};

		var lanArr = self.__TRANSLATE_LAN_JSON__ = [];
		if (LAN && LAN.split) {
			var lanKeys = LAN.split(',');
			for(var i = 0, len = lanKeys.length; i < len; i++) {
				var lanItem = __TRANSLATE_JSON__[lanKeys[i]];
				if (lanItem) lanArr.push(lanItem);
			}
		}
	}

	var lanArr = self.__TRANSLATE_LAN_JSON__,
		resultDefault, resultSubject;
	for(var i = 0, len = lanArr.length; i < len; i++) {
		var lanItem = lanArr[i];
		var subtypeJSON = subtype && lanItem.SUBTYPES && lanItem.SUBTYPES[subtype];
		resultSubject = subtypeJSON && subtypeJSON[msg];
		if (resultSubject) break;
		if (!resultDefault)
			resultDefault = lanItem.DEFAULTS && lanItem.DEFAULTS[msg];
	}

	var result = resultSubject || resultDefault;
	// Taking into account the use of the array that is empty,
	// so the need for mandatory conversion of the results data.
	if (result && result.join)
		return ''+result;
	else
		return result || msg;
}
````


[npm-image]: http://img.shields.io/npm/v/i18nc.svg
[downloads-image]: http://img.shields.io/npm/dm/i18nc.svg
[npm-url]: https://www.npmjs.org/package/i18nc
[travis-image]: http://img.shields.io/travis/Bacra/node-i18nc/master.svg?label=linux
[travis-url]: https://travis-ci.org/Bacra/node-i18nc
[appveyor-image]: https://img.shields.io/appveyor/ci/Bacra/node-i18nc/master.svg?label=windows
[appveyor-url]: https://ci.appveyor.com/project/Bacra/node-i18nc
[coveralls-image]: https://img.shields.io/coveralls/Bacra/node-i18nc.svg
[coveralls-url]: https://coveralls.io/github/Bacra/node-i18nc
[license-image]: http://img.shields.io/npm/l/i18nc.svg

