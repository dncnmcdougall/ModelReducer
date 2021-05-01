var defaultValue = require('./Util.js').defaultValue;
var objectOrString = require('./Util.js').objectOrString;

function ModelCreatorVersion(version, modelCreator){
    this.addProperty = function(name, type) {
        modelCreator.addProperty(name, type);
        if ( !type ) {
            type = null;
        }
        version.add(name, defaultValue(type));
    };

    this.removeProperty = function(name) {
        modelCreator.removeProperty(name);
        version.remove(name);
    };

    this.renameProperty = function(name, newName) {
        modelCreator.addProperty(newName, modelCreator.getPropertyType(name));
        modelCreator.removeProperty(name);
        version.rename(name, newName);
    };

    this.addChild = function(childModel, childName) {
        if ( !childName ) {
            childName = childModel.name;
        }

        modelCreator.addChild(childModel, childName);
        version.add(childName, childModel.createEmpty() );
    };

    this.addChildAsCollection = function(childModel) {
        let collectionName = childModel.name+'[]';

        modelCreator.addChildAsCollection(childModel);
        version.add(collectionName, {});
    };

    this.removeChild = function(childModel) {
        let childName = objectOrString(childModel, (c) => c.name);

        if ( !modelCreator.hasChild(childName) && modelCreator.hasChild(childName+'[]') ) {
            childName = childName+'[]';
        }

        modelCreator.removeChild(childName);
        version.remove(childName);
    };
}

module.exports =  ModelCreatorVersion;
