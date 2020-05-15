/*eslint-env jasmine */

var ModelReducer = require('./Util.js').ModelReducer

var defaultState = require('./mock_DefaultState.js');

describe('Model: The model returned from the creator. Used to process state.', function() {
    describe('reduce: Perform the named action on the given state and return the new state.', function() {

        var state;

        beforeEach( function() {
            state = defaultState();

            spyOn(MockParent.actions, 'NullAction').and.callThrough();
            spyOn(MockParent.children.MockChild.actions, 'NullAction').and.callThrough();
            spyOn(MockParent.children.MockCollectionChildren.actions, 'NullAction').and.callThrough();

            spyOn(MockParent.actions, 'IncrementAction').and.callThrough();
            spyOn(MockParent.children.MockChild.actions, 'IncrementAction').and.callThrough();
            spyOn(MockParent.children.MockCollectionChildren.actions, 'IncrementAction').and.callThrough();
        });

        it('Should pass the correct the correct parent action and return the same state', function() {
            expect(MockParent.reduce('MockParent.NullAction',state)).toBe(state);

            expect(MockParent.actions.NullAction).toHaveBeenCalled();
            expect(MockParent.actions.NullAction).toHaveBeenCalledWith(state);
            expect(MockParent.children.MockChild.actions.NullAction).not.toHaveBeenCalled();
            expect(MockParent.children.MockCollectionChildren.actions.NullAction).not.toHaveBeenCalled();

            expect(MockParent.actions.IncrementAction).not.toHaveBeenCalled();
            expect(MockParent.children.MockChild.actions.IncrementAction).not.toHaveBeenCalled();
            expect(MockParent.children.MockCollectionChildren.actions.IncrementAction).not.toHaveBeenCalled();
        });
        it('Should pass the correct the correct parent action and return the new state', function() {

            var result = MockParent.reduce('MockParent.IncrementAction',state);
            expect(result).not.toEqual(state);
            expect(result.NumberProperty).toEqual(state.NumberProperty+1);

            expect(MockParent.actions.NullAction).not.toHaveBeenCalled();
            expect(MockParent.children.MockChild.actions.NullAction).not.toHaveBeenCalled();
            expect(MockParent.children.MockCollectionChildren.actions.NullAction).not.toHaveBeenCalled();

            expect(MockParent.actions.IncrementAction).toHaveBeenCalled();
            expect(MockParent.actions.IncrementAction).toHaveBeenCalledWith(state);
            expect(MockParent.children.MockChild.actions.IncrementAction).not.toHaveBeenCalled();
            expect(MockParent.children.MockCollectionChildren.actions.IncrementAction).not.toHaveBeenCalled();
        });

        it('Should call the correct child action and return the same state', function() {
            var subState = state.MockChild;

            expect(MockParent.reduce('MockParent.MockChild.NullAction',state)).toBe(state);

            expect(MockParent.actions.NullAction).not.toHaveBeenCalled();
            expect(MockParent.children.MockChild.actions.NullAction).toHaveBeenCalled();
            expect(MockParent.children.MockChild.actions.NullAction).toHaveBeenCalledWith(subState);
            expect(MockParent.children.MockCollectionChildren.actions.NullAction).not.toHaveBeenCalled();

            expect(MockParent.actions.IncrementAction).not.toHaveBeenCalled();
            expect(MockParent.children.MockChild.actions.IncrementAction).not.toHaveBeenCalled();
            expect(MockParent.children.MockCollectionChildren.actions.IncrementAction).not.toHaveBeenCalled();
        });
        it('Should call the correct child action and return the new state', function() {
            var subState = state.MockChild;

            var result = MockParent.reduce('MockParent.MockChild.IncrementAction',state);
            expect(result).not.toEqual(state);
            expect(result.MockChild.NumberProperty).toEqual(state.MockChild.NumberProperty+1);

            expect(result.MockCollectionChildren).toBe(state.MockCollectionChildren);

            expect(MockParent.actions.NullAction).not.toHaveBeenCalled();
            expect(MockParent.children.MockChild.actions.NullAction).not.toHaveBeenCalled();
            expect(MockParent.children.MockCollectionChildren.actions.NullAction).not.toHaveBeenCalled();

            expect(MockParent.actions.IncrementAction).not.toHaveBeenCalled();
            expect(MockParent.children.MockChild.actions.IncrementAction).toHaveBeenCalled();
            expect(MockParent.children.MockChild.actions.IncrementAction).toHaveBeenCalledWith(subState);
            expect(MockParent.children.MockCollectionChildren.actions.IncrementAction).not.toHaveBeenCalled();
        });

        it('Should call the correct collection action and return the same state', function() {
            var subState =state.MockCollectionChildren[0] ;

            expect(MockParent.reduce('MockParent.MockCollectionChildren.NullAction',state, 0)).toBe(state);

            expect(MockParent.actions.NullAction).not.toHaveBeenCalled();
            expect(MockParent.children.MockChild.actions.NullAction).not.toHaveBeenCalled();
            expect(MockParent.children.MockCollectionChildren.actions.NullAction).toHaveBeenCalled();
            expect(MockParent.children.MockCollectionChildren.actions.NullAction).toHaveBeenCalledWith(subState);

            expect(MockParent.actions.IncrementAction).not.toHaveBeenCalled();
            expect(MockParent.children.MockChild.actions.IncrementAction).not.toHaveBeenCalled();
            expect(MockParent.children.MockCollectionChildren.actions.IncrementAction).not.toHaveBeenCalled();
        });
        it('Should call the correct collection action and return the new state', function() {
            var subState =state.MockCollectionChildren[0] ;

            var result = MockParent.reduce('MockParent.MockCollectionChildren.IncrementAction',state, 0);
            expect(result).not.toEqual(state);
            expect(result.MockCollectionChildren[0].NumberProperty).toEqual(state.MockCollectionChildren[0].NumberProperty+1);

            expect(result.MockChild).toBe(state.MockChild);

            expect(MockParent.actions.NullAction).not.toHaveBeenCalled();
            expect(MockParent.children.MockChild.actions.NullAction).not.toHaveBeenCalled();
            expect(MockParent.children.MockCollectionChildren.actions.NullAction).not.toHaveBeenCalled();

            expect(MockParent.actions.IncrementAction).not.toHaveBeenCalled();
            expect(MockParent.children.MockChild.actions.IncrementAction).not.toHaveBeenCalled();
            expect(MockParent.children.MockCollectionChildren.actions.IncrementAction).toHaveBeenCalled();
            expect(MockParent.children.MockCollectionChildren.actions.IncrementAction).toHaveBeenCalledWith(subState);
        });

    });
});

