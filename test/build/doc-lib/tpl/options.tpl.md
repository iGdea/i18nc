## 配置说明

> 文档宽度较大，注意左右滚动阅读

$OPTIONS_TABLE_DATA


### 一些补充说明

### proxyGlobalHandler

即使不使用`I18NHandler.style.codeStyle=proxyGlobalHandler`，
也可以使用如下写法，告诉工具，使用proxyGlobalHandler模式，生成I18N函数

```javascript
function I18N(msg){return ''+topI18NHandler(msg, arguments);}
```



## 配置关联性

下面的配置，当左边设置之后，右边会强制设置成想要的值，以确保逻辑的合理性

$OPTIONS_LINK_TABLE_DATA
