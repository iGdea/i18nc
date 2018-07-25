# 配置说明

> 文档宽度较大，注意左右滚动阅读

<table>
	<tr>
		<th colspan="4">变量</th>
		<th>类型</th>
		<th>默认值</th>
		<th>描述</th>
		<th>备注</th>
	</tr>
	<tr><td colspan="4">I18NHandlerAlias</td><td>Array</td><td></td><td>I18NHandlerName的别名</td><td>I18NHandlerAlias优先级比ignoreScanHandlerNames低</td></tr>
	<tr><td colspan="4">I18NHandlerName</td><td>String</td><td>I18N</td><td>插入和运行时包裹的函数名</td><td></td></tr>
	<tr><td colspan="4">cutwordReg</td><td>RegExp|null</td><td>排除所有ascii字符的正则</td><td>分词的正则</td><td></td></tr>
	<tr><td colspan="4">dbTranslateWords</td><td>Object</td><td>null</td><td>导入的翻译数据</td><td></td></tr>
	<tr><td colspan="4">depdEnable</td><td>Boolean</td><td>true</td><td>是否向前兼容逻辑</td><td></td></tr>
	<tr><td colspan="4">ignoreScanHandlerNames</td><td>Object|Array</td><td>console.xxxx</td><td>这些函数里面的调用，或则声明不进行扫描</td><td>函数名带有.，表示对成员方法的调用</td></tr>
	<tr><td colspan="4">pluginEnabled</td><td>Object|Array</td><td></td><td>启用的插件</td><td>空数据则关闭所有，空对象则使用默认</td></tr>
	<tr><td colspan="4">pluginSettings</td><td>Object</td><td></td><td>插件配置</td><td></td></tr>
	<tr><td>I18NHandler</td><td colspan="3"></td><td>Object</td><td></td><td>注入到代码中的I18N函数的一些配置</td><td></td></tr>
	<tr><td rowspan="28"></td><td>data</td><td colspan="2">defaultFileKey</td><td>String</td><td>*</td><td>翻译代码默认标识key</td><td>可以针对filekey，打包定制翻译结果</td></tr>
	<tr><td rowspan="3"></td><td colspan="2">defaultLanguage</td><td>String</td><td>en-US</td><td>当没有找到任何语言包 & 启动了 I18NHandler.style.comment4nowords, 使用这个语言，作为代码中的语言包</td><td></td></tr>
	<tr><td colspan="2">ignoreFuncWords</td><td>Boolean</td><td>false</td><td>翻译的时候，不参考代码中I18N里面的数据</td><td>启动后，如果dbTranslateWords没有数据，直接删除翻译</td></tr>
	<tr><td colspan="2">onlyTheseLanguages</td><td>Array</td><td></td><td>只打包这个列表内语言包到代码中</td><td>数组为空则不受限制</td></tr>
	<tr><td>insert</td><td colspan="2">checkClosure</td><td>Boolean</td><td>true</td><td>插入I18N函数前，检查所在位置，必须闭包</td><td></td></tr>
	<tr><td rowspan="2"></td><td colspan="2">enable</td><td>Boolean</td><td>true</td><td>是否插入新的I18N函数</td><td></td></tr>
	<tr><td colspan="2">priorityDefineHalder</td><td>Boolean</td><td>true</td><td>新的I18N函数优先插入到define函数</td><td></td></tr>
	<tr><td>style</td><td colspan="2">codeStyle</td><td>String</td><td>fullHandler</td><td>优先使用的代码风格（fullHandler/proxyGlobalHandler）</td><td></td></tr>
	<tr><td rowspan="10"></td><td colspan="2">comment4nowords</td><td>Boolean</td><td>true</td><td>在源代码中，输出所有提取的关键字中，没有翻译结果的关键字，以注释的形式插入</td><td></td></tr>
	<tr><td>fullHandler</td><td>autoConvert</td><td>Boolean</td><td>true</td><td>将源码中类fullHandler写法的I18N函数，转换为标准的fullHandler</td><td></td></tr>
	<tr><td></td><td>keepThisStyle</td><td>Boolean</td><td>true</td><td>已经转的函数，是否维持此状态</td><td>权重高于autoConvert</td></tr>
	<tr><td colspan="2">minFuncCode</td><td>Boolean</td><td>false</td><td>对插入的I18N进行代码压缩</td><td></td></tr>
	<tr><td colspan="2">minFuncJSON</td><td>Boolean</td><td>false</td><td>压缩插入到代码中的翻译结果JSON</td><td>设置true，会导致</td></tr>
	<tr><td>proxyGlobalHandler</td><td></td><td>Object</td><td></td><td>在I18N函数体内，调用外部函数，代替插入过多代码的方式</td><td></td></tr>
	<tr><td rowspan="4"></td><td>autoConvert</td><td>Boolean</td><td>true</td><td>将源码中类proxyGlobal写法的I18N函数，转换为标准的proxyGlobalHandler</td><td></td></tr>
	<tr><td>ignoreFuncCodeName</td><td>Boolean</td><td>false</td><td>忽略源代码中解析出来的外部函数名，强制使用配置的函数名</td><td>如果原来有值，但不同，会触发更新；原来没有，则不会进行更新</td></tr>
	<tr><td>keepThisStyle</td><td>Boolean</td><td>true</td><td>已经转的函数，是否维持此状态</td><td>权重高于autoConvert</td></tr>
	<tr><td>name</td><td>String</td><td>topI18N</td><td>调用的外部函数名</td><td></td></tr>
	<tr><td>tpl</td><td colspan="2">getLanguageCode</td><td>String|Function</td><td></td><td>js代码中，获取当前语言包的代码</td><td></td></tr>
	<tr><td rowspan="5"></td><td>languageVars</td><td></td><td>Object</td><td></td><td>getLanguageCode中可替换$LanguageVars.xxxx$的变量</td><td></td></tr>
	<tr><td rowspan="2"></td><td>cookie</td><td>String</td><td>proj.i18n_lan</td><td>获取语言包通用变量-cookie版</td><td></td></tr>
	<tr><td>name</td><td>String</td><td>__i18n_lan__</td><td>获取语言包通用变量</td><td></td></tr>
	<tr><td colspan="2">newFooterCode</td><td>String</td><td>/* eslint-enable */</td><td>新插入的I18N函数外包裹的内容-结束部分</td><td></td></tr>
	<tr><td colspan="2">newHeaderCode</td><td>String</td><td>/* eslint-disable */</td><td>新插入的I18N函数外包裹的内容-开始部分</td><td></td></tr>
	<tr><td>upgrade</td><td colspan="2">checkVersion</td><td>Boolean</td><td>true</td><td>函数版本号不同的时候，是否更新函数体</td><td></td></tr>
	<tr><td rowspan="3"></td><td colspan="2">enable</td><td>Boolean</td><td>true</td><td>能否更新已插入代码中I18N函数体的总开关</td><td>已经初始化的I18N函数，不会主动更新</td></tr>
	<tr><td colspan="2">partial</td><td>Boolean</td><td>true</td><td>对I18N函数优先进行局部更新（只更新翻译数据）</td><td></td></tr>
	<tr><td colspan="2">updateJSON</td><td>Boolean</td><td>true</td><td>是否更新代码中的翻译结果JSON</td><td>此配置只影响输出代码的结果，不会影响输出的JSON结果</td></tr>
	<tr><td>codeModifyItems</td><td colspan="3"></td><td>Object|Array</td><td></td><td>设置可修改的源码类型</td><td>空数据则关闭所有，空对象则使用默认</td></tr>
	<tr><td rowspan="3"></td><td colspan="3">I18NHandlerAlias</td><td>Boolean</td><td>true</td><td>将I18NHandlerAlias统一成I18NHandlerName</td><td></td></tr>
	<tr><td colspan="3">TranslateWord</td><td>Boolean</td><td>true</td><td>将分词的结果，用I18N函数包裹起来</td><td></td></tr>
	<tr><td colspan="3">TranslateWord_RegExp</td><td>Boolean</td><td>false</td><td>TranslateWord中的RegExp类型</td><td></td></tr>
	<tr><td>events</td><td colspan="3"></td><td>Object</td><td></td><td>可监听的事件</td><td></td></tr>
	<tr><td rowspan="5"></td><td colspan="3">assignLineStrings</td><td>Function</td><td>null</td><td>将分词结果绑定ast时触发，可调整分词和ast的对应关系</td><td></td></tr>
	<tr><td colspan="3">beforeScan</td><td>Function</td><td>null</td><td>逐步扫描源码ast树时触发，可对ast结构进行预处理&判断</td><td></td></tr>
	<tr><td colspan="3">cutword</td><td>Function</td><td>null</td><td>分词之后触发，可对分词结果进行优化</td><td></td></tr>
	<tr><td colspan="3">loadTranslateJSON</td><td>Function</td><td>null</td><td>从源码I18N函数体中提取到翻译数据时触发，可修改数据</td><td></td></tr>
	<tr><td colspan="3">newTranslateJSON</td><td>Function</td><td>null</td><td>生成新的I18N函数时触发，可对翻译数据进行再加工</td><td></td></tr>
