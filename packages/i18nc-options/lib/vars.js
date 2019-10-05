'use strict';


exports.OLD_RENAME_OPTIONS =
{
	cutWordReg: 'cutwordReg',
	handlerName: 'I18NHandlerName',

	defaultFileKey: 'I18NHandler.data.defaultFileKey',
	// defaultTranslateLanguage: 'I18NHandler.data.defaultLanguage',
	pickFileLanguages: 'I18NHandler.data.onlyTheseLanguages',
	isIgnoreI18NHandlerTranslateWords: 'I18NHandler.data.ignoreFuncWords',

	isPartialUpdate: 'I18NHandler.upgrade.partial',

	// minTranslateFuncCode: 'I18NHandler.style.minFuncCode',
	// minTranslateFuncCode: 'I18NHandler.style.minFuncJSON',
	// isMinFuncTranslateCode: 'I18NHandler.style.minFuncJSON',
	isInjectAllTranslateWords: 'I18NHandler.style.comment4nowords',

	// isProxyGlobalHandler: 'I18NHandler.style.proxyGlobalHandler.enable',
	proxyGlobalHandlerName: 'I18NHandler.style.proxyGlobalHandler.name',
	isIgnoreCodeProxyGlobalHandlerName: 'I18NHandler.style.proxyGlobalHandler.ignoreFuncCodeName',


	isCheckClosureForNewI18NHandler: 'I18NHandler.insert.checkClosure',
	isClosureWhenInsertedHead: 'I18NHandler.insert.checkClosure',
	isInsertToDefineHalder: 'I18NHandler.insert.priorityDefineHalder',


	I18NHandlerTPL_GetLanguageCode: 'I18NHandler.tpl.getLanguageCode',
	I18NHandlerTPL_LanguageVars: 'I18NHandler.tpl.languageVars',
	I18NHandlerTPL_NewHeaderCode: 'I18NHandler.tpl.newHeaderCode',
	I18NHandlerTPL_NewFooterCode: 'I18NHandler.tpl.newFooterCode',

	I18NhandlerTpl_GetLanguageCode: 'I18NHandler.tpl.getLanguageCode',
	I18NhandlerTpl_LanguageVars: 'I18NHandler.tpl.languageVars',
	I18NhandlerTpl_NewHeaderCode: 'I18NHandler.tpl.newHeaderCode',
	I18NhandlerTpl_NewFooterCode: 'I18NHandler.tpl.newFooterCode',

	I18NhandlerTpl_LanguageVarName: 'I18NHandler.tpl.languageVars.name',
	'I18NhandlerTpl:LanguageVarName': 'I18NHandler.tpl.languageVars.name',

	I18NhandlerTpl_GetGlobalCode: 'I18NHandler.tpl.getLanguageCode',
	'I18NhandlerTpl:GetGlobalCode': 'I18NHandler.tpl.getLanguageCode',

	'I18NHandler.upgrade.version': 'I18NHandler.upgrade.checkVersion',
	'I18NHandler.style.proxyGlobalHandler.ignoreFuncCode': 'I18NHandler.style.proxyGlobalHandler.ignoreFuncCodeName',

	loadTranslateJSON: 'events.loadTranslateJSON',
	newTranslateJSON: 'events.newTranslateJSON',
	beforeScan: 'events.beforeScan',
	cutword: 'events.cutword',
	assignLineStrings: 'events.assignLineStrings',

	// 由于会修改I18NHandler值，所以放到最后去处理
	codeModifiedArea: 'codeModifyItems',
	'codeModifiedArea.I18NHandler': 'I18NHandler',
};


exports.OLD_VALUE_OPTIONS =
{
	'minTranslateFuncCode=all':
		[
			'I18NHandler.style.minFuncCode=true',
			'I18NHandler.style.minFuncJSON=true'
		],
	'minTranslateFuncCode=onlyFunc':
		[
			'I18NHandler.style.minFuncCode=true',
			'I18NHandler.style.minFuncJSON=false'
		],
	'minTranslateFuncCode=none':
		[
			'I18NHandler.style.minFuncCode=false',
			'I18NHandler.style.minFuncJSON=false'
		],
	'isMinFuncTranslateCode=true':
		[
			'I18NHandler.style.minFuncCode=true',
			'I18NHandler.style.minFuncJSON=true'
		],
	'isMinFuncTranslateCode=false':
		[
			'I18NHandler.style.minFuncCode=true',
			'I18NHandler.style.minFuncJSON=false'
		],
	'I18NHandler.style.proxyGlobalHandler.enable=true':
		[
			'I18NHandler.style.codeStyle=proxyGlobalHandler'
		],
	'isProxyGlobalHandler=true':
		[
			'I18NHandler.style.codeStyle=proxyGlobalHandler'
		],
};


exports.RM_OPTIONS =
{
	/**
	 * 当没有找到任何语言包 & 启动了comment4nowords, 使用这个语言，作为代码中的语言包
	 * 由于没有任何实际数据，对代码结果无影响
	 *
	 * @type {String}
	 */
	'I18NHandler.data.defaultLanguage': 'en-US',
};


// 修改key的值，会导致val的值被强制设置
exports.LINK_VALUES =
{
	'I18NHandler.style.minFuncJSON=true':
		'I18NHandler.style.comment4nowords=false',

	'I18NHandler.style.codeStyle=fullHandler':
		'I18NHandler.style.fullHandler.keepThisStyle=true',

	'I18NHandler.style.codeStyle=proxyGlobalHandler':
		'I18NHandler.style.proxyGlobalHandler.keepThisStyle=true',

	'I18NHandler.style.fullHandler.keepThisStyle=false':
		'I18NHandler.style.fullHandler.autoConvert=false',

	'I18NHandler.style.proxyGlobalHandler.keepThisStyle=false':
		'I18NHandler.style.proxyGlobalHandler.autoConvert=false',
};
