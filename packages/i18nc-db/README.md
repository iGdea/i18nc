I18NC-PO
==================


[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][npm-url]
[![NPM License][license-image]][npm-url]

# Install

```
npm install i18nc-po --save
```

# Usage

```javascript
var fs = require('fs');
var i18nc = require('i18nc-core');
var i18ncPO = require('i18nc-po');
var ret = i18nc(code, options);

i18ncPO.create(ret);    // return content of pot and po

var poContent = fs.readFileSync('en-US.po').toString();
i18ncPO.parse(poContent);      // return dbTranslateWords for i18nc-core
```


[npm-image]: https://img.shields.io/npm/v/i18nc-po.svg
[downloads-image]: https://img.shields.io/npm/dm/i18nc-po.svg
[npm-url]: https://www.npmjs.org/package/i18nc-po
[license-image]: https://img.shields.io/npm/l/i18nc-po.svg
