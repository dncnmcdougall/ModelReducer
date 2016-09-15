var ModelReducer = require('../index.js');

var mockChildCreator = new ModelReducer.ModelCreator('MockCollectionChild');

mockChildCreator.setFormsACollection(true);
mockChildCreator.setCollectionKeyField('id');
mockChildCreator.setCollectionName('MockCollectionChildren');
mockChildCreator.addProperty('ChildProperty');
mockChildCreator.addAction('ChildAction', function(state){
    return state;
});
mockChildCreator.addRequest('ChildRequest', function(state){
    return 'Child';
});

module.exports = mockChildCreator.finaliseModel();
