/*eslint no-console: off*/

var path = require('path');

function onDone() {
}

try {
    let JasmineRunner = require(path.join(__dirname,'JasmineRunner.js'));

    let testDir = __dirname;
    let specFiles = JasmineRunner.findSpecFiles(testDir);
    JasmineRunner.runTests(testDir, specFiles,onDone);
} catch(err) {
    console.error('Error in tests: '+err);
    console.error(err.stack);
}
