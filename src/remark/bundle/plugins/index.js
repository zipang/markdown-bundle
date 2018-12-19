/**
 * Markdown Syntax Tree Handlers
 * @return {Object} a table of handlers indexed by the element type they transform
 */
module.exports = {
	image: require('./handleImages')
};
