
function StateValidator()
{
    this.validateStateCollection = (model, collection) => {
        var error = null;
        if ( !model.getIdField() ) {
            error = model.getName()+' should not be placed in a collection, it has no id field';
        }

        Object.keys(collection).forEach( (id) => {
            if ( !error ) {
                var internalId = collection[id][model.getIdField()];
                if ( internalId != id ) {
                    error = model.getName()+' '+ id +' had '+model.getIdField()+': '+internalId+', expected it to be '+id;
                } else {
                    error = this.validateState(model, collection[id] ).error;
                }
            }
        });

        if ( error ) {
            return {
                'error': error,
                'value': null
            };
        } else {
            return {
                'error': null,
                'value': collection
            };
        }
    };

    this.validateState = (model, state) => {
        var newState = {};
        var children = model.Children;

        var childCount = {};
        var collectionCount = {};
        var propertyCount = {};

        Object.keys(children).forEach( (childName) => { 
            var child = children[childName];
            if ( child.getIdField() ) {
                collectionCount[child.getPropertyName()] = {
                    'count': 0,
                    'name': childName
                }; 
            } else {
                childCount[child.getPropertyName()] = 0; 
            }
        } );

        model.Properties.forEach( (prop) => { 
            propertyCount[prop] = 0; 
        } );

        if ( model.getIdField() ) {
            propertyCount[model.getIdField()] = 0; 
        }

        var error = null;

        Object.keys(state).forEach( (key) => {
            if (error) {
                return;
            } else if ( propertyCount[key] == 0 ) {
                propertyCount[key] = 1;
                newState[key] = state[key];
            } else if ( childCount[key] == 0 ) {
                var newChild = this.validateState(children[key], state[key]); 
                if ( !newChild.error ) {
                    childCount[key] = 1;
                    newState[key] = newChild.value;
                } else {
                    error =  newChild.error;
                }
            } else if ( collectionCount[key] && collectionCount[key].count == 0 ) {
                var childName = collectionCount[key].name;
                var tmpResult = this.validateStateCollection( children[childName], state[key] );
                if ( tmpResult.error ) {
                    error = tmpResult.error;
                } else {
                    collectionCount[key].count = 1;
                    newState[key] = tmpResult.value;
                }
            } else if ( propertyCount[key] > 0 ) {
                error= 'Duplicate property "'+key+'" in '+model.getName();
            } else if ( childCount[key] && childCount[key] > 0 ) {
                error= 'Duplicate child "'+key+'" in '+model.getName();
            } else if ( collectionCount[key] && collectionCount[key].count > 0 ) {
                error= 'Duplicate collection "'+key+'" in '+model.getName();
            } else {
                error= 'Nothing named "'+key+'" found in '+model.getPropertyName();
            }
        }
        );
        Object.keys(collectionCount).forEach( (key) => {
            if ( !error && !collectionCount[key].count ) {
                error = 'Collection "'+key+'" not populated in '+model.getName();
            }
        });

        Object.keys(childCount).forEach( (key) => {
            if ( !error && !childCount[key] ) {
                error = 'Child "'+key+'" not populated in '+model.getName();
            }
        });

        Object.keys(propertyCount).forEach( (key) => {
            if ( !error && !propertyCount[key] ) {
                error = 'Property "'+key+'" not populated in '+model.getName();
            }
        });

        if ( error ) {
            return {
                'error': error,
                'value': null
            };
        } else {
            return {
                'error': null,
                'value': newState
            };
        }
    };
}

module.exports = new StateValidator();
