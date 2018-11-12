I18N函数风格
============


## 完整模式

```javascript
function I18N(msg, tpldata, subtype)
{
	var self = I18N,
		data = self.$ || (self.$ = {}),
		translateJSON,
		replace_index = 0,
		lanIndexArr, i, lanIndex, msgResult, translateValues,
		LAN = (function(){return global.__i18n_lan__})(data);

	if (!tpldata || !tpldata.join) {
		subtype = tpldata;
		tpldata = [];
	}

	if (LAN && LAN.split) {
		if (self.L != LAN) {
			self.K = 'i18n_handler_example';
			self.V = 'If';
			self.D = {
				"$": [
					"en-US",
					"zh-TW"
				],
				"*": {
					"简体": [
						"simplified",
						"簡體"
					],
					"空白": [
						[]
					],
					"无": [
						"",
						"無"
					],
					"%s美好%s生活": [
						"%sgood%s life"
					],
					"%{中文}词典": [
						"%{Chinese} dictionary"
					]
				},
				"subtype": {
					"简体": [
						"simplified subtype"
					]
				}
			};
			translateJSON = self.D;

			var dblans = translateJSON.$ || [],
				dblansMap = {},
				lanKeys = LAN.split(',');
			lanIndexArr = self.M = [];
			for(i = dblans.length; i--;) dblansMap[dblans[i]] = i;
			for(i = lanKeys.length; i--;) {
				lanIndex = dblansMap[lanKeys[i]];
				if (lanIndex || lanIndex === 0) lanIndexArr.push(lanIndex);
			}
			self.L = LAN;
		}

		lanIndexArr = self.M;
		translateJSON = self.D;
		var _getVaule = function(subtype) {
			translateValues = translateJSON[subtype] && translateJSON[subtype][msg];
			if (translateValues) {
				msgResult = translateValues[lanIndex];
				if (typeof msgResult == 'number') msgResult = translateValues[msgResult];
			}
		};
		for(i = lanIndexArr.length; !msgResult && i--;) {
			lanIndex = lanIndexArr[i];
			if (subtype) _getVaule(subtype);
			if (!msgResult) _getVaule('*');
		}

		if (msgResult) msg = msgResult;
	}

	msg += '';
	if (!tpldata.length || msg.indexOf('%') == -1) return msg;

	return msg.replace(/%s|%p|%\{.+?\}/g, function() {
		var newVal = tpldata[replace_index++];
		return newVal === undefined ? '' : newVal;
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
	self.V = 'Is';

	var replace_index = 0;
	return msg.replace(/%s|%p|%\{.+?\}/g, function() {
		var newVal = tpldata[replace_index++];
		return newVal === undefined ? '' : newVal;
	});
}
```


## 全局模式

```javascript
function I18N(msg)
{
	var self = I18N;
	var data = self.$;

	if (!data) {
		data = self.$ = {};
		self.K = 'i18n_handler_example_global';
		self.V = 'Ig';
		self.D = {
			"$": [
				"en-US",
				"zh-TW"
			],
			"*": {
				"简体": [
					"simplified",
					"簡體"
				],
				"空白": [
					[]
				],
				"无": [
					"",
					"無"
				],
				"%s美好%s生活": [
					"%sgood%s life"
				],
				"%{中文}词典": [
					"%{Chinese} dictionary"
				]
			},
			"subtype": {
				"简体": [
					"simplified subtype"
				]
			}
		};
	}

	return ''+I18N.topI18N(msg, arguments, self.D, self.K, data, self);
}
```
