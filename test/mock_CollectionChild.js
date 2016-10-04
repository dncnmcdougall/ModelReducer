var ModelReducer = require('../index.js');

var mockChildCreator = new ModelReducer.ModelCreator('MockCollectionChild');

mockChildCreator.setFormsACollection(true);
mockChildCreator.setCollectionKey('id');
mockChildCreator.setCollectionName('MockCollectionChildren');

mockChildCreator.addProperty('CollectionChildProperty');
mockChildCreator.addAction('CollectionChildAction', function(state){
    return state;
});
mockChildCreator.addRequest('CollectionChildRequest', function(state){
    return 'Child';
});

module.exports = mockChildCreator.finaliseModel();
