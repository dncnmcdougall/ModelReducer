/*eslint-env jasmine */

var MockParent = require('./mock_Parent.js');
var MockChild = require('./mock_Child.js');

describe('Model: The model returned from the crerator. Used to process state.', function() {
    describe('listActions: Lists all the actions registered on this model, recursively.', function() {
        it('Should list all the actions on the model.', function() {
        var actions = MockParent.listActions();
        expect(actions).toContain('MockParent.NullAction');
        expect(actions).toContain('MockParent.IncrementAction');

        expect(actions).toContain('MockParent.MockChild.NullAction');
        expect(actions).toContain('MockParent.MockChild.IncrementAction');
        expect(actions).toContain('MockParent.MockChild.MockNestedChild.Action');
        expect(actions).toContain('MockParent.MockChild.MockNestedCollection.Action');

        expect(actions).toContain('MockParent.MockCollectionChild.NullAction');
        expect(actions).toContain('MockParent.MockCollectionChild.IncrementAction');
        expect(actions).toContain('MockParent.MockCollectionChild.MockNestedChild.Action');
        expect(actions).toContain('MockParent.MockCollectionChild.MockNestedCollection.Action');

        expect(actions.length).toEqual(10);
        });

        it('Should list only the actions on the given model.', function() {
        var actions = MockChild.listActions();

        expect(actions).toContain('MockChild.NullAction');
        expect(actions).toContain('MockChild.IncrementAction');
        expect(actions).toContain('MockChild.MockNestedChild.Action');
        expect(actions).toContain('MockChild.MockNestedCollection.Action');

        expect(actions.length).toEqual(4);
        });
    });
    describe('listRequests: Lists all the requests registered on this model, recursively.', function() {
        it('Should list all the requests on the model.', function() {
        var requests = MockParent.listRequests();
        expect(requests).toContain('MockParent.ParentRequest');

        expect(requests).toContain('MockParent.MockChild.ChildRequest');
        expect(requests).toContain('MockParent.MockChild.MockNestedChild.Request');
        expect(requests).toContain('MockParent.MockChild.MockNestedCollection.Request');

        expect(requests).toContain('MockParent.MockCollectionChild.CollectionChildRequest');
        expect(requests).toContain('MockParent.MockCollectionChild.MockNestedChild.Request');
        expect(requests).toContain('MockParent.MockCollectionChild.MockNestedCollection.Request');

        expect(requests.length).toEqual(7);
        });

        it('Should list only the requests on the given model.', function() {
        var requests = MockChild.listRequests();

        expect(requests).toContain('MockChild.ChildRequest');
        expect(requests).toContain('MockChild.MockNestedChild.Request');
        expect(requests).toContain('MockChild.MockNestedCollection.Request');

        expect(requests.length).toEqual(3);
        });
    });
    describe('createEmpty: Creates an empty state representing this model.', function() {
    });
    describe('State (request): Returns the state representing this model from within the given state.', function() {
    });
    describe('Set[PropertyName] (action): Sets the named property to the given value and returnes the new state.', function() {
    });
    describe('Add[ChildName] (action): Adds an empty instance of the child, under the given key, and returns the new state.', 
        function() {
        });
    describe('Available[ChildName] (request): Returns the available key value for the given child collection in the state.', 
        function() {
        });
});
