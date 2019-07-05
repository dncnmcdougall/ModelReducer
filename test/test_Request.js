/*eslint-env jasmine */

var MockParent = require('./mock_Parent.js');

var defaultState = require('./mock_DefaultState.js');

describe('Model: The model returned from the creator. Used to process state.', function() {
    describe('request: Perform the named request using the given state and return the result.', function() {

        var state;

        beforeEach( function() {
            state = defaultState();

            spyOn(MockParent.requests, 'ParentRequest').and.callThrough();
            spyOn(MockParent.children.MockChild.requests, 'ChildRequest').and.callThrough();
            spyOn(MockParent.children.MockCollectionChildren.requests, 'CollectionChildRequest').and.callThrough();
        });

        it('Should call the correct parent action', function() {
            expect(MockParent.request('MockParent.ParentRequest',state)).toEqual('Parent');

            expect(MockParent.requests.ParentRequest).toHaveBeenCalled();
            expect(MockParent.requests.ParentRequest).toHaveBeenCalledWith(state);
            expect(MockParent.children.MockChild.requests.ChildRequest).not.toHaveBeenCalled();
            expect(MockParent.children.MockCollectionChildren.requests.CollectionChildRequest).not.toHaveBeenCalled();
        });

        it('Should call the correct child action', function() {
            var subState =state.MockChild;

            expect(MockParent.request('MockParent.MockChild.ChildRequest',state)).toEqual('Child');

            expect(MockParent.requests.ParentRequest).not.toHaveBeenCalled();
            expect(MockParent.children.MockChild.requests.ChildRequest).toHaveBeenCalled();
            expect(MockParent.children.MockChild.requests.ChildRequest).toHaveBeenCalledWith(subState);
            expect(MockParent.children.MockCollectionChildren.requests.CollectionChildRequest).not.toHaveBeenCalled();
        });

        it('Should call the correct collection action', function() {
            var subState =state.MockCollectionChildren[0] ;

            expect(MockParent.request('MockParent.MockCollectionChildren.CollectionChildRequest',state, 0))
                .toEqual('CollectionChild');

            expect(MockParent.requests.ParentRequest).not.toHaveBeenCalled();
            expect(MockParent.children.MockChild.requests.ChildRequest).not.toHaveBeenCalled();
            expect(MockParent.children.MockCollectionChildren.requests.CollectionChildRequest).toHaveBeenCalled();
            expect(MockParent.children.MockCollectionChildren.requests.CollectionChildRequest).toHaveBeenCalledWith(subState);
        });

    });
});

