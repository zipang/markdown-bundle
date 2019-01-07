const { h } = require('petit-dom');

function toPetitDom(tree) {
	const { tagName = 'div', value, properties = {}, children = [] } = tree;

	return value !== undefined ?
		{ _text: value } :
		h( tagName, properties, children.map(toPetitDom) );
}

function buildCompiler(config) {

	this.Compiler = toPetitDom;
}

module.exports = toPetitDom;
module.exports.plugin = buildCompiler;

