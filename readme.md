[![Build Status][travis-image]][travis-url]

# Usage
## Dependencies
This library does not directly depend on anything. 
For building and testing it depends on
- Jasmine - for testing
- Istanbul - for code coverage
- eslint - for linting.

Testing with coverage can be run with 
- npm test 
with the 
- "npm_test_coverage" environment variable set to 1.
If it is not set, the tests are simply run.

To test without coverage run
- npm run test_no_cov
To run the linting run
- npm run lint

## Examples
As yet I have not written an example. However the mock objects in the test
folder should serve in the interum. Start with the "mock_Parent"

# Motivation

First some history:

## History
This is my option on the history of programming. 
DISCLAMER: This is not researched and is likely to be rather full of error. If
you have corrections, make a pull request.

Once long long ago, when the world was still young. Programming was born.
After some time of punching cards and later writing hex, people came up with a
higher level language so that they could "write" programs, rather than only
"coding" them. This is why we have text.
These initial programs consisted of a list of command which the computer should
execute. Let us call this procedural programming: you specify the procedure of
how to execute the task. 

Soon, as the desired complexity of programs increased, this way of programming
became cumbersome and hard to read and understand. The response to this was an
abstraction called "Object Orientation". This consists of creating things called
objects which represent a tertian arraignment of data. The arraignment give
meaning and helps the programmer write code at a higher conceptual level.
Coupled with the data it was common practice to add to the Object definition the
definitions of method which operate on the data. 
Practically this worked itself out with programmers defining objects then
creating instances of them. The methods are then bound to the data of an
instance. The methods can mutate and change the data inside an instance. 
Let us call the data in an instance the state. Then the instances of objects are
stateful. Object orientation works great as an abstraction in many cases and is
extensively used.

Parallel to the development of Object Oriented programming was the development
of Functional programming. In functional programming instead of having an object
you have a function. A function is much like a method on an object except
that it does not have "state" associated with it. In functional programming not
only can you parse data to your functions, but you can parse other functions to
your functions. The main way of thinking here is not to represent the world as a
bunch of entities which you mutate, but rather as streams of data which you
process. This has been a particularly useful abstraction for problems which
require high throughput. However it can feel unnatural to think of the world in
this way, especially if you learned to program by thinking in object ( This is
the case for me, at least).

Enter Javascript. 
comment briefly on:
- JQuery: Easy to mutate DOM state.
  - Complex state stored across different places.
  - Hard to reason about
- Enter React:
  - Imutable
  - Redux
  - Procedural: One giant switch

Enter <Enter name of library here> 

This library allows for the creation of structured data, like classes. But makes
a clear distinction between the Model and the State. This means that you get
structured data, with easy to reason about state. It also makes it possible to
use immutable state without compromising on structures which look like classes.

# Names

This library could do with a better name than 'ModelReducer' (and model_reducer
in npm). Here are some ideas.

## ModelReducer
Is confused with the reducer form model reducer.

## Shape
The redux doc opens with a section declaring that the "State Shape" is
important.

- FormedReducer
- FormReducer
- Morphosis
- Dimorphous
- DimorphousReducer
- MorphicReducer
- ShapelyReducer
- ShapedReducer
- ShapeBasedReducer
- ShapeReducer
- Shaper (not really)
- StateShaper
- StateShapeBasedReducer (accurate)

## Delegator
https://github.com/lapanoid/redux-delegator

This is a module which makes composing reducers easy.
This "delegates" reducers.

- DelegatedShapeReducer 
- ModelDelegatedReducer
- ShapeDelegatedReducer


