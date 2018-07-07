var Promise = require('bluebird');
var replaceSuite = require('./suite_replace');
var tasks =
[{
	name: 'varCache',
	suite: require('./suite_var_cache')
},
{
	name: 'Repalce - check',
	suite: replaceSuite.noReplace
},
{
	name: 'Replace - do',
	suite: replaceSuite.doReplace
}];

Promise.each(tasks, function(item)
{
	return new Promise(function(resolve)
	{
		console.log('\n\n==== '+item.name+' start ====');
		item.suite.on('complete', resolve).run();
	});
})
.catch(function(err)
{
	console.log(err.stack);
});
