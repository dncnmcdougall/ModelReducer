/* eslint complexity: [ "warn" ] */
const path = require('path');
// var expect = require('expect');
var StateReducer = require(path.join(__dirname,'StateReducer.js'));

function StateActions()
{
    this.Properties = [];
    this.Actions = {};
    this.Requests = {};
    this.Children = {};

    this.getName = function() { throw 'getName not implemented'; };
    this.getIdField = function() { return null; };
    this.getPropertyName = function() { 
        if ( this.getIdField() ) {
            return this.getName()+'s';
        } else {
            return this.getName();
        }
    };

    this.createEmpty = function() {
        let emptyState = {};
        for( let i = 0; i < this.Properties.length; i++ ) {
            // expect( emptyState.hasOwnProperty(this.Properties[i]) ).toBe(false,
            //     this.Properties[i] +' is duplicated in '+this.getName());
            emptyState[this.Properties[i]] = null;
        }

        if ( this.getIdField() ) {
            var idField = this.getIdField();
            // expect( emptyState.hasOwnProperty(idField) ).toBe(false,
            //     idField +' is duplicated in '+this.getName());
            emptyState[idField] = null;
        }

        for( let childName in this.Children ) {
            if ( childName ) {
                // expect( emptyState.hasOwnProperty(childName) ).toBe(false,childName+' is duplicated in '+this.getName());
                var child =this.Children[childName];
                if ( child.getIdField() ) {
                    emptyState[child.getPropertyName()] = {};
                } else {
                    emptyState[child.getPropertyName()] = child.createEmpty();
                }
            }
        }
        return emptyState;
    };

    this.reduce = function(actionString, state, ...args) {
        return StateReducer.reduce(this, 
                (child) => {return child.Actions;}, 
                (child) => {return child.Children;}, 
                true, actionString, state, ...args);
    };

    this.request = function(requestString, state, ...args) {
        return StateReducer.reduce(this, 
                (child) => {return child.Requests;}, 
                (child) => {return child.Children;}, 
                false, requestString, state, ...args);
    };

    this.listActions = function() {
        return StateReducer.listActions(this, 
                (child) => {return child.Actions;}, 
                (child) => {return child.Children;});
    };

    this.listRequests = function() {
        return StateReducer.listActions(this, 
                (child) => {return child.Requests;}, 
                (child) => {return child.Children;});
    };

    this.forEachChild = function( func ) {
        for( var name in this.Children )
        {
            if ( name )
            {
                var child = this.Children[name];
                func(child);
            }
        }
    };

    this.addPropertyAction = function(property, actionName) {

        if ( !actionName ) {
            actionName = 'Set';
            var tmp = property.split('_');
            for( var part in tmp)
            {
                actionName += tmp[part][0].toUpperCase() + tmp[part].slice(1);
            }
        }
        this.Actions[actionName] = (state, value) => {
            if ( state[property] === value )
            {
                return state;
            }
            var merger = {};
            merger[property] = value;
            return Object.assign({},state,merger);
        };
    };

    this.addAddActionFor = function(childName, actionName) {
        if ( !actionName ) {
            actionName = 'Add'+childName;
        }
        var child = this.Children[childName];
        // expect(child).toExist();
        // expect(child.getIdField()).toExist();

        this.Actions[actionName] = function(state, id)
        {
            var childObject = child.createEmpty();
            childObject[child.getIdField()] = id;

            var modName = child.getPropertyName();
            var merger = {};
            merger[modName] = {};
            Object.assign(merger[modName], state[modName]);
            merger[modName][id] = childObject;

            return Object.assign({},state,merger);
        };
    };

    this.addStateRequest = function() {
        this.Requests['State'] = function(state)
        {
            return state;
        };
    };

    this.addAvailableIdRequest = function(collectionName, requestName) {
        if ( !requestName ) {
            var propertyName;

            if( collectionName[collectionName.length-1] === 's' ) { 
                propertyName = collectionName.slice(0,collectionName.length-1) ;
            } else {
                propertyName = collectionName;
            }
            requestName = 'Available'+propertyName+'Id';
        }

        this.Requests[requestName] = function(state)
        {
            var ids = Object.keys(state[collectionName]).map( (value) => {
                return parseInt(value, 10); 
            });
            ids.sort( (a,b) => { return a-b; });
            var id = ids.length-1;
            if ( id < 0 ) {
                return 0;
            }
            var delta = parseInt(ids.length/2, 10);
            if ( delta < 1 ) {
                delta = 1;
            }
            var dir = 0;

            while ( delta > 0 ) {
                if ( ids[id] === id ) {
                    if ( id === ids.length -1 ) {
                        return ids.length;
                    } else if ( ids[id+1] > (id+1) ) {
                        return (id + 1);
                    } else if ( ids[id+1] === (id+1) ) {
                        id += delta;
                        if ( dir < 0 ) {
                            delta = parseInt(delta /2, 10);
                        }
                        dir = 1;
                    } else {
                        throw 'This should not happen: ===, <';
                    }
                } else if ( ids[id] > id ) {
                    if ( id === 0 ) {
                        return 0;
                    } else if ( ids[id-1] === (id-1) ) {
                        return id;
                    } else if ( ids[id-1] > (id-1) ) {
                        id -= delta;
                        if ( dir > 0 ) {
                            delta = parseInt(delta /2, 10);
                        }
                        dir = -1;
                    } else {
                        throw 'This should not happen: >, <';
                    }
                } else {
                    throw 'This should not happen: <';
                }
                if ( delta < 1 ) {
                    delta = 1;
                }
                if ( id < 0 ) {
                    id = 0;
                } else if ( id >= ids.length ) {
                    throw 'This should not happen: Out of bounds';
                }
            }
            throw 'This should not happen: delta === 0';
        };
    };
}

module.exports = new StateActions();

