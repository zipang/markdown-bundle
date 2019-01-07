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
const toHtml = require('../hast-to-petitdom/').plugin;

// PETI DOM
const { mount, patch } = require('petit-dom');

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
		const petitdom = processor.processSync(markdown).contents;
		const node = mount(petitdom);

		if (!dest) {
			return node.outerHTML;
		} else if (dest.rendered) {
			dest.rendered = patch(node, dest.rendered, dest);
		} else {
			dest.innerHTML = node.outerHTML;
			dest.rendered  = node;
		}
	}

	return render;
}

module.exports = markdownBundle;
