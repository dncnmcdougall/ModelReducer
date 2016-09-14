// var expect = require('expect');

function StateReducer() {

    this.checkChild = function(child) {
        // expect( child.getName).toBeA('function');
        // expect( child.getName()).toNotBe(null);
        // expect( child.getIdField).toBeA('function');
    };

    this.reduce = function(current, getActions, getChildren, 
                           shouldExpandState, actionString, 
                           state, ...args) {
        const name = current.getName();
        const actionParts = actionString.split('.');
        // expect(state).toNotBe(undefined, 'Expected state not to be undefined'); 
        // expect( actionParts[0] ).toEqual(name,'Expected the first part of the action to be '+name+' but was '+actionParts[0]); 
        if ( actionParts.length == 2 ) {
            const actions = getActions(current);
            // expect( actions.hasOwnProperty(actionParts[1]) ).
            //     toBe(true,'Did not find the action '+actionParts[1]+' in '+name);
            return actions[actionParts[1]](state, ...args);
        } else {
            const children = getChildren(current);
            // expect( children.hasOwnProperty(actionParts[1]) ).toBe(true,'Did not find the child '+actionParts[1]+ ' in '+ name); 
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
        const idField = child.getIdField();
        if ( idField == null ) {
            return { 'State': state[child.getName()],
                'Args': args
            };
        } else {
            const id = args[0];
            // const expectMessage = 'The id given for the '+child.getName()+' was ';
            // expect(id).toNotBe(null, expectMessage+'null');
            // expect(id).toNotBe(undefined,expectMessage+'undefined');

            const childState = state[child.getName()+'s'][id];
            // expect(childState).toNotBe(null, 'The object refered to by the id was null');
            // expect(childState).toNotBe(undefined, 'The object refered to by the id was undefined');
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
                actions.push( ...this.listActions(child, getActions, getChildren));
            }
        }

        return actions.map( (element) => { return current.getName()+'.'+element; });
    };

}

module.exports = new StateReducer();

