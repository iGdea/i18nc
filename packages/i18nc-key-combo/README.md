I18NC-KEY-COMBO
================


[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][npm-url]
[![NPM License][license-image]][npm-url]

# Install

```
npm install i18nc i18nc-key-combo --save
```

# Usage

```javascript
var i18nc = require('i18nc');
require('i18nc-key-combo')(i18nc);

var info = i18nc('"中文"+11+I18N("词典")',
{
  pluginEnabled: {keyCombo: true},
  pluginSettings: {keyComboMode: 'I18N'}
});

console.log(info.code);  // I18N('中文11词典')
```


[npm-image]: https://img.shields.io/npm/v/i18nc-key-combo.svg
[downloads-image]: https://img.shields.io/npm/dm/i18nc-key-combo.svg
[npm-url]: https://www.npmjs.org/package/i18nc-key-combo
[license-image]: https://img.shields.io/npm/l/i18nc-key-combo.svg
