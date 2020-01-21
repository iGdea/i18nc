module.exports = function textWrapCode(){

function code() {
	function handler() {}
	function I18N() {}

	console.log(handler`before ${info} 中文 split ${I18N('中文2')}`);
}

}
