const path =require('path');

const webConfig = {
    target: 'web',
    mode: 'production',
    output: {
        filename: 'model-reducer.umd.js',
        library: 'ModelReducer',
        libraryTarget: 'umd'
    }
};
const nodeConfig = {
    target: 'node',
    mode: 'production',
    output: {
        filename: 'model-reducer.node.js',
        library: 'ModelReducer',
        libraryTarget: 'umd'
    }
};

module.exports = [webConfig, nodeConfig];
