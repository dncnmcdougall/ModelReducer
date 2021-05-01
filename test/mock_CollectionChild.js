var ModelReducer = require('./Util.js').ModelReducer;
var mock_NestedChild = require('./mock_NestedChild.js');

var mockChildCreator = new ModelReducer.ModelCreator('MockCollectionChild');

mockChildCreator.setCollectionKey('id');

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
mockChildCreator.addChildAsCollection(mock_NestedChild);

module.exports = mockChildCreator.finaliseModel();
