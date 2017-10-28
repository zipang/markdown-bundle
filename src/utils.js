module.exports = {
	// Tools for client side
	addStyleSheet: function(url) {
		if (global.document) {
			var link = document.createElement("link");
			link.type = "text/css";
			link.rel = "stylesheet";
			link.href = url;
			document.getElementsByTagName("head")[0].appendChild(link);
		}
	},
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
