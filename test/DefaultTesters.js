/*eslint-env jasmine */

var StateValidator = require('../lib/StateValidator.js');

module.exports['testProperty'] = function (Model, propertyMethod, propertyName, valueArray){
    describe('Action '+Model.getName()+'.'+propertyMethod+'()', function(){

        var actionName = Model.getName()+'.'+propertyMethod;
        var state = null;
        beforeEach(function(){
            state = Model.createEmpty();
            state[propertyName] = valueArray[0];
        });

        it('Should return the origonal state if the property is not changed.', function(){
            expect(Model.reduce(actionName, state, valueArray[0])).toBe(state);
        });

        (valueArray.slice(1)).forEach(function(value) {
            it('Should return a new state with the given value.', function(){
                var newState = Model.reduce(actionName, state, value);
                expect(newState[propertyName]).toEqual(value);
                expect(newState).not.toBe(state);
            });
        });
    });
};



module.exports['testAvailableId'] = function(Model, listName, requestName) {
    if ( !requestName ) {
        var propertyName;

        if( listName[listName.length-1] === 's' ) { 
            propertyName = listName.slice(0,listName.length-1) ;
        } else {
            propertyName = listName;
        }
        requestName = 'Available'+propertyName+'Id';
    }

    var count = 9;
    var modelName = Model.getName();
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
                    id = Model.request(modelName+'.'+requestName, state);
                    expect(id).toEqual(i);
                    state[listName][i] = { 'Property': 'String'};
                }
            });
            it('Should return a missing id if the list a has big hole.', function() {
                for (i = 0; i< count-1; i++ ) {
                    delete state[listName][i];
                    delete state[listName][i+1];
                    id = Model.request(modelName+'.'+requestName, state);
                    expect(id).toEqual(i);
                    state[listName][i] = { 'Property': 'String'};
                    state[listName][i+1] = { 'Property': 'String'};
                }
            });
            it('Should return a missing id if the list has two holes.', function() {
                for (i = 0; i< count-3; i++ ) {
                    delete state[listName][i];
                    delete state[listName][i+3];
                    id = Model.request(modelName+'.'+requestName, state);
                    expect(id).toEqual(i);
                    state[listName][i] = { 'Property': 'String'};
                    state[listName][i+3] = { 'Property': 'String'};
                }
            });
        });
    }


    describe('Request '+modelName+'.'+requestName, function () {
        it('Should handle an empty list', function() {
            var state = {};
            state[listName] = {};
            var id = Model.request(modelName+'.'+requestName, state);
            expect(id).toEqual(0);
        });
        it('Should handle a list with only one item', function() {
            var state = {};
            state[listName] = {
                '0': {' Property': 'String'} 
            };
            var id = Model.request(modelName+'.'+requestName, state);
            expect(id).toEqual(1);

            state[listName] = {
                '1': {' Property': 'String'} 
            };
            id = Model.request(modelName+'.'+requestName, state);
            expect(id).toEqual(0);
        });
        testOnRange(count);
        testOnRange(count-1);
    });
};

module.exports['testAddChild'] = function(Model, childName) {

    describe('Action '+Model.getName()+'.Add'+childName+'()', function() {
        var state = null;
        var actionName = Model.getName() + '.Add'+childName;
        var propertyName = Model.Children[childName].getPropertyName();

        beforeEach( function () {
            state = Model.createEmpty();
        });

        it('Should add a child of the given id.', function() {
            expect( Object.keys(state[propertyName]).length ).toEqual(0);
            expect( state[propertyName][0]).toBeUndefined();

            var newState = Model.reduce(actionName, state, 0);
            expect( Object.keys(newState[propertyName]).length ).toEqual(1);
            expect( newState[propertyName][0]).not.toBeUndefined();
        });

        it('Should override the child of the given id.', function() {
            var newState = Model.reduce(actionName, state, 0);
            expect( newState[propertyName][0]).not.toBeUndefined();
            newState[propertyName][0] = { 'TestProperty': 'Test value'};

            var newState2 = Model.reduce(actionName, newState, 0);
            expect(newState2[propertyName][0]['TestProperty']).toBeUndefined();
        });

        it('Should result in a valid state.', function() {
            var newState = Model.reduce(actionName,state,0);

            var result = StateValidator.validateState(Model, newState);
            expect(result.error).toBeNull();
            expect(result.value).toEqual(newState);
        });

    });
};

module.exports['testStateRequest'] = function(Parent, Child) {
    if ( Child.getIdField() ) {
        describe('Request '+Child.getName()+'.State()', function() {
            var state;
            var childState;

            var childIdField = Child.getIdField();
            var childName = Child.getName();
            var childPropName = Child.getPropertyName();

            beforeEach( function () {
                childState = {};
                childState[childIdField] = 0;
                childState['property'] = '0';

                state = {};
                state[childPropName] = {};
                state[childPropName][0] = childState;
            });

            it('Should return the bundle sub-state if it does exist.', function() {
                var newChildState = Parent.request(Parent.getName()+'.'+childName+'.State',state, 0);

                expect( newChildState ).toBe( state[childPropName][0] );
                expect( newChildState ).toBe( childState );

            });
            it('Should return the state.', function() {

                var newChildState = Child.request(childName+'.State', childState);

                expect( newChildState ).toBe( state[childPropName][0] );
                expect( newChildState ).toBe( childState );
            });
        });
    } else {
        describe('Request '+Child.getName()+'.State()', function() {
            var state;
            var childState;

            var childName = Child.getName();
            var childPropName = Child.getPropertyName();

            beforeEach( function () {
                childState = {};
                childState['property'] = '0';

                state = {};
                state[childPropName] = childState;
            });

            it('Should return the bundle sub-state if it does exist.', function() {
                var newChildState = Parent.request(Parent.getName()+'.'+childName+'.State',state);

                expect( newChildState ).toBe( state[childPropName] );
                expect( newChildState ).toBe( childState );

            });
            it('Should return the state.', function() {

                var newChildState = Child.request(childName+'.State', childState);

                expect( newChildState ).toBe( state[childPropName] );
                expect( newChildState ).toBe( childState );
            });
        });
    }
};
