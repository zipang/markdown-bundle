var settings = require("./settings.json"),
	md = require("markdown-it")(),
	bundle = require("./bundles/" + settings.bundle);

bundle(md, settings);

// make it available as a global markdown function
global.markdown = module.exports = function(text) {
	return md.render(text);
};


// // Create a marked API-compatible that wraps markdown-it
// var marked = function(text) {
// 	return md.render(text);
// };

// // alias marked.setOptions to markdown-it.set()
// // translate marked options to markdown-it
// marked.setOptions = function(opt) {

// 	if (opt.breakLines) {
// 		md.options.breaks = opt.breakLines;
// 	}

// };

