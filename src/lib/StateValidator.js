var checkType = require('./Util.js').checkType;
var wrapResult = require('./Util.js').wrapResult;
// var assert = require('./Util.js').assert;

var CollectionCreator = require('./CollectionCreator.js');


function checkProperty(state, modelName, key, propertyCount, error) {
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
    return wrapResult(error, state);
}

function checkChild(state, key, children, childCount, shouldUpdate, error, validateState) {
    var result = validateState(children[key], state[key], shouldUpdate); 
    if ( result.error ) {
        error = result.error;
    } else {
        childCount[key].found = true;
        if ( shouldUpdate ) {
            state[key] = result.value;
        }
    }
    return wrapResult(error, state);
}

function checkItem(state, key, model, modelName, shouldUpdate, error, validateState) {
    var internalKey = model.collectedChild.collectionKey;
    var internalId = state[key][internalKey];
    if ( internalId != key ) {
        error = 'Expected '+modelName+'['+key+'] to have "'+
            internalKey+'" of '+key+' but found '+internalId+'.';
    } else {
        var result = validateState(model.collectedChild, state[key], shouldUpdate);
        if ( result.error ) {
            error = result.error;
        } else if ( shouldUpdate ) {
            state[key] = result.value;
        }
    }
    return wrapResult(error, state);
}

function checkCount(modelName, count, countName, error) {
    Object.keys(count).forEach( (key) => {
        if ( !error && !count[key].found ) {
            error = 'Expected to find a '+countName+' named '+modelName+'.'+key+', but did not.';
        }
    });
    return error;
}

function validateState(model, state, shouldUpdate, hasCopied) {
        var children = model.children;
        var properties = model.properties;

        var propertyCount = {};
        var childCount = {};
        var collectionKeyCount = {};
        collectionKeyCount[model.collectionKey] = {
            'found': false,
            'name': model.collectionKey,
        };
        Object.keys(children).forEach( (childName) => { 
            childCount[childName] = {
                'found': false,
                'name': childName
            };
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
            var result = { error:null, value:state };
            if (error) {
                return;
            } else if ( key == 'version' ) {
                return;
            } else if ( key in propertyCount ) {
                result = checkProperty(state, modelName, key, propertyCount, error);
            } else if ( key in childCount ) {
                result = checkChild(state, key, children, childCount, shouldUpdate, error, validateState);
            } else if ( key in collectionKeyCount) {
                collectionKeyCount.found = true;
            } else if ( model.isCollection() ) {
                result = checkItem(state, key, model, modelName, shouldUpdate, error, validateState);
            } else {
                result = wrapResult('Did not expect to find a property named '+modelName+'.'+key+', but did.', null);
            }

            if ( result.error ) {
                error = result.error;
            } else {
                state = result.value;
            }
        });

        error = checkCount(modelName, childCount, 'child', error);
        error = checkCount(modelName, propertyCount, 'property', error);
        // error = checkCount(modelName, collectionKeyCount, 'collection key', error);

        return wrapResult( error, state);
}

function StateValidator()
{
    this.validateStateCollection = function(model, state, shouldUpdate, hasCopied) {
        var collectionModel = null;

        if ( model.isCollection() == false ) {
            collectionModel = new CollectionCreator(model, model.name).finaliseModel();
        }

        // if( model.isCollection() == false ) {
        //     error = 'Expected the model "'+model.name+'" to be a collection, but was not.';
        //     return wrapResult( error, null);
        // }

        return validateState(collectionModel, state, shouldUpdate, hasCopied);
    };

    this.validateState = function(model, state, shouldUpdate, hasCopied) {
        return validateState(model, state, shouldUpdate, hasCopied);
    };
}

module.exports = new StateValidator();
