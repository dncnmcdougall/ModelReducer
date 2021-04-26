# *ModelVersioning*: A class used in validating to allow different versions of an object.
* should add a version to the model if none exists, but otherwise leave the model as is.
* should set the version to the last version number
* lastVersionNumber: gets the largest version in this versioning.
* should throw if used after finalisation.
* should should throw if a version is not an integer
* should handle updates from different base versions
## *add*: specifies a property to add for a version
* should add the properties named
* should add the property with the given value
* should fail to add the property if it already exists.
## *rename*: specifies a rename for a version
* should rename the properties
* should chain renames
* should fail rename if the property does not exists
* should fail rename if the property does not exists
* should fail rename if the new name already exists.
## *remove*: specifies a property to remove at a version
* should rename the properties
* should be able to remove properties added 
* should fail renames if the property does not exists
* should fail renames if the property does not exists
# *Util*: a private set of utilities
## *checkType*: checks that the type of the argument is the type specified
* Should handle objects
* Should handle arrays
* Should handle booleans
* Should handle strings
* Should handle numbers
### *wrapResult*: wraps the given error and into a result object
* Should have the error specified
* Should have a null value if it has a non null error
* Should have the value specified, if there is no error
### *defaultValue*: returns a default value for the given type
* Should return correct defaults for string, boolean, number, array, object and null types
* Should return null given null
* Should throw for unknown types
# *StateValidator*: A class used for asserting that a given state object fulfils a given model.
## *validateState*: asserts that the given object represents a state of the given model.
* Should return the state and no error when everything is correct.
* Should return an error when a property is of the wrong type.
* Should return an error when a child property is of the wrong type.
* Should return an error when a collection property is of the wrong type.
* Should return an error when there is a missing property.
* Should return an error when there is a missing child.
* Should return an error when there is a missing collection child.
* Should return an error when there is an extra property.
* Should return an error when there is a missing property on a child.
* Should return an error when there is a missing child on a child.
* Should return an error when there is a missing collection child on a child.
* Should return an error when there is an extra property on a child.
* Should return an error when there is a missing property on a collection.
* Should return an error when there is a missing child on a collection.
* Should return an error when there is a missing collection child on a collection.
* Should return an error when there is an extra property on a collection.
## *validateStateCollection*: asserts that the given object represents a collection of state of the given model.
* Should return an error when there is a missing property.
* Should return an error when there is a missing child.
* Should return an error when there is a missing collection child.
* Should return an error when there is an extra property.
* Should return an error when the "key" property is out of sync.
# *Model*: The model returned from the creator. Used to process state.
## *request*: Perform the named request using the given state and return the result.
* Should call the correct parent action
* Should call the correct child action
* Should call the correct collection action
## *reduce*: Perform the named action on the given state and return the new state.
* Should pass the correct the correct parent action and return the same state
* Should pass the correct the correct parent action and return the new state
* Should call the correct child action and return the same state
* Should call the correct child action and return the new state
* Should call the correct collection action and return the same state
* Should call the correct collection action and return the new state
## *listActions*: Lists all the actions registered on this model, recursively.
* Should list all the actions on the model.
* Should list only the actions on the given model.
## *listCustomActions*: Lists all the user defined actions registered on this model, recursively.
* Should list all the user defined actions on the model.
* Should list only the user defined actions on the given model.
## *listRequests*: Lists all the requests registered on this model, recursively.
* Should list all the requests on the model.
* Should list only the requests on the given model.
## *listCustomRequests*: Lists all the user defined requests registered on this model, recursively.
* Should list all the user defined requests on the model.
* Should list only the user defined requests on the given model.
## *createEmpty*: Creates an empty state representing this model.
* Should populate strings with ""
* Should populate numbers with 0
* Should populate booleans with false
* Should populate objects with {}
* Should populate arrays with []
* Should populate null types (type not given) with null
* Should populate children recursively.
* Should populate child collections with {}
## *State (request)*: Returns the state representing this model from within the given state.
* Should return the parent state.
* Should return the child state.
* Should return the collection child state.
## *Set[PropertyName] (action)*: Sets the named property to the given value and returns the new state.
* Should set the property to the given value.
* Should do nothing if the value is the same.
* Should set the property to any value if the type is not give.
* Should throw if there is a type violation.
* Should throw if the property does not exist.
## *Add[ChildName] (action)*: Adds an empty instance of the child to its collection, under the given key, and returns the new state.
* Should add the child a child at the given id.
* Should overwrite a child if it already exists.
## *Available[ChildName] (request)*: Returns the available key value for the given child collection in the state.
* Should handle an empty list
* Should handle a list with only one item
### Should return the missing id of an odd element array
* Should return a missing id if the list has a hole.
* Should return a missing id if the list a has big hole.
* Should return a missing id if the list has two holes.
### Should return the missing id of an even element array
* Should return a missing id if the list has a hole.
* Should return a missing id if the list a has big hole.
* Should return a missing id if the list has two holes.
## *hasCollection*: returns true if the model has the named collection of children.
* Should return true if the collection is present.
* Should return false if the collection is not present.
* Should return false if the collection is not present, but is a child.
## *hasChild*: returns true if the model has the named child.
* Should return true if the child is present.
* Should return false if the child is not present.
* Should return true if the child is not present, but is a collection.
# *StateValidator*: The state validator can be used to update to a newer version.
* should work with old models as expected
* should error on updated state with old models
* should update the state with new models
* should read updated state with new models
* should fail if the update fails
## *validateStateCollection*: asserts that the given object represents a collection of state of the given model.
* should work with old models as expected
* should update the state with new models
# *ModelCreator*: A class used for building a model.
* Should create a model with the given name.
* Should throw if used after the model was finalised.
## *copyFrom*: Copies the given model's properties, children, actions and requests into this model
* Should add the properties to the current model.
* Should override duplicate properties in the current model.
* Should add the children to the current model.
* Should add the actions to the current model.
* Should override duplicate actions in the current model.
* Should add the requests to the current model.
* Should override duplicate requests in the current model.
* Should throw if the model is already finalised.
## *setCollectionName*: Sets the name of the collection that this child becomes in the parent.
* Should set the collection name of the model.
* Should not set the name of the model.
* Should throw if not given a string
## *setCollectionKeyField*: Sets the name of the field which is used to store the numeric identifier of an instance of this model in a collection.
* Should set the name of the key
* Should throw if not given a string
## *addProperty*: Adds a property to the model.
* Should add a property with the specified type to the model.
* Should add a property with the no type to the model, if no type is given.
* Should override a property if it exists.
* Should throw if the property name is not a string.
* Should throw if the property type is not a string.
## *removeProperty*: Removes a property from the model.
* Should remove the given property from the model.
* Should throw if the property is not defined.
* Should throw if the property name is not a string.
## *addAction*: Adds an action to the model.
* Should add an action with the specified function to the model.
* Should override an action if it already exists.
* Should throw if the action name is not a string.
* Should throw if the action is not a function.
## *removeAction*: Removes an action from the model.
* Should remove the given user defined action from the model.
* Should remove the given built in action from the model.
* Should throw if the action is not defined.
* Should throw if the action name is not a string.
## *addRequest*: Adds a request to the model.
* Should add a request with the specified function to the model.
* Should override a request if it already exists.
* Should throw if the request name is not a string.
* Should throw if the request is not a function.
## *removeRequest*: Removes a request from the model.
* Should remove the given user defined request from the model.
* Should remove the given built in request from the model.
* Should throw if the request is not defined.
* Should throw if the request name is not a string.
## *addChild*: Adds a child model to this model.
* Should add a child with the specified function to the model.
* Should throw if a child is added that already exists.
* Should throw if the child is not an object.
## *addChildAsCollection*: Adds a child model to this model as a collection.
* Should add a child with the collection name to the model.
* Should not add a child with the model name to the model.
* Should throw if a child is added that already exists.
* Should throw if a child is added that already exists as a collection.
* Should throw if the child is not an object.
## *removeChild*: Removes a child model from this model.
* Should remove the given child from the model.
* Should throw if the child is not defined.
* Should throw if the child is not an object.
## *finaliseModel*: Finalises and returns the model.
* Should return the defined model.
* Should throw is it is called on a creator which has been finalised already
* Should throw if the collection key will shadow a property.
## *addStateRequest*: adds the "State" request.
* Should add the "State" request.
## *addAvailableKeyRequestFor*: Should add an "Available[ChildName][ChildCollectionKey]" request for a collection.
* Should add an "Available" request with the correct default name: Available[ChildName][ChildCollectionKey].
* Should add an "Available" request with the given name.
* Should throw if the child does not form a collection.
* Should throw if the child is not an object.
* Should throw if the request name is not a string.
## *addAddActionFor*: Adds an "Add[ChildName]" action for a collection.
* Should this be added by default when a child is added as a collection?
* Should add an "Add" action with the correct default name: Add[ChildName].
* Should add an "Add" action with the given name.
* Should throw if the child does not form a collection.
* Should throw if the child is not on the model.
* Should throw if the child is not an object.
* Should throw if the request name is not a string.
## *addSetPropertyActionFor*: Adds a Set[Property] action to the model
* Should add a "Set" action with the correct default name: Set[Property].
* Should add a "Set" action with the given name.
* Should throw if the property name is not a string.
* Should throw if the action name is not a string.