var ModelReducer = require('../index.js');
var mock_Child = require('./mock_Child.js');
var mock_CollectionChild = require('./mock_CollectionChild.js');

var mockParentCreator = new ModelReducer.ModelCreator('MockParent');

mockParentCreator.setFormsACollection(false);
mockParentCreator.addProperty('ParentProperty');
mockParentCreator.addProperty('NumberProperty', 'number');
mockParentCreator.addAction('NullAction', function(state){
    return state;
});
mockParentCreator.addAction('IncrementAction', function(state){
    var newState = Object.assign({},state);
    newState.NumberProperty++;
    return newState;
});
mockParentCreator.addRequest('ParentRequest', function(state){
    return 'Parent';
});
mockParentCreator.addStateRequest();

mockParentCreator.addChildModel(mock_Child);
mockParentCreator.addChildModel(mock_CollectionChild);
mockParentCreator.addAddActionFor(mock_CollectionChild);
mockParentCreator.addAvailableKeyRequestFor(mock_CollectionChild);

module.exports = mockParentCreator.finaliseModel();
