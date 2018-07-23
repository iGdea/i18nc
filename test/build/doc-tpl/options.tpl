## 函数配置

> 文档宽度较大，注意左右滚动阅读

$TABLE_DATA


## 特别说明

### proxyGlobalHandler.enable

即使不使用此参数，也可以使用如下写法，告诉工具，使用proxyGlobalHandler模式，生成I18N函数

```javascript
function I18N(msg){return ''+topI18NHandler(msg, arguments);}
```

同时，

 * 此配置只会影响没有进行插装的源码，如果要全部更新，需要配置 `upgrade.partial = false`
