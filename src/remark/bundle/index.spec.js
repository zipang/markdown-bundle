const { render } = require('./index')();
const { it, describe } = require('../../tests/describe');

describe(`Markdown bundle test suite`, () => {

	it('converts markdown', (expect) => {
		expect(render(`# Title`)).toBe('<h1>Title</h1>');
		expect(render(`__bold__`)).toContain('<strong>bold</strong>');
	});

	it('converts inline KaTeX', (expect) => {
		expect(render(`$E=MC^2$`)).toContain('inlineMath');
	});

	it('converts KaTeX blocks', (expect) => {
		expect(render(`$$E=MC^2$$`)).toContain('inlineMath', 'inlineMathDouble');
	});

	it('renders images', (expect) => {
		expect(render(`![xkcd#395](https://imgs.xkcd.com/comics/morning.png)`)).toContain('img');
	});

	it('renders embedded media URLs', (expect) => {
		const embedded = render(`![xkcd#1190](https://youtu.be/Ryyk69WE9i8)`);
		console.log(`Embedding youtube urls : ${embedded}`);
		expect(embedded).toContain('iframe');
	});

});
