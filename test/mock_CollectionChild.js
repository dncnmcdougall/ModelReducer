var ModelReducer = require('../index.js');
var mock_NestedChild = require('./mock_NestedChild.js');
var mock_NestedCollection = require('./mock_NestedCollection.js');

var mockChildCreator = new ModelReducer.ModelCreator('MockCollectionChild');

mockChildCreator.setFormsACollection(true);
mockChildCreator.setCollectionKey('id');
mockChildCreator.setCollectionName('MockCollectionChildren');

mockChildCreator.addProperty('CollectionChildProperty');
mockChildCreator.addProperty('NumberProperty', 'number');
mockChildCreator.addAction('CollectionChildAction', function(state){
    return state;
});
mockChildCreator.addRequest('CollectionChildRequest', function(state){
    return 'Child';
});

mockChildCreator.addChildModel(mock_NestedChild);
mockChildCreator.addChildModel(mock_NestedCollection);

module.exports = mockChildCreator.finaliseModel();
