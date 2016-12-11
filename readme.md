
Motivation
=
First some history:

History
==
This is my oppion on the history of programming. DISCLAMER: This is not
researched and is likly to be rather full of error. If you have corrections,
make a pull request.

Once long long ago, when the world was still young. Programming was born.
After some time of punching cards and later writing hex, people came up with a
higher level language so that they could "write" programs, rather than only
"coding" them. This is why we have text.
These initial programs consisted of a list of command which the computer should
execute. Let us call this procedural programming: you specify the procedure of
how to execute the task. 

Soon, as the desired complexity of programs increased, this way of programming
became cumbersom and hard to read and understand. The response to this was an
abstraction called "Object Orientation". This consists of creating things called
objects which represent a certian arraingment of data. The araingment give
meaning and helps the programmer write code at a higher conseptual levvel.
Coupled with the data it was common practie to add to the Object definition the
definitions of method which operate on the data. 
Practically this worked itself out with programmers defining objects then
creating instances of them. The methods are then bound to the data of an
instance. The methods can mutate and change the data inside an instance. 
Let us call the data in an instance the state. Then the instances of objects are
stateful. Object orientation works great as an absraction in many cases and is
extensively used.

Parallel to the development of Object Oriented programming was the development
of Functional programming. In functional programming instead of having an object
you have a function. A function is much like the a methd on an object except
that it does not have "state" associated with it. In functional programming not
only can you parse data to your functions, but you can parse other functions to
your functions. The main way of thinking here is not to represent the world as a
bunch of entities which you mutat, but rather as streams of data which you
process. This has been a particularly useful abstraction for problems which
require high throughput. However it can feel unnatural to think of the world in
this way, especially if you learned to program by thinking in object ( This is
the case for me, at least).

Enter Javascript. 
- JQuery
- Complex state stored accross different places.
- Hard to reason about
- Enter React
- Imutable
- Redux
- Procedural:
-- One giant switch

Enter <Enter name of library here> 


Names
=

ModelReducer
==
Is confused with the reduc form model reducer.

Shape
==
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

Delegator
==
https://github.com/lapanoid/redux-delegator

This is a module which makes composing reducers easy.
This "delegates" reducers.

- DelegatedShapeReducer 
- ModelDelegatedReducer
- ShapeDelegatedReducer


