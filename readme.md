[![Build Status](https://travis-ci.org/dncnmcdougall/ModelReducer.svg?branch=master)](https://travis-ci.org/dncnmcdougall/ModelReducer)
[![Coverage Status](https://coveralls.io/repos/github/dncnmcdougall/ModelReducer/badge.svg?branch=master)](https://coveralls.io/github/dncnmcdougall/ModelReducer?branch=master)

# Description
ModelReducer (name pending, see below and please propose ideas) is a library to
help structure your data inside a reducer function. It does this by allowing you
to create the structures you would with Object Oriented programming, while
retaining all the benefits of pure functional programming and immutable state.

In particular the goal is to allow programmers to simply impose a structure on
the state of their applications while still using a library like
[Redux](http://redux.js.org).

# Usage
This is a library that has no dependencies when not developing it.
As such it should be as simple as pulling the code somewhere useful and
requiring it.

## Examples
As yet I have not written an example. However the mock objects in the test
folder should serve in the interim. Start with the "mock_Parent"

## Development

### Dependencies
This library does not directly depend on anything. 
For building and testing it depends on
- Jasmine - for testing
- Istanbul - for code coverage
- eslint - for linting.
- coveralls - for code coverage online report. This should not be necessary when
  building locally.
- markdown-to-html - for viewing the documentation as html

### Building
Testing with coverage can be run with 
- npm test 

with the 
- "npm_test_coverage" environment variable set to 1.

If it is not set, the tests are simply run.

To test without coverage run
- npm run test_no_cov

To run the linting run
- npm run lint

# Motivation

First some history:

## History
This is an opinionated history of programming.
DISCLAMER: This is not researched and is likely to be rather full of error. If
you have corrections, make a pull request.

Once long long ago, when the world was still young, programming was born.
After some time of punching cards and later writing hex, people came up with a
higher level language so that they could "write" programs, rather than only
"coding" them. This is why we have text.
These initial programs consisted of a list of commands which the computer should
execute. Let us call this procedural programming: you specify the procedure of
how to execute the task. 

Soon, as the desired complexity of programs increased, this way of programming
became cumbersome, hard to read and difficult understand. The response to this
was an abstraction called "Object Orientation". This consists of creating things
called objects which represent a certain arraignment of data. The structure
gives meaning to the data and helps the programmer write code at a higher
conceptual level.  Coupled with the data stored in object it became common
practice to add to the Object definition the definitions of method which operate
on the data.  These methods operated on the data represented by the object.
This worked itself out with programmers defining objects then creating instances
of them. The methods then operate on the data in a particular instance. The
methods could mutate and change the data inside that instance.  Let us call the
data in an instance "state". Then the instances of objects are stateful in that
they have a state that can change. Arising from this the result of a method
depends on which instance it is called on, because the state of the sintance
might be different from another. Object orientation works great as an
abstraction in many cases and is extensively used.

Parallel to the development of Object Oriented programming was the development
of Functional programming. In functional programming instead of having an object
you have a function. A function is much like a method on an object except
that it does not have "state" associated with it. In functional programming not
only can you parse data to your functions, but you can parse other functions to
your functions. The main way of thinking here is not to represent the world as a
bunch of entities which you mutate, but rather as streams of data which you
process. This has been a particularly useful abstraction for problems which
require high throughput. However it can feel unnatural to think of the world in
this way, especially if you learned to program by thinking in object ( this is
the case for me, at least).

How does this pertain to a JavaScript library? JavaScript is a delightful (or
offensive) language that allows both Object orientation and functional
programming, if you are disciplined. It also excels at allowing you to make a
mess if you are not. JavaScript is currently at the core of web development
which makes it a very popular and widely used language. One of the consequences
of this is that it receives a lot of attention and a lot of practical innovation
happens in it. I have enjoyed watching the _status quo_ develop over the last
few years.

Here I will discuss web development as it pertains to the front-end development
of websites (there is a whole lot more to it, though). Building a website
consists of setting up the structure of the document in HTML while defining some
special behaviour in JavaScript. 

As websites became more popular so did JavaScript. More and more of a website's
behaviour was captured in JavaScript. Thus JavaScript was heavily used for
changing the HTML of a website depending on how the user interacted with it.
This is also called the DOM.
However this is a cumbersome process and so a library called JQuery emerged and
took the web-development community by storm. JQuery allows for the easy mutation
of the DOM, and that with a convenient syntax. This was great, it allowed
programmers to do more complicated things more eagerly. 

However with increased complexity comes bugs... The habit became to store the
state of the web application in the DOM or in some JavaScript data structure.
The art was then making sure that you were in the right state at all times.

Facebook, a distinctly popular and complicated website, became frustrated at
fixing and re-fixing a bug pertaining to user notifications. Their frustration
stemmed from the fact that their website was very complicated with lots of
different states needing to know about lots of others and some subtle confusion
happening somewhere in there. So they decided to fundamentally change the way
their application works. Later they open sourced the library that resulted from
this, namely [React](https://facebook.github.io/react/). 

React shifted the paradigm by allowing programmers to think of the DOM as a
renderer. You could push data to it and it would quickly re-render itself. This
allowed developers to think of the rendering in a functional sense, and helped
them collect the state of their application into one place. 

Shortly after this the movement of having you data immutable emerged. The idea
here is that you do not change data, rather you recreate it. The advantage of
this is that all your methods become pure functions without side effects, so
everything is easy to think about (the obvious cost is increased memory
usage). 

This shift proposed a new question: how do you manage your state? Where do you
put it? How do you get notified about changes? _et cetera_. The answer to this
was a design paradigm called Flux. The basic paradigm is a single direction of
data flow. You present data to the renderer which draws it, the user interacts
with it resulting in actions. These actions are then processed to update the
state which is then passed back to the view to be drawn.

This was great in concept and after several iterations a library called
[Redux](http://redux.js.org) emerged as the standard way to achieve this. Redux has an
underlying immutable data store. This stores the current and previous states of
the application. The state is changed by firing an action which gets passed to
the reducer. The reducer passes the current state and the name of the action to
user a user function which produces the new state of the previous one and the
action details. Redux also notified all listeners that the state has changed so
that they can update themselves, and it make undo and redo easy because the
whole history is stored.

This works great but with complex programs the reducer has to
do a lot of work to figure out what action to take. Moreover each action has to
figure out which parts of the state it is interested in and look only at
those. 

Facebook proposed [GraphQl](http://graphql.org) as a way to manage this
complexity, as well as a way to minimise how much data needs to be sent. For
this system to work you need the server that is providing the data to understand
GraphQl as well as making the client side code understand it. This is great for
large applications like Facebook. However for smaller applications the
complexity of directing actions and parsing data is still there.

This is where this library comes in. For smallish applications the reducer is
inclined to be one large switch statement. This is hard to read, maintain and
extend. Moreover every function that the reducer calls gets the state of the
whole application, even if it only cares about a small bit. Thus the programmer
has to keep in mind the state of the whole application even when writing very
simple updates.

The goal of this library is to take charge of the routing to functions in the
reducer as well as to strict only the relevant bits of the whole state and
parse them in to the user functions. This means that the programmer can think
about parts of their application in isolation without worrying about how this
affects other pieces of state. This should also make it easier to extend the
state of the application because they are not coupled.


## How does it work

This library works by allowing the user create "object definitions" (called
models) which have properties, methods and sub-objects. The methods are pure
functions and their first argument is the relevant subsection of the global
state and the expected result of the function is merely the new state of the
current model (not the whole state).  Thus the programmer can define a structure
to the state of the application in the same manner as one would in object
oriented programming, but the methods are all pure functions so there is no need
to worry about what state it is in or nasty unexpected side effects.

This library allows the global state to be passed to the root model along with
the specification of which action should be performed. The library then takes
care of finding that function and parsing it the relevant subsection of the
global state.  The relevant subsection will only be the state of the current
object, namely the values of its properties and children. The result of the
methods is merely the new state of this model, not the new global state.  This
result is then reconstructed into the new global state and returned. Thus the
programmer does not need to keep the whole structure in mind while writing
functions, only the structure of the relevant object. Additionally the
programmer does not need to worry about how the actions are routed.

Not only does this make the writing of specific actions easier to understand and
maintain, this way of doing things also makes the application more modular.
Because each action is only concerned with its model and the model's children, parent
and sibling models can easily be added removed or changed without any changes
necessary to this model.

The goal of this library is to present a paradigm for the building of reducers
which draws from our rich _ancient_ programming heratage while standing on the
sholders or recent developments. It utilises the single flow of data and the
simplicity of immutable data while levering the extensibility and abstraction of
object oriented programming.

## This libraries great failing

The whole motivation of this library is to work well with Redux. However I wrote
it without using Redux myself, only the concept, because I did not need it for
my small application. As such it differs in some important practical points from
Redux which means that this library needs extension before it can be used by
with Redux. 

The most pressing difference is the representation of actions. 
This library does that with a dotted string action name (works with Redux) and
then a list of arguments. Redux works with an object that contains the action
name and the arguments.

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


