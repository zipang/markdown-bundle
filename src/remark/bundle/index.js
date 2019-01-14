const unified = require('unified');
// PARSER
const parseMarkdown = require('remark-parse');
// TRANSFORMERS
const breaks = require('remark-breaks');
const parseMath = require('remark-math');
const transformToHtml = require('remark-rehype');
const katex = require('rehype-katex');
// const addIdsToTitles = require('rehype-slug');
const handlers = require('./plugins/');
// COMPILERS
const toHtml = require('zipang.markdown-bundle.remark.hast-to-preact').plugin;

// PREACT UNIVERSAL RENDERING
const renderToDom = require('preact').render;
const renderToString = require('preact-render-to-string');

const DEFAULTS = {
	// Markdown parser options
	// @see https://github.com/remarkjs/remark/tree/master/packages/remark-parse#processoruseparse-options
	markdown: {
		gfm: true, // Github Flavored Markdown
		commonmark: false,
		footnotes: true,
	},
	// Inline math processor options
	math: {
		inlineMathDouble: true,
	},
	// MDAST to HAST (HTML) transformer options
	// @see https://github.com/syntax-tree/mdast-util-to-hast#tohastnode-options
	html: {
		allowDangerousHTML: false,
		handlers: handlers
	},
	// Rehype Katex renderer options
	// @see https://github.com/Rokt33r/remark-math#rehype-katex-and-remark-html-katex
	katex: {
		strict: false,
		throwOnError: false,
		errorColor: 'red',
		inlineMathDoubleDisplay: false,
		macros: {},
	},
	// Vdom transformation options
	vdom: {

	}
}

//require('katex/dist/katex.css')
//require('github-markdown-css')


/**
 * Markdown Bundle Factory method
 * @param  {Object} opts
 */
function markdownBundle(opts) {

	const options = Object.assign({}, DEFAULTS, opts);

	const processor = unified()
		// Parses markdown to mdast syntax tree
		.use(parseMarkdown, options.markdown)
		// Marks $inline$ and $$block$$ contents as math
		.use(parseMath, options.math)
		.use(breaks)
		.use(transformToHtml, options.html)
		.use(katex, options.katex)
		.use(toHtml)
		// .use(addIdsToTitles);

	function render(markdown, dest) {
		const node = processor.processSync(markdown).contents;

		if (!dest) {
			return renderToString(node);
		} else if (dest.rendered) {
			renderToDom(node, dest, dest.rendered);
		} else {
			dest.rendered = renderToDom(node, dest);
		}
	}

	return render;
}

module.exports = markdownBundle;

if (window) {
	window.markdownBundle = markdownBundle;
}
