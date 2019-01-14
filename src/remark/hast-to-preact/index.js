const { h } = require('preact');

/**
 * Converts a HAST tree to Preact virtual dom
 * @param {HASTTree} tree
 * @return {String|PreactDOM}
 */
function toPreact(tree) {
	const { type, tagName = 'div', value, properties = {}, children = [] } = tree;

	// when at the root of the tree, check to see if we really need a wrapper
	if ((type === 'root') && (children.length === 1)) {
		// nope !!
		return toPreact(children[0]);
	}

	return type === 'text' ?
		value :
		h( tagName, properties, children.map(toPreact) );

}

/**
 * Register the hast-to-preact compiler
 * Usage :
 * > unified()
 * >  .use(parser)
 * >  .use(....) // some transformers that ends up with a HAST (HTML) tree
 * >  .use(require('hast-to-preact').plugin)
 * **note** the converted preact dom will be available under the `contents` property name
 */
function useCompiler() {
	this.Compiler = toPreact;
}

module.exports = toPreact;
module.exports.plugin = useCompiler;

