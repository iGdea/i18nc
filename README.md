I18NC-CORE
==================


[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Coveralls][coveralls-image]][coveralls-url]
[![NPM License][license-image]][npm-url]

# Install
```
npm install i18nc-core --save
```

# Useage

```
var i18nc = require('i18nc-core');
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
var word = "中文1";
define(function()
{
  var word = "中文2";
  var word = I18N('中文', 'sub type');
});

var word = '简体';
var word = I18N('中文');
function I18N(){}
```

### Output Code

```
var word = I18N('中文1');
define(function()
{
  var word = I18N('中文2');
  var word = I18N('中文', 'sub type');
});

var word = I18N('简体');
var word = I18N('中文');
function I18N(msg, subtype) {
  ....
}
```

Replace `I18N` handler code:

```
function I18N(msg, subtype) {
  var self = I18N;
  var GLOBAL = self.__GLOBAL__ || (self.__GLOBAL__ = window.settings) || {};
  var LAN = GLOBAL.__i18n_lan__;
  if (!LAN) return msg;

  if (self.__TRANSLATE_LAN__ != LAN) {
    self.__TRANSLATE_LAN__ = LAN;
    var __FILE_KEY__ = "default_file_key";
    var __FUNCTION_VERSION__ = 2;

    var __TRANSLATE_JSON__ = {
        'en': {
          'DEFAULTS': {'中文1': 'zh1', '中文2': 'zh2'},
          'SUBTYPES': {'sub type': {'中文': 'zh in subtype'}}
        },
        'tw': {'DEFAULTS': {'简体': '簡體'}}
      };

    var lanArr = self.__TRANSLATE_LAN_JSON__ = [];
    ...
    lanArr.push(__TRANSLATE_JSON__.xxx);
  }

  var lanArr = self.__TRANSLATE_LAN_JSON__;
  var result;
  for(var i = 0, len = lanArr.length; i < len; i++) {
    ....
    if (result) break;
  }

  ....
  return result || msg;
}
```


[npm-image]: http://img.shields.io/npm/v/i18nc-core.svg
[downloads-image]: http://img.shields.io/npm/dm/i18nc-core.svg
[npm-url]: https://www.npmjs.org/package/i18nc-core
[travis-image]: http://img.shields.io/travis/Bacra/node-i18nc-core/master.svg?label=linux
[travis-url]: https://travis-ci.org/Bacra/node-i18nc-core
[appveyor-image]: https://img.shields.io/appveyor/ci/Bacra/node-i18nc-core/master.svg?label=windows
[appveyor-url]: https://ci.appveyor.com/project/Bacra/node-i18nc-core
[coveralls-image]: https://img.shields.io/coveralls/Bacra/node-i18nc-core.svg
[coveralls-url]: https://coveralls.io/github/Bacra/node-i18nc-core
[license-image]: http://img.shields.io/npm/l/i18nc-core.svg
