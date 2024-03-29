var StateReducer = require('./StateReducer.js');
var defaultValue = require('./Util.js').defaultValue;

function Model(name) {
    this.name = name;

    this.collectionKey = 'id';

    this.properties = {};
    this.actions = {};
    this.requests = {};
    this.children = {};
    this.collections = {};

    this.customActions = [];
    this.customRequests = [];
}

Model.prototype.reduce = function(actionString, state, ...args) {
    return StateReducer.newReduce(this.name, this, 
        (child) => child.actions, 
        true, actionString, state, ...args);
};

Model.prototype.request = function(requestString, state, ...args) {
    return StateReducer.newReduce(this.name, this, 
        (child) => child.requests, 
        false, requestString, state, ...args);
};

Model.prototype.listActions = function() {
    return StateReducer.listActions(this.name, this, 
        (child) => child.actions);
};

Model.prototype.listCustomActions = function() {
    return StateReducer.listActions(this.name, this, 
        (child) => child.customActions);
};

Model.prototype.listRequests = function() {
    return StateReducer.listActions(this.name, this, 
        (child) => child.requests);
};

Model.prototype.listCustomRequests = function() {
    return StateReducer.listActions(this.name, this, 
        (child) => child.customRequests);
};

Model.prototype.hasChild = function(childName) {
    return this.children.hasOwnProperty(childName);
};

Model.prototype.hasCollection = function(childName) {
    return this.children.hasOwnProperty(childName) &&
        this.collections[childName];
};

Model.prototype.isCollection = function() {
    return false;
};

Model.prototype.createEmpty = function() {
    let emptyState = {};
    for( let prop in this.properties ) {

        let value = defaultValue(this.properties[prop], prop);

        emptyState[prop] = value;
    }

    for( let childName in this.children ) {
        let child = this.children[childName];
        if ( this.hasCollection(childName) ) {
            emptyState[childName] = {};
        } else {
            emptyState[childName] = child.createEmpty();
        }
    }

    return emptyState;
};

module.exports = Model;
