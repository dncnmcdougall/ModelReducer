var assert = require('assert');

function StateReducer() {

    this.reduce = function(current, getActions, getChildren, 
                           shouldExpandState, actionString, 
                           state, ...args) {
        const name = current.name;
        const actionParts = actionString.split('.');
        assert.ok(state, 'Expected state not to be undefined'); 
        if ( actionParts.length == 1 ) {
            const actions = getActions(current);
            assert( actions.hasOwnProperty(actionParts[0]),
                'Did not find the action '+actionParts[0]+' in '+name);
            return actions[actionParts[0]](state, ...args);
        } else {
            const children = getChildren(current);
            assert( children.hasOwnProperty(actionParts[0]),
                'Did not find the child '+actionParts[0]+ ' in '+ name); 
            const child = children[actionParts[0]];
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
        const idField = child.getIdField();
        if ( idField == null ) {
            return { 'State': state[child.getName()],
                'Args': args
            };
        } else {
            const id = args[0];
            const expectMessage = 'The id given for the '+child.name+' was ';
            assert(id != null, expectMessage+'null');
            assert(id != undefined,expectMessage+'undefined');

            const childState = state[child.getName()+'s'][id];
            assert(childState != null, 'The object refered to by the id was null');
            assert(childState != undefined, 'The object refered to by the id was undefined');
            return { 'State': childState,
                'Args': args.slice(1)
            };
        }
    };

    this.expandState = function(state, childState, child) {
        let merger = {};
        const idField = child.getIdField();
        if ( idField == null ) {
            if ( state[child.getName()] === childState) {
                return state;
            }
            merger[child.getName()] = childState;
        } else {
            if ( state[child.getName()+'s'][childState[idField]] === childState) {
                return state;
            }
            merger[child.getName()+'s'] = {};
            Object.assign(merger[child.getName()+'s'], state[child.getName()+'s']);
            merger[child.getName()+'s'][childState[idField]] = childState;
        }

        return Object.assign({}, state, merger); 
    };

    this.listActions = function(current, getActions, getChildren)
    {
        // console.log(current.name);
        let actions = [];
        for( const actionName in getActions(current) ) {
            if ( actionName ) {
                actions.push(actionName);
            }
        }
        const children = getChildren(current);
        for( const childName in children ) {
            if ( childName ) {
                const child = children[childName];
                // console.log('child:'+child.name);
                actions.push( ...this.listActions(child, getActions, getChildren));
            }
        }

        return actions.map( (element) => { return current.getName()+'.'+element; });
    };

}

module.exports = new StateReducer();

