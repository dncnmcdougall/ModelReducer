var ModelReducer = require('./Util.js').ModelReducer
var mock_NestedChild = require('./mock_NestedChild.js');
var mock_NestedCollection = require('./mock_NestedCollection.js');

var mockChildCreator = new ModelReducer.ModelCreator('MockOtherChild');

mockChildCreator.addProperty('ChildProperty');
mockChildCreator.addProperty('NumberProperty', 'number');
mockChildCreator.addAction('NullAction', function(state){
    return state;
});
mockChildCreator.addAction('IncrementAction', function(state){
    var newState = Object.assign({},state);
    newState.NumberProperty++;
    return newState;
});
mockChildCreator.addRequest('ChildRequest', function(state){
    return 'Child';
});
mockChildCreator.addStateRequest();

mockChildCreator.addChild(mock_NestedChild);
mockChildCreator.addChildAsCollection(mock_NestedCollection);
mockChildCreator.addAddActionFor(mock_NestedCollection);

module.exports = mockChildCreator.finaliseModel();
