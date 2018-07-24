

## 废弃特性说明


### Options 参数调整

#### minTranslateFuncCode

设置为 `all`，对应新配置

 * `I18NHandler.style.minFuncCode` = `true`
 * `I18NHandler.style.minFuncJSON` = `true`

设置为 `onlyFunc`，对应新配置

 * `I18NHandler.style.minFuncCode` = `true`
 * `I18NHandler.style.minFuncJSON` = `false`

设置为 `none`，对应新配置

 * `I18NHandler.style.minFuncCode` = `false`
 * `I18NHandler.style.minFuncJSON` = `false`


#### isMinFuncTranslateCode

设置为 `true`，对应新配置

 * `I18NHandler.style.minFuncCode` = `true`
 * `I18NHandler.style.minFuncJSON` = `true`

设置为 `false`，对应新配置

 * `I18NHandler.style.minFuncCode` = `false`
 * `I18NHandler.style.minFuncJSON` = `true`


#### 参数名新旧对照表

$OPTIONS_RENAME_TABLE_DATA

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
