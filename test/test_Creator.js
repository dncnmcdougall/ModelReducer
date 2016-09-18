/*eslint-env jasmine */

var ModelReducer = require('../index.js');

var ModelCreator = ModelReducer.ModelCreator;

var wrapFunction = function( func, ...args) {
    return function() {
        func(...args);
    };
};

describe('ModelCreator: A class used for building a model.', function() {

    var modelCreator;

    beforeEach(function() {
        modelCreator = new ModelCreator('Model');
    });


    it('Should create a model with the given name.',function() {
        var model = modelCreator.finaliseModel();

        expect( model.name ).toEqual('Model');
        expect(typeof(model.reduce) ).toEqual('function');
        expect(typeof(model.request) ).toEqual('function');
    });

    it('Should throw if used after the model was finalised.', function () {
        modelCreator.finaliseModel();

        expect(wrapFunction(modelCreator.addProperty,'property')).toThrow();
    });

    describe('copyFrom: Copies the given model\'s attributes into this model', function(){
        pending();
    });

    describe('setFormsACollection: Declares that this model will form a collection when it is used as a child.', function() {
        it('Should declare that this model forms a collection.', function() {
            modelCreator.setFormsACollection(true);
            var model = modelCreator.finaliseModel();

            expect( model.formsACollection ).toEqual( true );
        });
        it('Should declare that this model does not form a collection.', function() {
            modelCreator.setFormsACollection(true);
            modelCreator.setFormsACollection(false);
            var model = modelCreator.finaliseModel();

            expect( model.formsACollection ).toEqual( false );
        });
        it('Should throw if not given a boolean', function() {
            expect( wrapFunction(modelCreator.setFormsACollection) ).toThrow();
            expect( wrapFunction(modelCreator.setFormsACollection,42) ).toThrow();
            expect( wrapFunction(modelCreator.setFormsACollection,'Hello world') ).toThrow();
        });
    });
    describe('setCollectionName: Sets the name of the collection that this child becomes in the parent.', function() {
        it('Should set the property name of the model, if it is a collection', function() {
            modelCreator.setFormsACollection(true);
            modelCreator.setCollectionName('Collection');
            var model = modelCreator.finaliseModel();

            expect( model.propertyName ).toEqual( 'Collection' );
        });
        it('Should not set the property name of the model, if it is not a collection', function() {
            modelCreator.setFormsACollection(false);
            modelCreator.setCollectionName('Collection');
            var model = modelCreator.finaliseModel();

            expect( model.propertyName ).not.toEqual( 'Collection' );
        });
        it('Should throw if not given a string', function() {
            expect( wrapFunction(modelCreator.setCollectionName) ).toThrow();
            expect( wrapFunction(modelCreator.setCollectionName,42) ).toThrow();
            expect( wrapFunction(modelCreator.setCollectionName,true) ).toThrow();
        });
    });
    describe('setCollectionKeyField: Sets the name of the field which is used to store the numberic '+
        'identifier of an instance of this model in a collection.', function() {
            it('Should set the name of the key, if the model is a collection', function() {
                modelCreator.setFormsACollection(true);
                modelCreator.setCollectionKey('key');
                var model = modelCreator.finaliseModel();

                expect( model.collectionKey ).toEqual( 'key' );
            });
            it('Should not set the property name of the model, if it is not a collection', function() {
                modelCreator.setFormsACollection(false);
                modelCreator.setCollectionKey('key');
                var model = modelCreator.finaliseModel();

                expect( model.collectionKey ).toBeUndefined();
            });
            it('Should throw if not given a string', function() {
                expect( wrapFunction(modelCreator.setCollectionKey) ).toThrow();
                expect( wrapFunction(modelCreator.setCollectionKey,42) ).toThrow();
                expect( wrapFunction(modelCreator.setCollectionKey,true) ).toThrow();
            });
        });
    describe('addProperty: Adds a property to the model.', function() {
        it('Should add a property with the specified type to the model.', function() {

            modelCreator.addProperty('property', 'string');
            var model = modelCreator.finaliseModel();

            expect(model.properties['property']).not.toBeUndefined();
            expect(model.properties['property']).toEqual('string');
        });
        it('Should add a property with the no type to the model, if no type is given.', function() {

            modelCreator.addProperty('property');
            var model = modelCreator.finaliseModel();

            expect(model.properties['property']).not.toBeUndefined();
            expect(model.properties['property']).toBeNull();
        });
        it('Should override a property if it exists.', function() {
            modelCreator.addProperty('property', 'string');
            modelCreator.addProperty('property', 'boolean');
            var model = modelCreator.finaliseModel();

            expect(model.properties['property']).not.toBeUndefined();
            expect(model.properties['property']).toEqual('boolean');
        });
        it('Should throw if the property name is not a string.', function() {
            expect( wrapFunction(modelCreator.addProperty) ).toThrow();
            expect( wrapFunction(modelCreator.addProperty,42) ).toThrow();
            expect( wrapFunction(modelCreator.addProperty,true) ).toThrow();
        });
        it('Should throw if the property type is not a string.', function() {
            expect( wrapFunction(modelCreator.addProperty,'property',42) ).toThrow();
            expect( wrapFunction(modelCreator.addProperty,'property',true) ).toThrow();
        });
    });
    describe('removeProperty: Removes a property from the model.', function() {
        beforeEach(function() {
            modelCreator.addProperty('property');
        });
        it('Should remove the given property from the model.', function() {
            modelCreator.removeProperty('property');
            var model = modelCreator.finaliseModel();

            expect(model.properties['property']).toBeUndefined();
        });
        it('Should throw if the property is not defined.', function() {
            expect( wrapFunction(modelCreator.removeProperty, 'NotAProperty') ).toThrow();
        });
        it('Should throw if the property name is not a string.', function() {
            expect( wrapFunction(modelCreator.removeProperty) ).toThrow();
            expect( wrapFunction(modelCreator.removeProperty,42) ).toThrow();
            expect( wrapFunction(modelCreator.removeProperty,true) ).toThrow();
        });
    });
    describe('addAction: Adds an action to the model.', function() {
        var testFunc = function(state) {
            return state;
        };
        it('Should add an action with the specified function to the model.', function() {

            modelCreator.addAction('action', testFunc);
            var model = modelCreator.finaliseModel();

            expect(model.actions['action']).not.toBeUndefined();
            expect(model.actions['action']).toBe(testFunc);
        });
        it('Should override an action if it already exists.', function() {
            modelCreator.addAction('action', (state) => {return state;});
            modelCreator.addAction('action', testFunc );
            var model = modelCreator.finaliseModel();

            expect(model.actions['action']).not.toBeUndefined();
            expect(model.actions['action']).toBe(testFunc);
        });
        it('Should throw if the action name is not a string.', function() {
            expect( wrapFunction(modelCreator.addAction) ).toThrow();
            expect( wrapFunction(modelCreator.addAction,42) ).toThrow();
            expect( wrapFunction(modelCreator.addAction,true) ).toThrow();
        });
        it('Should throw if the action is not a function.', function() {
            expect( wrapFunction(modelCreator.addAction,'action') ).toThrow();
            expect( wrapFunction(modelCreator.addAction,'action',42) ).toThrow();
            expect( wrapFunction(modelCreator.addAction,'action',true) ).toThrow();
        });
    });
    describe('removeAction: Removes an action from the model.', function() {
        var testFunc = function(state) {
            return state;
        };
        beforeEach(function() {
            modelCreator.addAction('action',testFunc);
        });
        it('Should remove the given action from the model.', function() {
            modelCreator.removeAction('action');
            var model = modelCreator.finaliseModel();

            expect(model.actions['action']).toBeUndefined();
        });
        it('Should throw if the action is not defined.', function() {
            expect( wrapFunction(modelCreator.removeAction, 'NotAnAction') ).toThrow();
        });
        it('Should throw if the action name is not a string.', function() {
            expect( wrapFunction(modelCreator.removeAction) ).toThrow();
            expect( wrapFunction(modelCreator.removeAction,42) ).toThrow();
            expect( wrapFunction(modelCreator.removeAction,true) ).toThrow();
        });
    });
    describe('addRequest: Adds a request to the model.', function() {
        var testFunc = function(state) {
            return 42;
        };
        it('Should add a request with the specified function to the model.', function() {

            modelCreator.addRequest('request', testFunc);
            var model = modelCreator.finaliseModel();

            expect(model.requests['request']).not.toBeUndefined();
            expect(model.requests['request']).toBe(testFunc);
        });
        it('Should override a request if it already exists.', function() {
            modelCreator.addRequest('request', (state) => {return 42;});
            modelCreator.addRequest('request', testFunc );
            var model = modelCreator.finaliseModel();

            expect(model.requests['request']).not.toBeUndefined();
            expect(model.requests['request']).toBe(testFunc);
        });
        it('Should throw if the request name is not a string.', function() {
            expect( wrapFunction(modelCreator.addRequest) ).toThrow();
            expect( wrapFunction(modelCreator.addRequest,42) ).toThrow();
            expect( wrapFunction(modelCreator.addRequest,true) ).toThrow();
        });
        it('Should throw if the request is not a function.', function() {
            expect( wrapFunction(modelCreator.addRequest,'request') ).toThrow();
            expect( wrapFunction(modelCreator.addRequest,'request',42) ).toThrow();
            expect( wrapFunction(modelCreator.addRequest,'request',true) ).toThrow();
        });
    });
    describe('removeRequest: Removes a request from the model.', function() {
        var testFunc = function(state) {
            return 42;
        };
        beforeEach(function() {
            modelCreator.addRequest('request',testFunc);
        });
        it('Should remove the given request from the model.', function() {
            modelCreator.removeRequest('request');
            var model = modelCreator.finaliseModel();

            expect(model.requests['request']).toBeUndefined();
        });
        it('Should throw if the request is not defined.', function() {
            expect( wrapFunction(modelCreator.removeRequest, 'NotARequest') ).toThrow();
        });
        it('Should throw if the request name is not a string.', function() {
            expect( wrapFunction(modelCreator.removeRequest) ).toThrow();
            expect( wrapFunction(modelCreator.removeRequest,42) ).toThrow();
            expect( wrapFunction(modelCreator.removeRequest,true) ).toThrow();
        });
    });
    describe('addChildModel: Adds a child model to this model.', function() {
        var testModel = (new ModelCreator('TestModel')).finaliseModel();

        it('Should add a child with the specified function to the model.', function() {

            modelCreator.addChildModel(testModel);
            var model = modelCreator.finaliseModel();

            expect(model.children['TestModel']).not.toBeUndefined();
            expect(model.children['TestModel']).toBe(testModel);
        });
        it('Should throw if a child is added that already exists.', function() {
            var newModel = (new ModelCreator('TestModel')).finaliseModel();
            modelCreator.addChildModel( newModel);
            expect( wrapFunction(modelCreator.addChildModel, testModel )).toThrow();
        });
        it('Should throw if the child is not an object.', function() {
            expect( wrapFunction(modelCreator.addChildModel) ).toThrow();
            expect( wrapFunction(modelCreator.addChildModel,42) ).toThrow();
            expect( wrapFunction(modelCreator.addChildModel,true) ).toThrow();
        });
    });
    describe('removeChild: Removes a child model from this model.', function() {
        var testModel = (new ModelCreator('TestModel')).finaliseModel();

        beforeEach(function() {
            modelCreator.addChildModel(testModel);
        });
        it('Should remove the given child from the model.', function() {
            modelCreator.removeChildModel(testModel);
            var model = modelCreator.finaliseModel();

            expect(model.children['TestModel']).toBeUndefined();
        });
        it('Should throw if the child is not defined.', function() {
            var newModel = (new ModelCreator('NewModel')).finaliseModel();
            expect( wrapFunction(modelCreator.removeChildModel,newModel) ).toThrow();
        });
        it('Should throw if the child is not an object.', function() {
            expect( wrapFunction(modelCreator.removeChildModel) ).toThrow();
            expect( wrapFunction(modelCreator.removeChildModel,42) ).toThrow();
            expect( wrapFunction(modelCreator.removeChildModel,true) ).toThrow();
        });
    });
    describe('finaliseModel: Finalises and returns the model.', function() {
        it('Should return the defined model.', function() {
            modelCreator.addProperty('prop1');
            modelCreator.addProperty('prop2');

            var model = modelCreator.finaliseModel();

            expect( typeof(model) ).toEqual('object');
            expect( model.properties.hasOwnProperty('prop1') ).toEqual(true);
            expect( model.properties.hasOwnProperty('prop2') ).toEqual(true);
            expect( model.properties.hasOwnProperty('prop3') ).toEqual(false);
        });
        it('Should throw is it is called on a creator which has been finalised already', function() {
            modelCreator.finaliseModel();
            expect( modelCreator.finaliseModel ).toThrow();
        });
        it('Should throw if the collection key will shadow a property.', function() {
            modelCreator.addProperty('key','integer');
            modelCreator.setCollectionKey('key');

            modelCreator.setFormsACollection(true);
            expect( modelCreator.finaliseModel ).toThrow();

            modelCreator.setFormsACollection(false);
            expect( modelCreator.finaliseModel ).not.toThrow();
        });
    });
    describe('addStateRequest: adds the "State" request.', function() {
        it('Should add the "State" request.', function() {
            modelCreator.addStateRequest();
            var model = modelCreator.finaliseModel();

            expect( model.requests['State'] ).not.toBeUndefined();
            expect( typeof(model.requests['State']) ).toEqual('function');
        });
    });
    describe('addAvailableKeyRequestFor: '+
        'Should add an "Available[ChildName][ChildCollectionKey]" request for a collection.', function(){
        var collectionCreator = new ModelCreator('KeyChild');
        collectionCreator.setFormsACollection(true);
        var keyChild = collectionCreator.finaliseModel();

        collectionCreator = new ModelCreator('IdChild');
        collectionCreator.setFormsACollection(true);
        collectionCreator.setCollectionKey('Id');
        var idChild = collectionCreator.finaliseModel();

        beforeEach(function() {
            modelCreator.addChildModel( keyChild );
            modelCreator.addChildModel( idChild );
        });

        it('Should add an "Available" request with the correct default name: '+
            'Available[ChildName][ChildCollectionKey].', function(){
            modelCreator.addAvailableKeyRequestFor( idChild );
            modelCreator.addAvailableKeyRequestFor( keyChild );
            var model = modelCreator.finaliseModel();

            expect( model.requests['AvailableKeyChildKey'] ).not.toBeUndefined();
            expect( typeof(model.requests['AvailableKeyChildKey']) ).toEqual('function');
            expect( model.requests['AvailableIdChildId'] ).not.toBeUndefined();
            expect( typeof(model.requests['AvailableIdChildId']) ).toEqual('function');
        });
        it('Should add an "Available" request with the given name.', function(){
            modelCreator.addAvailableKeyRequestFor( idChild, 'AvailableChildKey' );
            var model = modelCreator.finaliseModel();

            expect( model.requests['AvailableChildKey'] ).not.toBeUndefined();
            expect( typeof(model.requests['AvailableChildKey']) ).toEqual('function');
        });
        it('Should throw if the child does not form a collection.', function(){
            var newChild = (new ModelCreator('NewChild')).finaliseModel();

            expect( wrapFunction( modelCreator.addAvailableKeyRequestFor, newChild) ).toThrow();
        });
        it('Should throw if the child is not an object.', function() {
            expect( wrapFunction(modelCreator.addAvailableKeyRequestFor) ).toThrow();
            expect( wrapFunction(modelCreator.addAvailableKeyRequestFor,42) ).toThrow();
            expect( wrapFunction(modelCreator.addAvailableKeyRequestFor,true) ).toThrow();
        });
        it('Should throw if the request name is not a string.', function() {
            expect( wrapFunction(modelCreator.addAvailableKeyRequestFor, idChild, 42) ).toThrow();
            expect( wrapFunction(modelCreator.addAvailableKeyRequestFor, idChild, true) ).toThrow();
        });
    });
    describe('addAddActionFor: Adds an "Add[ChildName]" action for a collection.', function(){
        var collectionCreator = new ModelCreator('Child');
        collectionCreator.setFormsACollection(true);
        var child = collectionCreator.finaliseModel();

        beforeEach(function() {
            modelCreator.addChildModel( child );
        });

        it('Should add an "Add" action with the correct default name: Add[ChildName].', function(){
            modelCreator.addAddActionFor( child );
            var model = modelCreator.finaliseModel();

            expect( model.actions['AddChild'] ).not.toBeUndefined();
            expect( typeof(model.actions['AddChild']) ).toEqual('function');
        });
        it('Should add an "Add" action with the given name.', function(){
            modelCreator.addAddActionFor( child, 'CreateChild' );
            var model = modelCreator.finaliseModel();

            expect( model.actions['CreateChild'] ).not.toBeUndefined();
            expect( typeof(model.actions['CreateChild']) ).toEqual('function');
        });
        it('Should throw if the child does not form a collection.', function(){
            var newChild = (new ModelCreator('NewChild')).finaliseModel();

            expect( wrapFunction( modelCreator.addAddActionFor, newChild) ).toThrow();
        });
        it('Should throw if the child is not an object.', function() {
            expect( wrapFunction(modelCreator.addAddActionFor) ).toThrow();
            expect( wrapFunction(modelCreator.addAddActionFor,42) ).toThrow();
            expect( wrapFunction(modelCreator.addAddActionFor,true) ).toThrow();
        });
        it('Should throw if the request name is not a string.', function() {
            expect( wrapFunction(modelCreator.addAddActionFor, child, 42) ).toThrow();
            expect( wrapFunction(modelCreator.addAddActionFor, child, true) ).toThrow();
        });
    });
    describe('AddSetPropertyActionFor: Adds a Set[Property] action to the model', function() {
        beforeEach( function() {
            modelCreator.addProperty('Property');
        });
        it('Should add a "Set" action with the correct default name: Set[Property].', function(){
            modelCreator.addSetPropertyActionFor( 'Property' );
            var model = modelCreator.finaliseModel();

            expect( model.actions['SetProperty'] ).not.toBeUndefined();
            expect( typeof(model.actions['SetProperty']) ).toEqual('function');
        });
        it('Should add a "Set" action with the given name.', function(){
            modelCreator.addSetPropertyActionFor( 'Property', 'set_property' );
            var model = modelCreator.finaliseModel();

            expect( model.actions['set_property'] ).not.toBeUndefined();
            expect( typeof(model.actions['set_property']) ).toEqual('function');
        });
        it('Should throw if the property name is not a string.', function() {
            expect( wrapFunction(modelCreator.addSetPropertyActionFor) ).toThrow();
            expect( wrapFunction(modelCreator.addSetPropertyActionFor,42) ).toThrow();
            expect( wrapFunction(modelCreator.addSetPropertyActionFor,true) ).toThrow();
        });
        it('Should throw if the action name is not a string.', function() {
            expect( wrapFunction(modelCreator.addSetPropertyActionFor, 'Property', 42) ).toThrow();
            expect( wrapFunction(modelCreator.addSetPropertyActionFor, 'Property', true) ).toThrow();
        });
        
    });
});
