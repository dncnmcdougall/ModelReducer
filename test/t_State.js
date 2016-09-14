/*eslint-env jasmine */

var path = require('path'); 
var fs = require('fs');
var State = require('membro/state/State.js');
var JasmineRunner = require('../JasmineRunner.js');

var actions = State.listActions();
var requests = State.listRequests();
var fileList = JasmineRunner.findSpecFiles(__dirname).map( (file) => {
    return path.join(__dirname,file);
});


var generateActionFiles = false;
var generateRequestFiles = false;

var generateContent = function( thing, type ) {
    var thingParts = thing.split('.');
    var model = thingParts[thingParts.length-2];
    var thingName = thingParts[thingParts.length-1];

    return  'var ' + model+' = require(\'membro/state/'+model+'.js\');\n'+
            'console.log('+model+');\n'+
            '\n'+
            'describe(\''+type+' '+model+'.'+thingName+'\', function() {\n'+
            '   it(\'Needs to be implemented\');\n'+
            '});\n\n';
};

describe('State', function() {

    it('Should have tests for all the actions.', function(){
        var missingTests = [];
        actions.forEach(function(action) {
            var testFileName = path.join('StateTests','test_Action_'+action+'.js');
            var fullTestFileName = path.join(__dirname, testFileName);

            if ( generateActionFiles && fileList.indexOf(fullTestFileName) == -1) {
                fs.writeFileSync(fullTestFileName,generateContent(action, 'Action'));
            }

            if ( fileList.indexOf(fullTestFileName) == -1 ) {
                missingTests.push(testFileName);
            }
        });
        if ( missingTests.length != 0 ) {
            throw ('Missing tests: '+missingTests.join('\n'));
        }
    });

    it('Should have tests for all the requests.', function(){
        var missingTests = [];
        requests.forEach(function(request) {
            var testFileName = path.join('StateTests','test_Request_'+request+'.js');
            var fullTestFileName = path.join(__dirname, testFileName);

            if ( generateRequestFiles && fileList.indexOf(fullTestFileName) == -1) {
                fs.writeFileSync(fullTestFileName,generateContent(request, 'Request'));
            }

            if ( fileList.indexOf(fullTestFileName) == -1 ) {
                missingTests.push(testFileName);
            }
        });
        if ( missingTests.length != 0 ) {
            throw ('Missing tests: '+missingTests.join('\n'));
        }
    });
});
