/*eslint-env jasmine */

var ModelReducer = require('./Util.js').ModelReducer;
var ModelCreator = ModelReducer.ModelCreator;
var CollectionCreator = ModelReducer.CollectionCreator;

var wrapFunction = require('./Util.js').wrapFunction;

describe('Collection: The collection returned from the creator. Used to process collection state.', function() {
    var Child;
    var Collection;
    var Parent;
    var emptyState;
    var popState;
    var emptyParentState;
    var popParentState;

    beforeAll( function() {
        var modelCreator = new ModelCreator('Child');
        modelCreator.addProperty('NumberProp','number');
        Child = modelCreator.finaliseModel();

        var collectionCreator = new CollectionCreator('Collection',Child);
        collectionCreator.addProperty('StringProp', 'string');
        Collection = collectionCreator.finaliseModel();

        var parentCreator = new ModelCreator('Parent');
        parentCreator.addChild(Collection);
        Parent = parentCreator.finaliseModel();
    });
    beforeEach( function() {
        emptyState = Collection.createEmpty();
        popState = Collection.createEmpty();
        Object.assign(popState, { 0: Child.createEmpty() });
        Object.assign(popState, { 2: Child.createEmpty() });
        Object.assign(popState, { 'some_key': Child.createEmpty() });

        popState[0].NumberProp = 0;
        popState[2].NumberProp = 2;
        popState['some_key'].NumberProp = 3;

        emptyParentState = Parent.createEmpty();
        popParentState = Parent.createEmpty();
        Object.assign(popParentState.Collection, popState);
    });
    describe('keys: Returns a list of the keys in the collection. Method available on "this" in actions and requests.', function() {
        it('Should return an empty list when the collection is empty, ignoring properties.', function() {
            expect( Collection.keys(emptyState) ).toEqual( [] );
        });
        it('Should return a list with all the keys in the collection.', function() {
            let keys = Collection.keys(popState);
            expect(keys).toEqual( ['0', '2', 'some_key'] );
            expect(keys).toContain( '0' );
            expect(keys).toContain( '2' ); 
            expect(keys).toContain( 'some_key' );
            expect(keys).toHaveSize(3);
        });
    });
    describe('Keys (request): A request that returns a list of the keys in the collection.', function() {
        it('Should return an empty list when the collection is empty, ignoring properties.', function() {
            expect( Collection.request('Collection.Keys', emptyState) ).toEqual( [] );
            expect( Parent.request('Parent.Collection.Keys', emptyParentState) ).toEqual( [] );
        });
        it('Should return a list with all the keys in the collection.', function() {
            let keys =  Collection.request('Collection.Keys',popState);
            expect(keys).toContain( '0' );
            expect(keys).toContain( '2' ); 
            expect(keys).toContain( 'some_key' );
            expect(keys).toHaveSize(3);

            keys = Parent.request('Parent.Collection.Keys',popParentState);
            expect(keys).toContain( '0' );
            expect(keys).toContain( '2' ); 
            expect(keys).toContain( 'some_key' );
            expect(keys).toHaveSize(3);
        });
    });
    describe('largestKey: Returns the largest numberic key in the collection. Method available on "this" in actions and requests.', function() {
        it('Should return null when the collection is empty, ignoring properties.', function() {
            expect( Collection.largestKey(emptyState) ).toBeNull();

            Object.assign(emptyState, { 'some_key': Child.createEmpty() });
            emptyState['some_key'].NumberProp = 3;
            expect( Collection.largestKey(emptyState) ).toBeNull();
        });
        it('Should return the largest numeric key in the collection.', function() {
            expect( Collection.largestKey(popState) ).toEqual( 2 );
            Object.assign(popState, { 4: Child.createEmpty() });
            expect( Collection.largestKey(popState) ).toEqual( 4 );
            Object.assign(popState, { 'cats': Child.createEmpty() });
            expect( Collection.largestKey(popState) ).toEqual( 4 );
        });
    });
    describe('smallestKey: Returns the smallest numberic key in the collection. Method available on "this" in actions and requests.', function() {
        it('Should return null when the collection is empty, ignoring properties.', function() {
            expect( Collection.smallestKey(emptyState) ).toBeNull();

            Object.assign(emptyState, { 'some_key': Child.createEmpty() });
            emptyState['some_key'].NumberProp = 3;
            expect( Collection.smallestKey(emptyState) ).toBeNull();
        });
        it('Should return the largest numeric key in the collection.', function() {
            expect( Collection.smallestKey(popState) ).toEqual( 0 );
            delete popState[0];
            expect( Collection.smallestKey(popState) ).toEqual( 2 );
        });
    });
    describe('length: Returns the number of items in the collection. Method available on "this" in actions and requests.', function() {
        it('Should return 0 when the collection is empty, ignoring properties.', function() {
            expect( Collection.length(emptyState) ).toEqual( 0 );
        });
        it('Should return the number of elements in the collection.', function() {
            expect( Collection.length(popState) ).toEqual( 3 );
        });
    });
    describe('Length (request): A request that returns the number of items in the collection.', function() {
        it('Should return 0 when the collection is empty, ignoring properties.', function() {
            expect( Collection.request('Collection.Length',emptyState) ).toEqual( 0 );
            expect( Parent.request('Parent.Collection.Length',emptyParentState) ).toEqual( 0 );
        });
        it('Should return the number of elements in the collection.', function() {
            expect( Collection.request('Collection.Length',popState) ).toEqual( 3 );
            expect( Parent.request('Parent.Collection.Length',popParentState) ).toEqual( 3 );
        });
    });
    describe('headState: Returns the state of the first item in the collecton. Method availavle on "this" in actions and requests.', function() {
        it('Should return null list when the collection is empty.', function() {
            expect( Collection.headState(emptyState) ).toBeNull();
        });
        it('Should return the state of the first item in the collection.', function() {
            expect( Collection.headState(popState) ).toEqual( { NumberProp: 0 });
        });
    });
    describe('HeadState (request): A request that returns the state of the first item in the collection.', function() {
        it('Should return null list when the collection is empty.', function() {
            expect( Collection.request('Collection.HeadState',emptyState) ).toBeNull();
            expect( Parent.request('Parent.Collection.HeadState',emptyParentState) ).toBeNull();
        });
        it('Should return the state of the first item in the collection.', function() {
            expect( Collection.request('Collection.HeadState',popState) ).toEqual( { NumberProp: 0 });
            expect( Parent.request('Parent.Collection.HeadState',popParentState) ).toEqual( { NumberProp: 0 });
        });
    });
    describe('tailState: Returns the state of the last item in the collecton. Method availavle on "this" in actions and requests.', function() {
        it('Should return null list when the collection is empty.', function() {
            expect( Collection.tailState(emptyState) ).toBeNull();
        });
        it('Should return the state of the last item in the collection.', function() {
            expect( Collection.tailState(popState) ).toEqual( { NumberProp: 3 });
        });
    });
    describe('TailState (request): A request that returns the state of the last item in the collection.', function() {
        it('Should return null list when the collection is empty.', function() {
            expect( Collection.request('Collection.TailState',emptyState) ).toBeNull();
            expect( Parent.request('Parent.Collection.TailState',emptyParentState) ).toBeNull();
        });
        it('Should return the state of the last item in the collection.', function() {
            expect( Collection.request('Collection.TailState',popState) ).toEqual( { NumberProp: 3 });
            expect( Parent.request('Parent.Collection.TailState',popParentState) ).toEqual( { NumberProp: 3 });
        });
    });
    describe('PushEmpty (action): Adds an empty instance of the child to the end of the collection.'+
        'This considers the keys that are numbers.', 
        function() {
            it('Should add an empty item with id 0, if the collection is empty.', function() {
                let newState = Collection.reduce('Collection.PushEmpty', emptyState);
                expect( Object.keys(newState) ).toContain( '0' );

                let newEmpty = Child.createEmpty();
                newEmpty[Child.collectionKey] = 0;
                expect( newState[0] ).toEqual(newEmpty);
            });
            it('Should add an empty item with id last+1 to the collection.', function() {
                let lastKey = Collection.largestKey(popState);
                let newState = Collection.reduce('Collection.PushEmpty', popState);
                expect(Collection.largestKey(newState) ).toEqual( lastKey +1 );

                let expectedKey = (lastKey+1).toString();
                expect( Object.keys(newState) ).toContain( expectedKey );
                let newEmpty = Child.createEmpty();
                newEmpty[Child.collectionKey] = (lastKey+1);
                expect( newState[lastKey+1] ).toEqual(newEmpty);
            });
        });
    describe('AddEmpty (action): Adds an empty instance of the child to the end of the collection, '+
        'under the given key.', function() {
            it('Should add an empty item with the specified numeric id.', function() {
                expect( Object.keys(popState) ).not.toContain( '12' );
                let newState = Collection.reduce('Collection.AddEmpty', popState, 12);
                expect( Object.keys(newState) ).toContain( '12' );

                let newEmpty = Child.createEmpty();
                newEmpty[Child.collectionKey] = 12;
                expect( newState[12] ).toEqual(newEmpty);
            });
            it('Should add an empty item with the specified non-numeric id.', function() {
                expect( Object.keys(popState) ).not.toContain( 'cats' );
                let newState = Collection.reduce('Collection.AddEmpty', popState, 'cats');
                expect( Object.keys(newState) ).toContain( 'cats' );

                let newEmpty = Child.createEmpty();
                newEmpty[Child.collectionKey] = 'cats';
                expect( newState.cats ).toEqual(newEmpty);
            });
            it('Should throw an error if the key names a property.', function() {
                expect(wrapFunction(Collection, 'reduce', 'Collection.AddEmpty', popState, 'StringProp')).toThrowError(/property/);
            });
            it('Should throw an error if the key names a child.', function() {
                var collectionCreator = new CollectionCreator('Collection',Child);
                collectionCreator.addProperty('StringProp', 'string');
                collectionCreator.addChild(Child, 'SomeChild');
                Collection = collectionCreator.finaliseModel();

                expect(wrapFunction(Collection, 'reduce', 'Collection.AddEmpty', popState, 'SomeChild')).toThrowError(/child/);
            });
            it('Should throw an error if the key is already used.', function() {
                expect(wrapFunction(Collection, 'reduce', 'Collection.AddEmpty', popState, 2)).toThrowError(/existing/);
            });
            it('Should throw an error if the key is the collection key.', function() {
                expect(wrapFunction(Collection, 'reduce', 'Collection.AddEmpty', popState, 'id')).toThrowError(/collection key/);
            });
            it('Should throw an error if the key names an action.', function() {
                var collectionCreator = new CollectionCreator('Collection',Child);
                collectionCreator.addProperty('StringProp', 'string');
                collectionCreator.addAction('NullAction', (state) => state );
                Collection = collectionCreator.finaliseModel();

                expect(wrapFunction(Collection, 'reduce', 'Collection.AddEmpty', popState, 'NullAction')).toThrowError(/action/);
            });
            it('Should throw an error if the key names a request.', function() {
                var collectionCreator = new CollectionCreator('Collection',Child);
                collectionCreator.addProperty('StringProp', 'string');
                collectionCreator.addRequest('NullRequest', (state) => null );
                Collection = collectionCreator.finaliseModel();

                expect(wrapFunction(Collection, 'reduce', 'Collection.AddEmpty', popState, 'NullRequest')).toThrowError(/request/);
            });
        });
    describe('RemoveHead (action): Removes the first item from the collection.' , function() {
        it('Should remove the smallest numerically numbered item.', function() {
            let newState = Collection.reduce('Collection.RemoveHead', popState);

            expect( Collection.keys(popState) ).toEqual( ['0', '2', 'some_key']);
            expect( Collection.keys(newState) ).toEqual( ['2', 'some_key']);
        });
        it('Should do nothing if there no numerically numbered items.', function() {
            let newState = Collection.reduce('Collection.RemoveHead', popState);
            newState = Collection.reduce('Collection.RemoveHead', newState);
            expect( Collection.keys(newState) ).toEqual( ['some_key']);

            expect(wrapFunction(Collection, 'reduce', 'Collection.RemoveHead', popState)).not.toThrow();
            let finalState = Collection.reduce('Collection.RemoveHead', newState);
            expect( finalState ).toBe( newState );
        });
    });
    describe('RemoveTail (action): Removes the last item from the collection.' , function() {
        it('Should remove the largest numerically numbered item.', function() {
            let newState = Collection.reduce('Collection.RemoveTail', popState);

            expect( Collection.keys(popState) ).toEqual( ['0', '2', 'some_key']);
            expect( Collection.keys(newState) ).toEqual( ['0', 'some_key']);
        });
        it('Should do nothing if there no numerically numbered items.', function() {
            let newState = Collection.reduce('Collection.RemoveTail', popState);
            newState = Collection.reduce('Collection.RemoveTail', newState);
            expect( Collection.keys(newState) ).toEqual( ['some_key']);

            expect(wrapFunction(Collection, 'reduce', 'Collection.RemoveTail', newState)).not.toThrow();
            let finalState = Collection.reduce('Collection.RemoveTail', newState);
            expect( finalState ).toBe( newState );
        });
    });
    describe('Remove (action): Removes the specified item from the collection.' , function() {
        it('Should remove the specified item.', function() {
            let newState1 = Collection.reduce('Collection.Remove', popState, 'some_key');
            let newState2 = Collection.reduce('Collection.Remove', popState, '2');

            expect( Collection.keys(popState) ).toEqual( ['0', '2', 'some_key']);
            expect( Collection.keys(newState1) ).toEqual( ['0', '2']);
            expect( Collection.keys(newState2) ).toEqual( ['0', 'some_key']);
        });
        it('Should do nothing if the specified item is not included.', function() {
            expect(wrapFunction(Collection, 'reduce', 'Collection.Remove', popState, 'non_existing_item')).not.toThrow();
            let newState = Collection.reduce('Collection.Remove', popState, 'non_existing_item');
            expect( newState ).toBe( popState );
        });
        it('Should throw an error if the key names a property.', function() {
            expect(wrapFunction(Collection, 'reduce', 'Collection.Remove', popState, 'StringProp')).toThrowError(/property/);
        });
        it('Should throw an error if the key names a child.', function() {
            var collectionCreator = new CollectionCreator('Collection',Child);
            collectionCreator.addProperty('StringProp', 'string');
            collectionCreator.addChild(Child, 'SomeChild');
            Collection = collectionCreator.finaliseModel();

            expect(wrapFunction(Collection, 'reduce', 'Collection.Remove', popState, 'SomeChild')).toThrowError(/child/);
        });
        it('Should throw an error if the key is the collection key.', function() {
            expect(wrapFunction(Collection, 'reduce', 'Collection.Remove', popState, 'id')).toThrowError(/collection key/);
        });
        it('Should throw an error if the key names an action.', function() {
            var collectionCreator = new CollectionCreator('Collection',Child);
            collectionCreator.addProperty('StringProp', 'string');
            collectionCreator.addAction('NullAction', (state) => state );
            Collection = collectionCreator.finaliseModel();

            expect(wrapFunction(Collection, 'reduce', 'Collection.Remove', popState, 'NullAction')).toThrowError(/action/);
        });
        it('Should throw an error if the key names a request.', function() {
            var collectionCreator = new CollectionCreator('Collection',Child);
            collectionCreator.addProperty('StringProp', 'string');
            collectionCreator.addRequest('NullRequest', (state) => null );
            Collection = collectionCreator.finaliseModel();

            expect(wrapFunction(Collection, 'reduce', 'Collection.Remove', popState, 'NullRequest')).toThrowError(/request/);
        });
    });
});
