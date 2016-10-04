/*eslint-env jasmine */

var StateValidator = require('../lib/StateValidator.js');

var MockChild = require('./mock_Child.js');
var MockCollectionChild = require('./mock_CollectionChild.js');
var MockParent = require('./mock_Parent.js');

describe('StateValidator: A class used for asserting that a given state object fulfills a given model.', function() {
    describe('validateState: asserts that the given object represents a state of the given model.', function () {

        var state;
        beforeEach( function() {
            state = {
                'ParentProperty': 1,
                'NumberProperty': 2,
                'MockChild': {
                    'ChildProperty': 3,
                    'NumberProperty': 4,
                    'MockNestedChild': {
                        'NestedChildProperty': 5
                    },
                    'MockNestedChildren': {
                        0: {
                            'id': 0,
                            'NestedCollectionProperty': 6
                        }
                    }
                },
                'MockCollectionChildren': {
                    0: {
                        'id': 0,
                        'CollectionChildProperty': 7,
                        'NumberProperty': 8,
                        'MockNestedChild': {
                            'NestedChildProperty': 9
                        },
                        'MockNestedChildren': {
                            0: {
                                'id': 0,
                                'NestedCollectionProperty': 10
                            }
                        }
                    }
                }
            };
        });

        it('Should return the state and no error when everything is correct.', function() {
            var result = StateValidator.validateState( MockParent, state );

            expect(result.error).toBeNull();
            // CRC: DMD: should this be changed?
            // expect(result.value).toBe( state );
            expect(result.value).toEqual( state );
        });

        it('Should return an error when a property is of the wrong type.', function() {
            state.NumberProperty = 'A String';

            var result = StateValidator.validateState( MockParent, state );
            expect(result.error).toEqual( 
                'Expected property MockParent.NumberProperty to have type "number", but found type "string".'
            );
            expect(result.value).toBeNull();
        });
        it('Should return an error when a child property is of the wrong type.', function() {
            state.MockChild.NumberProperty = 'A String';

            var result = StateValidator.validateState( MockParent, state );
            expect(result.error).toEqual( 
                'Expected property MockChild.NumberProperty to have type "number", but found type "string".'
            );
            expect(result.value).toBeNull();
        });
        it('Should return an error when a collection property is of the wrong type.', function() {
            state.MockCollectionChildren[0].NumberProperty = 'A String';

            var result = StateValidator.validateState( MockParent, state );
            expect(result.error).toEqual( 
                'Expected property MockCollectionChildren[0].NumberProperty to have type "number", but found type "string".'
            );
            expect(result.value).toBeNull();
        });

        it('Should return an error when there is a missing property.', function() {
            delete state.NumberProperty;

            var result = StateValidator.validateState( MockParent, state );
            expect(result.error).toEqual( 'Expected to find a property named MockParent.NumberProperty, but did not.');
            expect(result.value).toBeNull();
        });
        it('Should return an error when there is a missing child.', function() {
            delete state.MockChild;

            var result = StateValidator.validateState( MockParent, state );
            expect(result.error).toEqual( 'Expected to find a child named MockParent.MockChild, but did not.');
            expect(result.value).toBeNull();
        });
        it('Should return an error when there is a missing collection child.', function() {
            delete state.MockCollectionChildren;

            var result = StateValidator.validateState( MockParent, state );
            expect(result.error).toEqual( 'Expected to find a collection named MockParent.MockCollectionChildren, but did not.');
            expect(result.value).toBeNull();
        });
        it('Should return an error when there is an extra property.', function() {
            state.ExtraProperty = 'An extra property';

            var result = StateValidator.validateState( MockParent, state );
            expect(result.error).toEqual( 'Did not expecte to find a property named MockParent.ExtraProperty, but did.');
            expect(result.value).toBeNull();
        });

        it('Should return an error when there is a missing property on a child.', function() {
            delete state.MockChild.NumberProperty;

            var result = StateValidator.validateState( MockParent, state );
            expect(result.error).toEqual( 'Expected to find a property named MockChild.NumberProperty, but did not.');
            expect(result.value).toBeNull();
        });
        it('Should return an error when there is a missing child on a child.', function() {
            delete state.MockChild.MockNestedChild;

            var result = StateValidator.validateState( MockParent, state );
            expect(result.error).toEqual( 'Expected to find a child named MockChild.MockNestedChild, but did not.');
            expect(result.value).toBeNull();
        });
        it('Should return an error when there is a missing collection child on a child.', function() {
            delete state.MockChild.MockNestedChildren;

            var result = StateValidator.validateState( MockParent, state );
            expect(result.error).toEqual( 'Expected to find a collection named MockChild.MockNestedChildren, but did not.');
            expect(result.value).toBeNull();
        });
        it('Should return an error when there is an extra property on a child.', function() {
            state.MockChild.ExtraProperty = 'An extra property';

            var result = StateValidator.validateState( MockParent, state );
            expect(result.error).toEqual( 'Did not expecte to find a property named MockChild.ExtraProperty, but did.');
            expect(result.value).toBeNull();
        });

        it('Should return an error when there is a missing property on a collection.', function() {
            delete state.MockCollectionChildren[0].NumberProperty;

            var result = StateValidator.validateState( MockParent, state );
            expect(result.error).toEqual( 
                'Expected to find a property named MockCollectionChildren[0].NumberProperty, but did not.'
            );
            expect(result.value).toBeNull();
        });
        it('Should return an error when there is a missing child on a collection.', function() {
            delete state.MockCollectionChildren[0].MockNestedChild;

            var result = StateValidator.validateState( MockParent, state );
            expect(result.error).toEqual( 
                'Expected to find a child named MockCollectionChildren[0].MockNestedChild, but did not.'
            );
            expect(result.value).toBeNull();
        });
        it('Should return an error when there is a missing collection child on a collection.', function() {
            delete state.MockCollectionChildren[0].MockNestedChildren;

            var result = StateValidator.validateState( MockParent, state );
            expect(result.error).toEqual( 
                'Expected to find a collection named MockCollectionChildren[0].MockNestedChildren, but did not.'
            );
            expect(result.value).toBeNull();
        });
        it('Should return an error when there is an extra property on a collection.', function() {
            state.MockCollectionChildren[0].ExtraProperty = 'An extra property';

            var result = StateValidator.validateState( MockParent, state );
            expect(result.error).toEqual( 
                'Did not expecte to find a property named MockCollectionChildren[0].ExtraProperty, but did.'
            );
            expect(result.value).toBeNull();
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
                        'MockNestedChildren': {
                            0: {
                                'id': 0,
                                'NestedCollectionProperty': 4
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
                        'MockNestedChildren': {
                            0: {
                                'id': 0,
                                'NestedCollectionProperty': 8
                            }
                        }
                    }
                };
            });

            it('Should return an error when there is a missing property.', function() {
                delete state[0].NumberProperty;

                var result = StateValidator.validateStateCollection( MockCollectionChild, state );
                expect(result.error).toEqual( 
                    'Expected to find a property named MockCollectionChildren[0].NumberProperty, but did not.'
                );
                expect(result.value).toBeNull();
            });
            it('Should return an error when there is a missing child.', function() {
                delete state[0].MockNestedChild;

                var result = StateValidator.validateStateCollection( MockCollectionChild, state );
                expect(result.error).toEqual( 
                    'Expected to find a child named MockCollectionChildren[0].MockNestedChild, but did not.'
                );
                expect(result.value).toBeNull();
            });
            it('Should return an error when there is a missing collection child.', function() {
                delete state[0].MockNestedChildren;

                var result = StateValidator.validateStateCollection( MockCollectionChild, state );
                expect(result.error).toEqual( 
                    'Expected to find a collection named MockCollectionChildren[0].MockNestedChildren, but did not.'
                );
                expect(result.value).toBeNull();
            });
            it('Should return an error when there is an extra property.', function() {
                state[0].ExtraProperty = 'An extra property';

                var result = StateValidator.validateStateCollection( MockCollectionChild, state );
                expect(result.error).toEqual( 
                    'Did not expecte to find a property named MockCollectionChildren[0].ExtraProperty, but did.'
                );
                expect(result.value).toBeNull();
            });

            it('Should return an error when the "key" property is out of sync.', function () {
                state[0].id = 1;
                var result = StateValidator.validateStateCollection( MockCollectionChild, state );

                expect(result.error).toEqual('Expected MockCollectionChildren[0] to have "id" of 0 but found 1.');
                expect(result.value).toBeNull();
            });

            it('Should return an error when the Model is not a collection.', function () {
                state[0].id = 1;
                var result = StateValidator.validateStateCollection( MockChild, state );

                expect(result.error).toEqual(
                    'MockChild should not be placed in a collection as it is not marked as forming a collection.'
                );
                expect(result.value).toBeNull();
            });
        });
});

