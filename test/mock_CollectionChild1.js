var ModelReducer = require('../index.js');
var mock_NestedChild = require('./mock_NestedChild.js');
var mock_NestedCollection = require('./mock_NestedCollection.js');

var mockChildCreator = new ModelReducer.ModelCreator('MockCollectionChild');

mockChildCreator.setFormsACollection(true);
mockChildCreator.setCollectionKey('id');
mockChildCreator.setCollectionName('MockCollectionChildren');

mockChildCreator.addProperty('CollectionChildProperty');
mockChildCreator.addProperty('NumberProperty', 'number');
mockChildCreator.addAction('NullAction', function(state){
    return state;
});
mockChildCreator.addAction('IncrementAction', function(state){
    var newState = Object.assign({},state);
    newState.NumberProperty++;
    return newState;
});
mockChildCreator.addRequest('CollectionChildRequest', function(state){
    return 'CollectionChild';
});
mockChildCreator.addStateRequest();

mockChildCreator.addChild(mock_NestedChild);
mockChildCreator.addChildAsCollection(mock_NestedCollection);

var version1 = mockChildCreator.addVersion();
version1.removeProperty('NumberProperty');
version1.addProperty('NumberPropertyV1', 'number');
version1.renameProperty('CollectionChildProperty','CollectionChildPropertyV1');

module.exports = mockChildCreator.finaliseModel();
