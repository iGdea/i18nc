I18N函数风格
============


## 完整模式

```javascript
function I18N(msg, tpldata, subtype)
{
	var self = I18N;
	var data = self.$ || (self.$ = {});
	var LAN = (function(){return global.__i18n_lan__})(data);
	if (!tpldata || !tpldata.join)
	{
		subtype = tpldata;
		tpldata = [];
	}

	if (LAN && LAN.split)
	{
		var lanArr, i, len, lanItem;
		if (self.L != LAN)
		{
			self.K = 'i18n_handler_example';
			self.V = 'cf';
			self.D = {
				"en-US": {
					"DEFAULTS": {
						"简体": "simplified",
						"空白": [],
						"无": "",
						"%s美好%s生活": "%sgood%s life",
						"%{中文}词典": "%{Chinese} dictionary"
					},
					"SUBTYPES": {
						"subtype": {
							"简体": "simplified subtype"
						}
					}
				},
				"zh-TW": {
					"DEFAULTS": {
						"简体": "簡體",
						"无": "無"
					}
				}
			};

			var __TRANSLATE_JSON__ = self.D;
			var lanKeys = LAN.split(',');
			lanArr = self.M = [];
			for(i = 0, len = lanKeys.length; i < len; i++)
			{
				lanItem = __TRANSLATE_JSON__[lanKeys[i]];
				if (lanItem) lanArr.push(lanItem);
			}
			self.L = LAN;
		}

		lanArr = self.M;
		var resultDefault, resultSubject, allsubtypes, alldefaults, subtypeJSON;
		for(i = 0, len = lanArr.length; i < len; i++)
		{
			lanItem = lanArr[i];
			if (subtype)
			{
				allsubtypes = lanItem.SUBTYPES;
				subtypeJSON = allsubtypes && allsubtypes[subtype];
				resultSubject = subtypeJSON && subtypeJSON[msg];
				if (resultSubject) break;
			}
			if (!resultDefault)
			{
				alldefaults = lanItem.DEFAULTS;
				resultDefault = alldefaults && alldefaults[msg];
			}
		}

		if (resultSubject) msg = resultSubject;
		else if (resultDefault) msg = resultDefault;
	}

	msg += '';
	if (!tpldata.length || msg.indexOf('%') == -1) return msg;

	var replace_index = 0;
	return msg.replace(/%s|%\{.+?\}/g, function(all)
	{
		var newVal = tpldata[replace_index++];
		return newVal === undefined ? all : newVal === null ? '' : newVal;
	});
}
```

| 成员变量   | 说明                  |
|:---------|:---------------------|
| `self.$` | 缓存数据               |
| `self.L` | 翻译语言列表           |
| `self.K` | 函数FileKey           |
| `self.V` | 函数版本号             |
| `self.D` | 翻译数据               |
| `self.M` | 当前语言列表下的翻译数据 |


## 简易模式

```javascript
function I18N(msg, tpldata)
{
	msg += '';
	if (!tpldata || !tpldata.length || msg.indexOf('%') == -1) return msg;

	var self = I18N;

	self.K = 'i18n_handler_example_simple';
	self.V = 'cs';

	var replace_index = 0;
	return msg.replace(/%s|%\{.+?\}/g, function(all)
	{
		var newVal = tpldata[replace_index++];
		return newVal === undefined ? all : newVal === null ? '' : newVal;
	});
}
```


## 全局模式

```javascript
function I18N(msg)
{
	var self = I18N;
	var data = self.$;

	if (!data)
	{
		data = self.$ = {};
		self.K = 'i18n_handler_example_global';
		self.V = 'cg';
		self.D = {
			"en-US": {
				"DEFAULTS": {
					"简体": "simplified",
					"空白": [],
					"无": "",
					"%s美好%s生活": "%sgood%s life",
					"%{中文}词典": "%{Chinese} dictionary"
				},
				"SUBTYPES": {
					"subtype": {
						"简体": "simplified subtype"
					}
				}
			},
			"zh-TW": {
				"DEFAULTS": {
					"简体": "簡體",
					"无": "無"
				}
			}
		};
	}

	return ''+I18N.topI18N(msg, arguments, self.D, self.K, data, self);
}
```
