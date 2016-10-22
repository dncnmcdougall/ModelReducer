/*eslint-env jasmine */

var ModelReducer = require('../index.js');
var ModelCreator = ModelReducer.ModelCreator;

var MockParent = require('./mock_Parent.js');
var MockChild = require('./mock_Child.js');

var defaultState = require('./mock_DefaultState.js');

var wrapFunction = function( func, ...args) {
    return function() {
        func(...args);
    };
};

describe('Model: The model returned from the creator. Used to process state.', function() {
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
            expect(requests).toContain('MockParent.State');
            expect(requests).toContain('MockParent.AvailableMockCollectionChildId');

            expect(requests).toContain('MockParent.MockChild.ChildRequest');
            expect(requests).toContain('MockParent.MockChild.State');
            expect(requests).toContain('MockParent.MockChild.MockNestedChild.Request');
            expect(requests).toContain('MockParent.MockChild.MockNestedCollection.Request');

            expect(requests).toContain('MockParent.MockCollectionChild.CollectionChildRequest');
            expect(requests).toContain('MockParent.MockCollectionChild.State');
            expect(requests).toContain('MockParent.MockCollectionChild.MockNestedChild.Request');
            expect(requests).toContain('MockParent.MockCollectionChild.MockNestedCollection.Request');

            expect(requests.length).toEqual(11);
        });

        it('Should list only the requests on the given model.', function() {
            var requests = MockChild.listRequests();

            expect(requests).toContain('MockChild.ChildRequest');
            expect(requests).toContain('MockChild.State');
            expect(requests).toContain('MockChild.MockNestedChild.Request');
            expect(requests).toContain('MockChild.MockNestedCollection.Request');

            expect(requests.length).toEqual(4);
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
            collectionCreator.setFormsACollection(true);
            collectionCreator.setCollectionName('Collection');
            collectionCreator.addProperty('NumberProp','number');
            CollectionModel = collectionCreator.finaliseModel();

            var modelCreator = new ModelCreator('Model');
            modelCreator.addProperty('StringProp','string');
            modelCreator.addProperty('NumberProp','number');
            modelCreator.addProperty('BooleanProp','boolean');
            modelCreator.addProperty('ObjectProp','object');
            modelCreator.addProperty('ArrayProp','array');
            modelCreator.addProperty('UnknownProp');

            modelCreator.addChildModel( ChildModel );
            modelCreator.addChildModel( CollectionModel );

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
            expect( state.Collection ).toEqual( {} );
        });
        it('Should set the collection key to null', function() {
            var collectionState = CollectionModel.createEmpty();

            expect( collectionState ).not.toBeUndefined();

            expect( collectionState.Key ).not.toBeUndefined();
            expect( collectionState.Key ).toEqual( null );

            expect( collectionState.NumberProp ).toEqual( 0 );
            expect( typeof(collectionState.NumberProp) ).toEqual( 'number' );
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
            var subState =state.MockCollectionChildren[0] ;
            expect(MockParent.request('MockParent.MockCollectionChild.State',state, 0)).toBe(subState);
        });
    });
    describe('Set[PropertyName] (action): Sets the named property to the given value and returnes the new state.', function() {
        it('Should set the property to the given value.');
        it('Should throw if there is a type violation.');
    });
    describe('Add[ChildName] (action): Adds an empty instance of the child, under the given key, and returns the new state.', 
        function() {
            it('Should add the child a child at the given id.');
            it('Should overwrite a child if it already exists.');
        });
    describe('Available[ChildName] (request): Returns the available key value for the given child collection in the state.', 
        function() {

            var count = 9;
            var listName = MockParent.children.MockCollectionChild.propertyName;
            var requestName = 'AvailableMockCollectionChildId';
            var modelName = MockParent.name;
            function testOnRange(count){
                var name;
                if ( count%2 === 0 ) {
                    name = 'even';
                } else {
                    name = 'odd';
                }
                describe('Should return the missing id of an '+name+' lengthed array', function() {
                    var state = {};
                    var id;
                    var i;
                    beforeEach(function(){
                        id = -1;
                        i = 0;
                        state = {};
                        state[listName] = {};
                        for ( var i = 0; i< count; i++ ) {
                            state[listName][i] = { 'Property': 'String'};
                        }
                    });

                    it('Should return a missing id if the list has a hole.', function() {
                        for (i = 0; i< count; i++ ) {
                            delete state[listName][i];
                            id = MockParent.request(modelName+'.'+requestName, state);
                            expect(id).toEqual(i);
                            state[listName][i] = { 'Property': 'String'};
                        }
                    });
                    it('Should return a missing id if the list a has big hole.', function() {
                        for (i = 0; i< count-1; i++ ) {
                            delete state[listName][i];
                            delete state[listName][i+1];
                            id = MockParent.request(modelName+'.'+requestName, state);
                            expect(id).toEqual(i);
                            state[listName][i] = { 'Property': 'String'};
                            state[listName][i+1] = { 'Property': 'String'};
                        }
                    });
                    it('Should return a missing id if the list has two holes.', function() {
                        for (i = 0; i< count-3; i++ ) {
                            delete state[listName][i];
                            delete state[listName][i+3];
                            id = MockParent.request(modelName+'.'+requestName, state);
                            expect(id).toEqual(i);
                            state[listName][i] = { 'Property': 'String'};
                            state[listName][i+3] = { 'Property': 'String'};
                        }
                    });
                });
            }

            it('Should handle an empty list', function() {
                var state = {};
                state[listName] = {};
                var id = MockParent.request(modelName+'.'+requestName, state);
                expect(id).toEqual(0);
            });
            it('Should handle a list with only one item', function() {
                var state = {};
                state[listName] = {
                    '0': {' Property': 'String'} 
                };
                var id = MockParent.request(modelName+'.'+requestName, state);
                expect(id).toEqual(1);

                state[listName] = {
                    '1': {' Property': 'String'} 
                };
                id = MockParent.request(modelName+'.'+requestName, state);
                expect(id).toEqual(0);
            });

            testOnRange(count);
            testOnRange(count-1);
        });
});
