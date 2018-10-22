module.exports = function textWrapCode(){

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
			self.V = 'Hf';
			self.D = {
				'$': [
					'en-US',
					'zh-TW'
				],
				'*': {
					'%s美好%s生活': ['%sgood%s life'],
					'%{中文}词典': ['%{Chinese} dictionary'],
					// '空白':
					'简体': [
						'simplified',
						'簡體'
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

	return msg.replace(/%s|%\{.+?\}/g, function() {
		var newVal = tpldata[replace_index++];
		return newVal === undefined ? '' : newVal;
	});
}
var codeJSON = {
	"DEFAULTS": [
		I18N('简体'),
		I18N('空白'),
		I18N('%s美好%s生活'),
		I18N('%{中文}词典')
	],
	"SUBTYPES": {
		"subtype": [
			I18N('简体')
		]
	}
}

}
