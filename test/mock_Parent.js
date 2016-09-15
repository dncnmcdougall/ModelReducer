var ModelReducer = require('../index.js');
var mock_Child = require('./mock_Child.js');
var mock_CollectionChild = require('./mock_CollectionChild.js');

var mockParentCreator = new ModelReducer.ModelCreator('MockParent');

mockParentCreator.setFormsACollection(false);
mockParentCreator.addProperty('ParentProperty');
mockParentCreator.addAction('ParentAction', function(state){
    return state;
});
mockParentCreator.addRequest('ParentRequest', function(state){
    return 'Parent';
});
console.log('adding Child');
console.log(mock_Child);

mockParentCreator.addChildModel(mock_Child);
mockParentCreator.addChildModel(mock_CollectionChild);

module.exports = mockParentCreator.finaliseModel();
