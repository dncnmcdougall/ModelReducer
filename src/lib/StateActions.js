/* eslint complexity: [ "warn" ] */
var checkType = require('./Util.js').checkType;
var objectOrString = require('./Util.js').objectOrString;

function StateActions()
{

    this.addStateRequest = function(constructor, actionName) {
        if ( actionName ) {
            checkType(actionName, 'string');
        } else {
            actionName = 'State';
        }
        constructor.addRequest(actionName, function(state) {
            return state;
        }, true);
    };

    this.addSetActionFor = function(constructor, propertyName, actionName) {
        checkType(constructor, 'object');
        checkType(propertyName, 'string');
        if ( actionName ) {
            checkType(actionName, 'string');
        } else {
            actionName = 'Set'+propertyName;
        }


        constructor.addAction(actionName, function(state, value) {
            if ( this.properties.hasOwnProperty(propertyName) === false ) {
                throw new Error('The property "'+propertyName+'" was not defined on the model');
            }
            if ( this.properties[propertyName] ) {
                checkType(value, this.properties[propertyName] );
            }
            if ( state[propertyName] === value )
            {
                return state;
            }
            var merger = {};
            merger[propertyName] = value;
            return Object.assign({},state,merger);
        }, true);
    };


    this.addAddActionFor = function(constructor, child, actionName) {
        checkType(constructor, 'object');

        let childName = objectOrString(child, (c) => c.name+'[]');

        if ( !constructor.hasCollection(childName) ) {
            throw new Error('Add actions can only be created for children'+
                ' which form a collection');
        }
        if ( actionName ) {
            checkType(actionName, 'string');
        } else {
            actionName = 'Add'+child.name;
        }

        constructor.addAction(actionName, function(state, key) {
            var childObject = child.createEmpty();
            childObject[child.collectionKey] = key;

            var modName = childName;
            var merger = {};
            merger[modName] = {};
            Object.assign(merger[modName], state[modName]);
            merger[modName][key] = childObject;

            return Object.assign({},state,merger);
        }, true);
    };
}

module.exports = new StateActions();

