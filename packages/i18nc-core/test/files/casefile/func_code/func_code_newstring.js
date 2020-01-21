exports.TemplateLiteral = function code() {
	const info = 1;
	function I18N() {}
	console.log(`before ${info} 中文 split ${I18N('中文2')}`);
};

exports.TemplateLiteral2 = function code() {
	const info = 1;
	function I18N() {}
	console.log(`before ${info ? `${I18N('中文2')}` : ''} 中文 split`);
};

exports.JSXElement = function code() {
	// return <div>xxxdd {this.xxx} {xxx(fff)} </div>
};

exports.TaggedTemplateExpression = function code() {
	function handler() {}
	function I18N() {}

	console.log(handler`before ${info} 中文 split ${I18N('中文2')}`);
};
