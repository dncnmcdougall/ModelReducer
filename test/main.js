/*eslint no-console: off*/

var path = require('path');

function onDone() {
}

try {
    let includeInternal = !require('./Util.js').production;
    let JasmineRunner = require(path.join(__dirname,'JasmineRunner.js'));

    let testDir = __dirname;
    let specFiles = JasmineRunner.findSpecFiles(testDir, includeInternal);
    console.log('includeInternal: ' + includeInternal);
    console.log(specFiles);
    JasmineRunner.runTests(testDir, specFiles,onDone);
} catch(err) {
    console.error('Error in tests: '+err);
    console.error(err.stack);
}
