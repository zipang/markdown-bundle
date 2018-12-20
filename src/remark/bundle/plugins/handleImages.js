'use strict';

const imageReg = /\.(jpe?g|png|gif|svg)$/i;

const embedded = [
	{
		name: 'youtube',
		regex: /(youtube.com|youtu.be)$/i,
		/**
		 * @param {URL} url of the video to embed
		 * @return <iframe class="youtube embed-responsive-item"
		 * 	frameborder="0" allowfullscreen
		 src="https://www.youtube.com/embed/${videoId}?rel=0"></iframe>`
		 */
		createNode: (url) => {

			const videoId = url.searchParams.has('v')
				? url.searchParams.get('v')
				: url.pathname.split('/').pop();

			return {
				type: 'element',
				tagName: 'iframe',
				properties: {
					src: `https://www.youtube.com/embed/${videoId}?rel=0`,
					frameborder: '0',
					className: ['youtube', 'embed-responsive-item'],
					allowfullscreen: true
				}
			}
		}
	},
	{
		name: 'vimeo',
		regex: /(vimeo.com)$/i,
		/**
		 * @param {URL} url of the video to embed
		 * @return <iframe class="vimeo embed-responsive-item"
		 *     frameborder="0" allowfullscreen
		 *     src="https://player.vimeo.com/video/${videoId}"></iframe>`
		 */
		createNode: (url) => {

			const videoId = url.pathname.split('/').pop();

			return {
				type: 'element',
				tagName: 'iframe',
				properties: {
					src: `https://player.vimeo.com/video/${videoId}`,
					frameborder: '0',
					className: ['vimeo', 'embed-responsive-item'],
					allowfullscreen: true
				}
			}
		}
	}
];


/**
 * We are transforming MDAST image nodes
 * into their HAST format (HTML <img> tag)
 * _or_ into embedded media content (HTML <iframe> tag)
 * @param {Function} h(node, tagName, props, children)
 * @param {Object} MDAST node
 * @return {Object} HAST node
 */
function handleImageNode(h, node) {

	const url = new URL(node.url);
	const rscPath = url.pathname;
	const domain  = url.hostname;

	if (imageReg.test(rscPath)) {

		var props = {
			src: url.toString(),
			alt: node.alt || '',
			title: node.alt || ''
		}

		return h(node, 'img', props);

	} else {
		let embeddable = embedded.find(embeddable => embeddable.regex.test(domain));

		if (embeddable) {
			// lets' embed
			return embeddable.createNode(url);

		} else {
			// just display a link to the ressource
			var props = {
				href: url.toString(),
				title: node.alt || ''
			}
			return h(node, 'a', props, [
				{ type: 'text', value: url.toString() }
			]);
		}
	}
}

module.exports = handleImageNode;



// Convert a MDAST (Markdown) node to HAST (HTML Syntax Tree).
// function h(node, tagName, props, children) {
// 	if (
// 		(children === undefined || children === null) &&
// 		typeof props === 'object' &&
// 		'length' in props
// 	) {
// 		children = props
// 		props = {}
// 	}

// 	return augment(node, {
// 		type: 'element',
// 		tagName: tagName,
// 		properties: props || {},
// 		children: children || []
// 	})
// }
