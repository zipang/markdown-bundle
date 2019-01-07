const h = require('hastscript');
const toPreact = require('./index');
const { it, describe } = require('@bit/zipang.bit-boilerplate.tests.describe');

it("Convert HAST to petit-dom", () => {

	describe("It converts a simple text node", (expect) => {
		expect.assertions(2);
		const textNode = toPreact(h('p', "Hello World"));
		console.dir(textNode);
		expect(textNode.type).toBe('p');
		expect(textNode.content[0]._text).toBe("Hello World");
	});


	describe("It converts a simple text node", (expect) => {
		expect.assertions(2);
		const listNode = toPreact(
			h('ul#todos', [
				h('li.todo', { done: true }, "One"),
				h('li.todo', { done: false }, "Two"),
			])
		);
		console.dir(listNode);
		expect(listNode.type).toBe('ul');
		expect(listNode.content.length).toBe(2);
	});

});

