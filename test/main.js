var path = require('path');

try {
    let JasmineRunner = require(path.join(__dirname,'JasmineRunner.js'));

    let testDir = __dirname;
    let specFiles = JasmineRunner.findSpecFiles(testDir);
    JasmineRunner.runTests(testDir, specFiles, () => {app.quit();});
} catch(err) {
    console.error('Error in tests');
    console.error(err.stack);
}
