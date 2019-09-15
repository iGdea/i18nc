'use strict';

var _		= require('lodash');
var fs		= require('fs');
var DEF		= require('../lib/def');
var i18nTpl	= require('../lib/i18n_func/render');

exports.TRANSLATE_JSON =
{
	$: ['en-US', 'zh-TW'],
	'*':
	{
		'简体': ['simplified', '簡體'],
		'空白': [[]],
		'无': ['', '無'],
		'%s美好%s生活': ['%sgood%s life'],
		'%{中文}词典': ['%{Chinese} dictionary']
	},
	'subtype':
	{
		'简体': ['simplified subtype'],
	}
};

exports.I18NHandlerExampleCode = function I18NHandlerExampleCode(isMin)
{
	var config =
	{
		handlerName			: 'I18N',
		getLanguageCode		: '(function(){return global.__i18n_lan__})',
		FILE_KEY			: 'i18n_handler_example',
		FUNCTION_VERSION	: DEF.I18NFunctionVersion+DEF.I18NFunctionSubVersion.FULL,
		TRANSLATE_JSON_CODE	: JSON.stringify(exports.TRANSLATE_JSON, null, '\t'),
	};
	return i18nTpl.render(config, isMin);
};

exports.I18NHandlerGlobalExampleCode = function I18NHandlerGlobalExampleCode(isMin)
{
	var config =
	{
		handlerName			: 'I18N',
		globalHandlerName	: 'I18N.topI18N',
		FILE_KEY			: 'i18n_handler_example_global',
		FUNCTION_VERSION	: DEF.I18NFunctionVersion+DEF.I18NFunctionSubVersion.GLOBAL,
		TRANSLATE_JSON_CODE	: JSON.stringify(exports.TRANSLATE_JSON, null, '\t'),
	};
	return i18nTpl.renderGlobal(config, isMin);
};

exports.I18NHandlerSimpleExampleCode = function I18NHandlerSimpleExampleCode(isMin)
{
	var config =
	{
		handlerName			: 'I18N',
		FILE_KEY			: 'i18n_handler_example_simple',
		FUNCTION_VERSION	: DEF.I18NFunctionVersion+DEF.I18NFunctionSubVersion.SIMPLE,
	};
	return i18nTpl.renderSimple(config, isMin);
};

exports.main = main;
function main()
{
	console.log('run main');

	var filemap =
	{
		i18n_handler_example		: exports.I18NHandlerExampleCode,
		i18n_handler_simple_example	: exports.I18NHandlerSimpleExampleCode,
		i18n_handler_global_example	: exports.I18NHandlerGlobalExampleCode
	};

	_.each(filemap, function(handler, basename)
		{
			var content = 'module.exports = I18N;\n';
			content += handler();

			fs.writeFileSync(__dirname+'/files/casefile/i18n_handler/'+basename+'.js', content);
		});
}

if (process.mainModule === module) main();
