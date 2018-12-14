const { render } = require('./index')();
const { it, describe } = require('../../tests/describe');
// const expect = require('expect.js');

describe(`Markdown bundle test suite`, () => {
	it('converts markdown', (expect) => {
		expect(render(`# Title`)).toBe('<h1>Title</h1>');
		expect(render(`__bold__`)).toContain('<strong>bold</strong>');
	});

	it('converts inline KaTeX', (expect) => {
		expect(render(`$E=MC^2$`)).toContain('inlineMath');
	});

	it('converts KaTeX blocks', (expect) => {
		expect(render(`$$E=MC^2$$`)).toContain('inlineMathDouble');
	});

});
