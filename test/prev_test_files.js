'use strict';

var _		= require('lodash');
var fs		= require('fs');
var DEF		= require('../lib/def');
var i18nTpl	= require('../lib/i18n_func/render');

function I18NHandlerConfig()
{
	var TRANSLATE_JSON =
	{
		"en-US":
		{
			"DEFAULTS":
			{
				'简体': 'simplified',
				'空白': [],
				'无': '',
				'%s美好%s生活': '%sgood%s life',
				'%{中文}词典': '%{Chinese} dictionary'
			},
			"SUBTYPES":
			{
				'subtype':
				{
					'简体': 'simplified subtype',
				}
			}
		},
		"zh-TW":
		{
			"DEFAULTS":
			{
				'简体': '簡體',
				'无': '無',
			}
		}
	};

	return {
		handlerName			: 'I18N',
		FILE_KEY			: 'i18n_handler_example',
		FUNCTION_VERSION	: DEF.I18NFunctionVersion,
		GetLanguageCode		: '(function(){return global.__i18n_lan__})',
		TRANSLATE_JSON_CODE	: JSON.stringify(TRANSLATE_JSON, null, '\t'),
	};
}

exports.I18NHandlerExampleCode = function I18NHandlerExampleCode()
{
	return i18nTpl.render(I18NHandlerConfig(), true);
};

exports.I18NHandlerGlobalExampleCode = function I18NHandlerGlobalExampleCode()
{
	var config = I18NHandlerConfig();
	config.globalHandlerName = 'I18N.topI18N';
	return i18nTpl.renderGlobal(config, true);
};

exports.I18NHandlerSimpleExampleCode = function I18NHandlerSimpleExampleCode()
{
	var config =
	{
		handlerName			: 'I18N',
		FILE_KEY			: 'i18n_handler_example',
		FUNCTION_VERSION	: DEF.I18NFunctionVersion,
	};
	return i18nTpl.renderSimple(config, true);
};

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
