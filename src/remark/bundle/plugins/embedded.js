'use strict'

const normalize = require('mdurl/encode')
const imageReg = /\.(gif|jpg|jpeg|svg|png)$/i;

const embedded = [
	{
		name: 'youtube',
		test: /(youtube.com|youtu.be)/gi,
		getResourceId: (url) => {
			if (url.searchParams && url.searchParams.v) {
				return url.searchParams.v;
			} else {
				return url.pathname.split('/').last();
			}
		},
		createNode: (h) => {

		}
	}
];


/**
 *
 */
function image(h, node) {

	const url = new URL(node.url);
	const rscPath = url.pathname;
	let embeddable;

	if (embeddable = embedded.find( embeddable => embeddable.regex.test(url))) {
		// lets' embed
		return embeddable.createNode(h);

	} else if (imageReg.test(rscPath)) {
		var props = {
			src: url.toString(),
			alt: node.alt,
			title: node.title || ''
		}

		return h(node, 'img', props);
	} else {
		return h()
	}

}

// Create an element for a `node`.
function h(node, tagName, props, children) {
	if (
		(children === undefined || children === null) &&
		typeof props === 'object' &&
		'length' in props
	) {
		children = props
		props = {}
	}

	return augment(node, {
		type: 'element',
		tagName: tagName,
		properties: props || {},
		children: children || []
	})
}

module.exports = image;