</table>


## 一些补充说明

### proxyGlobalHandler.autoConvert

即使不使用`I18NHandler.style.codeStyle=proxyGlobalHandler`，
在开启`I18NHandler.style.proxyGlobalHandler.autoConvert`的情景下，
也可以使用如下写法，告诉工具，使用proxyGlobalHandler模式，生成I18N函数

```javascript
function I18N(msg){return ''+topI18NHandler(msg, arguments);}
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
function I18N(msg){return ''+msg;}
```

函数提点：

 * 使用`I18NHandler`（此处为`I18N`）命名函数
 * `return` 格式为 `''+`开头，后面跟一个变量（此处为`msg`）
 * 变量`msg`同时为`I18NHandler`函数的第一个参数




# 配置关联性

下面的配置，当左边设置之后，右边会强制设置成想要的值，以确保逻辑的合理性

<table>
	<tr>
		<th colspan="2">当此配置为</th>
		<th>将强制设置成</th>
	</tr>
	<tr><td colspan="2"><code>I18NHandler.style.fullHandler.keepThisStyle</code> = <code>false</code></td><td><code>I18NHandler.style.fullHandler.autoConvert</code> = <code>false</code></td></tr>
	<tr><td colspan="2"><code>I18NHandler.style.minFuncJSON</code> = <code>true</code></td><td><code>I18NHandler.style.comment4nowords</code> = <code>false</code></td></tr>
	<tr><td colspan="2"><code>I18NHandler.style.proxyGlobalHandler.keepThisStyle</code> = <code>false</code></td><td><code>I18NHandler.style.proxyGlobalHandler.autoConvert</code> = <code>false</code></td></tr>
	<tr><td rowspan="2"><code>I18NHandler.style.codeStyle</code></td><td><code>fullHandler</code></td><td><code>I18NHandler.style.fullHandler.keepThisStyle</code> = <code>true</code></td></tr>
	<tr><td><code>proxyGlobalHandler</code></td><td><code>I18NHandler.style.proxyGlobalHandler.keepThisStyle</code> = <code>true</code></td></tr>
</table>
