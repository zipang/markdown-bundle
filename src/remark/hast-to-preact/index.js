const { h } = require('preact');

/**
 * Usage :
 * > unified()
 * >  .use(parser)
 * >  .use(....) // some transformers that ends up with a HAST (HTML) tree
 * >  .use(require('hast-to-preact').plugin)
 * Register the hast-to-preact compiler
 * **note** the converted preact dom will be available under the `contents` property name
 */
function toPreact(tree) {
	const { tagName = 'div', value, properties = {}, children = [] } = tree;

	return value !== undefined ?
		value :
		h( tagName, properties, children.map(toPreact) );
}

function useCompiler() {
	this.Compiler = toPreact;
}

module.exports = toPreact;
module.exports.plugin = useCompiler;

