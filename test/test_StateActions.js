/*eslint-env jasmine */

// var MockChild = require('./mock_Child.js');
function MockChild()
{
    this.Properties = ['child_property'];
    this.Actions = {
        'ChildAction': (state) => {return state;}
    };
    this.Requests = {
        'ChildRequest': () => {return 'Child';}
    };
    this.Children = {
    };

    this.getName = function() {return 'MockChild';};
}
MockChild.prototype = require('../lib/StateActions.js');
var Child = new MockChild;

function MockIdChild()
{
    this.Properties = ['child_property'];
    this.Actions = {};
    this.Requests = {};
    this.Children = {};

    this.getName = function() {return 'MockIdChild';};
    this.getIdField = function() {return 'id';};
}
MockIdChild.prototype = require('../lib/StateActions.js');
var IdChild = new MockIdChild;

function MockParent()
{
    this.Properties = ['parent_property'];
    this.Actions = {
        'ParentAction': (state) => {return state;}
    };
    this.Requests = {
        'ParentRequest': () => {return 'Parent';}
    };
    this.Children = {
        'MockChild': new MockChild(),
        'MockIdChild': new MockIdChild()
    };

    this.getName = function() {return 'MockParent';};
}
MockParent.prototype = require('../lib/StateActions.js');

var Parent = new MockParent();

describe('StateActions', function () {

    it('getName(). Should return the name of the object.', function() {
        expect(Parent.getName()).toEqual('MockParent');
        expect(Child.getName()).toEqual('MockChild');
        expect(IdChild.getName()).toEqual('MockIdChild');
    });
    it('getIdField(). Should return id or null.', function() {
        expect(Parent.getIdField()).toEqual(null);
        expect(Child.getIdField()).toEqual(null);
        expect(IdChild.getIdField()).toEqual('id');
    });
    it('createEmpty(). Should initialise properties to null and children.', function(){
        var state = Parent.createEmpty();
        expect(state.parent_property).toBeNull();
        expect(state.MockChild).not.toBeNull();
        expect(state.MockChild.child_property).toBeNull();
        expect(state.MockIdChilds).toEqual({});

        var childState = (new MockIdChild()).createEmpty();
        expect(childState.id).not.toBeUndefined();
        expect(childState.id).toBeNull();
    });
    it('reduce(). Should execute the correct action.', function() {
        var state = {
            'parent_property' : 1,
            'MockChild': {
                'child_property': 1
            },
            'MockIdChilds': {
                '0': {
                    'id': 0,
                    'child_property': 10
                }
            }
        };
        Object.freeze(state.MockIdChilds[1]);
        Object.freeze(state.MockIdChilds);
        Object.freeze(state.MockChild);
        Object.freeze(state);

        spyOn(Parent.Actions,'ParentAction').and.callThrough();
        spyOn(Parent.Children.MockChild.Actions,'ChildAction').and.callThrough();

        expect(Parent.reduce('MockParent.ParentAction',state)).toBe(state);
        expect(Parent.Actions.ParentAction).toHaveBeenCalled();
        expect(Parent.Actions.ParentAction).toHaveBeenCalledWith(state);

        expect(Parent.reduce('MockParent.MockChild.ChildAction',state)).toBe(state);
        expect(Parent.Children.MockChild.Actions.ChildAction).toHaveBeenCalled();
        expect(Parent.Children.MockChild.Actions.ChildAction).toHaveBeenCalledWith(state.MockChild);
    });
    it('request(). Should execute the correct request.', function() {
        var state = {
            'parent_property' : 1,
            'MockChild': {
                'child_property': 1
            },
            'MockIdChilds': {
                '0': {
                    'id': 0,
                    'child_property': 10
                }
            }
        };
        Object.freeze(state.MockIdChilds[1]);
        Object.freeze(state.MockIdChilds);
        Object.freeze(state.MockChild);
        Object.freeze(state);

        spyOn(Parent.Requests,'ParentRequest').and.callThrough();
        spyOn(Parent.Children.MockChild.Requests,'ChildRequest').and.callThrough();

        expect(Parent.request('MockParent.ParentRequest',state)).toEqual('Parent');
        expect(Parent.Requests.ParentRequest).toHaveBeenCalled();
        expect(Parent.Requests.ParentRequest).toHaveBeenCalledWith(state);

        expect(Parent.request('MockParent.MockChild.ChildRequest',state)).toEqual('Child');
        expect(Parent.Children.MockChild.Requests.ChildRequest).toHaveBeenCalled();
        expect(Parent.Children.MockChild.Requests.ChildRequest).toHaveBeenCalledWith(state.MockChild);
    });
    it('listActions(). Should list all the actions.', function() {
        var actions = Parent.listActions();
        expect(actions).toContain('MockParent.ParentAction');
        expect(actions).toContain('MockParent.MockChild.ChildAction');
        expect(actions.length).toEqual(2);
    });
    it('listRequests(). Should list all the requests.', function() {
        var requests = Parent.listRequests();
        expect(requests).toContain('MockParent.ParentRequest');
        expect(requests).toContain('MockParent.MockChild.ChildRequest');
        expect(requests.length).toEqual(2);
    });
    describe('addPropertAction(). Should add an action for the property', function(){
        var TestParent;
        beforeEach(function() {
            TestParent = new MockParent();
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
            TestParent = new MockParent();
        });
        it('Should add a "Add" action with the correct default name', function(){
            expect(TestParent.Actions['AddMockIdChild']).toBeUndefined();
            TestParent.addAddActionFor('MockIdChild');
            expect(TestParent.Actions['AddMockIdChild']).not.toBeUndefined();
        });
        it('Should add a "Add" action with the given name', function(){
            expect(TestParent.Actions['Name']).toBeUndefined();
            TestParent.addAddActionFor('MockIdChild','Name');
            expect(TestParent.Actions['Name']).not.toBeUndefined();
        });
    });
    it('addStateRequest(). Should add a "State" request.', function(){
        var TestParent = new MockParent();
        expect(TestParent.Requests['State']).toBeUndefined();
        TestParent.addStateRequest();
        expect(TestParent.Requests['State']).not.toBeUndefined();
    });
    describe('addAAvailableIdRequest(). Should add an "AvailableId" request for a collection.', function(){
        var TestParent;
        beforeEach(function() {
            TestParent = new MockParent();
        });
        it('Should add a "Available" request with the correct default name, with an s', function(){
            expect(TestParent.Requests['AvailableMockIdChildId']).toBeUndefined();
            TestParent.addAvailableIdRequest('MockIdChilds');
            expect(TestParent.Requests['AvailableMockIdChildId']).not.toBeUndefined();
        });
        it('Should add a "Available" request with the correct default name, without an s', function(){
            expect(TestParent.Requests['AvailableMockIdChildId']).toBeUndefined();
            TestParent.addAvailableIdRequest('MockIdChild');
            expect(TestParent.Requests['AvailableMockIdChildId']).not.toBeUndefined();
        });
        it('Should add a "Add" action with the given name', function(){
            expect(TestParent.Requests['Name']).toBeUndefined();
            TestParent.addAvailableIdRequest('MockIdChilds','Name');
            expect(TestParent.Requests['Name']).not.toBeUndefined();
        });
    });
});
