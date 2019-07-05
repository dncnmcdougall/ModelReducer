var ModelReducer = require('../src/index.js');

var mockChildCreator = new ModelReducer.ModelCreator('MockNestedCollection');

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
