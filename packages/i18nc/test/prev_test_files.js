'use strict';

var _		= require('lodash');
var fs		= require('fs');
var mkdirp	= require('mkdirp');
var optTpl	= require('../util/opt_tpl');
var renders	= exports.renders = {};


[
	'webNavigatorAndProcessDomain', 'webCookeAndProcssDomian',
	'onlyWebCookie', 'onlyWebNavigator'
]
.forEach(function(name)
{
	var code = optTpl[name].toString();

	renders[name] = function(vars)
	{
		return code.replace(/\$LanguageVars\.([\w$]+)\$/g, function(all, name)
		{
			return vars[name];
		});
	};
});


function main()
{
	var p = __dirname+'/input/opt_tpl/';
	mkdirp.sync(p);

	_.each(renders, function(render, filename)
	{
		var code = render(
		{
			name: '__i18n_lan__',
			cookie: 'test_lan'
		});

		code = "'use strict';\n\n"+'module.exports = '+code;

		fs.writeFileSync(p+filename+'.js', code);
	});
}


if (process.mainModule === module) main();
