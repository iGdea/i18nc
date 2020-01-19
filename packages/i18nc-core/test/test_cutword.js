'use strict';

const expect = require('expect.js');
const escodegen = require('escodegen');
const i18ncAst = require('i18nc-ast');
const astTpl = i18ncAst.tpl;
const initOptions = require('i18nc-options').init;
const LiteralHandler = require('../lib/ast_literal_handler').LiteralHandler;

describe('#cutword', function() {
	const options = initOptions();
	const literalHandler = new LiteralHandler(options);

	it('#ast', function() {
		function txt2code(val) {
			const ast = literalHandler.handle(astTpl.Literal(val))[0]
				.__i18n_replace_info__.newAst;
			return escodegen.generate(ast, i18ncAst.config.escodegenMinOptions);
		}

		expect(txt2code('中文')).to.be('I18N(\'中文\')');
		expect(txt2code('中文11')).to.be('I18N(\'中文11\')');
		expect(txt2code('11<span>中文</span>中文11')).to.be(
			'\'11<span>\'+I18N(\'中文\')+\'</span>\'+I18N(\'中文11\')'
		);
	});
});
