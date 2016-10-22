var ModelReducer = require('../index.js');

var mockChildCreator = new ModelReducer.ModelCreator('MockNestedCollection');

mockChildCreator.setFormsACollection(true);
mockChildCreator.setCollectionKey('id');
mockChildCreator.setCollectionName('MockNestedChildren');

mockChildCreator.addProperty('NestedCollectionProperty');
mockChildCreator.addAction('Action', function(state){
    return state;
});
mockChildCreator.addRequest('Request', function(state){
    return 'Child';
});

module.exports = mockChildCreator.finaliseModel();
