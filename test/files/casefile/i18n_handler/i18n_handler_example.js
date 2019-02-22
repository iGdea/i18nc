module.exports = I18N;
function I18N(msg, tpldata, subtype)
{
	if (!msg) return msg === undefined || msg === null ? '' : '' + msg;

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