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
        if ( Array.isArray(thing) !== true) {
            throw new Error('Expected parameter to be of type "array" but received "'+typeof(thing)+'".');
        }
    } else if ( type === 'object' && Array.isArray(thing) === true ) {
        throw new Error('Expected parameter to be of type "object" but received "array".');
    } else if ( typeof(thing) !== type ) {
        throw new Error('Expected parameter to be of type "'+type+'" but received "'+typeof(thing)+'".');
    }
};

module.exports.wrapResult = function(error, value) {
    if ( error ) {
        return {
            'error': error,
            'value': null
        };
    } else {
        return {
            'error': null,
            'value': value
        };
    }
};

module.exports.defaultValue = function(type, name) {
    switch(type) {
    case 'string':
        return '';
    case 'boolean':
        return false;
    case 'object':
        return {};
    case 'number':
        return 0.0;
    case 'array':
        return [];
    case null:
        return null;
    default:
        if ( name ) {
            throw new Error('Type ('+type+') of property '+name+' not recognised');
        } else {
            throw new Error('Type '+type+' not recognised');
        }
    }
};