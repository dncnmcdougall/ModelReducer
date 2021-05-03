
/*eslint-env jasmine */

var Collection = require('../src/lib/Collection.js');
var Model = require('../src/lib/Model.js');

var ModelReducer = require('./Util.js').ModelReducer;
var ModelCreator = ModelReducer.ModelCreator;
var CollectionCreator = ModelReducer.CollectionCreator;

var wrapFunction = require('./Util.js').wrapFunction;

describe('ModelCreator: A class used for building a model.', function() {
    it('Should return an instance of Model.', function() {
        let childCreator = new ModelCreator('Child');
        let Child = childCreator.finaliseModel();

        expect( Child ).toBeInstanceOf( Model );
        expect( Child ).not.toBeInstanceOf( Collection );
    });
});

describe('CollectionCreator: A class used for building a collection.', function() {
    it('Should return an instance of Collection.', function() {
        let childCreator = new ModelCreator('Child');
        let Child = childCreator.finaliseModel();

        let collectionCreator = new CollectionCreator('Collection', Child);
        let Col = collectionCreator.finaliseModel();

        expect( Col ).toBeInstanceOf( Model );
        expect( Col ).toBeInstanceOf( Collection );
    });
});

