/*eslint-env jasmine */
var Util = require('../lib/Util.js');

var wrapFunction = function( func, ...args) {
    return function() {
        func(...args);
    };
};

describe('Util: a private set of utilities', function() {
    describe('checkType: checks that the type of the argument is the type specified', function() {
        var object = {};
        var array = [2];
        var bool = true;
        var string = 'st';
        var number = 12;
        it('Should handle objects', function() {
            expect( wrapFunction(Util.checkType, object, 'object') ).not.toThrow();
            expect( wrapFunction(Util.checkType, array,  'object') ).toThrow();
            expect( wrapFunction(Util.checkType, bool,   'object') ).toThrow();
            expect( wrapFunction(Util.checkType, string, 'object') ).toThrow();
            expect( wrapFunction(Util.checkType, number, 'object') ).toThrow();
        });
        it('Should handle arrays', function() {
            expect( wrapFunction(Util.checkType, object, 'array') ).toThrow();
            expect( wrapFunction(Util.checkType, array,  'array') ).not.toThrow();
            expect( wrapFunction(Util.checkType, bool,   'array') ).toThrow();
            expect( wrapFunction(Util.checkType, string, 'array') ).toThrow();
            expect( wrapFunction(Util.checkType, number, 'array') ).toThrow();
        });
        it('Should handle booleans', function() {
            expect( wrapFunction(Util.checkType, object, 'boolean') ).toThrow();
            expect( wrapFunction(Util.checkType, array,  'boolean') ).toThrow();
            expect( wrapFunction(Util.checkType, bool,   'boolean') ).not.toThrow();
            expect( wrapFunction(Util.checkType, string, 'boolean') ).toThrow();
            expect( wrapFunction(Util.checkType, number, 'boolean') ).toThrow();
        });
        it('Should handle strings', function() {
            expect( wrapFunction(Util.checkType, object, 'string') ).toThrow();
            expect( wrapFunction(Util.checkType, array,  'string') ).toThrow();
            expect( wrapFunction(Util.checkType, bool,   'string') ).toThrow();
            expect( wrapFunction(Util.checkType, string, 'string') ).not.toThrow();
            expect( wrapFunction(Util.checkType, number, 'string') ).toThrow();
        });
        it('Should handle numbers', function() {
            expect( wrapFunction(Util.checkType, object, 'number') ).toThrow();
            expect( wrapFunction(Util.checkType, array,  'number') ).toThrow();
            expect( wrapFunction(Util.checkType, bool,   'number') ).toThrow();
            expect( wrapFunction(Util.checkType, string, 'number') ).toThrow();
            expect( wrapFunction(Util.checkType, number, 'number') ).not.toThrow();
        });
        describe('wrapResult: wraps the given error and into a result object', function() {
            it('Should have the error specified', function() {
                var result = Util.wrapResult('Error', 'Value');
                expect(result.error).toEqual('Error');
            });
            it('Should have a null value if it has a non null error', function() {
                var result = Util.wrapResult('Error', 'Value');
                expect(result.value).toBeNull();
            });
            it('Should have the value specified, if there is no error', function() {
                var result = Util.wrapResult(null, 'Value');
                expect(result.error).toBeNull();
                expect(result.value).toEqual('Value');
            });
        });

    });
});

