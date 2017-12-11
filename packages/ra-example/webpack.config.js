const path = require('path');

module.exports = {
    devtool: 'eval',
    entry: './app.js',
    output: {
        path: path.join(__dirname, 'static'),
        filename: 'bundle.js',
        publicPath: '/static/',
    },
    module: {
        loaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
            { test: /\.css$/, loader: 'style-loader!css-loader' },
        ],
    },
    resolve: {
        alias: {
            'react-admin': path.join(__dirname, '..', 'react-admin', 'src'),
            'ra-data-fakerest': path.join(
                __dirname,
                '..',
                'ra-data-fakerest',
                'src'
            ),
            'ra-input-rich-text': path.join(
                __dirname,
                '..',
                'ra-input-rich-text',
                'src'
            ),
        },
    },
};
