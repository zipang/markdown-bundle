const { FuseBox, QuantumPlugin, UglifyJSPlugin } = require("fuse-box");

const fuse = FuseBox.init({
	target: "browser@es5",
	homeDir: ".",
	output: "dist/$name.js",
	plugins: [
		QuantumPlugin({
			treeshake: true,
			target: "browser",
		}),
		UglifyJSPlugin({

		})
	],
});

fuse.bundle("remark-bundle").instructions("> index.js");

fuse.run();
