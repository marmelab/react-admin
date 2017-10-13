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
            'react-admin': path.join(__dirname, '..', 'packages/react-admin'),
            'ra-data-fakerest': path.join(
                __dirname,
                '..',
                'packages/ra-data-fakerest'
            ),
            'ra-language-french': path.join(
                __dirname,
                '..',
                'packages/ra-language-french'
            ),
        },
    },
};
