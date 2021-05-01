var StateReducer = require('./StateReducer.js');
var defaultValue = require('./Util.js').defaultValue;

function Model(name) {
    this.name = name;

    this.collectionKey = 'id';

    // this.propertyName = modelName;
    this.properties = {};
    this.actions = {};
    this.requests = {};
    this.children = {};
    this.collections = {};

    this.customActions = [];
    this.customRequests = [];

    this.reduce = function(actionString, state, ...args) {
        return StateReducer.reduce(this.name, this, 
            (child) => child.actions, 
            (child) => child.children, 
            true, actionString, state, ...args);
    };

    this.request = function(requestString, state, ...args) {
        return StateReducer.reduce(this.name, this, 
            (child) => child.requests, 
            (child) => child.children, 
            false, requestString, state, ...args);
    };

    this.listActions = function() {
        return StateReducer.listActions(this.name, this, 
            (child) => child.actions, 
            (child) => child.children, false);
    };

    this.listCustomActions = function() {
        return StateReducer.listActions(this.name, this, 
            (child) => child.customActions, 
            (child) => child.children, false);
    };

    this.listRequests = function() {
        return StateReducer.listActions(this.name, this, 
            (child) => child.requests, 
            (child) => child.children, false);
    };

    this.listCustomRequests = function() {
        return StateReducer.listActions(this.name, this, 
            (child) => child.customRequests, 
            (child) => child.children, false);
    };

    this.hasChild = function(childName) {
        return this.children.hasOwnProperty(childName);
    };

    this.hasCollection = function(childName) {
        return this.children.hasOwnProperty(childName) &&
            this.collections[childName];
    };

    this.createEmpty = function() {
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
}

module.exports = Model;
