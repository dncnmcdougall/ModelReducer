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
