/* eslint complexity: [ "warn" ] */
var checkType = require('./Util.js').checkType;
var defaultValue = require('./Util.js').defaultValue;

function StateActions()
{
    this.addCreateEmpty = function (constModel) {
        constModel.createEmpty = function() {
            let emptyState = {};
            for( let prop in this.properties ) {

                let value = defaultValue(this.properties[prop], prop);

                emptyState[prop] = value;
            }

            for( let childName in this.children ) {
                let child = this.children[childName];
                if ( constModel.hasCollection(child.collectionName) ) {
                    emptyState[child.collectionName] = {};
                } else {
                    emptyState[child.name] = child.createEmpty();
                }
            }

            return emptyState;
        };
    };

    this.addStateRequest = function(constructor) {
        constructor.addRequest('State', function(state) {
            return state;
        }, true);
    };

    this.addSetPropertyActionFor = function(constructor, propertyName, actionName) {
        checkType(constructor, 'object');
        checkType(propertyName, 'string');
        if ( actionName ) {
            checkType(actionName, 'string');
        } else {
            actionName = 'Set'+propertyName;
        }


        constructor.addAction(actionName, function(state, value) {
            if ( this.properties.hasOwnProperty(propertyName) === false ) {
                throw new Error('The property "'+propertyName+'" was not defined on the model');
            }
            if ( this.properties[propertyName] ) {
                checkType(value, this.properties[propertyName] );
            }
            if ( state[propertyName] === value )
            {
                return state;
            }
            var merger = {};
            merger[propertyName] = value;
            return Object.assign({},state,merger);
        }, true);
    };


    this.addAddActionFor = function(constructor, child, actionName) {
        checkType(constructor, 'object');
        checkType(child, 'object');
        if ( !constructor.hasCollection(child.collectionName) ) {
            throw new Error('Add actions can only be created for children'+
                ' which form a collection');
        }
        if ( actionName ) {
            checkType(actionName, 'string');
        } else {
            actionName = 'Add'+child.name;
        }

        constructor.addAction(actionName, function(state, key) {
            var childObject = child.createEmpty();
            childObject[child.collectionKey] = key;

            var modName = child.collectionName;
            var merger = {};
            merger[modName] = {};
            Object.assign(merger[modName], state[modName]);
            merger[modName][key] = childObject;

            return Object.assign({},state,merger);
        }, true);
    };

    this.addAvailableKeyRequestFor = function(constructor, child, requestName) {
        checkType(constructor, 'object');
        checkType(child, 'object');
        if ( !constructor.hasCollection(child.collectionName) ) {
            throw new Error('AvailableKey requests can only be created for children'+
                ' which form a collection');
        }
        if ( requestName ) {
            checkType(requestName, 'string');
        } else {
            var key = child.collectionKey;
            key = key[0].toUpperCase() + key.slice(1);
            requestName = 'Available'+child.name+key;
        }

        constructor.addRequest(requestName, function(state) {
            var keys = [];
            if ( state && state[child.collectionName] ) {
                keys = Object.keys(state[child.collectionName]).map( (value) => {
                    return parseInt(value, 10); 
                });
            }
            keys.sort( (a,b) => { return a-b; });
            var key = keys.length-1;
            if ( key < 0 ) {
                return 0;
            }
            var delta = parseInt(keys.length/2, 10);
            if ( delta < 1 ) {
                delta = 1;
            }
            var dir = 0;

            while ( delta > 0 ) {
                if ( keys[key] === key ) {
                    if ( key === keys.length -1 ) {
                        return keys.length;
                    } else if ( keys[key+1] > (key+1) ) {
                        return (key + 1);
                    } else if ( keys[key+1] === (key+1) ) {
                        key += delta;
                        if ( dir < 0 ) {
                            delta = parseInt(delta /2, 10);
                        }
                        dir = 1;
                    } else {
                        throw 'This should not happen: ===, <';
                    }
                } else if ( keys[key] > key ) {
                    if ( key === 0 ) {
                        return 0;
                    } else if ( keys[key-1] === (key-1) ) {
                        return key;
                    } else if ( keys[key-1] > (key-1) ) {
                        key -= delta;
                        if ( dir > 0 ) {
                            delta = parseInt(delta /2, 10);
                        }
                        dir = -1;
                    } else {
                        throw 'This should not happen: >, <';
                    }
                } else {
                    throw 'This should not happen: <';
                }
                if ( delta < 1 ) {
                    delta = 1;
                }
                if ( key < 0 ) {
                    key = 0;
                } else if ( key >= keys.length ) {
                    throw 'This should not happen: Out of bounds';
                }
            }
            throw 'This should not happen: delta === 0';
        }, true);
    };
}

module.exports = new StateActions();

