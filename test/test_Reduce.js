/*eslint-env jasmine */

var ModelReducer = require('./Util.js').ModelReducer;
var ModelCreator = ModelReducer.ModelCreator;
var CollectionCreator = ModelReducer.CollectionCreator;

var MockParent = require('./mock_Parent.js');

var defaultState = require('./mock_DefaultState.js');

describe('Model: The model returned from the creator. Used to process state.', function() {
    describe('reduce: Perform the named action on the given state and return the new state.', function() {

        var state;

        beforeEach( function() {
            state = defaultState();

            spyOn(MockParent.actions, 'NullAction').and.callThrough();
            spyOn(MockParent.children.MockChild.actions, 'NullAction').and.callThrough();
            spyOn(MockParent.children['MockCollectionChild[]'].collectedChild.actions, 'NullAction').and.callThrough();

            spyOn(MockParent.actions, 'IncrementAction').and.callThrough();
            spyOn(MockParent.children.MockChild.actions, 'IncrementAction').and.callThrough();
            spyOn(MockParent.children['MockCollectionChild[]'].collectedChild.actions, 'IncrementAction').and.callThrough();
        });

        it('Should pass the correct parent action and return the same state', function() {
            expect(MockParent.reduce('MockParent.NullAction',state)).toBe(state);

            expect(MockParent.actions.NullAction).toHaveBeenCalled();
            expect(MockParent.actions.NullAction).toHaveBeenCalledWith(state);
            expect(MockParent.children.MockChild.actions.NullAction).not.toHaveBeenCalled();
            expect(MockParent.children['MockCollectionChild[]'].collectedChild.actions.NullAction).not.toHaveBeenCalled();

            expect(MockParent.actions.IncrementAction).not.toHaveBeenCalled();
            expect(MockParent.children.MockChild.actions.IncrementAction).not.toHaveBeenCalled();
            expect(MockParent.children['MockCollectionChild[]'].collectedChild.actions.IncrementAction).not.toHaveBeenCalled();
        });
        it('Should pass the correct the correct parent action and return the new state', function() {

            var result = MockParent.reduce('MockParent.IncrementAction',state);
            expect(result).not.toEqual(state);
            expect(result.NumberProperty).toEqual(state.NumberProperty+1);

            expect(MockParent.actions.NullAction).not.toHaveBeenCalled();
            expect(MockParent.children.MockChild.actions.NullAction).not.toHaveBeenCalled();
            expect(MockParent.children['MockCollectionChild[]'].collectedChild.actions.NullAction).not.toHaveBeenCalled();

            expect(MockParent.actions.IncrementAction).toHaveBeenCalled();
            expect(MockParent.actions.IncrementAction).toHaveBeenCalledWith(state);
            expect(MockParent.children.MockChild.actions.IncrementAction).not.toHaveBeenCalled();
            expect(MockParent.children['MockCollectionChild[]'].collectedChild.actions.IncrementAction).not.toHaveBeenCalled();
        });

        it('Should call the correct child action and return the same state', function() {
            var subState = state.MockChild;

            expect(MockParent.reduce('MockParent.MockChild.NullAction',state)).toBe(state);

            expect(MockParent.actions.NullAction).not.toHaveBeenCalled();
            expect(MockParent.children.MockChild.actions.NullAction).toHaveBeenCalled();
            expect(MockParent.children.MockChild.actions.NullAction).toHaveBeenCalledWith(subState);
            expect(MockParent.children['MockCollectionChild[]'].collectedChild.actions.NullAction).not.toHaveBeenCalled();

            expect(MockParent.actions.IncrementAction).not.toHaveBeenCalled();
            expect(MockParent.children.MockChild.actions.IncrementAction).not.toHaveBeenCalled();
            expect(MockParent.children['MockCollectionChild[]'].collectedChild.actions.IncrementAction).not.toHaveBeenCalled();
        });
        it('Should call the correct child action and return the new state', function() {
            var subState = state.MockChild;

            var result = MockParent.reduce('MockParent.MockChild.IncrementAction',state);
            expect(result).not.toEqual(state);
            expect(result.MockChild.NumberProperty).toEqual(state.MockChild.NumberProperty+1);

            expect(result['MockCollectionChild[]']).toBe(state['MockCollectionChild[]']);

            expect(MockParent.actions.NullAction).not.toHaveBeenCalled();
            expect(MockParent.children.MockChild.actions.NullAction).not.toHaveBeenCalled();
            expect(MockParent.children['MockCollectionChild[]'].collectedChild.actions.NullAction).not.toHaveBeenCalled();

            expect(MockParent.actions.IncrementAction).not.toHaveBeenCalled();
            expect(MockParent.children.MockChild.actions.IncrementAction).toHaveBeenCalled();
            expect(MockParent.children.MockChild.actions.IncrementAction).toHaveBeenCalledWith(subState);
            expect(MockParent.children['MockCollectionChild[]'].collectedChild.actions.IncrementAction).not.toHaveBeenCalled();
        });

        it('Should call the correct collection action and return the same state', function() {
            var subState = state['MockCollectionChild[]'][0] ;

            expect(MockParent.reduce('MockParent.MockCollectionChild[].NullAction',state, 0)).toBe(state);

            expect(MockParent.actions.NullAction).not.toHaveBeenCalled();
            expect(MockParent.children.MockChild.actions.NullAction).not.toHaveBeenCalled();
            expect(MockParent.children['MockCollectionChild[]'].collectedChild.actions.NullAction).toHaveBeenCalled();
            expect(MockParent.children['MockCollectionChild[]'].collectedChild.actions.NullAction).toHaveBeenCalledWith(subState);

            expect(MockParent.actions.IncrementAction).not.toHaveBeenCalled();
            expect(MockParent.children.MockChild.actions.IncrementAction).not.toHaveBeenCalled();
            expect(MockParent.children['MockCollectionChild[]'].collectedChild.actions.IncrementAction).not.toHaveBeenCalled();
        });
        it('Should call the correct collection action and return the new state', function() {
            var subState = state['MockCollectionChild[]'][0] ;

            var result = MockParent.reduce('MockParent.MockCollectionChild[].IncrementAction',state, 0);
            expect(result).not.toEqual(state);
            expect(result['MockCollectionChild[]'][0].NumberProperty).toEqual(state['MockCollectionChild[]'][0].NumberProperty+1);

            expect(result.MockChild).toBe(state.MockChild);

            expect(MockParent.actions.NullAction).not.toHaveBeenCalled();
            expect(MockParent.children.MockChild.actions.NullAction).not.toHaveBeenCalled();
            expect(MockParent.children['MockCollectionChild[]'].collectedChild.actions.NullAction).not.toHaveBeenCalled();

            expect(MockParent.actions.IncrementAction).not.toHaveBeenCalled();
            expect(MockParent.children.MockChild.actions.IncrementAction).not.toHaveBeenCalled();
            expect(MockParent.children['MockCollectionChild[]'].collectedChild.actions.IncrementAction).toHaveBeenCalled();
            expect(MockParent.children['MockCollectionChild[]'].collectedChild.actions.IncrementAction).toHaveBeenCalledWith(subState);
        });
    });
});

