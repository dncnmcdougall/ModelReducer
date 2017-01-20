var ModelReducer = require('../index.js');
var mock_NestedChild = require('./mock_NestedChild.js');
var mock_NestedCollection = require('./mock_NestedCollection.js');

var mockChildCreator = new ModelReducer.ModelCreator('MockChild');

mockChildCreator.setFormsACollection(false);
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

mockChildCreator.addChildModel(mock_NestedChild);
mockChildCreator.addChildModel(mock_NestedCollection);
mockChildCreator.addAddActionFor(mock_NestedCollection);

module.exports = mockChildCreator.finaliseModel();
