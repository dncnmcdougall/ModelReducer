/*eslint-env jasmine */

var ModelReducer = require('./Util.js').ModelReducer;
var StateValidator = ModelReducer.StateValidator;

var MockCollectionChild = require('./mock_CollectionChild.js');
var MockCollectionChild1 = require('./mock_CollectionChild1.js');
var MockParent = require('./mock_Parent.js');
var MockParent1 = require('./mock_Parent1.js');

var defaultState = require('./mock_DefaultState.js');

describe('StateValidator: A class used for asserting that a given state object fulfils a given model.', function() {
    describe('validateState: can be used to update to a newer version.', function() {

        var state;

        beforeEach(function() {
            state = defaultState();
        });

        it('should work with old models as expected', function() {
            var result = StateValidator.validateState( MockParent, state, true );
            expect(result.error).toBeNull();

            expect( state.version ).toBeUndefined();
            expect( result.value.version ).toBe(0);

            expect( result.value ).toEqual( defaultState(0) );
        });

        it('should error on updated state with old models', function() {
            var result = StateValidator.validateState( MockParent, state, true );
            expect(result.error).toBeNull();
        });

        it('should update the state with new models', function() {
            var result = StateValidator.validateState( MockParent1, state, true );
            expect(result.error).toBeNull();

            expect( state.version ).toBeUndefined();
            expect( result.value.version ).toBe(1);

            expect( state.NumberProperty ).not.toBeUndefined();
            expect( state.ParentProperty ).not.toBeUndefined();
            expect( state.MockChild ).not.toBeUndefined();
            expect( state.NumberPropertyV1 ).toBeUndefined();
            expect( state.ParentPropertyV1 ).toBeUndefined();
            expect( state.MockOtherChild ).toBeUndefined();

            expect( result.value.NumberProperty ).toBeUndefined();
            expect( result.value.ParentProperty ).toBeUndefined();
            expect( result.value.MockChild ).toBeUndefined();
            expect( result.value.NumberPropertyV1 ).not.toBeUndefined();
            expect( result.value.ParentPropertyV1 ).not.toBeUndefined();
            expect( result.value.MockOtherChild ).not.toBeUndefined();
        });

        it('should read updated state with new models', function() {
            state = defaultState(1);
            var result = StateValidator.validateState( MockParent1, state, true );
            expect(result.error).toBeNull();

            expect( state.version ).toBe(1);
            expect( result.value.version ).toBe(1);
            expect( result.value).toEqual( state );
        });

        it('should fail if the update fails', function() {
            delete state['ParentProperty'];
            var result = StateValidator.validateState( MockParent1, state, true );
            expect(result.value).toBeNull();
            expect(result.error).toEqual(
                'Expected to find property "ParentProperty" to rename to "ParentPropertyV1" in version 1, but did not.');

        });
    });

    describe('validateStateCollection: asserts that the given object represents a collection of state of the given model.', 
        function () {

            var state;
            beforeEach( function() {
                state = {
                    0: {
                        'id': 0,
                        'CollectionChildProperty': 1,
                        'NumberProperty': 2,
                        'MockNestedChild': {
                            'NestedChildProperty': 3
                        },
                        'MockNestedChild[]': {
                            0: {
                                'id': 0,
                                'NestedChildProperty': 4
                            }
                        }
                    },
                    1: {
                        'id': 1,
                        'CollectionChildProperty': 5,
                        'NumberProperty': 6,
                        'MockNestedChild': {
                            'NestedChildProperty': 7
                        },
                        'MockNestedChild[]': {
                            0: {
                                'id': 0,
                                'NestedChildProperty': 8
                            }
                        }
                    }
                };
            });

            it('should work with old models as expected', function() {
                var result = StateValidator.validateStateCollection( MockCollectionChild, state, true );
                expect(result.error).toBeNull();

                expect( state[0].version ).toBeUndefined();
                expect( state[1].version ).toBeUndefined();
                expect( result.value[0].version ).toBe(0);
                expect( result.value[1].version ).toBe(0);
            });

            it('should update the state with new models', function() {
                var result = StateValidator.validateStateCollection( MockCollectionChild1, state, true );
                expect(result.error).toBeNull();

                expect( state[0].version ).toBeUndefined();
                expect( state[1].version ).toBeUndefined();
                expect( result.value[0].version ).toBe(1);
                expect( result.value[1].version ).toBe(1);

                expect( state[0].NumberProperty ).not.toBeUndefined();
                expect( state[0].NumberPropertyV1 ).toBeUndefined();
                expect( state[0].CollectionChildProperty ).not.toBeUndefined();
                expect( state[0].CollectionChildPropertyV1 ).toBeUndefined();

                expect( state[1].NumberProperty ).not.toBeUndefined();
                expect( state[1].NumberPropertyV1 ).toBeUndefined();
                expect( state[1].CollectionChildProperty ).not.toBeUndefined();
                expect( state[1].CollectionChildPropertyV1 ).toBeUndefined();

                expect( result.value[0].NumberProperty ).toBeUndefined();
                expect( result.value[0].NumberPropertyV1 ).not.toBeUndefined();
                expect( result.value[0].CollectionChildProperty ).toBeUndefined();
                expect( result.value[0].CollectionChildPropertyV1 ).not.toBeUndefined();

                expect( result.value[1].NumberProperty ).toBeUndefined();
                expect( result.value[1].NumberPropertyV1 ).not.toBeUndefined();
                expect( result.value[1].CollectionChildProperty ).toBeUndefined();
                expect( result.value[1].CollectionChildPropertyV1 ).not.toBeUndefined();
            });
        });


});

