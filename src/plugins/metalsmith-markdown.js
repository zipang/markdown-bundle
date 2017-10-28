
var basename = require('path').basename;
var dirname  = require('path').dirname;
var extname  = require('path').extname;
var markdown = require('../index.js');

/**
 * Expose `plugin`.
 */
module.exports = plugin;

/**
 * Metalsmith plugin to convert markdown files.
 *
 * @param {Object} options (optional)
 *   @property {Array} keys keys of the file object that should be converted from markdown
 * @return {Function}
 */
function plugin(options) {
	options = options || {};
	var keys = options.keys || [];

	return function(files, metalsmith, done) {

		setImmediate(done);

		Object.keys(files).forEach(function(path){
			console.log(`checking file: ${path}`);

			if (!isMarkdown(path)) return;

			var data = files[path];

			console.log(`converting markdown data for file: ${path}`);
			// convert main content
			var str = markdown(data.contents.toString(), options);
			data.contents = new Buffer(str);

			// convert other metadatas that are markdown
			keys.forEach(function(key) {
				data[key] = markdown(data[key], options);
			});

			// replace markdown extension by 'html'
			delete files[path];
			files[path.replace(/\.md$|\.markdown$/, "/index.html")] = data;
		});
	};
}

/**
 * Check if a `file` is markdown.
 *
 * @param {String} file
 * @return {Boolean}
 */

function isMarkdown(file){
	return /\.md|\.markdown/.test(extname(file));
}
