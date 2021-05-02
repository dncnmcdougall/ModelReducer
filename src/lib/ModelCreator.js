const StateActions = require('./StateActions.js');
const VersioningCreator = require('./VersioningCreator.js');
const ModelCreatorVersion = require('./ModelCreatorVersion.js');
const Model = require('./Model.js');

var checkType = require('./Util.js').checkType;
var objectOrString = require('./Util.js').objectOrString;

var throwIfFinalised = function( finalised ) {
    if ( finalised ) {
        throw new Error('The model was already finalised, cannot modify it further.');
    }
};

function ModelCreator(modelName){
    var versioningCreator = new VersioningCreator();
    var finalised = false;
    this.modelUnderConstruction = new Model(modelName);

    this.hasChild = function(childName) {
        return this.modelUnderConstruction.hasChild(childName);
    };
    this.hasCollection = function(childName) {
        return this.modelUnderConstruction.hasCollection(childName);
    };

    this.copyFrom = function(otherModel) {
        throwIfFinalised(finalised);

        this.modelUnderConstruction.properties = Object.assign({}, 
            this.modelUnderConstruction.properties, 
            otherModel.properties);
        this.modelUnderConstruction.actions = Object.assign({}, 
            this.modelUnderConstruction.actions, 
            otherModel.actions);
        this.modelUnderConstruction.requests = Object.assign({}, 
            this.modelUnderConstruction.requests, 
            otherModel.requests);
        this.modelUnderConstruction.children = Object.assign({}, 
            this.modelUnderConstruction.children, 
            otherModel.children);
        this.modelUnderConstruction.collections = Object.assign({}, 
            this.modelUnderConstruction.collections, 
            otherModel.collections);
    };

    this.setCollectionKey = function(keyField) {
        checkType(keyField, 'string');
        throwIfFinalised(finalised);

        this.modelUnderConstruction.collectionKey = keyField;
    };

    this.addVersion = function() {
        var maxVersionNumber = versioningCreator.lastVersionNumber();

        var newVersion = versioningCreator.addVersion( maxVersionNumber + 1 );
        return new ModelCreatorVersion(newVersion, this);
    };

    this.getPropertyType = function(name) {
        return this.modelUnderConstruction.properties[name];
    };

    this.addProperty = function(name, type) {
        checkType(name, 'string');
        if ( type ) {
            checkType(type, 'string');
        } else {
            type = null;
        }
        throwIfFinalised(finalised);

        this.modelUnderConstruction.properties[name] = type;
    };

    this.removeProperty = function(name) {
        checkType(name, 'string');
        throwIfFinalised(finalised);

        if ( !this.modelUnderConstruction.properties.hasOwnProperty(name) ) {
            throw Error('The property "'+name+'" could not be removed because it is not contained.');
        }
        delete this.modelUnderConstruction.properties[name];
    };

    this.addChild = function(childModel, childName) {
        if ( childName ) {
            checkType(childName, 'string');
        } else {
            childName = childModel.name;
        }

        checkType(childModel, 'object');
        throwIfFinalised(finalised);

        if ( this.modelUnderConstruction.children.hasOwnProperty(childName) ) {
            throw new Error('The child named "'+childName+'" already exists in this model.'+
                ' Do you have two models with the same name?');
        }

        this.modelUnderConstruction.children[childName] = childModel;
        this.modelUnderConstruction.collections[childName] = false;
    };

    this.addChildAsCollection = function(childModel) {
        checkType(childModel, 'object');
        throwIfFinalised(finalised);
        let collectionName = childModel.name+'[]';

        if ( this.modelUnderConstruction.children.hasOwnProperty(collectionName) ) {
            throw new Error('The child named "'+collectionName+'" already exists in this model.'+
                ' Do you have two models with the same name?');
        }

        this.modelUnderConstruction.children[collectionName] = childModel;
        this.modelUnderConstruction.collections[collectionName] = true;
    };

    this.removeChild = function(childModel) {
        let childName = objectOrString(childModel, (c) => c.name);
        throwIfFinalised(finalised);

        if ( this.modelUnderConstruction.children.hasOwnProperty(childName) ) {
            delete this.modelUnderConstruction.children[childName];
            delete this.modelUnderConstruction.collections[childName];
        }else if ( this.modelUnderConstruction.children.hasOwnProperty(childName+'[]') ) {
            delete this.modelUnderConstruction.children[childName];
            delete this.modelUnderConstruction.collections[childName];
        }else {
            throw new Error('The child named "'+childName+'" could not be removed because it is not contained.');
        }
    };

    this.addAction = function(name, func, isNotCustom) {
        checkType(name, 'string');
        checkType(func, 'function');
        throwIfFinalised(finalised);

        this.modelUnderConstruction.actions[name] = func.bind(this.modelUnderConstruction);
        if ( !isNotCustom  && !( name in this.modelUnderConstruction.customActions) ){
            this.modelUnderConstruction.customActions.push(name);
        }
    };

    this.removeAction = function(name) {
        checkType(name, 'string');
        throwIfFinalised(finalised);

        if ( !this.modelUnderConstruction.actions.hasOwnProperty(name) ) {
            throw new Error('The action "'+name+'"+ could not be removed because it is not contained.');
        }
        delete this.modelUnderConstruction.actions[name];
        var index = this.modelUnderConstruction.customActions.indexOf(name);
        if ( index >= 0 ) {
            this.modelUnderConstruction.customActions.splice(index, 1);
        }
    };

    this.addRequest = function(name, func, isNotCustom) {
        checkType(name, 'string');
        checkType(func, 'function');
        throwIfFinalised(finalised);

        this.modelUnderConstruction.requests[name] = func.bind(this.modelUnderConstruction);
        if ( !isNotCustom && !(name in this.modelUnderConstruction.customRequests) ) {
            this.modelUnderConstruction.customRequests.push(name);
        }
    };
    this.removeRequest = function(name) {
        checkType(name, 'string');
        throwIfFinalised(finalised);

        if ( !this.modelUnderConstruction.requests.hasOwnProperty(name) ) {
            throw new Error('The request "'+name+'" could not be removed because it is not contained.');
        }
        delete this.modelUnderConstruction.requests[name];
        var index = this.modelUnderConstruction.customRequests.indexOf(name);
        if ( index >= 0 ) {
            this.modelUnderConstruction.customRequests.splice(index, 1);
        }
    };

    this.addStateRequest = function(actionName) {
        StateActions.addStateRequest(this, actionName);
    };

    this.addSetActionFor = function(propertyName, actionName) {
        StateActions.addSetActionFor( this, propertyName, actionName);
    };

    this.addAddActionFor = function(child, actionName) {

        StateActions.addAddActionFor( this, child, actionName);
    };

    this.addAvailableKeyRequestFor = function(child, actionName) {
        StateActions.addAvailableKeyRequestFor( this, child, actionName);
    };

    this.finaliseModel = function() {
        throwIfFinalised(finalised);

        if ( this.modelUnderConstruction.properties.hasOwnProperty( this.modelUnderConstruction.collectionKey ) )
        {
            throw new Error('The property "'+this.modelUnderConstruction.collectionKey+'" shadows the collection key.');
        }

        this.modelUnderConstruction.versioning = versioningCreator.finalise();

        finalised = true;

        return this.modelUnderConstruction;
    };
}


module.exports =  ModelCreator;
