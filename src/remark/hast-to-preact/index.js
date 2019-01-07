const { h } = require('preact');

function toPreact(tree) {
	const { tagName = 'div', value, properties = {}, children = [] } = tree;

	return value !== undefined ?
		value :
		h( tagName, properties, children.map(toPreact) );
}

function useCompiler(config) {

	this.Compiler = toPreact;
}

module.exports = toPreact;
module.exports.plugin = useCompiler;

