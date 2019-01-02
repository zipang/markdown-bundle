const unified = require('unified');
const parseMarkdown = require('remark-parse');
const breaks = require('remark-breaks');
const parseMath = require('remark-math');
const transformToHtml = require('remark-rehype');
const katex = require('rehype-katex');
const addIdsToTitles = require('rehype-slug');
const handlers = require('./plugins/');
const stringify = require('rehype-stringify');

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
	}
}

//require('katex/dist/katex.css')
//require('github-markdown-css')


// Expose a factory
const markdownBundle = (opts) => {

	const options = Object.assign({}, DEFAULTS, opts);

	function process(markdown) {
		return unified()
			// Parses markdown to mdast syntax tree
			.use(parseMarkdown, options.markdown)
			// Marks $inline$ and $$block$$ contents as math
			.use(parseMath, options.math)
			.use(breaks)
			.use(transformToHtml, options.html)
			.use(katex, options.katex)
			.use(addIdsToTitles)
			.use(stringify)
			.processSync(markdown);
	}

	return {
		render: (markdown) => process(markdown).toString(),
		//renderReact: (markdown) => process(markdown).toReact(),
	}
}

module.exports = markdownBundle;
