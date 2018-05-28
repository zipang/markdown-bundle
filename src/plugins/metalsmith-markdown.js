
var basename = require('path').basename;
var dirname  = require('path').dirname;
var extname  = require('path').extname;
var markdown = require('../index.js');

const _EXCLUDED_KEYS = {
	contents: true,
	collection: true,
	stats: true,
	previous: true,
	next: true,
	parents: true,
	parent: true
}

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

			// convert main content
			var str = markdown(data.contents.toString(), options);
			data.contents = new Buffer(str);

			// in depth scan object and convert every given keys from markdown
			scan(data, keys, options);

			// Determine new file path as an HTML resource :
			// * path/to/index.md > path/to/index.html
			// * path/to/name.md > path/to/name/index.html
			delete files[path];
			var html_path = path.replace("index.md", "index.html").replace(/\.md$|\.markdown$/, "/index.html");
			files[html_path] = data;
			console.log(`Markdown conversion done for file: ${path} > ${html_path}`);
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

/**
 * Deeply scan an object for a list of keys to transform
 * @param {Object} data object to scan
 * @param {Array}  keys name of the keys that contain markdown text
 * @param {Object} options markdown options
 */
function scan(data, keys, options) {

	if (!data || !keys || keys.length === 0 || data._scanned) return;

	Object.keys(data).forEach(function(key) {

		if (typeof data[key] === "object" && !(key in _EXCLUDED_KEYS)) { // scan deeper (array or object)
			console.log("Markdown scanning : " + key);
			scan(data[key], keys, options);

		} else if (typeof data[key] === "string") {
			if (keys.indexOf(key) !== -1) {
				data[key] = markdown(data[key], options);
			}
		}
	})

	// Allow to exit circular references between objects
	data._scanned = true;
}
