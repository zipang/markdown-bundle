/*!
 * SimplePluginFactory (for markdown-it)
 * Based on markdown-it-regexp by Alex Kocharin
 * MIT Licensed
 */

var counter = 0;

function createPlugin(name, test, replacer, options) {

	if (typeof name !== "string") {
		throw "SimplePlugin factory method expects a name as first argument !";
	}

	if (typeof test !== "function" || typeof replacer !== "function") {
		throw "SimplePlugin factory method expects two functions test(chunk) and replace(chunk) as arguments.";
	}

	// initialize plugin object
	var plugin = new SimplePlugin(name, test, replacer, options);

	// return a callable function passed to markdown-it.use()
	return function(md, options) {
		Object.assign(plugin.options, options);
		plugin.init(md);
	};
}

function SimplePlugin(name, test, replacer, options) {
	// this plugin can be inserted multiple times,
	// so we're generating unique name for it
	this.id = name + '-' + counter;
	counter++;
	// copy init options
	this.test = test;
	this.replacer = replacer;
	this.options = Object.assign({}, options);
}

// function that registers plugin with markdown-it
SimplePlugin.prototype.init = function (md) {
	md.inline.ruler.push(this.id, this.parse.bind(this));
	md.renderer.rules[this.id] = this.render.bind(this);
}

SimplePlugin.prototype.parse = function (state, silent) {

	// test the current chunk for match
	var candidate = state.src.slice(state.pos),
		match = this.test(candidate, this.options);

	if (!match) return false; // continue

	if (!match.token) {
		throw "SimplePlugin test() method MUST return the token it is interested into under the key 'token' ";
	}

	// valid candidate found, now we need to advance cursor
	state.pos += match.token.length;

	// don't insert any tokens in silent mode
	if (silent) return true;

	var token = state.push(this.id, '', 0);
	token.meta = match;

	return true;
}

SimplePlugin.prototype.render = function (tokens, id, mdSettings) {
	return this.replacer(tokens[id].meta, this.options);
}

/**
 * Expose the SimplePlugin factory method
 */
module.exports = {
	create: createPlugin
};
