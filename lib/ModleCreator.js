var StateReducer = require('./StateReducer.js');
var StateActions = require('./StateActions.js');
var checkType = require('./Util.js').checkType;

var throwIfFinalised = function( finalised ) {
    if ( finalised ) {
        throw new Error('The model was already finalised, cannot modify it further.');
    }
};

function ModelCreator(modelName){
    var finalised = false;
    var constModel = {};

    constModel.name = modelName;

    constModel.formsACollection = false;
    constModel.collectionName = modelName+'s';
    constModel.collectionKey = 'Key';

    constModel.propertyName = modelName;
    constModel.properties = {};
    constModel.actions = {};
    constModel.requests = {};
    constModel.children = {};

    constModel.reduce = function(actionString, state, ...args) {
        return StateReducer.reduce(constModel, 
            (child) => {return child.actions;}, 
            (child) => {return child.children;}, 
            true, actionString, state, ...args);
    };

    constModel.request = function(requestString, state, ...args) {
        return StateReducer.reduce(constModel, 
            (child) => {return child.requests;}, 
            (child) => {return child.children;}, 
            false, requestString, state, ...args);
    };

    constModel.listActions = function() {
        return StateReducer.listActions(constModel, 
            (child) => {return child.actions;}, 
            (child) => {return child.children;});
    };

    constModel.listRequests = function() {
        return StateReducer.listActions(constModel, 
            (child) => {return child.requests;}, 
            (child) => {return child.children;});
    };

    StateActions.addCreateEmpty( constModel );

    this.copyFrom = function(otherModel) {
        throwIfFinalised(finalised);
    };

    this.setFormsACollection = function(formsACollection) {
        checkType(formsACollection, 'boolean');
        throwIfFinalised(finalised);

        constModel.formsACollection = formsACollection;
    };

    this.setCollectionName = function(collectionName) {
        checkType(collectionName, 'string');
        throwIfFinalised(finalised);

        constModel.collectionName = collectionName;
    };

    this.setCollectionKey = function(keyField) {
        checkType(keyField, 'string');
        throwIfFinalised(finalised);

        constModel.collectionKey = keyField;
    };

    this.addProperty = function(name, type) {
        checkType(name, 'string');
        if ( type ) {
            checkType(type, 'string');
        } else {
            type = null;
        }
        throwIfFinalised(finalised);

        constModel.properties[name] = type;
    };

    this.removeProperty = function(name) {
        checkType(name, 'string');
        throwIfFinalised(finalised);

        if ( !constModel.properties.hasOwnProperty(name) ) {
            throw 'The property "'+name+'" could not be removed because it is not contained.';
        }
        delete constModel.properties[name];
    };

    this.addChildModel = function(childModel) {
        checkType(childModel, 'object');
        throwIfFinalised(finalised);

        if ( constModel.children.hasOwnProperty(childModel.name) ) {
            throw 'The child named "'+childModel.name+'" already exists in this model.'+
                ' Do you have two models with the same name?';
        }

        constModel.children[childModel.name] = childModel;
    };

    this.removeChildModel = function(childModel) {
        checkType(childModel, 'object');
        throwIfFinalised(finalised);

        if ( !constModel.children.hasOwnProperty(childModel.name) ) {
            throw 'The child named "'+childModel.name+'" could not be removed because it is not contained.';
        }
        delete constModel.children[childModel.name];
    };

    this.addAction = function(name, func) {
        checkType(name, 'string');
        checkType(func, 'function');
        throwIfFinalised(finalised);

        constModel.actions[name] = func.bind(constModel);
    };

    this.removeAction = function(name) {
        checkType(name, 'string');
        throwIfFinalised(finalised);

        if ( !constModel.actions.hasOwnProperty(name) ) {
            throw 'The action "'+name+'"+ could not be removed because it is not contained.';
        }
        delete constModel.actions[name];
    };

    this.addRequest = function(name, func) {
        checkType(name, 'string');
        checkType(func, 'function');
        throwIfFinalised(finalised);

        constModel.requests[name] = func.bind(constModel);
    };
    this.removeRequest = function(name) {
        checkType(name, 'string');
        throwIfFinalised(finalised);

        if ( !constModel.requests.hasOwnProperty(name) ) {
            throw 'The request "'+name+'" could not be removed because it is not contained.';
        }
        delete constModel.requests[name];
    };

    this.addStateRequest = function() {
        StateActions.addStateRequest(this);
    };

    this.addSetPropertyActionFor = function(propertyName, actionName) {
        StateActions.addSetPropertyActionFor( this, propertyName, actionName);
    };

    this.addAddActionFor = function(child, actionName) {
        StateActions.addAddActionFor( this, child, actionName);
    };

    this.addAvailableKeyRequestFor = function(child, actionName) {
        StateActions.addAvailableKeyRequestFor( this, child, actionName);
    };

    this.finaliseModel = function() {
        throwIfFinalised(finalised);
        if ( constModel.formsACollection ) {
            constModel.propertyName = constModel.collectionName;

            if ( constModel.properties.hasOwnProperty( constModel.collectionKey ) )
            {
                throw 'The property "'+constModel.collectionKey+'" shadows the collection key.';
            }
        } else {
            constModel.propertyName = constModel.name;
            delete constModel.collectionKey;
        }
        delete constModel.collectionName;

        finalised = true;

        return constModel;
    };
}


module.exports =  ModelCreator;
