/* eslint complexity: [ "warn" ] */
var checkType = require('./Util.js').checkType;

function StateActions()
{
    this.addCreateEmpty = function (constModel) {
        constModel.createEmpty = function() {
            let emptyState = {};
            for( let prop in this.properties ) {

                let value;
                switch( this.properties[prop] ) {
                case 'string':
                    value = '';
                    break;
                case 'boolean':
                    value = false;
                    break;
                case 'object':
                    value = {};
                    break;
                case 'number':
                    value = 0.0;
                    break;
                case null:
                    value = null;
                    break;
                default:
                    throw new Error('Type of property '+prop+' not recognised');
                }
                emptyState[prop] = value;
            }

            if ( this.formsACollection ) {
                emptyState[this.collectionKey] = null;
            }

            for( let childName in this.children ) {
                let child = this.children[childName];
                if ( child.formsACollection ) {
                    emptyState[child.propertyName] = {};
                } else {
                    emptyState[child.propertyName] = child.createEmpty();
                }
            }

            return emptyState;
        };
    };

    this.addStateRequest = function(constructor) {
        constructor.addRequest('State', function(state) {
            return state;
        });
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
        });
    };


    this.addAddActionFor = function(constructor, child, actionName) {
        checkType(constructor, 'object');
        checkType(child, 'object');
        if ( !child.formsACollection ) {
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

            var modName = child.propertyName;
            var merger = {};
            merger[modName] = {};
            Object.assign(merger[modName], state[modName]);
            merger[modName][key] = childObject;

            return Object.assign({},state,merger);
        });

    };

    this.addAvailableKeyRequestFor = function(constructor, child, requestName) {
        checkType(constructor, 'object');
        checkType(child, 'object');
        if ( !child.formsACollection ) {
            throw new Error('AvailableKey requests can only be created for children'+
                ' which form a collection');
        }
        if ( requestName ) {
            checkType(requestName, 'string');
        } else {
            requestName = 'Available'+child.name+child.collectionKey;
        }

        constructor.addRequest(requestName, function(state) {
            var keys = Object.keys(state[child.propertyName]).map( (value) => {
                return parseInt(value, 10); 
            });
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
        });
    };
}

module.exports = new StateActions();

