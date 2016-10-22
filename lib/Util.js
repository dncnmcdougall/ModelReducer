var fs = require('fs');
var path = require('path'); 

module.exports.recurseDirectory = function(baseDir, acceptFile, acceptDir)
{
    if ( !acceptFile ) {
        acceptFile = () => {return true;};
    }
    if ( !acceptDir ) {
        acceptDir = () => {return true;};
    }
    var files = fs.readdirSync(baseDir);
    var acceptedFiles = [];
    while ( files.length > 0)
    {
        var file = files.pop();
        var absFile = path.join(baseDir,file);
        if ( fs.statSync(absFile).isDirectory() && acceptDir(absFile) )
        {
            var newFiles = fs.readdirSync(absFile).map( (f) => {
                return path.join(file,f);
            });
            files.push(...newFiles);
        }
        else if( acceptFile(file) )
        {
            acceptedFiles.push(file);
        }
    }
    return acceptedFiles;
};

module.exports.checkType = function(thing, type) {
    if ( type === 'array' ) {
        if ( typeof(thing) !== 'object' || Array.isArray(thing) !== true ) {
            throw new Error('Expected parameter to be of type "array" but received "'+typeof(thing)+'".');
        }
    } else if ( typeof(thing) !== type ) {
        throw new Error('Expected parameter to be of type "'+type+'" but received "'+typeof(thing)+'".');
    }
};
