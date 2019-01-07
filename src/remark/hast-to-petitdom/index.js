const { h } = require('petit-dom');

/**
 * Convert HAST tree to petit-dom tree
 * @param {Object} HAST tree
 * @return {Object}
 */
function toPetitDom(tree) {
	const { tagName = 'div', value, properties = {}, children = [] } = tree;

	return value !== undefined ?
		{ _text: value } :
		h( tagName, properties, children.map(toPetitDom) );
}

/**
 * Usage :
 * > unified()
 * >  .use(parser)
 * >  .use(....) // some transformers that ends up with a HAST (HTML) tree
 * >  .use(require('hast-to-petit-dom'))
 * Register the hast-to-petitdom compiler
 * **note** the converted petitdom will be available under the `contents` property name
 */
function useCompiler() {
	this.Compiler = toPetitDom;
}

module.exports = toPetitDom;
module.exports.plugin = useCompiler;

