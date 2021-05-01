var checkType = require('./Util.js').checkType;
var wrapResult = require('./Util.js').wrapResult;

function StateValidator()
{
    this.validateStateCollection = (model, collectionState, shouldUpdate, hasCopied) => {
        var error = null;

        if ( shouldUpdate && !hasCopied ) {
            collectionState = Object.assign({}, collectionState);
            hasCopied = true;
        }

        Object.keys(collectionState).forEach( (key) => {
            if ( !error ) {
               var internalId = collectionState[key][model.collectionKey];
                if ( internalId != key ) {
                    error = 'Expected '+model.name+'['+key+'] to have "'+
                        model.collectionKey+'" of '+key+' but found '+internalId+'.';
                } else {
                    let result = this.validateState(model, collectionState[key], shouldUpdate, hasCopied);
                    if ( result.error ) {
                        error = result.error;
                    } else if ( shouldUpdate ) {
                        collectionState[key] = result.value;
                    }
                }
            }
        });

        return wrapResult( error, collectionState);
    };

    this.validateState = function(model, state, shouldUpdate, hasCopied) {
        var children = model.children;
        var properties = model.properties;

        var childCount = {};
        var collectionCount = {};
        var propertyCount = {};
        var collectionKeyCount = {
            'found': false,
            'name': model.collectionKey,
            'type': null
        };

        Object.keys(children).forEach( (childName) => { 
            if ( model.hasCollection(childName) ) {
                collectionCount[childName] = {
                    'found': false,
                    'name': childName
                }; 
            } else {
                childCount[childName] = {
                    'found': false,
                    'name': childName
                };
            }
        });

        Object.keys(properties).forEach( (prop) => { 
            propertyCount[prop] = {
                'found': false,
                'type': properties[prop]
            };
        });

        if ( shouldUpdate ) {
            var result = model.versioning.update( state );
            if ( result.error ) {
                return result;
            } else {
                hasCopied = true;
                state = result.value;
            }
        }

        var error = null;

        var modelName = model.name;
        if ( state.hasOwnProperty(model.collectionKey) ) {
            let id = state[ model.collectionKey];
            modelName = modelName+'['+id+']';
        } 

        Object.keys(state).forEach( (key) => {
            var name;
            if (error) {
                return;
            } else if ( key == 'version' ) {
                return;
            } else if ( propertyCount.hasOwnProperty(key) ) {
                var type = propertyCount[key].type;
                if ( type != null ) {
                    try {
                        checkType( state[key], type );
                        propertyCount[key].found = true;
                    } catch (err)  {
                        error = 'Expected property '+modelName+'.'+key+' to have type "'+
                            type+'", but found type "'+typeof( state[key] )+'".';
                    }
                } else {
                    propertyCount[key].found = true;
                }
            } else if ( childCount.hasOwnProperty(key) ) {
                var newChild = this.validateState(children[key], state[key], shouldUpdate); 
                if ( !newChild.error ) {
                    childCount[key].found = true;
                    if ( shouldUpdate ) {
                        state[key] = newChild.value;
                    }
                } else {
                    error =  newChild.error;
                }
            } else if ( collectionCount.hasOwnProperty(key) ) {
                var newCollection = this.validateStateCollection( children[key], state[key], shouldUpdate );
                if ( newCollection.error ) {
                    error = newCollection.error;
                } else {
                    if ( shouldUpdate ) {
                        state[key] = newCollection.value;
                    }
                    collectionCount[key].found = true;
                }
            } else if ( collectionKeyCount.name == key ) {
                collectionKeyCount.found = true;
            } else {
                error= 'Did not expect to find a property named '+modelName+'.'+key+', but did.';
            }
        });

        Object.keys(collectionCount).forEach( (key) => {
            if ( !error && !collectionCount[key].found ) {
                error = 'Expected to find a collection named '+modelName+'.'+key+', but did not.';
            }
        });

        Object.keys(childCount).forEach( (key) => {
            if ( !error && !childCount[key].found ) {
                error = 'Expected to find a child named '+modelName+'.'+key+', but did not.';
            }
        });

        Object.keys(propertyCount).forEach( (key) => {
            if ( !error && !propertyCount[key].found ) {
                error = 'Expected to find a property named '+modelName+'.'+key+', but did not.';
            }
        });

        return wrapResult( error, state);
    };
}

module.exports = new StateValidator();
