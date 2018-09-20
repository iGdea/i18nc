完整参数说明
==========

> 文档宽度较大，注意左右滚动阅读

<style>
.main-content {
	max-width: none !important;
	padding: 2rem !important;
	font-size: 1rem !important;
}

.main-content table th {
	font-size: 1rem;
}
.main-content table td {
	font-size: 0.9rem;
}
.main-content table.table_big {
	word-break: unset;
}
.main-content .table_big td {
	font-size: 0.8rem;
	padding: 0.5rem 0.4rem;
}
</style>


<table class="table_big table_options">
	<tr>
		<th colspan="4">变量</th>
		<th>类型</th>
		<th>默认值</th>
		<th class="table_options_desc">描述</th>
		<th class="table_options_remark">备注</th>
	</tr>
	<tr><td colspan="4">I18NHandlerAlias</td><td>Array</td><td></td><td class="table_options_desc">I18NHandlerName的别名</td><td class="table_options_remark">I18NHandlerAlias优先级比ignoreScanHandlerNames低</td></tr>
	<tr><td colspan="4">I18NHandlerName</td><td>String</td><td>I18N</td><td class="table_options_desc">插入和运行时包裹的函数名</td><td class="table_options_remark"></td></tr>
	<tr><td colspan="4">cutwordReg</td><td>RegExp|null</td><td>排除所有ascii字符的正则</td><td class="table_options_desc">提取分词的正则</td><td class="table_options_remark"></td></tr>
	<tr><td colspan="4">dbTranslateWords</td><td>Object</td><td>null</td><td class="table_options_desc">外部导入的翻译数据</td><td class="table_options_remark"></td></tr>
	<tr><td colspan="4">depdEnable</td><td>Boolean</td><td>true</td><td class="table_options_desc">是否开启向前版本兼容逻辑</td><td class="table_options_remark">向前兼容需要消耗一定的计算资源和时间，建议按照提示修改成最新的配置和接口</td></tr>
	<tr><td colspan="4">ignoreScanHandlerNames</td><td>Object|Array</td><td>console.xxxx</td><td class="table_options_desc">这些函数里面的调用或则声明，不进行扫描</td><td class="table_options_remark">函数名带有.，表示对成员方法的调用</td></tr>
	<tr><td colspan="4">pluginEnabled</td><td>Object|Array</td><td></td><td class="table_options_desc">当前安装和启用的插件</td><td class="table_options_remark">空数据则关闭所有，空对象则使用默认</td></tr>
	<tr><td colspan="4">pluginSettings</td><td>Object</td><td></td><td class="table_options_desc">插件的配置</td><td class="table_options_remark"></td></tr>
	<tr><td colspan="4">codeModifyItems</td><td>Object|Array</td><td></td><td class="table_options_desc">设置操作的源码可修改的内容</td><td class="table_options_remark">空数据则关闭所有，空对象则使用默认</td></tr>
	<tr><td rowspan="3"></td><td colspan="3">I18NHandlerAlias</td><td>Boolean</td><td>true</td><td class="table_options_desc">将I18NHandlerAlias替换成I18NHandlerName</td><td class="table_options_remark"></td></tr>
	<tr><td colspan="3">TranslateWord</td><td>Boolean</td><td>true</td><td class="table_options_desc">将提取的需要翻译的关键字，使用I18N函数包裹起来</td><td class="table_options_remark"></td></tr>
	<tr><td colspan="3">TranslateWord_RegExp</td><td>Boolean</td><td>false</td><td class="table_options_desc">同TranslateWord，RegExp类型的开关</td><td class="table_options_remark"></td></tr>
	<tr><td colspan="4">events</td><td>Object</td><td></td><td class="table_options_desc">面向定制化的监听事件</td><td class="table_options_remark"></td></tr>
	<tr><td rowspan="5"></td><td colspan="3">assignLineStrings</td><td>Function</td><td>null</td><td class="table_options_desc">将分词结果绑定ast时触发，可调整分词和ast的对应关系</td><td class="table_options_remark"></td></tr>
	<tr><td colspan="3">beforeScan</td><td>Function</td><td>null</td><td class="table_options_desc">逐步扫描源码ast树时触发，可对ast结构进行预处理&判断</td><td class="table_options_remark"></td></tr>
	<tr><td colspan="3">cutword</td><td>Function</td><td>null</td><td class="table_options_desc">分词之后触发，可对分词结果进行优化</td><td class="table_options_remark"></td></tr>
	<tr><td colspan="3">loadTranslateJSON</td><td>Function</td><td>null</td><td class="table_options_desc">从源码I18N函数体中提取到翻译数据时触发，可修改数据</td><td class="table_options_remark"></td></tr>
	<tr><td colspan="3">newTranslateJSON</td><td>Function</td><td>null</td><td class="table_options_desc">生成新的I18N函数时触发，可对翻译数据进行再加工</td><td class="table_options_remark"></td></tr>
	<tr><td colspan="4">I18NHandler</td><td>Object</td><td></td><td class="table_options_desc">注入到代码中的I18N函数的定制化配置</td><td class="table_options_remark"></td></tr>
	<tr><td rowspan="28"></td><td>data</td><td colspan="2">defaultFileKey</td><td>String</td><td>*</td><td class="table_options_desc">函数默认标识，可标识出特定的I18N函数体</td><td class="table_options_remark">可以针对filekey，可以提供定制翻译结果</td></tr>
	<tr><td rowspan="2"></td><td colspan="2">ignoreFuncWords</td><td>Boolean</td><td>false</td><td class="table_options_desc">翻译的时候，不参考代码中I18N里面的数据</td><td class="table_options_remark">启动后，如果dbTranslateWords没有数据，直接删除在I18N已有的翻译</td></tr>
	<tr><td colspan="2">onlyTheseLanguages</td><td>Array</td><td></td><td class="table_options_desc">只打包这个列表的语言包到代码中</td><td class="table_options_remark">数组为空则不受限制，传入多少种语言，就打包多少种</td></tr>
	<tr><td>insert</td><td colspan="2">checkClosure</td><td>Boolean</td><td>true</td><td class="table_options_desc">插入I18N函数前，检查插入位置，作用域不能是全局，必须闭包</td><td class="table_options_remark"></td></tr>
	<tr><td rowspan="2"></td><td colspan="2">enable</td><td>Boolean</td><td>true</td><td class="table_options_desc">[总开关]是否插入新的I18N函数</td><td class="table_options_remark"></td></tr>
	<tr><td colspan="2">priorityDefineHalder</td><td>Boolean</td><td>true</td><td class="table_options_desc">优先将新的I18N函数插入到define函数体中</td><td class="table_options_remark"></td></tr>
	<tr><td>upgrade</td><td colspan="2">checkVersion</td><td>Boolean</td><td>true</td><td class="table_options_desc">函数版本号不同的时候，是否更新整个函数体</td><td class="table_options_remark"></td></tr>
	<tr><td rowspan="3"></td><td colspan="2">enable</td><td>Boolean</td><td>true</td><td class="table_options_desc">[总开关]能否更新已插入代码中I18N函数体</td><td class="table_options_remark">已经初始化的I18N函数，不会主动更新</td></tr>
	<tr><td colspan="2">partial</td><td>Boolean</td><td>true</td><td class="table_options_desc">优先进行I18N函数的局部更新（只更新翻译数据）</td><td class="table_options_remark">是否能进行局部更新，受到众多因素影响，这只是一个开关</td></tr>
	<tr><td colspan="2">updateJSON</td><td>Boolean</td><td>true</td><td class="table_options_desc">是否更新代码中的翻译结果JSON</td><td class="table_options_remark">此配置只影响输出代码的结果，不会影响输出的JSON结果</td></tr>
	<tr><td>style</td><td colspan="2">codeStyle</td><td>String</td><td>fullHandler</td><td class="table_options_desc">优先使用的代码风格（fullHandler/proxyGlobalHandler）</td><td class="table_options_remark"></td></tr>
	<tr><td rowspan="11"></td><td colspan="2">comment4nowords</td><td>Boolean</td><td>true</td><td class="table_options_desc">翻译结果JSON，输出所有提取到的关键字；没有翻译结果的关键字，以注释的形式插入</td><td class="table_options_remark"></td></tr>
	<tr><td colspan="2">minFuncCode</td><td>Boolean</td><td>false</td><td class="table_options_desc">对插入的I18N进行代码压缩</td><td class="table_options_remark"></td></tr>
	<tr><td colspan="2">minFuncJSON</td><td>Boolean</td><td>false</td><td class="table_options_desc">对插入到代码中的翻译结果JSON进行代码压缩</td><td class="table_options_remark">设置true，会导致 I18NHandler.style.comment4nowords 失效</td></tr>
	<tr><td colspan="2">fullHandler</td><td>Object</td><td></td><td class="table_options_desc">插入完整的I18N函数体，代码不依赖外部任何库或者函数</td><td class="table_options_remark"></td></tr>
	<tr><td rowspan="2"></td><td>autoConvert</td><td>Boolean</td><td>true</td><td class="table_options_desc">将源码中类fullHandler写法的I18N函数，转换为标准的fullHandler</td><td class="table_options_remark"></td></tr>
	<tr><td>keepThisStyle</td><td>Boolean</td><td>true</td><td class="table_options_desc">已经转的函数，是否维持此状态</td><td class="table_options_remark">权重高于autoConvert</td></tr>
	<tr><td colspan="2">proxyGlobalHandler</td><td>Object</td><td></td><td class="table_options_desc">在I18N函数体内，调用外部函数，代替插入过多代码的方式</td><td class="table_options_remark"></td></tr>
	<tr><td rowspan="4"></td><td>autoConvert</td><td>Boolean</td><td>true</td><td class="table_options_desc">将源码中类proxyGlobal写法的I18N函数，转换为标准的proxyGlobalHandler</td><td class="table_options_remark"></td></tr>
	<tr><td>ignoreFuncCodeName</td><td>Boolean</td><td>false</td><td class="table_options_desc">忽略源代码中解析出来的外部函数名，强制使用配置的函数名</td><td class="table_options_remark">如果原来有值，但不同，会触发更新；原来没有，则不会进行更新</td></tr>
	<tr><td>keepThisStyle</td><td>Boolean</td><td>true</td><td class="table_options_desc">已经转的函数，是否维持此状态</td><td class="table_options_remark">权重高于autoConvert</td></tr>
	<tr><td>name</td><td>String</td><td>topI18N</td><td class="table_options_desc">调用的外部函数名</td><td class="table_options_remark"></td></tr>
	<tr><td>tpl</td><td colspan="2">getLanguageCode</td><td>String|Function</td><td></td><td class="table_options_desc">I18N函数体中，获取当前语言包的JS业务代码</td><td class="table_options_remark"></td></tr>
	<tr><td rowspan="5"></td><td colspan="2">newFooterCode</td><td>String</td><td>/* eslint-enable */</td><td class="table_options_desc">新插入的I18N函数外包裹的内容-结束部分</td><td class="table_options_remark"></td></tr>
	<tr><td colspan="2">newHeaderCode</td><td>String</td><td>/* eslint-disable */</td><td class="table_options_desc">新插入的I18N函数外包裹的内容-开始部分</td><td class="table_options_remark"></td></tr>
	<tr><td colspan="2">languageVars</td><td>Object</td><td></td><td class="table_options_desc">getLanguageCode中可替换$LanguageVars.xxxx$的变量</td><td class="table_options_remark"></td></tr>
	<tr><td rowspan="2"></td><td>cookie</td><td>String</td><td>proj.i18n_lan</td><td class="table_options_desc">获取语言包通用变量-cookie版</td><td class="table_options_remark"></td></tr>
	<tr><td>name</td><td>String</td><td>__i18n_lan__</td><td class="table_options_desc">获取语言包通用变量</td><td class="table_options_remark"></td></tr>
</table>
