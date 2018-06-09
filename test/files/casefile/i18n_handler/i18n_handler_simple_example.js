module.exports = I18N;
function I18N(c,a){
	var b=I18N;b.__FILE_KEY__='i18n_handler_example';b.__FUNCTION_VERSION__='a';if(!a||!a.join)return''+c;var d=0;return(''+c).replace(/(%s)|(%\{(.+?)\})/g,function(c){var b=a[d++];return b===undefined||b===null?c:b})
}