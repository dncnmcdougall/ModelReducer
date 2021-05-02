const StateActions = require('./StateActions.js');
const ModelCreator = require('./ModelCreator.js');
const Collection = require('./Collection.js');

var checkType = require('./Util.js').checkType;
var objectOrString = require('./Util.js').objectOrString;

var throwIfFinalised = function( finalised ) {
    if ( finalised ) {
        throw new Error('The model was already finalised, cannot modify it further.');
    }
};

function CollectionCreator(modelName, collectedChild){
    ModelCreator.call(this, modelName);
    this.modelUnderConstruction = new Collection(modelName);


    this.addAddActionFor = function(child, actionName) {
        StateActions.addAddActionFor( this, collectedChild, actionName);
    };

    this.addAvailableKeyRequestFor = function(child, actionName) {
        StateActions.addAvailableKeyRequestFor( this, child, actionName);
    };
}

CollectionCreator.prototype = Object.create(ModelCreator.prototype);
Object.defineProperty(CollectionCreator.prototype, 'constructor', {
    value: CollectionCreator,
    enumerable: false,
    writable: true
});

module.exports = CollectionCreator;
