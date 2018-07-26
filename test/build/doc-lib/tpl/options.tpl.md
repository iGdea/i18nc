# 配置说明

> 文档宽度较大，注意左右滚动阅读

$OPTIONS_TABLE_DATA


## 一些补充说明

### proxyGlobalHandler.autoConvert

即使不使用`I18NHandler.style.codeStyle=proxyGlobalHandler`，
在开启`I18NHandler.style.proxyGlobalHandler.autoConvert`的情景下，
也可以使用如下写法，告诉工具，使用proxyGlobalHandler模式，生成I18N函数

```javascript
function I18N(msg)
{
	return ''+topI18NHandler(msg, arguments);
}
```

函数特点：

 * 使用`I18NHandler`（此处为`I18N`）命名函数
 * `return` 格式为 `''+`开头，后面跟一个函数调用（此处为`topI18NHandler`函数）
 * `topI18NHandler` 函数第一个参数为`I18NHandler`函数的第一个参数（此处为`msg`）


### fullHandler.autoConvert

即使不使用`I18NHandler.style.codeStyle=fullHandler`，
在开启`I18NHandler.style.fullHandler.autoConvert`的情景下，
也可以使用如下写法，告诉工具，使用fullHandler模式，生成I18N函数

```javascript
function I18N(msg)
{
	return ''+msg;
}
```

函数提点：

 * 使用`I18NHandler`（此处为`I18N`）命名函数
 * `return` 格式为 `''+`开头，后面跟一个变量（此处为`msg`）
 * 变量`msg`同时为`I18NHandler`函数的第一个参数




# 配置关联性

下面的配置，当左边设置之后，右边会强制设置成想要的值，以确保逻辑的合理性

$OPTIONS_LINK_TABLE_DATA
