const hast = require('hastscript');
const toPetitDom = require('./index');
const { it, describe } = require('@bit/zipang.bit-boilerplate.tests.describe');

it("Convert HAST to petit-dom", () => {

	describe("It converts a simple text node", (expect) => {
		expect.assertions(2);
		const textNode = toPetitDom(hast('p', "Hello World"));
		console.dir(textNode);
		expect(textNode.type).toBe('p');
		expect(textNode.content[0]._text).toBe("Hello World");
	});


	describe("It converts a simple list", (expect) => {
		expect.assertions(2);
		const listNode = toPetitDom(
			hast('ul#todos', [
				hast('li.todo', { done: true }, "One"),
				hast('li.todo', { done: false }, "Two"),
			])
		);
		console.dir(listNode);
		expect(listNode.type).toBe('ul');
		expect(listNode.content.length).toBe(2);
	});

});

