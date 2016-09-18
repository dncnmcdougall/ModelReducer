/*eslint-env jasmine */

var StateValidator = require('../lib/StateValidator.js');

function MockChild()
{
    this.Properties = ['ChildProperty'];
    this.Actions = {
    };
    this.Requests = {};
    this.Children = {
    };

    this.getName = function() {return 'MockChild';};
}
MockChild.prototype = require('../lib/StateActions.js');

function MockChildArray()
{
    this.Properties = ['ChildProperty'];
    this.Actions = { };
    this.Requests = {};
    this.Children = { };

    this.getName = function() {return 'MockChildArray';};
    this.getIdField = function() { return 'id';};
}
MockChildArray.prototype = require('../lib/StateActions.js');

function MockParent()
{
    this.Properties = ['ParentProperty'];
    this.Actions = {
    };
    this.Requests = {};
    this.Children = {
        'MockChild': new MockChild(),
        'MockChildArray': new MockChildArray()
    };

    this.getName = function() {return 'MockParent';};
}
MockParent.prototype = require('../lib/StateActions.js');

var Parent = new MockParent();

describe('StateValidator', function () {

    it('Should return the state when everything is just right.', function() {
        var state = {
            'ParentProperty' : 1,
            'MockChild': {
                'ChildProperty': 1
            },
            'MockChildArrays': {
                '0': {
                    'id': 0,
                    'ChildProperty': 1
                }
            }
        };
        Object.freeze(state.MockChild);
        Object.freeze(state);
        var newState = StateValidator.validateState(Parent, 
            state);
        expect(newState.error).toBeNull();
        expect(newState.value).toEqual(state);
    });
    it('Should return error when there is an extra property', function() {
        var state = {
            'ParentProperty' : 1,
            'ExtraParentProperty' : 2,
            'MockChild': {
                'ChildProperty': 1
            },
            'MockChildArrays': {
                '0': {
                    'id': 0,
                    'ChildProperty': 1
                }
            }
        };
        Object.freeze(state.MockChild);
        Object.freeze(state);
        var newState = StateValidator.validateState(Parent, 
            state);
        expect(newState.error).not.toBeNull();
        //Expect error to be...
        expect(newState.value).toBeNull();
    });
    it('Should return error when the property is not populated', function(){
        var state = {
            'MockChild': {
                'ChildProperty': 1
            },
            'MockChildArrays': {
                '0': {
                    'id': 0,
                    'ChildProperty': 1
                }
            }
        };
        Object.freeze(state.MockChild);
        Object.freeze(state);
        var newState = StateValidator.validateState(Parent, 
            state);
        expect(newState.error).not.toBeNull();
        //Expect error to be...
        expect(newState.value).toBeNull();
    });
    it('Should return error when there is and extra child', function() {
        var state = {
            'ParentProperty' : 1,
            'MockChild': {
                'ChildProperty': 1
            },
            'ExtraChild': {
                'ChildProperty': 1
            },
            'MockChildArrays': {
                '0': {
                    'id': 0,
                    'ChildProperty': 1
                }
            }
        };
        Object.freeze(state.ExtraChild);
        Object.freeze(state.MockChild);
        Object.freeze(state);
        var newState = StateValidator.validateState(Parent, 
            state);
        expect(newState.error).not.toBeNull();
        //Expect error to be...
        expect(newState.value).toBeNull();
    });
    it('Should return error when the child is not populated', function() {
        var state = {
            'ParentProperty' : 1,
            'MockChildArrays': {
                '0': {
                    'id': 0,
                    'ChildProperty': 1
                }
            }
        };
        Object.freeze(state);
        var newState = StateValidator.validateState(Parent, 
            state);
        expect(newState.error).not.toBeNull();
        //Expect error to be...
        expect(newState.value).toBeNull();
    });
    it('Should return error when there is and extra child property', function(){
        var state = {
            'ParentProperty' : 1,
            'MockChild': {
                'ChildProperty': 1,
                'ExtraChildProperty' : 2
            },
            'MockChildArrays': {
                '0': {
                    'id': 0,
                    'ChildProperty': 1
                }
            }
        };
        Object.freeze(state.MockChild);
        Object.freeze(state);
        var newState = StateValidator.validateState(Parent, 
            state);
        expect(newState.error).not.toBeNull();
        //Expect error to be...
        expect(newState.value).toBeNull();
    });
    it('Should return error when the child property is not populated', function(){
        var state = {
            'ParentProperty' : 1,
            'MockChild': {
            },
            'MockChildArrays': {
                '0': {
                    'id': 0,
                    'ChildProperty': 1
                }
            }
        };
        Object.freeze(state.MockChild);
        Object.freeze(state);
        var newState = StateValidator.validateState(Parent, 
            state);
        expect(newState.error).not.toBeNull();
        //Expect error to be...
        expect(newState.value).toBeNull();
    });
    it('Should return error when the child collection is not populated', function() {
        var state = {
            'ParentProperty' : 1,
            'MockChild': {
                'ChildProperty': 1
            }
        };
        Object.freeze(state);
        var newState = StateValidator.validateState(Parent, 
            state);
        expect(newState.error).not.toBeNull();
        //Expect error to be...
        expect(newState.value).toBeNull();
    });
    it('Should return error when there is and extra child collection property', function(){
        var state = {
            'ParentProperty' : 1,
            'MockChild': {
                'ChildProperty': 1
            },
            'MockChildArrays': {
                '0': {
                    'id': 0,
                    'ChildProperty': 1,
                    'ExtraChildProperty' : 2
                }
            }
        };
        Object.freeze(state.MockChild);
        Object.freeze(state);
        var newState = StateValidator.validateState(Parent, 
            state);
        expect(newState.error).not.toBeNull();
        //Expect error to be...
        expect(newState.value).toBeNull();
    });
    it('Should return error when the child property is not populated', function(){
        var state = {
            'ParentProperty' : 1,
            'MockChild': {
                'ChildProperty': 1
            },
            'MockChildArrays': {
                '0': {
                    'id': 0
                }
            }
        };
        Object.freeze(state.MockChild);
        Object.freeze(state);
        var newState = StateValidator.validateState(Parent, 
            state);
        expect(newState.error).not.toBeNull();
        //Expect error to be...
        expect(newState.value).toBeNull();
    });
});
