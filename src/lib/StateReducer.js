var assert = require('./Util.js').assert;

const reduceState = function(childName, child, isCollectionModel, state, ...args) {
    assert(state.hasOwnProperty(childName), 'Expected the state to contain the property "'+childName+'"');
    if ( isCollectionModel ) {
        const id = args[0];
        const expectMessage = 'The '+child.collectionKey+' given for '+childName+' was ';
        assert(id != null, expectMessage+'null');
        assert(id != undefined,expectMessage+'undefined');

        const childState = state[childName][id];
        assert(childState != null, 'The object referred to by the id was null');
        assert(childState != undefined, 'The object referred to by the id was undefined');
        return { 
            'State': childState,
            'Args': args.slice(1)
        };
    } else {
        return { 
            'State': state[childName],
            'Args': args
        };
    }
};

const expandState = function(childName, child, isCollectionModel, state, childState) {
    let merger = {};
    if ( isCollectionModel ) {
        const idField = child.collectionKey;
        if ( state[childName][childState[idField]] === childState) {
            return state;
        }
        merger[childName] = {};
        Object.assign(merger[childName], state[childName]);
        merger[childName][childState[idField]] = childState;
    } else {
        if ( state[childName] === childState ) {
            return state;
        } 
        merger[childName] = childState;
    }

    return Object.assign({}, state, merger); 
};


function StateReducer() {

    this.reduce = function(name, current, getActions, getChildren, 
        shouldExpandState, actionParts, state, ...args) {

        if ( typeof(actionParts) === 'string' ) {
            actionParts = actionParts.split('.');
        } else if ( Array.isArray(actionParts) !== true ) {
            throw new Error('Expected the action identifier to be a "string" or an "array", but has "'+
                typeof(actionParts)+'"');
        }
        assert(state, 'Expected state not to be undefined'); 
        assert( actionParts[0] == name, 'Expected the first part of the command to be '+name+' but found "'+actionParts[0]+'"');

        if ( actionParts.length == 2 ) {
            const actions = getActions(current);
            assert( actions.hasOwnProperty(actionParts[1]),
                'Did not find the action '+actionParts[1]+' in '+name);
            return actions[actionParts[1]](state, ...args);
        } else {
            const isCollectionChild =  current.hasCollection( actionParts[1] );
            const children = getChildren(current);
            assert( children.hasOwnProperty(actionParts[1]),
                'Did not find the child '+actionParts[1]+ ' in '+ name); 
            const childName = actionParts[1];
            const child = children[childName];

            const childStateAndArgs = reduceState(childName, child, isCollectionChild, state, ...args);
            const newActionParts = actionParts.slice(1);

            const newChildState = this.reduce(childName, child, getActions, getChildren,
                shouldExpandState, newActionParts, 
                childStateAndArgs['State'], ...(childStateAndArgs['Args'])
            );

            if ( shouldExpandState ) {
                return expandState(childName, child, isCollectionChild, state,newChildState);
            } else {
                return newChildState;
            }
        }
    };

    this.listActions = function(name, current, getActions, getChildren, isCollection)
    {
        let actions = [];
        let returnedActions = getActions(current);
        if ( Array.isArray(returnedActions) ) {
            actions = returnedActions.map( (value) => value );
        } else {
            for( const actionName in returnedActions ) {
                actions.push(actionName);
            }
        }
        const children = getChildren(current);
        for( const childName in children ) {
            const child = children[childName];
            actions.push( ...this.listActions(childName, child, getActions, getChildren, current.hasCollection(childName)));
        }

        return actions.map( (element) => name+'.'+element );
    };

}

module.exports = new StateReducer();

