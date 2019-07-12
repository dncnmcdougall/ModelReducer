var StateReducer = require('./StateReducer.js');
var StateActions = require('./StateActions.js');
var VersioningCreator = require('./VersioningCreator.js');
var ModelCreatorVersion = require('./ModelCreatorVersion.js');
var checkType = require('./Util.js').checkType;

var throwIfFinalised = function( finalised ) {
    if ( finalised ) {
        throw new Error('The model was already finalised, cannot modify it further.');
    }
};

function ModelCreator(modelName){
    var versioningCreator = new VersioningCreator();
    var finalised = false;
    var constModel = {};

    constModel.name = modelName;

    constModel.collectionName = modelName+'s';
    constModel.collectionKey = 'Key';

    // constModel.propertyName = modelName;
    constModel.properties = {};
    constModel.actions = {};
    constModel.requests = {};
    constModel.children = {};
    constModel.collections = {};

    constModel.customActions = [];
    constModel.customRequests = [];

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
            (child) => {return child.children;}, false);
    };

    constModel.listCustomActions = function() {
        return StateReducer.listActions(constModel, 
            (child) => {return child.customActions;}, 
            (child) => {return child.children;}, false);
    };

    constModel.listRequests = function() {
        return StateReducer.listActions(constModel, 
            (child) => {return child.requests;}, 
            (child) => {return child.children;}, false);
    };

    constModel.listCustomRequests = function() {
        return StateReducer.listActions(constModel, 
            (child) => {return child.customRequests;}, 
            (child) => {return child.children;}, false);
    };

    constModel.hasChild = function(childName) {
        return this.children.hasOwnProperty(childName);
    };
    this.hasChild = function(childName) {
        return constModel.hasChild(childName);
    };
    constModel.hasCollection = function(childName) {
        return this.children.hasOwnProperty(childName) &&
            this.collections[childName];
    };
    this.hasCollection = function(childName) {
        return constModel.hasCollection(childName);
    };


    StateActions.addCreateEmpty( constModel );

    this.copyFrom = function(otherModel) {
        throwIfFinalised(finalised);

        constModel.properties = Object.assign({}, 
            constModel.properties, 
            otherModel.properties);
        constModel.actions = Object.assign({}, 
            constModel.actions, 
            otherModel.actions);
        constModel.requests = Object.assign({}, 
            constModel.requests, 
            otherModel.requests);
        constModel.children = Object.assign({}, 
            constModel.children, 
            otherModel.children);
        constModel.collections = Object.assign({}, 
            constModel.collections, 
            otherModel.collections);
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

    this.addVersion = function() {
        var maxVersionNumber = versioningCreator.lastVersionNumber();

        var newVersion = versioningCreator.addVersion( maxVersionNumber + 1 );
        return new ModelCreatorVersion(newVersion, this);
    };
    this.getPropertyType = function(name) {
        return constModel.properties[name];
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

    this.addChild = function(childModel) {
        checkType(childModel, 'object');
        throwIfFinalised(finalised);

        if ( constModel.children.hasOwnProperty(childModel.name) ) {
            throw 'The child named "'+childModel.name+'" already exists in this model.'+
                ' Do you have two models with the same name?';
        }

        constModel.children[childModel.name] = childModel;
        constModel.collections[childModel.name] = false;
    };

    this.addChildAsCollection = function(childModel) {
        checkType(childModel, 'object');
        throwIfFinalised(finalised);

        if ( constModel.children.hasOwnProperty(childModel.name) ) {
            throw 'The child named "'+childModel.name+'" already exists in this model.'+
                ' Do you have two models with the same name?';
        }
        if ( constModel.children.hasOwnProperty(childModel.collectionName) ) {
            throw 'The child named "'+childModel.collectionName+'" already exists in this model.'+
                ' Do you have two models with the same name?';
        }

        constModel.children[childModel.collectionName] = childModel;
        constModel.collections[childModel.collectionName] = true;
    };

    this.removeChild = function(childModel) {
        checkType(childModel, 'object');
        throwIfFinalised(finalised);

        if ( constModel.children.hasOwnProperty( childModel.name ) ) {
            delete constModel.children[childModel.name];
            delete constModel.collections[childModel.name];
        } else if ( constModel.children.hasOwnProperty( childModel.collectionName ) ) {
            delete constModel.children[childModel.collectionName];
            delete constModel.collections[childModel.collectionName];
        }else {
            throw 'The child named "'+childModel.name+'" could not be removed because it is not contained.';
        }
    };

    this.addAction = function(name, func, isNotCustom) {
        checkType(name, 'string');
        checkType(func, 'function');
        throwIfFinalised(finalised);

        constModel.actions[name] = func.bind(constModel);
        if ( !isNotCustom  && !( name in constModel.customActions) ){
            constModel.customActions.push(name);
        }
    };

    this.removeAction = function(name) {
        checkType(name, 'string');
        throwIfFinalised(finalised);

        if ( !constModel.actions.hasOwnProperty(name) ) {
            throw 'The action "'+name+'"+ could not be removed because it is not contained.';
        }
        delete constModel.actions[name];
        var index = constModel.customActions.indexOf(name);
        if ( index >= 0 ) {
            constModel.customActions.splice(index, 1);
        }
    };

    this.addRequest = function(name, func, isNotCustom) {
        checkType(name, 'string');
        checkType(func, 'function');
        throwIfFinalised(finalised);

        constModel.requests[name] = func.bind(constModel);
        if ( !isNotCustom && !(name in constModel.customRequests) ) {
            constModel.customRequests.push(name);
        }
    };
    this.removeRequest = function(name) {
        checkType(name, 'string');
        throwIfFinalised(finalised);

        if ( !constModel.requests.hasOwnProperty(name) ) {
            throw 'The request "'+name+'" could not be removed because it is not contained.';
        }
        delete constModel.requests[name];
        var index = constModel.customRequests.indexOf(name);
        if ( index >= 0 ) {
            constModel.customRequests.splice(index, 1);
        }
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

        if ( constModel.properties.hasOwnProperty( constModel.collectionKey ) )
        {
            throw 'The property "'+constModel.collectionKey+'" shadows the collection key.';
        }

        constModel.versioning = versioningCreator.finalise();

        finalised = true;

        return constModel;
    };
}


module.exports =  ModelCreator;
