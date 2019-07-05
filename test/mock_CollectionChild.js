var ModelReducer = process.env.NODE_ENV =='production' ? require('../dist/model-reducer.js') : require('../src/index.js');
var mock_NestedChild = require('./mock_NestedChild.js');
var mock_NestedCollection = require('./mock_NestedCollection.js');

var mockChildCreator = new ModelReducer.ModelCreator('MockCollectionChild');

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

module.exports = mockChildCreator.finaliseModel();
