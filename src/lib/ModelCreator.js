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
    var constModel = new Model(modelName);

    this.hasChild = function(childName) {
        return constModel.hasChild(childName);
    };
    this.hasCollection = function(childName) {
        return constModel.hasCollection(childName);
    };

    // StateActions.addCreateEmpty( constModel );

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
            throw Error('The property "'+name+'" could not be removed because it is not contained.');
        }
        delete constModel.properties[name];
    };

    this.addChild = function(childModel, childName) {
        if ( childName ) {
            checkType(childName, 'string');
        } else {
            childName = childModel.name;
        }

        checkType(childModel, 'object');
        throwIfFinalised(finalised);

        if ( constModel.children.hasOwnProperty(childName) ) {
            throw new Error('The child named "'+childName+'" already exists in this model.'+
                ' Do you have two models with the same name?');
        }

        constModel.children[childName] = childModel;
        constModel.collections[childName] = false;
    };

    this.addChildAsCollection = function(childModel) {
        checkType(childModel, 'object');
        throwIfFinalised(finalised);
        let collectionName = childModel.name+'[]';

        // if ( constModel.children.hasOwnProperty(childModel.name) ) {
        //     throw 'The child named "'+childModel.name+'" already exists in this model.'+
        //         ' Do you have two models with the same name?';
        // }
        if ( constModel.children.hasOwnProperty(collectionName) ) {
            throw new Error('The child named "'+collectionName+'" already exists in this model.'+
                ' Do you have two models with the same name?');
        }

        constModel.children[collectionName] = childModel;
        constModel.collections[collectionName] = true;
    };

    this.removeChild = function(childModel) {
        let childName = objectOrString(childModel, (c) => c.name);
        throwIfFinalised(finalised);

        if ( constModel.children.hasOwnProperty(childName) ) {
            delete constModel.children[childName];
            delete constModel.collections[childName];
        }else if ( constModel.children.hasOwnProperty(childName+'[]') ) {
            delete constModel.children[childName];
            delete constModel.collections[childName];
        }else {
            throw new Error('The child named "'+childName+'" could not be removed because it is not contained.');
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
            throw new Error('The action "'+name+'"+ could not be removed because it is not contained.');
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
            throw new Error('The request "'+name+'" could not be removed because it is not contained.');
        }
        delete constModel.requests[name];
        var index = constModel.customRequests.indexOf(name);
        if ( index >= 0 ) {
            constModel.customRequests.splice(index, 1);
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

        if ( constModel.properties.hasOwnProperty( constModel.collectionKey ) )
        {
            throw new Error('The property "'+constModel.collectionKey+'" shadows the collection key.');
        }

        constModel.versioning = versioningCreator.finalise();

        finalised = true;

        return constModel;
    };
}


module.exports =  ModelCreator;
