/*eslint-env jasmine */

// var Child = require('./mock_Child.js');
var CollectionChild = require('./mock_CollectionChild.js');
var Parent = require('./mock_Parent.js');
describe('StateActions', function () {
    it('createEmpty(). Should initialise properties to null and children.', function(){
        var state = Parent.createEmpty();
        expect(state.parent_property).toBeNull();
        expect(state.MockChild).not.toBeNull();
        expect(state.MockChild.child_property).toBeNull();
        expect(state.MockCollectionChilds).toEqual({});

        var childState = CollectionChild.createEmpty();
        expect(childState.id).not.toBeUndefined();
        expect(childState.id).toBeNull();
    });
    it('reduce(). Should execute the correct action.', function() {
        var state = {
            'parent_property' : 1,
            'MockChild': {
                'child_property': 1
            },
            'MockCollectionChilds': {
                '0': {
                    'id': 0,
                    'child_property': 10
                }
            }
        };
        Object.freeze(state.MockCollectionChilds[1]);
        Object.freeze(state.MockCollectionChilds);
        Object.freeze(state.MockChild);
        Object.freeze(state);

        spyOn(Parent.Actions,'ParentAction').and.callThrough();
        spyOn(Parent.Children.MockChild.Actions,'ChildAction').and.callThrough();

        expect(Parent.reduce('ParentAction',state)).toBe(state);
        expect(Parent.Actions.ParentAction).toHaveBeenCalled();
        expect(Parent.Actions.ParentAction).toHaveBeenCalledWith(state);
        expect(Parent.Children.MockChild.Actions.ChildAction).not.toHaveBeenCalled();

        expect(Parent.reduce('MockChild.ChildAction',state)).toBe(state);
        expect(Parent.Actions.ParentAction).not.toHaveBeenCalled();
        expect(Parent.Children.MockChild.Actions.ChildAction).toHaveBeenCalled();
        expect(Parent.Children.MockChild.Actions.ChildAction).toHaveBeenCalledWith(state.MockChild);
    });
    it('request(). Should execute the correct request.', function() {
        var state = {
            'parent_property' : 1,
            'MockChild': {
                'child_property': 1
            },
            'MockCollectionChilds': {
                '0': {
                    'id': 0,
                    'child_property': 10
                }
            }
        };
        Object.freeze(state.MockCollectionChilds[1]);
        Object.freeze(state.MockCollectionChilds);
        Object.freeze(state.MockChild);
        Object.freeze(state);

        spyOn(Parent.Requests,'ParentRequest').and.callThrough();
        spyOn(Parent.Children.MockChild.Requests,'ChildRequest').and.callThrough();

        expect(Parent.request('ParentRequest',state)).toEqual('Parent');
        expect(Parent.Requests.ParentRequest).toHaveBeenCalled();
        expect(Parent.Requests.ParentRequest).toHaveBeenCalledWith(state);
        expect(Parent.Children.MockChild.Requests.ChildRequest).not.toHaveBeenCalled();

        expect(Parent.request('MockChild.ChildRequest',state)).toEqual('Child');
        expect(Parent.Requests.ParentRequest).not.toHaveBeenCalled();
        expect(Parent.Children.MockChild.Requests.ChildRequest).toHaveBeenCalled();
        expect(Parent.Children.MockChild.Requests.ChildRequest).toHaveBeenCalledWith(state.MockChild);
    });
    it('listActions(). Should list all the actions.', function() {
        var actions = Parent.listActions();
        expect(actions).toContain('ParentAction');
        expect(actions).toContain('MockChild.ChildAction');
        expect(actions.length).toEqual(2);
    });
    it('listRequests(). Should list all the requests.', function() {
        var requests = Parent.listRequests();
        expect(requests).toContain('ParentRequest');
        expect(requests).toContain('MockChild.ChildRequest');
        expect(requests.length).toEqual(2);
    });
    describe('addPropertAction(). Should add an action for the property', function(){
        var TestParent;
        beforeEach(function() {
            TestParent = Object.assign({},Parent);
        });
        it('Should add a property action with the correct default name', function(){
            expect(TestParent.Actions['SetParentProperty']).toBeUndefined();
            TestParent.addPropertyAction('parent_property');
            expect(TestParent.Actions['SetParentProperty']).not.toBeUndefined();
        });
        it('Should add a property action with the given name', function(){
            expect(TestParent.Actions['Name']).toBeUndefined();
            TestParent.addPropertyAction('parent_property','Name');
            expect(TestParent.Actions['Name']).not.toBeUndefined();
        });
    });
});
