[![Build Status](https://travis-ci.org/dncnmcdougall/ModelReducer.svg?branch=master)](https://travis-ci.org/dncnmcdougall/ModelReducer)
[![Coverage Status](https://coveralls.io/repos/github/dncnmcdougall/ModelReducer/badge.svg?branch=master)](https://coveralls.io/github/dncnmcdougall/ModelReducer?branch=master)


The simplicity of pure functions with the logic of structured objects.

# Description
ModelReducer is a library that tries to combine and maintain the simplicity of
pure functions with the logic and structure that objects allow.

In particular the goal is to allow programmers to simply impose a structure on
the state of their applications while still using a library like
[Redux](http://redux.js.org).

This is achived by creating models (conceptually classes) but they are not
instanced, rather their state is a part of the global state object. So state
management is still imutable and state manipulation is still done with pure
functions, however structural decomposition is handled by this library.

Each model then its own actions (which mutate the state) and requests (which
do calculations on the state). However the model will not recieve the global state
object, and does not have to deal with reintegrating the new state object with
the whole. Rather it will recive a state object that matches the model.

This means that the mutation functions can still be pure. While at the same time
a model's actions and requests do not need to deal with the global state object.
This simplifies writing the functions.

# Usage
This is a library that has no dependencies when not in development.

Installing

npm install https://github.com/dncnmcdougall/ModelReducer

## ToDo Example
```javascript
var ModelReducer = require('model-reducer') 

// Create a ToDo item.
var ToDoItemCreator = new ModelReducer.ModelCreator('ToDoItem');
ToDoItemCreator.setCollectionName('ToDoItems');

// Add some properties
ToDoItemCreator.addProperty('Description', 'string');
ToDoItemCreator.addProperty('Done', 'boolean');

// Set the state of this ToDo item to complete.
// An action does modifies (copies) the state and must return a state object.
// Note: that the ToDoItem recieves a ToDoItem state object. It does not know
// about the list.
ToDoItemCreator.addAction('Complete', function(state) {
    return Object.assign({}, state, { 'Done': true } );
});

var ToDoItem = ToDoItemCreator.finaliseModel();

// Create a ToDo list.
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
When using a reducer function a natural part of the process of deiling with the
global state is extracting the part of intertest, creating a mutated version and
reintegrating it. This is tedious and error prone.

This library aims to do that for you.

# Features
- Seperate models and state
- Pure actions and requests
- State validation agains a model
- Versioning


# Development

## Dependencies
This library does not directly depend on anything. 
For building and testing it depends on
- Jasmine - for testing
- Istanbul - for code coverage
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

