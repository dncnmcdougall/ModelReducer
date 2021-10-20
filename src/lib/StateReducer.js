/* eslint complexity: [ "warn" ] */
const assert = require('./Util.js').assert;

function StateReducer() {

    this.newReduce = function(modelName, currentModel, getActions,
        shouldExpandState, actionParts, state, ...args) {

        if ( typeof(actionParts) === 'string' ) {
            actionParts = actionParts.split('.');
        } else if ( Array.isArray(actionParts) !== true ) {
            throw new Error('Expected the action identifier to be a "string" or an "array", but has "'+
                typeof(actionParts)+'"');
        }
        assert(state, 'Expected state not to be undefined'); 
        assert( actionParts[0] == modelName, 'Expected the first part of the command to be '+modelName+
            ' but found "'+actionParts[0]+'"');

        let child = undefined;
        let childState = undefined;
        let childArgs = undefined;
        let newActionParts = undefined;
        let newChildState = undefined;
        let expansionKey = undefined;

        const isCollection = currentModel.isCollection();
        const id = args[0];
        const hasKey = isCollection ? id in currentModel.keys(state) : false;

        const children = currentModel.children;
        const actions = getActions(currentModel);
        if ( actionParts.length == 2 ) {
            const actionName = actionParts[1];
            if ( actionName in actions ) {
                return actions[actionParts[1]](state, ...args);
            } else if ( hasKey ) {
                const collectedChildActions = getActions(currentModel.collectedChild);
                assert( actionName in collectedChildActions,
                    'Did not find the action '+actionName+' in item "'+id+'" of '+modelName);

                expansionKey = id;
                childState = state[id];
                childArgs = args.slice(1);
                newChildState = collectedChildActions[actionName](childState, ...childArgs);
            } else if ( isCollection ) {
                throw new Error('Looked for action "'+actionName+'" or item "'+id+
                    '" on '+modelName+', but did not find either.');
            } else {
                throw new Error('Did not find the action "'+actionName+'" in '+modelName);
            }
        } else {
            const childName = actionParts[1];
            if ( childName in children ) {
                expansionKey = childName;
                child = children[childName];
                childState = state[childName];
                childArgs = args;
                newActionParts = actionParts.slice(1);
            } else if ( hasKey ) {
                expansionKey = id;
                child = currentModel.collectedChild;
                childState = state[id];
                childArgs = args.slice(1);
                newActionParts = actionParts.slice(0);
                newActionParts[0] = currentModel.collectedChild.name;
            } else if ( isCollection ) {
                throw new Error('Looked for child "'+childName+'" or item "'+id+
                    '" on '+modelName+', but did not find either.');
            } else {
                throw new Error('Did not find the child "'+childName+'" in '+modelName);
            }
            newChildState = this.newReduce(childName, child, getActions, 
                shouldExpandState, newActionParts, 
                childState, ...childArgs
            );
        }
        if ( shouldExpandState ) {
            if ( newChildState === childState ) {
                return state;
            } else {
                let merger = {};
                merger[expansionKey] = newChildState;
                return Object.assign({}, state, merger);
            }
        } else {
            return newChildState;
        }
    };

    this.listActions = function(name, current, getActions )
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
        const children = current.children;
        for( const childName in children ) {
            const child = children[childName];
            actions.push( ...this.listActions(childName, child, getActions));
        }

        actions = actions.map( (element) => name+'.'+element );

        if ( current.isCollection() ) {
            actions.push( ...this.listActions(name, current.collectedChild, getActions));
        }
        return actions;
    };

}

module.exports = new StateReducer();

