/*eslint-env jasmine */

var ModelReducer = require('./Util.js').ModelReducer;
var ModelCreator = ModelReducer.ModelCreator;
var CollectionCreator = ModelReducer.CollectionCreator;

var wrapFunction = require('./Util.js').wrapFunction;

describe('Collection: The collection returned from the creator. Used to process collection state.', function() {
    var MockChild;
    var MockCollection;
    var Parent;
    var emptyState;
    var popState;
    var emptyParentState;
    var popParentState;

    beforeAll( function() {
        var modelCreator = new ModelCreator('MockChild');
        modelCreator.addProperty('NumberProp','number');
        MockChild = modelCreator.finaliseModel();

        var collectionCreator = new CollectionCreator('MockCollection',MockChild);
        collectionCreator.addProperty('StringProp', 'string');
        MockCollection = collectionCreator.finaliseModel();

        var parentCreator = new ModelCreator('Parent');
        parentCreator.addChild(MockCollection);
        Parent = parentCreator.finaliseModel();
    });
    beforeEach( function() {
        emptyState = MockCollection.createEmpty();
        popState = MockCollection.createEmpty();
        Object.assign(popState, { 0: MockChild.createEmpty() });
        Object.assign(popState, { 2: MockChild.createEmpty() });
        Object.assign(popState, { 'some_key': MockChild.createEmpty() });

        popState[0].NumberProp = 0;
        popState[2].NumberProp = 2;
        popState['some_key'].NumberProp = 3;

        emptyParentState = Parent.createEmpty();
        popParentState = Parent.createEmpty();
        Object.assign(popParentState.MockCollection, popState);
    });
    describe('keys: Returns a list of the keys in the collection. Method available on "this" in actions and requests.', function() {
        it('Should return an empty list when the collection is empty, ignoring properties.', function() {
            expect( MockCollection.keys(emptyState) ).toEqual( [] );
        });
        it('Should return a list with all the keys in the collection.', function() {
            let keys = MockCollection.keys(popState);
            expect(keys).toEqual( ['0', '2', 'some_key'] );
            expect(keys).toContain( '0' );
            expect(keys).toContain( '2' ); 
            expect(keys).toContain( 'some_key' );
            expect(keys).toHaveSize(3);
        });
    });
    describe('Keys (request): A request that returns a list of the keys in the collection.', function() {
        it('Should return an empty list when the collection is empty, ignoring properties.', function() {
            expect( MockCollection.request('MockCollection.Keys', emptyState) ).toEqual( [] );
            expect( Parent.request('Parent.MockCollection.Keys', emptyParentState) ).toEqual( [] );
        });
        it('Should return a list with all the keys in the collection.', function() {
            let keys =  MockCollection.request('MockCollection.Keys',popState);
            expect(keys).toContain( '0' );
            expect(keys).toContain( '2' ); 
            expect(keys).toContain( 'some_key' );
            expect(keys).toHaveSize(3);

            keys = Parent.request('Parent.MockCollection.Keys',popParentState);
            expect(keys).toContain( '0' );
            expect(keys).toContain( '2' ); 
            expect(keys).toContain( 'some_key' );
            expect(keys).toHaveSize(3);
        });
    });
    describe('largestKey: Returns the largest numberic key in the collection. Method available on "this" in actions and requests.', function() {
        it('Should return null when the collection is empty, ignoring properties.', function() {
            expect( MockCollection.largestKey(emptyState) ).toBeNull();

            Object.assign(emptyState, { 'some_key': MockChild.createEmpty() });
            emptyState['some_key'].NumberProp = 3;
            expect( MockCollection.largestKey(emptyState) ).toBeNull();
        });
        it('Should return the largest numeric key in the collection.', function() {
            expect( MockCollection.largestKey(popState) ).toEqual( 2 );
            Object.assign(popState, { 4: MockChild.createEmpty() });
            expect( MockCollection.largestKey(popState) ).toEqual( 4 );
            Object.assign(popState, { 'cats': MockChild.createEmpty() });
            expect( MockCollection.largestKey(popState) ).toEqual( 4 );
        });
    });
    describe('smallestKey: Returns the smallest numberic key in the collection. Method available on "this" in actions and requests.', function() {
        it('Should return null when the collection is empty, ignoring properties.', function() {
            expect( MockCollection.smallestKey(emptyState) ).toBeNull();

            Object.assign(emptyState, { 'some_key': MockChild.createEmpty() });
            emptyState['some_key'].NumberProp = 3;
            expect( MockCollection.smallestKey(emptyState) ).toBeNull();
        });
        it('Should return the largest numeric key in the collection.', function() {
            expect( MockCollection.smallestKey(popState) ).toEqual( 0 );
            delete popState[0];
            expect( MockCollection.smallestKey(popState) ).toEqual( 2 );
        });
    });
    describe('length: Returns the number of items in the collection. Method available on "this" in actions and requests.', function() {
        it('Should return 0 when the collection is empty, ignoring properties.', function() {
            expect( MockCollection.length(emptyState) ).toEqual( 0 );
        });
        it('Should return the number of elements in the collection.', function() {
            expect( MockCollection.length(popState) ).toEqual( 3 );
        });
    });
    describe('Length (request): A request that returns the number of items in the collection.', function() {
        it('Should return 0 when the collection is empty, ignoring properties.', function() {
            expect( MockCollection.request('MockCollection.Length',emptyState) ).toEqual( 0 );
            expect( Parent.request('Parent.MockCollection.Length',emptyParentState) ).toEqual( 0 );
        });
        it('Should return the number of elements in the collection.', function() {
            expect( MockCollection.request('MockCollection.Length',popState) ).toEqual( 3 );
            expect( Parent.request('Parent.MockCollection.Length',popParentState) ).toEqual( 3 );
        });
    });
    describe('headState: Returns the state of the first item in the collecton. Method availavle on "this" in actions and requests.', function() {
        it('Should return null list when the collection is empty.', function() {
            expect( MockCollection.headState(emptyState) ).toBeNull();
        });
        it('Should return the state of the first item in the collection.', function() {
            expect( MockCollection.headState(popState) ).toEqual( { NumberProp: 0 });
        });
    });
    describe('HeadState (request): A request that returns the state of the first item in the collection.', function() {
        it('Should return null list when the collection is empty.', function() {
            expect( MockCollection.request('MockCollection.HeadState',emptyState) ).toBeNull();
            expect( Parent.request('Parent.MockCollection.HeadState',emptyParentState) ).toBeNull();
        });
        it('Should return the state of the first item in the collection.', function() {
            expect( MockCollection.request('MockCollection.HeadState',popState) ).toEqual( { NumberProp: 0 });
            expect( Parent.request('Parent.MockCollection.HeadState',popParentState) ).toEqual( { NumberProp: 0 });
        });
    });
    describe('tailState: Returns the state of the last item in the collecton. Method availavle on "this" in actions and requests.', function() {
        it('Should return null list when the collection is empty.', function() {
            expect( MockCollection.tailState(emptyState) ).toBeNull();
        });
        it('Should return the state of the last item in the collection.', function() {
            expect( MockCollection.tailState(popState) ).toEqual( { NumberProp: 3 });
        });
    });
    describe('TailState (request): A request that returns the state of the last item in the collection.', function() {
        it('Should return null list when the collection is empty.', function() {
            expect( MockCollection.request('MockCollection.TailState',emptyState) ).toBeNull();
            expect( Parent.request('Parent.MockCollection.TailState',emptyParentState) ).toBeNull();
        });
        it('Should return the state of the last item in the collection.', function() {
            expect( MockCollection.request('MockCollection.TailState',popState) ).toEqual( { NumberProp: 3 });
            expect( Parent.request('Parent.MockCollection.TailState',popParentState) ).toEqual( { NumberProp: 3 });
        });
    });
    describe('PushEmpty (action): Adds an empty instance of the child to the end of the collection.'+
        'This considers the keys that are numbers.', 
        function() {
            it('Should add an empty item with id 0, if the collection is empty.', function() {
                let newState = MockCollection.reduce('MockCollection.PushEmpty', emptyState);
                expect( Object.keys(newState) ).toContain( '0' );

                let newEmpty = MockChild.createEmpty();
                newEmpty[MockChild.collectionKey] = 0;
                expect( newState[0] ).toEqual(newEmpty);
            });
            it('Should add an empty item with id last+1 to the collection.', function() {
                let lastKey = MockCollection.largestKey(popState);
                let newState = MockCollection.reduce('MockCollection.PushEmpty', popState);
                expect(MockCollection.largestKey(newState) ).toEqual( lastKey +1 );

                let expectedKey = (lastKey+1).toString();
                expect( Object.keys(newState) ).toContain( expectedKey );
                let newEmpty = MockChild.createEmpty();
                newEmpty[MockChild.collectionKey] = (lastKey+1);
                expect( newState[lastKey+1] ).toEqual(newEmpty);
            });
        });
    describe('AddEmpty (action): Adds an empty instance of the child to the end of the collection, '+
        'under the given key.', function() {
            it('Should add an empty item with the specified numeric id.', function() {
                expect( Object.keys(popState) ).not.toContain( '12' );
                let newState = MockCollection.reduce('MockCollection.AddEmpty', popState, 12);
                expect( Object.keys(newState) ).toContain( '12' );

                let newEmpty = MockChild.createEmpty();
                newEmpty[MockChild.collectionKey] = 12;
                expect( newState[12] ).toEqual(newEmpty);
            });
            it('Should add an empty item with the specified non-numeric id.', function() {
                expect( Object.keys(popState) ).not.toContain( 'cats' );
                let newState = MockCollection.reduce('MockCollection.AddEmpty', popState, 'cats');
                expect( Object.keys(newState) ).toContain( 'cats' );

                let newEmpty = MockChild.createEmpty();
                newEmpty[MockChild.collectionKey] = 'cats';
                expect( newState.cats ).toEqual(newEmpty);
            });
            it('Should throw an error if the key names a property.', function() {
                expect(wrapFunction(MockCollection, 'reduce', 'MockCollection.AddEmpty', popState, 'StringProp')).toThrowError(/property/);
            });
            it('Should throw an error if the key names a child.', function() {
                var collectionCreator = new CollectionCreator('MockCollection',MockChild);
                collectionCreator.addProperty('StringProp', 'string');
                collectionCreator.addChild(MockChild, 'SomeChild');
                MockCollection = collectionCreator.finaliseModel();

                expect(wrapFunction(MockCollection, 'reduce', 'MockCollection.AddEmpty', popState, 'SomeChild')).toThrowError(/child/);
            });
            it('Should throw an error if the key is already used.', function() {
                expect(wrapFunction(MockCollection, 'reduce', 'MockCollection.AddEmpty', popState, 2)).toThrowError(/existing/);
            });
            it('Should throw an error if the key is the collection key.', function() {
                expect(wrapFunction(MockCollection, 'reduce', 'MockCollection.AddEmpty', popState, 'id')).toThrowError(/collection key/);
            });
            it('Should throw an error if the key names an action.', function() {
                var collectionCreator = new CollectionCreator('MockCollection',MockChild);
                collectionCreator.addProperty('StringProp', 'string');
                collectionCreator.addAction('NullAction', (state) => state );
                MockCollection = collectionCreator.finaliseModel();

                expect(wrapFunction(MockCollection, 'reduce', 'MockCollection.AddEmpty', popState, 'NullAction')).toThrowError(/action/);
            });
            it('Should throw an error if the key names a request.', function() {
                var collectionCreator = new CollectionCreator('MockCollection',MockChild);
                collectionCreator.addProperty('StringProp', 'string');
                collectionCreator.addRequest('NullRequest', (state) => null );
                MockCollection = collectionCreator.finaliseModel();

                expect(wrapFunction(MockCollection, 'reduce', 'MockCollection.AddEmpty', popState, 'NullRequest')).toThrowError(/request/);
            });
        });
    describe('RemoveHead (action): Removes the first item from the collection.' , function() {
        it('Should remove the smallest numerically numbered item.', function() {
            let newState = MockCollection.reduce('MockCollection.RemoveHead', popState);

            expect( MockCollection.keys(popState) ).toEqual( ['0', '2', 'some_key']);
            expect( MockCollection.keys(newState) ).toEqual( ['2', 'some_key']);
        });
        it('Should do nothing if there no numerically numbered items.', function() {
            let newState = MockCollection.reduce('MockCollection.RemoveHead', popState);
            newState = MockCollection.reduce('MockCollection.RemoveHead', newState);
            expect( MockCollection.keys(newState) ).toEqual( ['some_key']);

            expect(wrapFunction(MockCollection, 'reduce', 'MockCollection.RemoveHead', popState)).not.toThrow();
            let finalState = MockCollection.reduce('MockCollection.RemoveHead', newState);
            expect( finalState ).toBe( newState );
        });
    });
    describe('RemoveTail (action): Removes the last item from the collection.' , function() {
        it('Should remove the largest numerically numbered item.', function() {
            let newState = MockCollection.reduce('MockCollection.RemoveTail', popState);

            expect( MockCollection.keys(popState) ).toEqual( ['0', '2', 'some_key']);
            expect( MockCollection.keys(newState) ).toEqual( ['0', 'some_key']);
        });
        it('Should do nothing if there no numerically numbered items.', function() {
            let newState = MockCollection.reduce('MockCollection.RemoveTail', popState);
            newState = MockCollection.reduce('MockCollection.RemoveTail', newState);
            expect( MockCollection.keys(newState) ).toEqual( ['some_key']);

            expect(wrapFunction(MockCollection, 'reduce', 'MockCollection.RemoveTail', newState)).not.toThrow();
            let finalState = MockCollection.reduce('MockCollection.RemoveTail', newState);
            expect( finalState ).toBe( newState );
        });
    });
    describe('Remove (action): Removes the specified item from the collection.' , function() {
        it('Should remove the specified item.', function() {
            let newState1 = MockCollection.reduce('MockCollection.Remove', popState, 'some_key');
            let newState2 = MockCollection.reduce('MockCollection.Remove', popState, '2');

            expect( MockCollection.keys(popState) ).toEqual( ['0', '2', 'some_key']);
            expect( MockCollection.keys(newState1) ).toEqual( ['0', '2']);
            expect( MockCollection.keys(newState2) ).toEqual( ['0', 'some_key']);
        });
        it('Should do nothing if the specified item is not included.', function() {
            expect(wrapFunction(MockCollection, 'reduce', 'MockCollection.Remove', popState, 'non_existing_item')).not.toThrow();
            let newState = MockCollection.reduce('MockCollection.Remove', popState, 'non_existing_item');
            expect( newState ).toBe( popState );
        });
        it('Should throw an error if the key names a property.', function() {
            expect(wrapFunction(MockCollection, 'reduce', 'MockCollection.Remove', popState, 'StringProp')).toThrowError(/property/);
        });
        it('Should throw an error if the key names a child.', function() {
            var collectionCreator = new CollectionCreator('MockCollection',MockChild);
            collectionCreator.addProperty('StringProp', 'string');
            collectionCreator.addChild(MockChild, 'SomeChild');
            MockCollection = collectionCreator.finaliseModel();

            expect(wrapFunction(MockCollection, 'reduce', 'MockCollection.Remove', popState, 'SomeChild')).toThrowError(/child/);
        });
        it('Should throw an error if the key is the collection key.', function() {
            expect(wrapFunction(MockCollection, 'reduce', 'MockCollection.Remove', popState, 'id')).toThrowError(/collection key/);
        });
        it('Should throw an error if the key names an action.', function() {
            var collectionCreator = new CollectionCreator('MockCollection',MockChild);
            collectionCreator.addProperty('StringProp', 'string');
            collectionCreator.addAction('NullAction', (state) => state );
            MockCollection = collectionCreator.finaliseModel();

            expect(wrapFunction(MockCollection, 'reduce', 'MockCollection.Remove', popState, 'NullAction')).toThrowError(/action/);
        });
        it('Should throw an error if the key names a request.', function() {
            var collectionCreator = new CollectionCreator('MockCollection',MockChild);
            collectionCreator.addProperty('StringProp', 'string');
            collectionCreator.addRequest('NullRequest', (state) => null );
            MockCollection = collectionCreator.finaliseModel();

            expect(wrapFunction(MockCollection, 'reduce', 'MockCollection.Remove', popState, 'NullRequest')).toThrowError(/request/);
        });
    });
});
