var fs = require('fs');
var path = require('path'); 

module.exports.production = process.env.NODE_ENV == 'production';

if ( module.exports.production === true ) {
    module.exports.ModelReducer = require('../dist/model-reducer.node.js') ;
} else {
    module.exports.ModelReducer = require('../src/index.js');
}

module.exports.wrapFunction = function( object, funcName, ...args) {
    return function() {
        object[funcName](...args);
    };
};

module.exports.recurseDirectory = function(baseDir, acceptFile, acceptDir)
{
    if ( !acceptFile ) {
        acceptFile = () => true;
    }
    if ( !acceptDir ) {
        acceptDir = () => true;
    }
    var files = fs.readdirSync(baseDir);
    var acceptedFiles = [];
    while ( files.length > 0)
    {
        var file = files.pop();
        var absFile = path.join(baseDir,file);
        if ( fs.statSync(absFile).isDirectory() && acceptDir(absFile) )
        {
            var newFiles = fs.readdirSync(absFile).map( (f) => path.join(file,f));
            files.push(...newFiles);
        }
        else if( acceptFile(file) )
        {
            acceptedFiles.push(file);
        }
    }
    return acceptedFiles;
};

