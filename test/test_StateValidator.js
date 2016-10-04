/*eslint-env jasmine */

var MockChild = require('./mock_Child.js');
var MockCollectionChild = require('./mock_CollectionChild.js');
var MockParent = require('./mock_Parent.js');

describe('StateValidator: A class used for asserting that a given state object fulfills a given model.', function() {
    describe('validateState: asserts that the given object represents a state of the given model.', function () {

        it('Should return the state and no error when everything is correct.');

        it('Should return an error when there is a missing property.');
        it('Should return an error when there is a missing child.');
        it('Should return an error when there is a missing collection child.');

        it('Should return an error when there is an extra property.');
        it('Should return an error when there is an extra child.');
        it('Should return an error when there is an extra collection child.');

        it('Should return an error when there is a missing property on a child.');
        it('Should return an error when there is a missing child on a child.');
        it('Should return an error when there is a missing collection child on a child.');

        it('Should return an error when there is an extra property on a child.');
        it('Should return an error when there is an extra child on a child.');
        it('Should return an error when there is an extra collection child on a child.');

        it('Should return an error when there is a missing property on a child collection.');
        it('Should return an error when there is a missing child on a child collection.');
        it('Should return an error when there is a missing collection child on a child collection.');

        it('Should return an error when there is an extra property on a child collection.');
        it('Should return an error when there is an extra child on a child collection.');
        it('Should return an error when there is an extra collection child on a child collection.');
    });

    describe('validateStateCollection: asserts that the given object represents a collection of state of the given model.', function () {

        it('Should return the state and no error when everything is correct.');

        it('Should return an error when there is a missing property.');
        it('Should return an error when there is a missing child.');
        it('Should return an error when there is a missing collection child.');

        it('Should return an error when there is an extra property.');
        it('Should return an error when there is an extra child.');
        it('Should return an error when there is an extra collection child.');
    });

});