describe('Collection: The collection returned from the creator. Used to process collection state.', function() {
    describe('reduce: Perform the named action on the given state and return the new state.', function() {

        var state;
        var childState;
        var MockChild;
        var MockCollection;

        beforeAll( function() {
            var modelCreator = new ModelCreator('MockChild');
            modelCreator.addProperty('NumberProp','number');
            modelCreator.addAction('ChildAction',(state) => state);
            MockChild = modelCreator.finaliseModel();

            var collectionCreator = new CollectionCreator('MockCollection',MockChild);
            collectionCreator.addProperty('StringProp', 'string');
            collectionCreator.addAction('CollectionAction',(state) => state);
            MockCollection = collectionCreator.finaliseModel();
        });

        beforeEach( function() {
            state = defaultState();
            state = MockCollection.reduce('MockCollection.PushEmpty', state);
            childState = state[0];

            spyOn(MockCollection.actions, 'CollectionAction').and.callThrough();
            spyOn(MockChild.actions, 'ChildAction').and.callThrough();
        });

        it('Should call the action on the collection.', function() {
            MockCollection.reduce('MockCollection.CollectionAction',state);

            expect(MockCollection.actions.CollectionAction).toHaveBeenCalled();
            expect(MockCollection.actions.CollectionAction).toHaveBeenCalledWith(state);
            expect(MockChild.actions.ChildAction).not.toHaveBeenCalled();
        });

        it('Should call the action on the specified child of the collection.', function() {
            MockCollection.reduce('MockCollection.ChildAction',state, 0);

            expect(MockCollection.actions.CollectionAction).not.toHaveBeenCalled();
            expect(MockChild.actions.ChildAction).toHaveBeenCalled();
            expect(MockChild.actions.ChildAction).toHaveBeenCalledWith(childState);
        });
    });
});
