module.exports = {
    entry: './src/index.js',
    output: {
        path: './build',
        filename: 'redux-crud.js',
    },
    module: {
        loaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
        ],
    },
};
