'use strict';

var fs = require('fs');
var DEF = require('../lib/def');
var optionsUtils = require('../lib/options');
var i18nTpl = require('../lib/i18n_func/render');


exports.I18NHandlerExampleCode = I18NHandlerExampleCode;
function I18NHandlerExampleCode()
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

	return i18nTpl.render(
		{
			handlerName			: 'I18N',
			FILE_KEY			: 'i18n_handler_example',
			FUNCTION_VERSION	: DEF.I18NFunctionVersion,
			GetLanguageCode		: '(function(){return global.__i18n_lan__})',
			TRANSLATE_JSON_CODE	: JSON.stringify(TRANSLATE_JSON, null, '\t').replace(/\n/g, '\n\t'),
		});
}

function I18NHandlerExampleFile()
{
	var content = 'module.exports = I18N;\n';
	content += I18NHandlerExampleCode();

	fs.writeFileSync(__dirname+'/files/i18n_handler_example.js', content);
}



exports.I18NHandlerSimpleExampleCode = I18NHandlerSimpleExampleCode;
function I18NHandlerSimpleExampleCode()
{
	return i18nTpl.renderSimple(
		{
			handlerName			: 'I18N',
			FILE_KEY			: 'i18n_handler_example',
			FUNCTION_VERSION	: DEF.I18NFunctionVersion,
		});
}

function I18NHandlerSimpleExampleFile()
{
	var content = 'module.exports = I18N;\n';
	content += I18NHandlerSimpleExampleCode();

	fs.writeFileSync(__dirname+'/files/i18n_handler_simple_example.js', content);
}

function main()
{
	console.log('run main');
	I18NHandlerExampleFile();
	I18NHandlerSimpleExampleFile();
}

if (process.mainModule === module) main();
