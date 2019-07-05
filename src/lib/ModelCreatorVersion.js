var defaultValue = require('./Util.js').defaultValue;

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

    this.addChild = function(childModel) {
        modelCreator.addChild(childModel);
        version.add(childModel.name, childModel.createEmpty() );
    };

    this.addChildAsCollection = function(childModel) {
        modelCreator.addChildAsCollection(childModel);
        version.add(childModel.propertyName, {});
    };

    this.removeChild = function(childModel) {
        modelCreator.removeChild(childModel);
        version.remove(childModel.name);
    };
}

module.exports =  ModelCreatorVersion;
