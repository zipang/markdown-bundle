const { h } = require('preact');

console.dir(h("Heloo World"))

console.log(JSON.stringify(h('div.container', {}, [
	h('p', {}, "Hello world"),
	h('ul', { id: 'todos'}, [
		h('li', { className: "todo" }, "I'll be happy"),
		h('li', { className: "todo" }, "from now on"),
		h('li', { className: "todo" }, "until the end"),
	]),
])));
