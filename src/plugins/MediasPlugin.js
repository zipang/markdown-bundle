var SimplePluginFactory = require("./SimplePluginFactory"),
	settings = require("./medias-extractor.js");

if (!"startsWith" in String.prototype) {
	String.prototype.startsWith = function(what) {
		return this.indexOf(what) === 0;
	}
}

/**
 * Check if the bit of text being evaluated matches our medias plugin patterns
 * @param {string} chunk
 * @param {Object} settings
 * @return {Boolean|Object}
 */
function testMedia(chunk, settings) {
	var matches = settings.allmedias.exec(chunk);

	if (!matches) return false;

	var mediaName = matches[1];

	if (!settings[mediaName]) {
		console.warn("Unknown media type : " + mediaName);
		return false; // unknown media type
	}

	var mediaId = (settings[mediaName].extractMediaId || extractMediaId)(
		mediaName, matches[2]
	);

	if (!mediaId) {
		console.warn("No media id found : " + chunk);
		return false;
	}

	return {
		token: matches[0], // mandatory : that's the part we will transform
		media: mediaName,
		mediaId: mediaId
	}
}

/**
 * Generic method to extract the unique media id from various service URLs.
 * (Can be overwritten by a specific plugin.)
 * This method assumes that the media id is usually the last segment of the url
 * (which is true for youtube share urls, vimeo, ..)
 * @param {string} media
 * @param {string} url
 */
function extractMediaId(media, url) {

	var mediaId = url, parts = url.split("/");

	if (parts.length > 1) { // there was at least one slash !
		// take the last url part that is not empty (case of a trailing slash)
		do mediaId = parts.pop(); while (!mediaId);
	}

	if (mediaId.startsWith("watch?v=")) {
		// special case for youtube full urls :
		// https://www.youtube.com/watch?v=WfqErNnvxoo
		mediaId = mediaId.substr(8);
	}

	return mediaId;
}

/**
 * Render the markdown token into its HTML form
 * @param {Object} match
 * @param {Object} settings
 */
function render(match, settings) {

	if (!match.mediaId) return match.token;

	// choose the rendering function
	var renderingMode = settings.mode,
		mediaSettings = settings[match.media],
		renderFn = mediaSettings[renderingMode];

	if (!renderFn) {
		renderFn = mediaSettings.embed; // this one is mandatory and should exist for any media
	}

	try {
		var media = renderFn(match.mediaId, mediaSettings);

		if (renderFn === mediaSettings.embed && settings.embedResponsive) {
			return settings.embedResponsive(media, mediaSettings);
		}

		return media;
	} catch(err) {
		return err; // yep. helpfull for debugging
	}
}

module.exports = SimplePluginFactory.create(
	"medias", testMedia, render, settings
);
