/*eslint-env jasmine */

var ModelReducer = require('./Util.js').ModelReducer;
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

    describe('copyFrom: Copies the given model\'s properties, children, actions and requests into this model', function(){
        var model;
        var child;

        var newModelCreator1;
        var newModelCreator2;

        var newModel1;
        var newModel2;

        beforeEach( function() {
            child =  ( new ModelCreator('Child') ).finaliseModel();

            modelCreator.addProperty('NumberProperty','number');
            modelCreator.addChild(child);
            modelCreator.addAction('Action', function(state) {
                var newState = Object.assign({},state);
                newState.NumberProperty++;
                return newState;
            });
            modelCreator.addRequest( 'Request', function(state) {
                return 42;
            });

            model = modelCreator.finaliseModel();

            newModelCreator1 = new ModelCreator('NewModel');
            newModelCreator2 = new ModelCreator('NewModel');
        });

        it('Should add the properties to the current model.', function() {
            newModelCreator2.copyFrom(model);

            newModel1 = newModelCreator1.finaliseModel();
            newModel2 = newModelCreator2.finaliseModel();

            expect(newModel1.properties['NumberProperty']).toBeUndefined();
            expect(newModel2.properties['NumberProperty']).not.toBeUndefined();
            expect(newModel2.properties['NumberProperty']).toBe('number');
        });

        it('Should override duplicate properties in the current model.', function() {
            newModelCreator1.addProperty('NumberProperty','string');
            newModelCreator2.addProperty('NumberProperty','string');

            newModelCreator2.copyFrom(model);

            newModel1 = newModelCreator1.finaliseModel();
            newModel2 = newModelCreator2.finaliseModel();

            expect(newModel1.properties['NumberProperty']).toBe('string');
            expect(newModel2.properties['NumberProperty']).toBe('number');
        });

        it('Should add the children to the current model.', function() {
            newModelCreator2.copyFrom(model);

            newModel1 = newModelCreator1.finaliseModel();
            newModel2 = newModelCreator2.finaliseModel();

            expect(newModel1.children['Child']).toBeUndefined();
            expect(newModel2.children['Child']).not.toBeUndefined();
        });

        it('Should add the actions to the current model.', function() {
            newModelCreator2.copyFrom(model);

            newModel1 = newModelCreator1.finaliseModel();
            newModel2 = newModelCreator2.finaliseModel();

            expect(newModel1.actions['Action']).toBeUndefined();
            expect(newModel2.actions['Action']).not.toBeUndefined();
        });

        it('Should override duplicate actions in the current model.', function() {
            newModelCreator1.addAction('Action',function(state) {
                var newState = Object.assign({},state); 
                newState.NumberProperty--; 
                return newState;
            });
            newModelCreator2.addAction('Action',function(state) { 
                var newState = Object.assign({},state); 
                newState.NumberProperty--; 
                return newState;
            });

            newModelCreator2.copyFrom(model);

            newModel1 = newModelCreator1.finaliseModel();
            newModel2 = newModelCreator2.finaliseModel();

            var state = {
                'NumberProperty': 1
            };

            var newState1 = newModel1.reduce('NewModel.Action', state);
            var newState2 = newModel2.reduce('NewModel.Action', state);

            expect(newState1.NumberProperty).toBe(0);
            expect(newState2.NumberProperty).toBe(2);
        });

        it('Should add the requests to the current model.', function() {
            newModelCreator2.copyFrom(model);

            newModel1 = newModelCreator1.finaliseModel();
            newModel2 = newModelCreator2.finaliseModel();

            expect(newModel1.requests['Request']).toBeUndefined();
            expect(newModel2.requests['Request']).not.toBeUndefined();
        });

        it('Should override duplicate requests in the current model.', function() {
            newModelCreator1.addRequest('Request',function(state) {
                return 17;
            });
            newModelCreator2.addRequest('Request',function(state) {
                return 17;
            });

            newModelCreator2.copyFrom(model);

            newModel1 = newModelCreator1.finaliseModel();
            newModel2 = newModelCreator2.finaliseModel();

            var state = {};

            var val1 = newModel1.request('NewModel.Request', state);
            var val2 = newModel2.request('NewModel.Request', state);

            expect(val1).toBe(17);
            expect(val2).toBe(42);
        });

        it('Should throw if the model is already finalised.', function() {
            newModel2 = newModelCreator2.finaliseModel();

            expect( wrapFunction(newModelCreator2.copyFrom, model) ).toThrow();
        });
    });
    describe('setCollectionKeyField: Sets the name of the field which is used to store the numeric '+
        'identifier of an instance of this model in a collection.', 
        function() {
            it('The collection key defaults to "id"', function() {
                var model = modelCreator.finaliseModel();

                expect( model.collectionKey ).toEqual( 'id' );
            });
            it('Should set the name of the key', function() {
                modelCreator.setCollectionKey('key');
                var model = modelCreator.finaliseModel();

                expect( model.collectionKey ).toEqual( 'key' );
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
            var newState = Object.assign({}, state);
            newState.NumberProp = state.NumberProp +1;
            return newState;
        };
        beforeEach( function() {
            modelCreator.addProperty('NumberProp','number');
        });
        it('Should add an action with the specified function to the model.', function() {
            modelCreator.addAction('action', testFunc);
            var model = modelCreator.finaliseModel();

            var state = model.createEmpty();
            expect(state.NumberProp).toBe( 0 );

            expect(model.actions['action']).not.toBeUndefined();
            expect(model.customActions).toContain( 'action' );
            var newState = model.reduce('Model.action',state);
            expect(newState.NumberProp).toBe( 1 );
        });
        it('Should override an action if it already exists.', function() {
            modelCreator.addAction('action', testFunc );
            modelCreator.addAction('action', (state) => {
                var newState = Object.assign({}, state);
                newState.NumberProp = state.NumberProp - 1;
                return newState;
            });
            var model = modelCreator.finaliseModel();

            var state = model.createEmpty();
            expect(state.NumberProp).toBe( 0 );

            expect(model.actions['action']).not.toBeUndefined();
            var newState = model.reduce('Model.action',state);
            expect(newState.NumberProp).toBe( -1 );
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
            modelCreator.addProperty('Property');
            modelCreator.addSetActionFor('Property');
        });
        it('Should remove the given user defined action from the model.', function() {
            modelCreator.removeAction('action');
            var model = modelCreator.finaliseModel();

            expect(model.actions['action']).toBeUndefined();
            expect(model.customActions).not.toContain( 'action' );
        });
        it('Should remove the given built in action from the model.', function() {
            modelCreator.removeAction('SetProperty');
            var model = modelCreator.finaliseModel();

            expect(model.actions['SetProperty']).toBeUndefined();
            expect(model.customActions).not.toContain( 'SetProperty' );
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

            var state = model.createEmpty();

            expect(model.requests['request']).not.toBeUndefined();
            expect(model.customRequests).toContain('request');
            expect( model.request('Model.request', state) ).toBe(42);
        });
        it('Should override a request if it already exists.', function() {
            modelCreator.addRequest('request', testFunc );
            modelCreator.addRequest('request', (state) => {return 49;});
            var model = modelCreator.finaliseModel();

            var state = model.createEmpty();

            expect(model.requests['request']).not.toBeUndefined();
            expect( model.request('Model.request', state) ).toBe(49);
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
            modelCreator.addStateRequest();
        });
        it('Should remove the given user defined request from the model.', function() {
            modelCreator.removeRequest('request');
            var model = modelCreator.finaliseModel();

            expect(model.requests['request']).toBeUndefined();
            expect(model.customRequests).not.toContain('request');
        });
        it('Should remove the given built in request from the model.', function() {
            modelCreator.removeRequest('State');
            var model = modelCreator.finaliseModel();

            expect(model.requests['State']).toBeUndefined();
            expect(model.customRequests).not.toContain('State');
        });
        it('Should throw if the specified request is not defined.', function() {
            expect( wrapFunction(modelCreator.removeRequest, 'NotARequest') ).toThrow();
        });
        it('Should throw if the given request name is not a string.', function() {
            expect( wrapFunction(modelCreator.removeRequest) ).toThrow();
            expect( wrapFunction(modelCreator.removeRequest,42) ).toThrow();
            expect( wrapFunction(modelCreator.removeRequest,true) ).toThrow();
        });
    });
    describe('addChild: Adds a child model to this model.', function() {
        var testModel = (new ModelCreator('TestModel')).finaliseModel();

        it('Should add a child to the model.', function() {

            modelCreator.addChild(testModel);
            var model = modelCreator.finaliseModel();

            expect(model.children['TestModel']).not.toBeUndefined();
            expect(model.children['TestModel']).toBe(testModel);
        });
        it('Should add a child to the model with the specified name.', function() {

            modelCreator.addChild(testModel, 'NewChild');
            var model = modelCreator.finaliseModel();

            expect(model.children['TestModel']).toBeUndefined();
            expect(model.children['NewChild']).not.toBeUndefined();
            expect(model.children['NewChild']).toBe(testModel);
        });
        it('Should throw if a child that already exists is added again.', function() {
            modelCreator.addChild( testModel);
            expect( wrapFunction(modelCreator.addChild, testModel )).toThrow();
        });
        it('Should not throw if a child that already exists is added with a different name.', function() {
            modelCreator.addChild( testModel);
            expect( wrapFunction(modelCreator.addChild, testModel, 'NewChild' )).not.toThrow();
        });
        it('Should throw if the child is not an object.', function() {
            expect( wrapFunction(modelCreator.addChild) ).toThrow();
            expect( wrapFunction(modelCreator.addChild,42) ).toThrow();
            expect( wrapFunction(modelCreator.addChild,true) ).toThrow();
        });
    });
    describe('removeChild: Removes a child model from this model.', function() {
        var testModel = (new ModelCreator('TestModel')).finaliseModel();

        beforeEach(function() {
            modelCreator.addChild(testModel);
        });
        it('Should remove the given child from the model.', function() {
            modelCreator.removeChild(testModel);
            var model = modelCreator.finaliseModel();

            expect(model.children['TestModel']).toBeUndefined();
        });
        it('Should throw if the child is not defined.', function() {
            var newModel = (new ModelCreator('NewModel')).finaliseModel();
            expect( wrapFunction(modelCreator.removeChild,newModel) ).toThrow();
        });
        it('Should throw if the child is not an object.', function() {
            expect( wrapFunction(modelCreator.removeChild) ).toThrow();
            expect( wrapFunction(modelCreator.removeChild,42) ).toThrow();
            expect( wrapFunction(modelCreator.removeChild,true) ).toThrow();
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

            expect( modelCreator.finaliseModel ).toThrow();
        });
    });
    describe('addStateRequest: adds the "State" request.', function() {
        it('Should add the "State" request.', function() {
            modelCreator.addStateRequest();
            var model = modelCreator.finaliseModel();

            expect( model.requests['State'] ).not.toBeUndefined();
            expect( typeof(model.requests['State']) ).toEqual('function');
            expect(model.customRequests).not.toContain('State');
        });
        it('Should add the "State" request with the given name.', function() {
            modelCreator.addStateRequest('get_state');
            var model = modelCreator.finaliseModel();

            expect( model.requests['State'] ).toBeUndefined();
            expect( model.requests['get_state'] ).not.toBeUndefined();
            expect( typeof(model.requests['get_state']) ).toEqual('function');
            expect(model.customRequests).not.toContain('get_state');
        });
    });

    describe('addSetActionFor: Adds a Set[Property] action to the model', function() {
        beforeEach( function() {
            modelCreator.addProperty('Property');
        });
        it('Should add a "Set" action with the correct default name: Set[Property].', function(){
            modelCreator.addSetActionFor( 'Property' );
            var model = modelCreator.finaliseModel();

            expect( model.actions['SetProperty'] ).not.toBeUndefined();
            expect( typeof(model.actions['SetProperty']) ).toEqual('function');
            expect( model.customActions).not.toContain('SetProperty');
        });
        it('Should add a "Set" action with the given name.', function(){
            modelCreator.addSetActionFor( 'Property', 'set_property' );
            var model = modelCreator.finaliseModel();

            expect( model.actions['set_property'] ).not.toBeUndefined();
            expect( typeof(model.actions['set_property']) ).toEqual('function');
            expect( model.customActions).not.toContain('set_property');
        });
        it('Should throw if the property name is not a string.', function() {
            expect( wrapFunction(modelCreator.addSetActionFor) ).toThrow();
            expect( wrapFunction(modelCreator.addSetActionFor,42) ).toThrow();
            expect( wrapFunction(modelCreator.addSetActionFor,true) ).toThrow();
        });
        it('Should throw if the action name is not a string.', function() {
            expect( wrapFunction(modelCreator.addSetActionFor, 'Property', 42) ).toThrow();
            expect( wrapFunction(modelCreator.addSetActionFor, 'Property', true) ).toThrow();
        });
    });
});
