I18NC-KEY-CLEAR
================


[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][npm-url]
[![NPM License][license-image]][npm-url]

# Install

```
npm install i18nc i18nc-key-clear --save
```

# Usage

```javascript
var i18nc = require('i18nc');
require('i18nc-key-clear')(i18nc);

var info = i18nc('var str="中文<!--注释-->词典"', {pluginEnabled: {keyClear: true}});
console.log(info.code);  // var str=I18N('中文词典');
```


[npm-image]: https://img.shields.io/npm/v/i18nc-key-clear.svg
[downloads-image]: https://img.shields.io/npm/dm/i18nc-key-clear.svg
[npm-url]: https://www.npmjs.org/package/i18nc-key-clear
[license-image]: https://img.shields.io/npm/l/i18nc-key-clear.svg
