// Tools for client side
module.exports = {
	/**
	 * Add the stylesheet to the HEAD of the document
	 * @param  {String} url
	 */
	addStyleSheet: function(url) {
		if (global.document) {
			var link = document.createElement("link");
			link.type = "text/css";
			link.rel = "stylesheet";
			link.href = url;
			document.getElementsByTagName("head")[0].appendChild(link);
		}
	},
	/**
	 * Test if a resource of the same name is already loaded in the page
	 * @param  {String} resourceName
	 * @return {Boolean}
	 */
	existsStyleSheet: function(resourceName) {
		if (global.document) {
			var href, styles = document.styleSheets;
			for (var i = 0, len = styles.length; i < len; i++) {
				href = styles[i].href; // not all style tags have external reference : some are inline !
				if (href && href.indexOf(resourceName) !== -1) {
					return true;
				}
			}
		}
		return false;
	}
}
