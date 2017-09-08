var path = require("path"),
	minified = (process.argv.indexOf('-p') !== -1), // -p is the webpack option for minification
	WebpackAutoInject = require("webpack-auto-inject-version");

console.log("Building " + (minified ? "minified" : "full") + " version of markdown renderer");

module.exports = {
	entry: "./src/index.js",
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: "markdown-bundle" + (minified ? ".min" : "") + ".js"
	},
	externals: 'fs', // in order to make mermaid work
	plugins: [
		new WebpackAutoInject({
			components: {
				AutoIncreaseVersion: true,
				InjectAsComment: true,
				InjectByTag: false
			},
			componentsOptions: {
				AutoIncreaseVersion: {
					runInWatchMode: false // it will increase version with every single build!
				},
				InjectAsComment: {
					tag: "markdown-bundle, build {version} - {date}"
				}
			}
		})
	]
};
