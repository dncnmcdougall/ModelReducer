const path =require('path');

const webConfig = {
    target: 'web',
    mode: 'production',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'model-reducer.umd.js',
        library: 'ModelReducer',
        libraryTarget: 'umd'
    }
};
const nodeConfig = {
    target: 'node',
    mode: 'production',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'model-reducer.node.js',
        library: 'ModelReducer',
        libraryTarget: 'umd'
    }
};

module.exports = [webConfig, nodeConfig];
