var assert = require('assert');

function StateReducer() {

    this.reduce = function(current, getActions, getChildren, 
        shouldExpandState, actionString, state, ...args) {
        let name = null;
        const actionParts = actionString.split('.');
        assert.ok(state, 'Expected state not to be undefined'); 
        if ( actionParts[0] == current.collectionName ) {
            name = current.collectionName;
        } else {
            name = current.name;
        }
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
            const child = children[actionParts[1]];
            const childStateAndArgs = this.reduceState(isCollectionChild, state, child, ...args);
            const newActionString = actionParts.slice(1).join('.');
            const newChildState = this.reduce(child, getActions, getChildren,
                shouldExpandState, newActionString, 
                childStateAndArgs['State'], ...(childStateAndArgs['Args'])
            );

            if ( shouldExpandState ) {
                return this.expandState(isCollectionChild, state,newChildState,child);
            } else {
                return newChildState;
            }
        }
    };

    this.reduceState = function(isCollectionModel, state, child, ...args) {
        if ( isCollectionModel ) {
            const id = args[0];
            const expectMessage = 'The id given for the '+child.collectionName+' was ';
            assert(id != null, expectMessage+'null');
            assert(id != undefined,expectMessage+'undefined');

            const childState = state[child.collectionName][id];
            assert(childState != null, 'The object referred to by the id was null');
            assert(childState != undefined, 'The object referred to by the id was undefined');
            return { 
                'State': childState,
                'Args': args.slice(1)
            };
        } else {
            return { 
                'State': state[child.name],
                'Args': args
            };
        }
    };

    this.expandState = function(isCollectionModel, state, childState, child) {
        let merger = {};
        if ( isCollectionModel === false ) {
            if ( state[child.name] === childState ) {
                return state;
            } 
            merger[child.name] = childState;
        } else {
            const idField = child.collectionKey;
            if ( state[child.collectionName][childState[idField]] === childState) {
                return state;
            }
            merger[child.collectionName] = {};
            Object.assign(merger[child.collectionName], state[child.collectionName]);
            merger[child.collectionName][childState[idField]] = childState;
        }

        return Object.assign({}, state, merger); 
    };

    this.listActions = function(current, getActions, getChildren, isCollection)
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
            actions.push( ...this.listActions(child, getActions, getChildren, current.hasCollection(childName)));
        }

        let name = isCollection ? current.collectionName : current.name;

        return actions.map( (element) => { return name+'.'+element; });
    };

}

module.exports = new StateReducer();

