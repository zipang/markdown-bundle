/* Defined regex markdown it plugins */
var Plugin = require("markdown-it-regexp");

var _DEFAULTS = {
	regex: "alt",
	embedded: true,
	bootstrap: true,
	ratio: "4:3"
}

var _PLUGINS_DEFAULTS = {
	youtube: {
		render: function(videoId) {
			return `<a class="youtube embed" rel="youtube" href="https://youtu.be/${videoId}" data-embed-url="https://www.youtube.com/embed/${videoId}?autoplay=1&amp;rel=0">
		<img src="https://img.youtube.com/vi/${videoId}/hqdefault.jpg" class="img-fluid" alt="Video">
		<i class="icon fa fa-youtube-play fa-5x"></i></a>`;
		},
		embed: function(videoId, options) {
			return `<iframe src="https://www.youtube.com/embed/${videoId}?rel=0"
			class="youtube embed-responsive-item" frameborder="0" allowfullscreen></iframe>`;
		}
	},
	vimeo: {
		ratio: "16:9",
		render: function(videoId) {
			return `<a class="vimeo embed" rel="vimeo" href="https://vimeo.com/${videoId}" data-embed-url="https://player.vimeo.com/video/${videoId}?autoplay=1">
		<img src="https://placehold.it/640x360" data-video-id="${videoId}" class="img-fluid" alt="Video">
		<i class="icon fa fa-vimeo-square fa-5x"></i></a>`;
		},
		embed: function(videoId, options) {
			return `<iframe class="embed-responsive-item"
		src="https://player.vimeo.com/video/${videoId}"
		frameborder="0" allowfullscreen></iframe>`;
		}
	},
	vine: {
	}
}

var _REGEXS = {
	youtube: {
		hackmd: /{%youtube\s*([\d\D]*?)\s*%}/, // matches {%youtube 17868761 %}
		alt: /@\[youtube\]\(([.:/\-\w]+)\)/    // matches @[youtube](youtubeURL)
	},
	vimeo: {
		hackmd: /{%vimeo\s*([\d\D]*?)\s*%}/,
		alt: /@\[vimeo\]\(([.:/\w]+)\)/
	}
}

/**
 * Medias Plugin generator for markdown-it
 * Usage exemple :
 *   var youtubePlugin = require("markdown-it-medias")("youtube", {embedded: true});
 *   md.use(youtubePlugin)
 *
 * Every plugin comes usually in 2 forms : embedded or linked
 */
module.exports = function(pluginName, options) {

	// parameters sanity check
	if (!pluginName in _PLUGINS_DEFAULTS) {
		throw `Unknown media markdown plugin ${pluginName}`;
	}

	var pluginSettings = Object.assign({}, _DEFAULTS, _PLUGINS_DEFAULTS[pluginName], options);

	if (pluginSettings.embedded) {
		pluginSettings.render = pluginSettings.embed;
	}

	if (typeof pluginSettings.regex === "string") {
		// look in the regex table
		pluginSettings.regex = _REGEXS[pluginName][pluginSettings.regex];

		if (pluginSettings.regex === undefined) {
			throw `Unknown regex pluginName for markdown plugin ${pluginName}`;
		}
	}

	if (pluginSettings.ratio) {
		pluginSettings.ratio = pluginSettings.ratio.replace(":", "by"); // "4:3" > "4by3" which is the bootstrap ratio class
	}

	return new Plugin(
		pluginSettings.regex,
		function(matches) {
			var videoId = matches[1].split("?")[0].split("/").pop(),
				result  = pluginSettings.render(videoId, pluginSettings);

			if (pluginSettings.embed && pluginSettings.bootstrap) { // wrap with a boostrap responsive div
				result = `<div class="embed-responsive embed-responsive-${pluginSettings.ratio}">${result}</div>`
			}

			console.log(`Plugin ${pluginName} : ${videoId} >
				${result}`);
			return result;
		}
	);
}
