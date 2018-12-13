const unified = require('unified');
const parse = require('remark-parse');
const math = require('remark-math');
const breaks = require('remark-breaks');
const remark2rehype = require('remark-rehype');
const stringify = require('rehype-stringify');
const katex = require('rehype-katex');

//require('katex/dist/katex.css')
//require('github-markdown-css')

const processor = unified()
	.use(parse)
	.use(math)
	.use(breaks)
	.use(remark2rehype)
	.use(katex)
	.use(stringify);

// Expose renderer
module.exports = (markdown) => processor.processSync(markdown).toString();
