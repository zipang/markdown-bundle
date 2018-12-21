#! /usr/bin/env node
const path = require("path");

// test results should be appended to this array
const testResults = global.testResults = [];

/**
 * Find the position where to insert the new result and insert it
 * (the results are ordered by the start time of a test)
 * @param  {Object} testResult
 */
testResults.append = (testResult) => {
	let pos = 0;
	while (pos < testResults.length) {
		if (testResults[pos].start > testResult.start) break;
		pos++;
	}
	testResults.splice(pos, 0, testResult);
}

/**
 * @see https://docs.bitsrc.io/docs/ext-testing.html#test-results-object
 * @param {String} specFile full path to a spec file
 * @return {Object} test results in bit format
 */
async function run(specFile) {
	let start = new Date();
	let failures = [];
	let testName = path.basename(specFile);
	try {
		await require(specFile);
	} catch (err) {
		failures.push({
			title: `${testName} has failed`,
			err: {
				message: err.message,
				stack: err.stack
			}
		});
	}
	return {
		tests: testResults,
		stats: {
			start: start,
			end: new Date()
		},
		failures: failures
	}
}

module.exports = {
	run,
	globals: {
		testResults
	},
	modules: {
		// Your modules here...
	}
};

