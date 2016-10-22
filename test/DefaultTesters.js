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

