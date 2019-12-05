I18NC-LOADER
============

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][npm-url]
[![NPM License][license-image]][npm-url]

# Install

```
npm install i18nc-loader webpack --save-dev
```

# Useage

```javascript
module.exports = {
  entry: {'input': 'input.js'},
  output: {
    path: 'dist',
    filename: '[name].js',
  },
  module: {
    rules: [{
      test: /\.js$/,
      use: [{
        loader: 'i18nc-loader',
        options: {
          I18NHandlerName: 'weLANG'
        }
      }]
    }]
  }
};
```

# OPTIONS

You can pass [i18nc options](https://bacra.github.io/i18nc/?p=options)
using standard webpack [loader options](https://webpack.js.org/configuration/module/#useentry).

[npm-image]: http://img.shields.io/npm/v/i18nc-loader.svg
[downloads-image]: http://img.shields.io/npm/dm/i18nc-loader.svg
[npm-url]: https://www.npmjs.org/package/i18nc-loader
[license-image]: http://img.shields.io/npm/l/i18nc-loader.svg
