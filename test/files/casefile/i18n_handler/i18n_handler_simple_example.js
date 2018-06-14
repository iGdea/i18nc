module.exports = I18N;
function I18N(c,a){
	if(!a||!a.join)return''+c;var b=I18N;b.K='i18n_handler_example';b.V='a';var d=0;return(''+c).replace(/(%s)|(%\{(.+?)\})/g,function(c){var b=a[d++];return b===undefined||b===null?c:b})
}