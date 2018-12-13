const markdown = require('./index');
//const { describe } = require('../../tests/describe');
const expect = require('expect.js');

describe(`Markdown bundle test suite`, () => {
	it('converts markdown', () => {
		expect(markdown(`# Title`)).to.be('<h1>Title</h1>');
		expect(markdown(`__bold__`)).to.contain('<strong>bold</strong>');
	});

	it('converts inline KaTeX', () => {
		expect(markdown(`$E=MC^2$`)).to.contain('inlineMath');
	});

	it('converts KaTeX blocks', () => {
		expect(markdown(`$$E=MC^2$$`)).to.contain('blockMath');
	});

});
