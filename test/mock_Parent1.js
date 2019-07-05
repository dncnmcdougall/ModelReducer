var ModelReducer = process.env.NODE_ENV =='production' ? require('../dist/model-reducer.js') : require('../src/index.js');
var mock_Child = require('./mock_Child.js');
var mock_OtherChild = require('./mock_OtherChild.js');
var mock_CollectionChild1 = require('./mock_CollectionChild1.js');

var mockParentCreator = new ModelReducer.ModelCreator('MockParent');

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

mockParentCreator.addChild(mock_Child);
mockParentCreator.addChildAsCollection(mock_CollectionChild1);
mockParentCreator.addAddActionFor(mock_CollectionChild1);
mockParentCreator.addAvailableKeyRequestFor(mock_CollectionChild1);

var version1 = mockParentCreator.addVersion();
version1.removeProperty('NumberProperty');
version1.addProperty('NumberPropertyV1', 'number');
version1.renameProperty('ParentProperty', 'ParentPropertyV1');
version1.addChild(mock_OtherChild);
version1.removeChild(mock_Child);

module.exports = mockParentCreator.finaliseModel();
