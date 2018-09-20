I18N函数风格
============


## 完整模式

```javascript
function I18N(msg, tpldata, subtype)
{
	var self = I18N,
		translateJSON,
		replace_index = 0,
		lanArr, lanKeys, i, lanItem, translateMsg, subtypeJSON,
		data = self.$ || (self.$ = {}),
		LAN = (function(){return global.__i18n_lan__})(data);

	if (!tpldata || !tpldata.join)
	{
		subtype = tpldata;
		tpldata = [];
	}

	if (LAN && LAN.split)
	{
		if (self.L != LAN)
		{
			self.K = 'i18n_handler_example';
			self.V = 'df';
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

			translateJSON = self.D;
			lanKeys = LAN.split(',');

			lanArr = self.M = [];
			for(i = lanKeys.length; i--;)
			{
				lanItem = translateJSON[lanKeys[i]];
				if (lanItem) lanArr.push(lanItem);
			}
			self.L = LAN;
		}

		lanArr = self.M;
		for(i = lanArr.length; !translateMsg && i--;)
		{
			lanItem = lanArr[i];
			if (subtype)
			{
				subtypeJSON = lanItem.SUBTYPES;
				subtypeJSON = subtypeJSON && subtypeJSON[subtype];
				translateMsg = subtypeJSON && subtypeJSON[msg];
			}
			if (!translateMsg)
			{
				subtypeJSON = lanItem.DEFAULTS;
				translateMsg = subtypeJSON && subtypeJSON[msg];
			}
		}

		if (translateMsg) msg = translateMsg;
	}

	msg += '';
	if (!tpldata.length || msg.indexOf('%') == -1) return msg;

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
	self.V = 'ds';

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
		self.V = 'dg';
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
