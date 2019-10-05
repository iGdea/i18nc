I18NC-KEY-TRIM
===============


[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][npm-url]
[![NPM License][license-image]][npm-url]

# Install

```
npm install i18nc i18nc-key-trim --save
```

# Useage

```javascript
var i18nc = require('i18nc');
require('i18nc-key-trim')(i18nc);

var info = i18nc('var str="<span> 中文 词典 </span>"', {pluginEnabled: {keyTrim: true}});
console.log(info.code);  // var str='<span> '+I18N('中文 词典')+' </span>';
```

[npm-image]: https://img.shields.io/npm/v/i18nc-key-trim.svg
[downloads-image]: https://img.shields.io/npm/dm/i18nc-key-trim.svg
[npm-url]: https://www.npmjs.org/package/i18nc-key-trim
[license-image]: https://img.shields.io/npm/l/i18nc-key-trim.svg
