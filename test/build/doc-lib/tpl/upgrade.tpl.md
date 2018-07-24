

## 新老参数转换


### 转换对应表

$OPTIONS_SWITCH_TABLE_DATA


#### 新旧改名对照表

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
