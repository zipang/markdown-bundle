var settings = require("./settings.json"),
	md = require("markdown-it")();

console.log(JSON.stringify(settings));

md.options.breaks = true; // breaks at newlines

md.use(require("markdown-it-katex"));
addStyleSheet("https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.8.3/katex.min.css");

md.use(require("markdown-it-footnote"));

// window.mermaid = require("mermaid");
// md.use(require("markdown-it-mermaid").default);

md.use(require("markdown-it-video"));

md.use(require("markdown-it-fontawesome"));
if (!existsStyleSheet("font-awesome")) {
	addStyleSheet("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css");
}

// Container plugin
var containerPlugin = require("markdown-it-container"),
	containerSettings = settings.plugins.container;

function renderContainer(blockName) {
	var settings = Object.assign({}, containerSettings[blockName]);
	return {
		render: function renderDefault(tokens, idx, _options, env, self) {

			// add a class to the opening tag
			if (tokens[idx].nesting === 1) {
				tokens[idx].attrPush(["class", settings.cssClasses || "alert alert-" + blockName]);
			}

			return self.renderToken(tokens, idx, _options, env, self);
		}
	}
}
md.use(containerPlugin, "warning", renderContainer("warning"));
md.use(containerPlugin, "info", renderContainer("info"));
md.use(containerPlugin, "cite", renderContainer("cite"));


// make it available as a global markdown function
window.markdown = module.exports = function(text) {
	return md.render(text);
};


// Tools for client side
function addStyleSheet(url) {
	if (document) {
		var link = document.createElement("link");
		link.type = "text/css";
		link.rel = "stylesheet";
		link.href = url;
		document.getElementsByTagName("head")[0].appendChild(link);
	}
}
function existsStyleSheet(resourceName) {
	if (document) {
		var styles = document.styleSheets;
		for (var i = 0, len = styles.length; i < len; i++) {
			if (styles[i].href.endsWith(resourceName + ".css") || styles[i].href.endsWith(resourceName + ".min.css"))
				return true;
		}
	}
	return false;
}
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

