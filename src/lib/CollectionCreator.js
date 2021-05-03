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
    this.modelUnderConstruction = new Collection(modelName, collectedChild);


    this.addAddActionFor = function(child, actionName) {
        StateActions.addAddActionFor( this, collectedChild, actionName);
    };

    this.addAvailableKeyRequestFor = function(child, actionName) {
        StateActions.addAvailableKeyRequestFor( this, child, actionName);
    };

    this.addRequest('Keys', function(state) {
        return this.keys(state);
    });

    this.addRequest('Length', function(state) {
        return this.length(state);
    });

    this.addRequest('HeadState', function(state) {
        return this.headState(state);
    });

    this.addRequest('TailState', function(state) {
        return this.tailState(state);
    });

    this.addAction('PushEmpty', function(state) {
        let key = this.largestKey(state);
        if ( key === null ) {
            key = 0;
        } else {
            key += 1;
        }
        let childState = this.collectedChild.createEmpty();
        childState[this.collectedChild.collectionKey] = key;
        let merger = {};
        merger[key] = childState;
        return Object.assign({}, state, merger);
    });

    this.addAction('AddEmpty', function(state, key) {
        if ( key == this.collectionKey ){
            throw new Error('Tried to add an item with key "'+key+'", which would override the collection key.');
        } else if ( key in this.properties ) {
            throw new Error('Tried to add an item with key "'+key+'", which would override a property.');
        } else if ( key in this.children ) {
            throw new Error('Tried to add an item with key "'+key+'", which would override a child.');
        } else if ( key in this.actions ) {
            throw new Error('Tried to add an item with key "'+key+'", which would override an action.');
        } else if ( key in this.requests ) {
            throw new Error('Tried to add an item with key "'+key+'", which would override a request.');
        } else if ( key in state ) {
            throw new Error('Tried to add an item with key "'+key+'", which would override an existing item.');
        }
        let childState = this.collectedChild.createEmpty();
        childState[this.collectedChild.collectionKey] = key;
        let merger = {};
        merger[key] = childState;
        return Object.assign({}, state, merger);
    });

    this.addAction('Remove', function(state, key) {
        if ( key == this.collectionKey ){
            throw new Error('Tried to remove an item with key "'+key+'", which would remove the collection key.');
        } else if ( key in this.properties ) {
            throw new Error('Tried to add an item with key "'+key+'", which would remove a property.');
        } else if ( key in this.children ) {
            throw new Error('Tried to add an item with key "'+key+'", which would remove a child.');
        } else if ( key in this.actions ) {
            throw new Error('Tried to add an item with key "'+key+'", which would remove an action.');
        } else if ( key in this.requests ) {
            throw new Error('Tried to add an item with key "'+key+'", which would remove a request.');
        } else if ( !(key in state) ) {
            return state;
        }
        let newState = Object.assign({}, state);
        delete newState[key];
        return newState;
    });
    
    this.addAction('RemoveTail', function(state) {
        let key = this.largestKey(state);
        if ( key === null ) {
            return state;
        }
        let newState = Object.assign({}, state);
        delete newState[key];
        return newState;
    });

    this.addAction('RemoveHead', function(state) {
        let key = this.smallestKey(state);
        if ( key === null ) {
            return state;
        }
        let newState = Object.assign({}, state);
        delete newState[key];
        return newState;
    });

}

CollectionCreator.prototype = Object.create(ModelCreator.prototype);
Object.defineProperty(CollectionCreator.prototype, 'constructor', {
    value: CollectionCreator,
    enumerable: false,
    writable: true
});

module.exports = CollectionCreator;
