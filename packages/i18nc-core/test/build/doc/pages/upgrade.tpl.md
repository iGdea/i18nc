版本升级调整
==========

本文档会收集整理，版本升级导致的`参数` `事件` `返回值`调整。

 * 参数调整兼容所有版本（部分新特性的默认配置依然会影响到旧版本生成代码的表现）
 * 事件从 `v9.0` 开始规范
 * 返回值从 `v7.1` 开始规范

# 新老参数转换


## 转换对应表

$OPTIONS_SWITCH_TABLE_DATA


## 新旧改名对照表

$OPTIONS_RENAME_TABLE_DATA

**注意**

`I18NhandlerTpl_GetGlobalCode` `I18NhandlerTpl:GetGlobalCode` 转换的时候，
需要使用函数继续包裹（将`$GetLanguageCode`替换成原来的值）

```javascript
// 最新代码见 https://github.com/Bacra/i18nc-core/blob/master/lib/upgrade/tpl/depd_getlanguagecode_handler.js

function GetLanguageCodeHandler(cache)
{
  var g = cache.g || (cache.g = $GetLanguageCode);
  return g.$LanguageVars.name$;
}
```
