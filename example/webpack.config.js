const path = require('path');

module.exports = {
    devtool: 'eval',
    entry: './app.js',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/static/',
    },
    module: {
        loaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: 'babel' },
            { test: /\.css$/, loader: 'style!css' },
        ],
    },
    resolve: {
        alias: {
            'admin-on-rest': path.join(__dirname, '..', 'src'),
            quill: path.join(__dirname, 'node_modules/quill'),
        },
    },
};
