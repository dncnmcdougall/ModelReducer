/*eslint-env jasmine */

var Child = require('./mock_Child.js');
var CollectionChild = require('./mock_CollectionChild.js');
var Parent = require('./mock_Parent.js');
describe('StateActions', function () {

    it('name. Should return the name of the object.', function() {
        expect(Parent.getName()).toEqual('MockParent');
        expect(Child.getName()).toEqual('MockChild');
        expect(CollectionChild.getName()).toEqual('MockCollectionChild');
    });
    it('getIdField(). Should return id or null.', function() {
        expect(Parent.getIdField()).toEqual(null);
        expect(Child.getIdField()).toEqual(null);
        expect(CollectionChild.getIdField()).toEqual('id');
    });
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

        expect(Parent.reduce('MockChild.ChildAction',state)).toBe(state);
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

        expect(Parent.request('MockChild.ChildRequest',state)).toEqual('Child');
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
    describe('addAddActionFor(). Should add an "Add" action for a child with an id field.', function(){
        var TestParent;
        beforeEach(function() {
            TestParent = Object.assign({},Parent);
        });
        it('Should add a "Add" action with the correct default name', function(){
            expect(TestParent.Actions['AddMockCollectionChild']).toBeUndefined();
            TestParent.addAddActionFor('MockCollectionChild');
            expect(TestParent.Actions['AddMockCollectionChild']).not.toBeUndefined();
        });
        it('Should add a "Add" action with the given name', function(){
            expect(TestParent.Actions['Name']).toBeUndefined();
            TestParent.addAddActionFor('MockCollectionChild','Name');
            expect(TestParent.Actions['Name']).not.toBeUndefined();
        });
    });
    it('addStateRequest(). Should add a "State" request.', function(){
        var TestParent = Object.assign({},Parent);
        expect(TestParent.Requests['State']).toBeUndefined();
        TestParent.addStateRequest();
        expect(TestParent.Requests['State']).not.toBeUndefined();
    });
    describe('addAAvailableIdRequest(). Should add an "AvailableId" request for a collection.', function(){
        var TestParent;
        beforeEach(function() {
            TestParent = Object.assign({},Parent);
        });
        it('Should add a "Available" request with the correct default name, with an s', function(){
            expect(TestParent.Requests['AvailableMockCollectionChildId']).toBeUndefined();
            TestParent.addAvailableIdRequest('MockCollectionChilds');
            expect(TestParent.Requests['AvailableMockCollectionChildId']).not.toBeUndefined();
        });
        it('Should add a "Available" request with the correct default name, without an s', function(){
            expect(TestParent.Requests['AvailableMockCollectionChildId']).toBeUndefined();
            TestParent.addAvailableIdRequest('MockCollectionChild');
            expect(TestParent.Requests['AvailableMockCollectionChildId']).not.toBeUndefined();
        });
        it('Should add a "Add" action with the given name', function(){
            expect(TestParent.Requests['Name']).toBeUndefined();
            TestParent.addAvailableIdRequest('MockCollectionChilds','Name');
            expect(TestParent.Requests['Name']).not.toBeUndefined();
        });
    });
});
