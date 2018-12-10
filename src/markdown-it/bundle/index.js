var md = require("markdown-it")(),
	settings = require("./settings.json"),
	utils = require("./utils");

/**
 * Apply a selection of markdown it plugins to the instance
 *
 * @param {markdown-it} md
 * @param {Object} settings
 */
function applyBundle(md, settings) {

	md.options.breaks = true; // breaks at newlines

	md.use(require("markdown-it-katex"));
	if (!utils.existsStyleSheet("katex")) {
		utils.addStyleSheet("https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.8.3/katex.min.css");
	}

	md.use(require("markdown-it-footnote"));

	var mediasPlugin = require("./plugins/MediasPlugin");
	md.use(mediasPlugin, { mode: "embed" });

	md.use(require("markdown-it-fontawesome"));
	if (!utils.existsStyleSheet("font-awesome")) {
		utils.addStyleSheet("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css");
	}

	// Container plugin
	var containerPlugin = require("markdown-it-container"),
		containerSettings = settings.plugins.container;

	function renderBlock(blockName) {
		var settings = Object.assign({}, containerSettings[blockName]);
		return {
			render: function renderDefault(tokens, idx, _options, env, self) {

				// add a class to the opening tag
				if (tokens[idx].nesting === 1) {
					tokens[idx].attrPush(["class", settings.cssClasses || "alert alert-" + blockName]);

					if (settings.tagName) {
						tokens[idx].tag = tagName.toLowerCase();
					}
				}

				return self.renderToken(tokens, idx, _options, env, self);
			}
		}
	}
	md.use(containerPlugin, "warning", renderBlock("warning"));
	md.use(containerPlugin, "info",    renderBlock("info"));
	md.use(containerPlugin, "success", renderBlock("success"));
	md.use(containerPlugin, "exemple", renderBlock("success"));
	md.use(containerPlugin, "danger",  renderBlock("danger"));
}

applyBundle(md, settings);

// make it available as a global markdown function
global.markdown = module.exports = function(text) {
	return md.render(text);
};

// // alias marked.setOptions to markdown-it.set()
// // translate marked options to markdown-it
// marked.setOptions = function(opt) {

// 	if (opt.breakLines) {
// 		md.options.breaks = opt.breakLines;
// 	}

// };

