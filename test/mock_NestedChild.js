var ModelReducer = require('../index.js');

var mockChildCreator = new ModelReducer.ModelCreator('MockNestedChild');

mockChildCreator.setFormsACollection(false);
mockChildCreator.addProperty('NestedChildProperty');
mockChildCreator.addAction('NestedChildAction', function(state){
    return state;
});
mockChildCreator.addRequest('NestedChildRequest', function(state){
    return 'Child';
});

module.exports = mockChildCreator.finaliseModel();
