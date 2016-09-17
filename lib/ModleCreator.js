var StateReducer = require('./StateReducer.js');

var checkType = function( thing, type) {
    if ( typeof(thing) !== type ) {
        throw new Error('Expected parameter to be of type "'+type+'" but received "'+typeof(thing)+'".');
    }
};

function ModelCreator(modelName){
    var constModel = {};

    constModel.name = modelName;

    constModel.formsACollection = false;
    constModel.collectionName = modelName+'s';
    constModel.collectionKey = 'id';

    constModel.propertyName = modelName;
    constModel.properties = {};
    constModel.actions = {};
    constModel.requests = {};
    constModel.children = {};

    constModel.reduce = function(actionString, state, ...args) {
        return StateReducer.reduce(this, 
            (child) => {return child.actions;}, 
            (child) => {return child.children;}, 
            true, actionString, state, ...args);
    };

    constModel.request = function(requestString, state, ...args) {
        return StateReducer.reduce(this, 
            (child) => {return child.requests;}, 
            (child) => {return child.children;}, 
            false, requestString, state, ...args);
    };

    constModel.listActions = function() {
        return StateReducer.listActions(this, 
            (child) => {return child.actions;}, 
            (child) => {return child.children;});
    };

    constModel.listRequests = function() {
        return StateReducer.listActions(this, 
            (child) => {return child.requests;}, 
            (child) => {return child.children;});
    };

    this.copyFrom = function(otherModel) {
    };

    this.setFormsACollection = function(formsACollection) {
        checkType(formsACollection, 'boolean');
        constModel.formsACollection = formsACollection;
    };

    this.setCollectionName = function(collectionName) {
        checkType(collectionName, 'string');
        constModel.collectionName = collectionName;
    };

    this.setCollectionKeyField = function(keyField) {
        checkType(keyField, 'string');
        constModel.collectionKey = keyField;
    };

    this.addProperty = function(name, type) {
        checkType(name, 'string');
        if ( type ) {
            checkType(type, 'string');
        } else {
            type = null;
        }

        constModel.properties[name] = type;
    };

    this.removeProperty = function(name) {
        checkType(name, 'string');

        if ( !constModel.properties.hasOwnProperty(name) ) {
            throw 'The property "'+name+'" could not be removed because it is not contained.';
        }
        delete constModel.properties[name];
    };

    this.addChildModel = function(childModel) {
        checkType(childModel, 'object');

        constModel.children[childModel.propertyName] = childModel;
    };

    this.removeChildModel = function(childModel) {
        checkType(childModel, 'object');

        if ( !constModel.children.hasOwnProperty(childModel.propertyName) ) {
            throw 'The child named "'+childModel.name+'" could not be removed because it is not contained.';
        }
        delete constModel.children[childModel.propertyName];
    };

    this.addAction = function(name, func) {
        checkType(name, 'string');
        checkType(func, 'function');

        constModel.actions[name] = func;
    };

    this.removeAction = function(name) {
        checkType(name, 'string');

        if ( !constModel.actions.hasOwnProperty(name) ) {
            throw 'The action "'+name+'"+ could not be removed because it is not contained.';
        }
        delete constModel.actions[name];
    };

    this.addRequest = function(name, func) {
        checkType(name, 'string');
        checkType(func, 'function');

        constModel.requests[name] = func;
    };
    this.removeRequest = function(name) {
        checkType(name, 'string');

        if ( !constModel.request.hasOwnProperty(name) ) {
            throw 'The request "'+name+'" could not be removed because it is not contained.';
        }
        delete constModel.requests[name];
    };

    this.finaliseModel = function() {
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

        return constModel;
    };
}


module.exports =  ModelCreator;
