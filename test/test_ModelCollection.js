
/*eslint-env jasmine */

var ModelReducer = require('./Util.js').ModelReducer;
var ModelCreator = ModelReducer.ModelCreator;

var wrapFunction = require('./Util.js').wrapFunction;

describe('ModelCreator: A class used for building a model.', function() {
    var modelCreator;

    beforeEach(function() {
        modelCreator = new ModelCreator('Model');
    });

    describe('addChildAsCollection: Adds a child model to this model as a collection.', function() {
        var testModel;
        var secondTestModel;

        beforeAll(function() {
            let testModelCreator = new ModelCreator('TestModel');
            testModel = testModelCreator.finaliseModel();

            let secondTestModelCreator = new ModelCreator('TestModel');
            secondTestModel = secondTestModelCreator.finaliseModel();
        });

        it('Should add a child with the collection name to the model.', function() {

            modelCreator.addChildAsCollection(testModel);
            var model = modelCreator.finaliseModel();

            expect(model.children['TestModel[]']).not.toBeUndefined();
            expect(model.children['TestModel[]']).toBe(testModel);
        });
        it('Should not add a child with the model name to the model.', function() {

            modelCreator.addChildAsCollection(testModel);
            var model = modelCreator.finaliseModel();

            expect(model.children['TestModel']).toBeUndefined();
        });
        it('Should throw if a child is added that already exists.', function() {
            // CBB: It would be nice for this not to be true
            modelCreator.addChild( secondTestModel, 'TestModel[]');
            expect( wrapFunction(modelCreator,'addChildAsCollection', testModel )).toThrow();
        });
        it('Should throw if a child is added that already exists as a collection.', function() {
            modelCreator.addChildAsCollection( secondTestModel);
            expect( wrapFunction(modelCreator,'addChildAsCollection', testModel )).toThrow();
        });
        it('Should throw if the child is not an object.', function() {
            expect( wrapFunction(modelCreator,'addChildAsCollection') ).toThrow();
            expect( wrapFunction(modelCreator,'addChildAsCollection',42) ).toThrow();
            expect( wrapFunction(modelCreator,'addChildAsCollection',true) ).toThrow();
        });
    });

    describe('addAddActionFor: Adds an "Add[ChildName]" action for a collection.', function(){
        var collectionCreator = new ModelCreator('Child');
        var child = collectionCreator.finaliseModel();

        beforeEach(function() {
            modelCreator.addChildAsCollection( child );
        });

        it('Should this be added by default when a child is added as a collection?');

        it('Should add an "Add" action with the correct default name: Add[ChildName].', function(){
            modelCreator.addAddActionFor( child );
            var model = modelCreator.finaliseModel();

            expect( model.actions['AddChild'] ).not.toBeUndefined();
            expect( typeof(model.actions['AddChild']) ).toEqual('function');
            expect(model.customActions).not.toContain('AddChild');
        });
        it('Should add an "Add" action with the given name.', function(){
            modelCreator.addAddActionFor( child, 'CreateChild' );
            var model = modelCreator.finaliseModel();

            expect( model.actions['CreateChild'] ).not.toBeUndefined();
            expect( typeof(model.actions['CreateChild']) ).toEqual('function');
            expect(model.customActions).not.toContain('CreateChild');
        });
        it('Should throw if the child does not form a collection.', function(){
            var newChild = (new ModelCreator('NewChild')).finaliseModel();
            modelCreator.addChild( newChild );

            expect( wrapFunction( modelCreator.addAddActionFor, newChild) ).toThrow();
        });
        it('Should throw if the child is not on the model.', function(){
            var newChild = (new ModelCreator('NewChild')).finaliseModel();

            expect( wrapFunction( modelCreator.addAddActionFor, newChild) ).toThrow();
        });
        it('Should throw if the child is not an object.', function() {
            expect( wrapFunction(modelCreator,'addAddActionFor') ).toThrow();
            expect( wrapFunction(modelCreator,'addAddActionFor',42) ).toThrow();
            expect( wrapFunction(modelCreator,'addAddActionFor',true) ).toThrow();
        });
        it('Should throw if the request name is not a string.', function() {
            expect( wrapFunction(modelCreator,'addAddActionFor', child, 42) ).toThrow();
            expect( wrapFunction(modelCreator,'addAddActionFor', child, true) ).toThrow();
        });
    });

    xdescribe('addAvailableKeyRequestFor: '+
        'Should add an "Available[ChildName][ChildCollectionKey]" request for a collection.', function(){
            var collectionCreator = new ModelCreator('KeyChild');
            collectionCreator.setCollectionKey('Key');
            var keyChild = collectionCreator.finaliseModel();

            collectionCreator = new ModelCreator('IdChild');
            collectionCreator.setCollectionKey('Id');
            var idChild = collectionCreator.finaliseModel();

            beforeEach(function() {
                modelCreator.addChildAsCollection( keyChild );
                modelCreator.addChildAsCollection( idChild );
            });

            it('Should add an "Available" request with the correct default name: '+
                'Available[ChildName][ChildCollectionKey].', function(){
                    modelCreator.addAvailableKeyRequestFor( idChild );
                    modelCreator.addAvailableKeyRequestFor( keyChild );
                    var model = modelCreator.finaliseModel();

                    expect( model.requests['AvailableKeyChildKey'] ).not.toBeUndefined();
                    expect( typeof(model.requests['AvailableKeyChildKey']) ).toEqual('function');
                    expect(model.customRequests).not.toContain('AvailableKeyChildKey');

                    expect( model.requests['AvailableIdChildId'] ).not.toBeUndefined();
                    expect( typeof(model.requests['AvailableIdChildId']) ).toEqual('function');
                    expect(model.customRequests).not.toContain('AvailableIdChildKey');
                });
            it('Should add an "Available" request with the given name.', function(){
                modelCreator.addAvailableKeyRequestFor( idChild, 'AvailableChildKey' );
                var model = modelCreator.finaliseModel();

                expect( model.requests['AvailableChildKey'] ).not.toBeUndefined();
                expect( typeof(model.requests['AvailableChildKey']) ).toEqual('function');
                expect(model.customRequests).not.toContain('AvailableChildKey');
            });
            it('Should throw if the child does not form a collection.', function(){
                var newChild = (new ModelCreator('NewChild')).finaliseModel();

                expect( wrapFunction( modelCreator.addAvailableKeyRequestFor, newChild) ).toThrow();
            });
            it('Should throw if the child is not an object.', function() {
                expect( wrapFunction(modelCreator,'addAvailableKeyRequestFor') ).toThrow();
                expect( wrapFunction(modelCreator,'addAvailableKeyRequestFor',42) ).toThrow();
                expect( wrapFunction(modelCreator,'addAvailableKeyRequestFor',true) ).toThrow();
            });
            it('Should throw if the request name is not a string.', function() {
                expect( wrapFunction(modelCreator,'addAvailableKeyRequestFor', idChild, 42) ).toThrow();
                expect( wrapFunction(modelCreator,'addAvailableKeyRequestFor', idChild, true) ).toThrow();
            });
        });
});
