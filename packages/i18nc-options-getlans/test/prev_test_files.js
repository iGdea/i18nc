'use strict';

var _			= require('lodash');
var fs			= require('fs');
var mkdirp		= require('mkdirp');
var optTpl		= require('../');
var renders		= exports.renders = {};
var INPUT_PATH	= __dirname + '/input/';


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
	var p = INPUT_PATH;
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

module.exports = main;


if (process.mainModule === module) main();
