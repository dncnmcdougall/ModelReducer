/*eslint-env jasmine */

var ModelReducer = require('./Util.js').ModelReducer;
var ModelCreator = ModelReducer.ModelCreator;

var MockParent = require('./mock_Parent.js');
var MockChild = require('./mock_Child.js');

var defaultState = require('./mock_DefaultState.js');

var wrapFunction = require('./Util.js').wrapFunction;

describe('Model: The model returned from the creator. Used to process state.', function() {
    describe('listActions: Lists all the actions registered on this model, recursively.', function() {

        it('Should list only the actions on the model.', function() {
            var actions = MockChild.listActions();

            expect(actions).toContain('MockChild.NullAction');
            expect(actions).toContain('MockChild.IncrementAction');
            expect(actions).toContain('MockChild.AddMockNestedChild');
            expect(actions).toContain('MockChild.MockNestedChild.Action');
            expect(actions).toContain('MockChild.MockNestedChild[].Action');
            expect(actions).toContain('MockChild.MockNestedChild[].PushEmpty');
            expect(actions).toContain('MockChild.MockNestedChild[].AddEmpty');
            expect(actions).toContain('MockChild.MockNestedChild[].Remove');
            expect(actions).toContain('MockChild.MockNestedChild[].RemoveHead');
            expect(actions).toContain('MockChild.MockNestedChild[].RemoveTail');

            expect(actions.length).toEqual(10);
        });
    });
    describe('listCustomActions: Lists all the user defined actions registered on this model, recursively.', function() {
        it('Should list all the user defined actions on the model.', function() {
            var actions = MockParent.listCustomActions();
            expect(actions).toContain('MockParent.NullAction');
            expect(actions).toContain('MockParent.IncrementAction');

            expect(actions).toContain('MockParent.MockChild.NullAction');
            expect(actions).toContain('MockParent.MockChild.IncrementAction');
            expect(actions).toContain('MockParent.MockChild.MockNestedChild.Action');
            expect(actions).toContain('MockParent.MockChild.MockNestedChild[].Action');

            expect(actions).toContain('MockParent.MockCollectionChild[].NullAction');
            expect(actions).toContain('MockParent.MockCollectionChild[].IncrementAction');
            expect(actions).toContain('MockParent.MockCollectionChild[].MockNestedChild.Action');
            expect(actions).toContain('MockParent.MockCollectionChild[].MockNestedChild[].Action');

            expect(actions.length).toEqual(10);
        });

        it('Should list only the user defined actions on the given model.', function() {
            var actions = MockChild.listCustomActions();

            expect(actions).toContain('MockChild.NullAction');
            expect(actions).toContain('MockChild.IncrementAction');
            expect(actions).toContain('MockChild.MockNestedChild.Action');
            expect(actions).toContain('MockChild.MockNestedChild[].Action');

            expect(actions.length).toEqual(4);
        });
    });
    describe('listRequests: Lists all the requests registered on this model, recursively.', function() {

        it('Should list only the requests on the model.', function() {
            var requests = MockChild.listRequests();

            expect(requests).toContain('MockChild.ChildRequest');
            expect(requests).toContain('MockChild.State');
            expect(requests).toContain('MockChild.MockNestedChild.Request');
            expect(requests).toContain('MockChild.MockNestedChild[].Request');
            expect(requests).toContain('MockChild.MockNestedChild[].Keys');
            expect(requests).toContain('MockChild.MockNestedChild[].Length');
            expect(requests).toContain('MockChild.MockNestedChild[].HeadState');
            expect(requests).toContain('MockChild.MockNestedChild[].TailState');

            expect(requests.length).toEqual(8);
        });
    });
    describe('listCustomRequests: Lists all the user defined requests registered on this model, recursively.', function() {
        it('Should list all the user defined requests on the model.', function() {
            var requests = MockParent.listCustomRequests();
            expect(requests).toContain('MockParent.ParentRequest');

            expect(requests).toContain('MockParent.MockChild.ChildRequest');
            expect(requests).toContain('MockParent.MockChild.MockNestedChild.Request');
            expect(requests).toContain('MockParent.MockChild.MockNestedChild[].Request');

            expect(requests).toContain('MockParent.MockCollectionChild[].CollectionChildRequest');
            expect(requests).toContain('MockParent.MockCollectionChild[].MockNestedChild.Request');
            expect(requests).toContain('MockParent.MockCollectionChild[].MockNestedChild[].Request');

            expect(requests.length).toEqual(7);
        });

        it('Should list only the user defined requests on the given model.', function() {
            var requests = MockChild.listCustomRequests();

            expect(requests).toContain('MockChild.ChildRequest');
            expect(requests).toContain('MockChild.MockNestedChild.Request');
            expect(requests).toContain('MockChild.MockNestedChild[].Request');

            expect(requests.length).toEqual(3);
        });
    });
    describe('createEmpty: Creates an empty state representing this model.', function() {
        var Model;
        var ChildModel;
        var CollectionModel;

        var state;

        beforeAll( function() {
            var childCreator = new ModelCreator('Child');
            childCreator.addProperty('StringProp','string');
            childCreator.addProperty('NumberProp','number');
            ChildModel = childCreator.finaliseModel();

            var collectionCreator = new ModelCreator('Collection');
            collectionCreator.addProperty('NumberProp','number');
            CollectionModel = collectionCreator.finaliseModel();

            var modelCreator = new ModelCreator('Model');
            modelCreator.addProperty('StringProp','string');
            modelCreator.addProperty('NumberProp','number');
            modelCreator.addProperty('BooleanProp','boolean');
            modelCreator.addProperty('ObjectProp','object');
            modelCreator.addProperty('ArrayProp','array');
            modelCreator.addProperty('UnknownProp');

            modelCreator.addChild( ChildModel );
            modelCreator.addChildAsCollection( CollectionModel );

            Model = modelCreator.finaliseModel();

            state = Model.createEmpty();
        });
        it('Should populate strings with ""', function() {
            expect( state.StringProp ).toEqual( '' );
            expect( typeof(state.StringProp) ).toEqual( 'string' );
        });
        it('Should populate numbers with 0', function() {
            expect( state.NumberProp ).toEqual( 0 );
            expect( typeof(state.NumberProp) ).toEqual( 'number' );
        });
        it('Should populate booleans with false', function() {
            expect( state.BooleanProp ).toEqual( false );
            expect( typeof(state.BooleanProp) ).toEqual( 'boolean' );
        });
        it('Should populate objects with {}', function() {
            expect( state.ObjectProp ).toEqual( {} );
            expect( typeof(state.ObjectProp) ).toEqual( 'object' );
        });
        it('Should populate arrays with []', function() {
            expect( state.ArrayProp ).toEqual( [] );
            expect( typeof(state.ArrayProp) ).toEqual( 'object' );
            expect( Array.isArray(state.ArrayProp) ).toBe( true );
        });
        it('Should populate null types (type not given) with null', function() {
            expect( state.UnknownProp ).toBeNull();
        });
        it('Should populate children recursively.', function() {
            expect( state.Child ).not.toBeUndefined();

            expect( state.Child.StringProp ).toEqual( '' );
            expect( typeof(state.Child.StringProp) ).toEqual( 'string' );
            expect( state.Child.NumberProp ).toEqual( 0 );
            expect( typeof(state.Child.NumberProp) ).toEqual( 'number' );
        });
        it('Should populate child collections with {}', function() {
            expect( state['Collection[]'] ).toEqual( {} );
        });
    });
    describe('State (request): Returns the state representing this model from within the given state.', function() {
        var state;
        beforeEach( function() {
            state = defaultState();
        });

        it('Should return the parent state.', function() {
            expect(MockParent.request('MockParent.State',state)).toBe(state);
        });
        it('Should return the child state.', function() {
            var subState = state.MockChild;
            expect(MockParent.request('MockParent.MockChild.State',state)).toBe(subState);
        });
        it('Should return the collection child state.', function() {
            var subState =state['MockCollectionChild[]'][0] ;
            expect(MockParent.request('MockParent.MockCollectionChild[].State',state, 0)).toBe(subState);
        });
    });
    describe('Set[PropertyName] (action): Sets the named property to the given value and returns the new state.', function() {
        var Model;
        beforeAll( function() {
            var modelCreator = new ModelCreator('Model');
            modelCreator.addProperty('NumberProp','number');
            modelCreator.addProperty('TypelessProp');
            modelCreator.addSetActionFor('NumberProp');
            modelCreator.addSetActionFor('TypelessProp');
            modelCreator.addSetActionFor('UnknownProp');
            Model = modelCreator.finaliseModel();
        });

        it('Should set the property to the given value.', function() {
            var state = Model.createEmpty();
            expect( state.NumberProp ).toEqual( 0 );

            var newState = Model.reduce('Model.SetNumberProp',state,3);
            expect( state.NumberProp ).toEqual( 0 );
            expect( newState.NumberProp ).toEqual( 3 );
        });
        it('Should do nothing if the value is the same.', function() {
            var state = Model.createEmpty();
            expect( state.NumberProp ).toEqual( 0 );

            var newState = Model.reduce('Model.SetNumberProp',state,0);
            expect( state.NumberProp ).toEqual( 0 );
            expect( newState.NumberProp ).toEqual( 0 );
            expect( newState).toBe( state );
        });
        it('Should set the property to any value if the type is not give.', function() {
            var state = Model.createEmpty();
            expect( state.TypelessProp ).toEqual( null );

            var newState = Model.reduce('Model.SetTypelessProp', state, 'A String');
            expect( state.TypelessProp ).toBe( null );
            expect( newState.TypelessProp ).toBe( 'A String' );

            newState = Model.reduce('Model.SetTypelessProp', state, false);
            expect( state.TypelessProp ).toBe( null );
            expect( newState.TypelessProp ).toBe( false );

            newState = Model.reduce('Model.SetTypelessProp', state, {'id':'value'});
            expect( state.TypelessProp ).toBe( null );
            expect( newState.TypelessProp ).toEqual( {'id':'value'} );
        });
        it('Should throw if there is a type violation.', function() {
            var state = Model.createEmpty();
            expect( wrapFunction(Model,'reduce', 'Model.SetNumberProp', state, 'A String') ).toThrow(
                new Error('Expected parameter to be of type "number" but received "string".')
            );
        });
        it('Should throw if the property does not exist.', function() {
            var state = Model.createEmpty();
            expect( wrapFunction(Model,'reduce', 'Model.SetUnknownProp', state, 'A String') ).toThrow(
                new Error('The property "UnknownProp" was not defined on the model')
            );
        });
    });
    describe('hasCollection: returns true if the model has the named collection of children.', function() {
        var Model;
        var CollectionModel;
        var SimpleModel;
        beforeAll( function() {

            var collectionCreator = new ModelCreator('Collection');
            collectionCreator.addProperty('NumberProp','number');
            collectionCreator.addSetActionFor('NumberProp');
            CollectionModel = collectionCreator.finaliseModel();

            var simpleCreator = new ModelCreator('Simple');
            simpleCreator.addProperty('NumberProp','number');
            simpleCreator.addSetActionFor('NumberProp');
            SimpleModel = simpleCreator.finaliseModel();

            var modelCreator = new ModelCreator('Model');
            modelCreator.addChildAsCollection( CollectionModel );
            modelCreator.addAddActionFor( CollectionModel, 'AddCollectionChild' );
            modelCreator.addChild( SimpleModel );
            Model = modelCreator.finaliseModel();
        });
        it('Should return true if the collection is present.', function() {
            expect(Model.hasCollection('Collection[]')).toBe(true);
        });
        it('Should return false if the collection is not present.', function() {
            expect(Model.hasCollection('UnknownCollection')).toBe(false);
        });
        it('Should return false if the collection is not present, but is a child.', function() {
            expect(Model.hasCollection('Simple')).toBe(false);
        });
    });
    describe('hasChild: returns true if the model has the named child.', function() {
        var Model;
        var CollectionModel;
        var SimpleModel;
        beforeAll( function() {

            var collectionCreator = new ModelCreator('Collection');
            collectionCreator.addProperty('NumberProp','number');
            collectionCreator.addSetActionFor('NumberProp');
            CollectionModel = collectionCreator.finaliseModel();

            var simpleCreator = new ModelCreator('Simple');
            simpleCreator.addProperty('NumberProp','number');
            simpleCreator.addSetActionFor('NumberProp');
            SimpleModel = simpleCreator.finaliseModel();

            var modelCreator = new ModelCreator('Model');
            modelCreator.addChildAsCollection( CollectionModel );
            modelCreator.addAddActionFor( CollectionModel, 'AddCollectionChild' );
            modelCreator.addChild( SimpleModel );
            Model = modelCreator.finaliseModel();
        });
        it('Should return true if the child is present.', function() {
            expect(Model.hasChild('Simple')).toBe(true);
        });
        it('Should return false if the child is not present.', function() {
            expect(Model.hasChild('UnknownChild')).toBe(false);
        });
        it('Should return true if the child is not present, but is a collection.', function() {
            expect(Model.hasChild('Collection[]')).toBe(true);
        });
    });
});
