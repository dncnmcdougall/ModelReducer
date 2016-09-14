function ModelReducer() {
    this.HelloWorld = "A Panther";
}

ModelReducer.prototype["fred"] = function() {
    console.log("Hello World");
};

module.exports = new ModelReducer();
