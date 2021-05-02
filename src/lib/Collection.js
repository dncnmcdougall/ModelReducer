
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

module.exports = Collection;
