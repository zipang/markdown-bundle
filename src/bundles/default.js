var utils = require("../utils");

function applyBundle(md, settings) {

	md.options.breaks = true; // breaks at newlines

	md.use(require("markdown-it-katex"));
	if (!utils.existsStyleSheet("katex")) {
		utils.addStyleSheet("https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.8.3/katex.min.css");
	}

	md.use(require("markdown-it-footnote"));

	// window.mermaid = require("mermaid");
	// md.use(require("markdown-it-mermaid").default);

	// var mediasPlugins = require("../plugins/markdown-it-medias");
	// ["youtube", "vimeo"].forEach(function(pluginName) {
	// 	md.use(mediasPlugins(pluginName));
	// });

	var mediasPlugin = require("../plugins/MediasPlugin");
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
	md.use(containerPlugin, "info", renderBlock("info"));
	md.use(containerPlugin, "cite", renderBlock("cite"));
}

module.exports = applyBundle;
