var Promise = require('bluebird');
var tasks =
[{
	name: 'varCache',
	suite: require('./suite_var_cache')
}];

Promise.each(tasks, function(item)
{
	return new Promise(function(resolve)
	{
		console.log( '==== '+item.name+' start ====');
		item.suite.on('complete', resolve).run();
	});
})
.catch(function(err)
{
	console.log(err.stack);
});
