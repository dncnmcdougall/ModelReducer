
const Model = require('./Model.js');

function Collection(name, child) {
    Model.call(this, name);

    this.collectedChild = child;
}

Collection.prototype = Object.create(Model.prototype);
Object.defineProperty(Collection.prototype, 'constructor', {
    value: Collection,
    enumerable: false,
    writable: true
});

Collection.prototype.isCollection = function() {
    return true;
};

Collection.prototype.isValidKey = function(key) {
    return key !== this.collectionKey
        && !(key in this.properties)
        && !(key in this.actions)
        && !(key in this.requests)
        && !(key in this.children);
};

Collection.prototype.keys = function(state) {
    return Object.keys(state)
        .filter( this.isValidKey.bind(this) );
};

Collection.prototype.length = function(state) {
    return this.keys(state).length;
};

Collection.prototype.largestKey = function(state) {
    let keys = this.keys(state);
    return keys.reduce( (acc, key) => {
        let val = Number.parseInt(key, 10);
        return Number.isNaN(val) ? acc : 
            ( acc === null? val: Math.max(acc, val));
    }, null);
};

Collection.prototype.smallestKey = function(state) {
    let keys = this.keys(state);
    return keys.reduce( (acc, key) => {
        let val = Number.parseInt(key, 10);
        return Number.isNaN(val) ? acc : 
            ( acc === null? val: Math.min(acc, val));
    }, null);
};

Collection.prototype.headState = function(state) {
    const keys = this.keys(state).sort();
    if ( keys.length > 0 ) {
        return state[keys[0]];
    } else {
        return null;
    }
};

Collection.prototype.tailState = function(state) {
    const keys = this.keys(state).sort();
    const l = keys.length;
    if ( l > 0 ) {
        return state[keys[l-1]];
    } else {
        return null;
    }
};

module.exports = Collection;
