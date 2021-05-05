const StateActions = require('./StateActions.js');
const VersioningCreator = require('./VersioningCreator.js');
const ModelCreatorVersion = require('./ModelCreatorVersion.js');
const Model = require('./Model.js');
const Collection = require('./Collection.js');

var checkType = require('./Util.js').checkType;
var objectOrString = require('./Util.js').objectOrString;
var assert = require('./Util.js').assert;

module.exports =  ModelCreator;
const CollectionCreator = require('./CollectionCreator.js');

var throwIfFinalised = function( finalised ) {
    if ( finalised ) {
        throw new Error('The model was already finalised, cannot modify it further.');
    }
};

function ModelCreator(modelName){
    var versioningCreator = new VersioningCreator();
    var finalised = false;
    this.modelUnderConstruction = new Model(modelName);
    this.collectionsUnderConstruction = {};

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
        assert( childModel instanceof Model, 
            'Expected the parameter to be an instance of model, but received a "'+typeof(childModel)+'"');
        throwIfFinalised(finalised);

        if ( childName ) {
            checkType(childName, 'string');
        } else {
            childName = childModel.name;
        }

        if ( childName == this.modelUnderConstruction.collectionKey ){
            throw new Error('Tried to add a child item with name "'+childName+'", which would override the collection key.');
        } else if ( childName in this.modelUnderConstruction.properties ){
            throw new Error('Tried to add a child item with name "'+childName+'", which would override a property.');
        } else if ( childName in this.modelUnderConstruction.children ){
            throw new Error('Tried to add a child item with name "'+childName+'", which would override another child.');
        } else if ( childName in this.modelUnderConstruction.actions ){
            throw new Error('Tried to add a child item with name "'+childName+'", which would override an action.');
        } else if ( childName in this.modelUnderConstruction.requests ){
            throw new Error('Tried to add a child item with name "'+childName+'", which would override a request.');
        }

        this.modelUnderConstruction.children[childName] = childModel;
        // this.modelUnderConstruction.collections[childName] = false;
        this.modelUnderConstruction.collections[childName] = (childModel instanceof Collection);
    };

    this.addChildAsCollection = function(childModel, collectionName) {
        assert( childModel instanceof Model, 
            'Expected the parameter to be an instance of model, but received a "'+typeof(childModel)+'"');
        throwIfFinalised(finalised);

        if ( collectionName ) {
            checkType(collectionName, 'string');
        } else {
            collectionName = childModel.name+'[]';
        }

        if ( collectionName == this.modelUnderConstruction.collectionKey ){
            throw new Error('Tried to add a child item with name "'+collectionName+'", which would override the collection key.');
        } else if ( collectionName in this.modelUnderConstruction.properties ){
            throw new Error('Tried to add a child item with name "'+collectionName+'", which would override a property.');
        } else if ( collectionName in this.modelUnderConstruction.children ){
            throw new Error('Tried to add a child item with name "'+collectionName+'", which would override another child.');
        } else if ( collectionName in this.modelUnderConstruction.actions ){
            throw new Error('Tried to add a child item with name "'+collectionName+'", which would override an action.');
        } else if ( collectionName in this.modelUnderConstruction.requests ){
            throw new Error('Tried to add a child item with name "'+collectionName+'", which would override a request.');
        }

        this.collectionsUnderConstruction[collectionName] = new CollectionCreator(collectionName, childModel);
        this.modelUnderConstruction.children[collectionName] = null;
        this.modelUnderConstruction.collections[collectionName] = true;
        return this.collectionsUnderConstruction[collectionName];
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

        Object.keys(this.collectionsUnderConstruction).forEach( (key) => {
            let collection = this.collectionsUnderConstruction[key].finaliseModel();
            this.modelUnderConstruction.children[key] = collection;
        });

        this.modelUnderConstruction.versioning = versioningCreator.finalise();

        finalised = true;

        return this.modelUnderConstruction;
    };
}


