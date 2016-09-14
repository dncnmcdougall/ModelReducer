var ModelReducer = require('../index.js');
var mock_Child = require('mock_Child.js');
var mock_CollectionChild = require('mock_CollectionChild.js');

var mockParentCreator = ModelReducer.startCreatingModel('MockParent');

mockParentCreator.setFormsACollection(false);
mockParentCreator.addProperty('ParentProperty');
mockParentCreator.addAction('ParentAction', function(state){
    return state;
});
mockParentCreator.addRequest('ParentRequest', function(state){
    return 'Parent';
});
mockParentCreator.addChild(mock_Child);
mockParentCreator.addChild(mock_CollectionChild);

odule.exports = mockParentCreator.finaliseConstructor();
