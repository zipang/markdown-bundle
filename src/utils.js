module.exports = {
	// Tools for client side
	addStyleSheet: function(url) {
		if (document) {
			var link = document.createElement("link");
			link.type = "text/css";
			link.rel = "stylesheet";
			link.href = url;
			document.getElementsByTagName("head")[0].appendChild(link);
		}
	},
	existsStyleSheet: function(resourceName) {
		if (document) {
			var styles = document.styleSheets;
			for (var i = 0, len = styles.length; i < len; i++) {
				if (styles[i].href.endsWith(resourceName + ".css") || styles[i].href.endsWith(resourceName + ".min.css"))
					return true;
			}
		}
		return false;
	}
}
