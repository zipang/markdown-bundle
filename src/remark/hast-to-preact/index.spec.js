const hast = require('hastscript');
const toPreact = require('./index');
const { it, describe } = require('@bit/zipang.bit-boilerplate.tests.describe');

it("Convert HAST to preact virtual dom", () => {

	describe("It converts a simple text node", (expect) => {
		expect.assertions(2);
		const textNode = toPreact(hast('p', "Hello World"));
		console.dir(textNode);
		expect(textNode.nodeName).toBe('p');
		expect(textNode.children[0]).toBe("Hello World");
	});


	describe("It converts a simple list", (expect) => {
		expect.assertions(2);
		const listNode = toPreact(
			hast('ul#todos', [
				hast('li.todo', { done: true }, "One"),
				hast('li.todo', { done: false }, "Two"),
			])
		);
		console.dir(listNode);
		expect(listNode.nodeName).toBe('ul');
		expect(listNode.children.length).toBe(2);
	});

});

