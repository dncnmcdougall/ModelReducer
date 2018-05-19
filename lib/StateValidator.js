var checkType = require('./Util.js').checkType;
var wrapResult = require('./Util.js').wrapResult;

function StateValidator()
{
    this.validateStateCollection = (model, collection, shouldUpdate, hasCopied) => {
        var error = null;
        if ( !model.collectionKey ) {
            error = model.propertyName+' should not be placed in a collection as it is not marked as forming a collection.';
        }

        if ( shouldUpdate && !hasCopied ) {
            collection = Object.assign({}, collection);
            hasCopied = true;
        }

        Object.keys(collection).forEach( (id) => {
            if ( !error ) {
                var internalId = collection[id][model.collectionKey];
                if ( internalId != id ) {
                    error = 'Expected '+model.propertyName+'['+id+'] to have "'+
                        model.collectionKey+'" of '+id+' but found '+internalId+'.';
                } else {
                    let result = this.validateState(model, collection[id], shouldUpdate, hasCopied);
                    if ( result.error ) {
                        error = result.error;
                    } else if ( shouldUpdate ) {
                        collection[id] = result.value;
                    }
                }
            }
        });

        return wrapResult( error, collection);
    };

    this.validateState = (model, state, shouldUpdate, hasCopied) => {
        var children = model.children;
        var properties = model.properties;

        var childCount = {};
        var collectionCount = {};
        var propertyCount = {};

        Object.keys(children).forEach( (childName) => { 
            var child = children[childName];
            if ( child.formsACollection ) {
                collectionCount[child.propertyName] = {
                    'found': false,
                    'name': childName
                }; 
            } else {
                childCount[child.propertyName] = {
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

        if ( model.formsACollection ) {
            propertyCount[model.collectionKey] = {
                'found': false,
                'type': null
            }; 
        }

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

        var modelName = model.propertyName;
        if ( model.formsACollection ) {
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
                name = childCount[key].name;
                var newChild = this.validateState(children[name], state[key], shouldUpdate); 
                if ( !newChild.error ) {
                    childCount[key].found = true;
                    if ( shouldUpdate ) {
                        state[key] = newChild.value;
                    }
                } else {
                    error =  newChild.error;
                }
            } else if ( collectionCount.hasOwnProperty(key) ) {
                name = collectionCount[key].name;
                var newCollection = this.validateStateCollection( children[name], state[key], shouldUpdate );
                if ( newCollection.error ) {
                    error = newCollection.error;
                } else {
                    if ( shouldUpdate ) {
                        state[key] = newCollection.value;
                    }
                    collectionCount[key].found = true;
                }
            } else {
                error= 'Did not expecte to find a property named '+modelName+'.'+key+', but did.';
            }
        }
        );
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
