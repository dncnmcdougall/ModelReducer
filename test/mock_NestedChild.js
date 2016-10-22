var ModelReducer = require('../index.js');

var mockChildCreator = new ModelReducer.ModelCreator('MockNestedChild');

mockChildCreator.setFormsACollection(false);
mockChildCreator.addProperty('NestedChildProperty');
mockChildCreator.addAction('Action', function(state){
    return state;
});
mockChildCreator.addRequest('Request', function(state){
    return 'Child';
});

module.exports = mockChildCreator.finaliseModel();
