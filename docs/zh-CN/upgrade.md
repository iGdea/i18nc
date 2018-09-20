版本升级调整
==========

本文档会收集整理，版本升级导致的`参数` `事件` `返回值`调整。

 * 参数调整兼容所有版本（部分新特性的默认配置依然会影响到旧版本生成代码的表现）
 * 事件从 `v9.0` 开始规范
 * 返回值从 `v7.1` 开始规范

# 新老参数转换


## 转换对应表

<table>
	<tr>
		<th colspan="2">老配置</th>
		<th>新配置</th>
	</tr>
	<tr><td colspan="2"><code>I18NHandler.style.proxyGlobalHandler.enable</code> = <code>true</code></td><td><code>I18NHandler.style.codeStyle</code> = <code>proxyGlobalHandler</code></td></tr>
	<tr><td colspan="2"><code>isProxyGlobalHandler</code> = <code>true</code></td><td><code>I18NHandler.style.codeStyle</code> = <code>proxyGlobalHandler</code></td></tr>
	<tr><td rowspan="2"><code>isMinFuncTranslateCode</code></td><td><code>false</code></td><td><code>I18NHandler.style.minFuncCode</code> = <code>true</code><br/><code>I18NHandler.style.minFuncJSON</code> = <code>false</code></td></tr>
	<tr><td><code>true</code></td><td><code>I18NHandler.style.minFuncCode</code> = <code>true</code><br/><code>I18NHandler.style.minFuncJSON</code> = <code>true</code></td></tr>
	<tr><td rowspan="3"><code>minTranslateFuncCode</code></td><td><code>all</code></td><td><code>I18NHandler.style.minFuncCode</code> = <code>true</code><br/><code>I18NHandler.style.minFuncJSON</code> = <code>true</code></td></tr>
	<tr><td><code>none</code></td><td><code>I18NHandler.style.minFuncCode</code> = <code>false</code><br/><code>I18NHandler.style.minFuncJSON</code> = <code>false</code></td></tr>
	<tr><td><code>onlyFunc</code></td><td><code>I18NHandler.style.minFuncCode</code> = <code>true</code><br/><code>I18NHandler.style.minFuncJSON</code> = <code>false</code></td></tr>
</table>


## 新旧改名对照表

|                                               老版本 | 新版本                                                   |
|----------------------------------------------------:|:--------------------------------------------------------|
| I18NHandler.style.proxyGlobalHandler.ignoreFuncCode | I18NHandler.style.proxyGlobalHandler.ignoreFuncCodeName |
|                         I18NHandler.upgrade.version | I18NHandler.upgrade.checkVersion                        |
|                      I18NHandlerTPL_GetLanguageCode | I18NHandler.tpl.getLanguageCode                         |
|                         I18NHandlerTPL_LanguageVars | I18NHandler.tpl.languageVars                            |
|                        I18NHandlerTPL_NewFooterCode | I18NHandler.tpl.newFooterCode                           |
|                        I18NHandlerTPL_NewHeaderCode | I18NHandler.tpl.newHeaderCode                           |
|                        I18NhandlerTpl:GetGlobalCode | I18NHandler.tpl.getLanguageCode                         |
|                      I18NhandlerTpl:LanguageVarName | I18NHandler.tpl.languageVars.name                       |
|                        I18NhandlerTpl_GetGlobalCode | I18NHandler.tpl.getLanguageCode                         |
|                      I18NhandlerTpl_GetLanguageCode | I18NHandler.tpl.getLanguageCode                         |
|                      I18NhandlerTpl_LanguageVarName | I18NHandler.tpl.languageVars.name                       |
|                         I18NhandlerTpl_LanguageVars | I18NHandler.tpl.languageVars                            |
|                        I18NhandlerTpl_NewFooterCode | I18NHandler.tpl.newFooterCode                           |
|                        I18NhandlerTpl_NewHeaderCode | I18NHandler.tpl.newHeaderCode                           |
|                                   assignLineStrings | events.assignLineStrings                                |
|                                          beforeScan | events.beforeScan                                       |
|                                    codeModifiedArea | codeModifyItems                                         |
|                        codeModifiedArea.I18NHandler | I18NHandler.upgrade.enable                              |
|                                          cutWordReg | cutwordReg                                              |
|                                             cutword | events.cutword                                          |
|                                      defaultFileKey | I18NHandler.data.defaultFileKey                         |
|                                         handlerName | I18NHandlerName                                         |
|                     isCheckClosureForNewI18NHandler | I18NHandler.insert.checkClosure                         |
|                           isClosureWhenInsertedHead | I18NHandler.insert.checkClosure                         |
|                  isIgnoreCodeProxyGlobalHandlerName | I18NHandler.style.proxyGlobalHandler.ignoreFuncCodeName |
|                   isIgnoreI18NHandlerTranslateWords | I18NHandler.data.ignoreFuncWords                        |
|                           isInjectAllTranslateWords | I18NHandler.style.comment4nowords                       |
|                              isInsertToDefineHalder | I18NHandler.insert.priorityDefineHalder                 |
|                                     isPartialUpdate | I18NHandler.upgrade.partial                             |
|                                   loadTranslateJSON | events.loadTranslateJSON                                |
|                                    newTranslateJSON | events.newTranslateJSON                                 |
|                                   pickFileLanguages | I18NHandler.data.onlyTheseLanguages                     |
|                              proxyGlobalHandlerName | I18NHandler.style.proxyGlobalHandler.name               |

**注意**

`I18NhandlerTpl_GetGlobalCode` `I18NhandlerTpl:GetGlobalCode` 转换的时候，
需要使用函数继续包裹（将`$GetLanguageCode`替换成原来的值）

```javascript
// 最新代码见 https://github.com/Bacra/node-i18nc-core/blob/master/lib/upgrade/tpl/depd_getlanguagecode_handler.js

function GetLanguageCodeHandler(cache)
{
  var g = cache.g || (cache.g = $GetLanguageCode);
  return g.$LanguageVars.name$;
}
```
