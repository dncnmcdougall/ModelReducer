[![Build Status](https://travis-ci.org/dncnmcdougall/ModelReducer.svg?branch=master)](https://travis-ci.org/dncnmcdougall/ModelReducer)
[![Coverage Status](https://coveralls.io/repos/github/dncnmcdougall/ModelReducer/badge.svg?branch=master)](https://coveralls.io/github/dncnmcdougall/ModelReducer?branch=master)


The simplicity of pure functions with the logic of structured objects.

# Description
ModelReducer is a library that tries to combine and maintain the simplicity of
pure functions with the logic and structure that objects allow.

In particular the goal is to allow programmers to simply impose a structure on
the state of their applications while still using a library like
[Redux](http://redux.js.org).

This is achieved by creating models (conceptually classes) but they are not
instanced, rather their state is a part of the global state object. So state
management is still immutable and state manipulation is still done with pure
functions, however structural decomposition is handled by this library.

Each model then its own actions (which mutate the state) and requests (which
do calculations on the state). However the model will not receive the global state
object, and does not have to deal with reintegrating the new state object with
the whole. Rather it will receive a state object that matches the model.

This means that the mutation functions can still be pure. While at the same time
a model's actions and requests do not need to deal with the global state object.
This simplifies writing the functions.

# Usage
This is a library that has no dependencies when not in development.

Installing

npm install https://github.com/dncnmcdougall/ModelReducer

Or you can download it from the dist folder.

```javascript
import * as ModelReducer from './model-reducer.umd.js'
// or
import {ModelCreator, StateValidator, VersioningCreator} from 'model-reducer.mjs'
// or
import ModelReducer from 'model-reducer.mjs'
'./model-reducer.mjs'
```
Note that model-reducer.umd.js has to use the default import like above. 
This is a result of the webpack build.

## ToDo Example
```javascript
// Create a ToDo item.
// A soimple item with a description and a done state.
// It has one action that marks a todo item as complete.
var ToDoItemCreator = new ModelReducer.ModelCreator('ToDoItem');
ToDoItemCreator.setCollectionName('ToDoItems');

// Add some properties
ToDoItemCreator.addProperty('Description', 'string');
ToDoItemCreator.addProperty('Done', 'boolean');

// Set the state of this ToDo item to complete.
// An action is used to change the state and so must return a state object.
// Note: that the ToDoItem recieves a ToDoItem state object. It does not know
// about the list.
ToDoItemCreator.addAction('Complete', function(state) {
    return Object.assign({}, state, { 'Done': true } );
});

var ToDoItem = ToDoItemCreator.finaliseModel();

// Create a ToDo list.
// A list of todos that has a request to count the number of todos that are not done.
var ToDoListCreator = new ModelReducer.ModelCreator('ToDoList');
ToDoListCreator.addChildAsCollection(ToDoItem);
ToDoListCreator.addAddActionFor(ToDoItem);
ToDoListCreator.addAvailableKeyRequestFor(ToDoItem);

// Count the  number of complete ToDo items
// A request does not modify the state, rather it is a query run on the state.
// Note: that this is the state object representing the entire list.
ToDoListCreator.addRequest('CountToDos', function(state) {
    return Object.keys( state['ToDoItems'] ).reduce( (result, value) => {
        return result + (state['ToDoItems'][value].Done ? 0 : 1 );
    }, 0);
});
var ToDoList = ToDoListCreator.finaliseModel();

var state = ToDoList.createEmpty();
/* {
    ToDoItems: {}
} */

state = ToDoList.reduce('ToDoList.AddToDoItem', state, 0);
state = ToDoList.reduce('ToDoList.AddToDoItem', state, 1);
/* {
    ToDoItems: {
        0: {
            'Key': 0,
            'Description': '',
            'Done': false
        }
        1: {
            'Key': 1,
            'Description': '',
            'Done': false
        }
} */

var stillToDo = ToDoList.request('ToDoList.CountToDos', state); // = 2

state = ToDoList.reduce('ToDoList.ToDoItems.Complete', state, 0);
/* {
    ToDoItems: {
        0: {
            'Key': 0,
            'Description': '',
            'Done': true
        }
        1: {
            'Key': 1,
            'Description': '',
            'Done': false
        }
} */

stillToDo = ToDoList.request('ToDoList.CountToDos', state); // = 1
```
# Why?
When using a reducer function a natural part of the process of dealing with the
global state is extracting the part of interest, creating a mutated version and
reintegrating it. This is tedious and error prone.

This library aims to do that for you.

Compare the above action:

```javascript
ToDoItemCreator.addAction('Complete', function(state) {
    // mutate todo item and return
    return Object.assign({}, state, { 'Done': true } );
});
```
With a conventional function:
```javascript
function completeToDo(full_state, todoItemId) {
    // Extract todo and mutate todo item
    newItem = Object.assign({}, full_state[todoItemId], { 'Done': true })
    // Re-integrate into global state and return
    return Object.assign( {}, full_state, {
        todoItemId: newItem
        })
}
```
This is a bit of a trivial example, but any experience will show you how this
automatic extraction and reintegration is a boon.

# Features
## Separates model and state.
State is a pure JSON object. The models are a hierarchy of pure functions.

## State validation again a model
```javascript
var result = StateValidator.validateState( ToDoItems, state );
```
This will throw with a sensible warning if the state object does not match the
model.
As an example: if the model has properties that the JSON does not have then this
with throw telling you which.
Or _vice versa_.

## Versioning
Allows modifying models with versioning to allow for backwards compatibility:
```javascript
var ToDoItemCreator = new ModelReducer.ModelCreator('ToDoItem');
ToDoItemCreator.setCollectionName('ToDoItems');
// Add some properties
ToDoItemCreator.addProperty('Description', 'string');
ToDoItemCreator.addProperty('Done', 'boolean');
// Add an action
ToDoItemCreator.addAction('Complete', function(state) {
    return Object.assign({}, state, { 'Done': true } );
});

var version1 = ToDoItemCreator.addVersion();
version1.addProperty('Date');

var ToDoItem = ToDoItemCreator.finaliseModel();
```
The validation module can parse old state and update it to the new model.

# To Improve
- The api for adding items to a collection is rather obscure.
- The Model.reduce and Model.request can be compressed togetehr into Model.r as
  the model stores whether it is a request or a reduce.
- The AddItem methods could automatically generate a unique id by default.

# Development

## Dependencies
This library does not directly depend on anything. 
For building and testing it depends on
- Jasmine - for testing
- nyc - for code coverage
- eslint - for linting.
- eslint-plugin-spellcheck - for spelling.
- coveralls - for code coverage online report. This should not be necessary when
  building locally.
- webpack - for minifying and packaging the library.

## Building
Tests can be run with
- npm test 

with the 
- "npm_test_coverage" environment variable set to 1.
the tests will produce a coverage report.

If it is not set, the tests are simply run.

To test without coverage run
- npm run test_no_cov

To run the linting run
- npm run lint

To build run
- npm run build

