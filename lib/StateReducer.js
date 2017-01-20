var assert = require('assert');

function StateReducer() {

    this.reduce = function(current, getActions, getChildren, 
        shouldExpandState, actionString, state, ...args) {
        const name = current.name;
        const actionParts = actionString.split('.');
        assert.ok(state, 'Expected state not to be undefined'); 
        assert( actionParts[0] == name, 'Expected the first part of the command to be '+name);
        if ( actionParts.length == 2 ) {
            const actions = getActions(current);
            assert( actions.hasOwnProperty(actionParts[1]),
                'Did not find the action '+actionParts[1]+' in '+name);
            return actions[actionParts[1]](state, ...args);
        } else {
            const children = getChildren(current);
            assert( children.hasOwnProperty(actionParts[1]),
                'Did not find the child '+actionParts[1]+ ' in '+ name); 
            const child = children[actionParts[1]];
            const childStateAndArgs = this.reduceState(state, child, ...args);
            const newActionString = actionParts.slice(1).join('.');
            const newChildState = this.reduce(child, getActions, getChildren,
                shouldExpandState, newActionString, 
                childStateAndArgs['State'], ...(childStateAndArgs['Args'])
            );

            if ( shouldExpandState ) {
                return this.expandState(state,newChildState,child);
            } else {
                return newChildState;
            }
        }
    };

    this.reduceState = function(state, child, ...args) {
        if ( child.formsACollection === false ) {
            return { 
                'State': state[child.propertyName],
                'Args': args
            };
        } else {
            const id = args[0];
            const expectMessage = 'The id given for the '+child.name+' was ';
            assert(id != null, expectMessage+'null');
            assert(id != undefined,expectMessage+'undefined');

            const childState = state[child.propertyName][id];
            assert(childState != null, 'The object refered to by the id was null');
            assert(childState != undefined, 'The object refered to by the id was undefined');
            return { 
                'State': childState,
                'Args': args.slice(1)
            };
        }
    };

    this.expandState = function(state, childState, child) {
        let merger = {};
        if ( child.formsACollection === false ) {
            if ( state[child.propertyName] === childState ) {
                return state;
            } 
            merger[child.propertyName] = childState;
        } else {
            const idField = child.collectionKey;
            if ( state[child.propertyName][childState[idField]] === childState) {
                return state;
            }
            merger[child.propertyName] = {};
            Object.assign(merger[child.propertyName], state[child.propertyName]);
            merger[child.propertyName][childState[idField]] = childState;
        }

        return Object.assign({}, state, merger); 
    };

    this.listActions = function(current, getActions, getChildren)
    {
        let actions = [];
        let returnedActions = getActions(current);
        if ( Array.isArray(returnedActions) ) {
            actions = returnedActions.map( (value) => {return value;} );
        } else {
            for( const actionName in returnedActions ) {
                actions.push(actionName);
            }
        }
        const children = getChildren(current);
        for( const childName in children ) {
            const child = children[childName];
            actions.push( ...this.listActions(child, getActions, getChildren));
        }

        return actions.map( (element) => { return current.name+'.'+element; });
    };

}

module.exports = new StateReducer();

