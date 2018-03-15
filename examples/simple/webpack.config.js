const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    devtool: 'cheap-module-source-map',
    module: {
        rules: [
            { test: /\.js$/, exclude: /node_modules/, use: { loader: 'babel-loader' } },
            { test: /\.css$/, loader: 'style-loader!css-loader' },
            { test: /\.html$/, use: { loader: 'html-loader' } }
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: './index.html'
        })
    ],
    resolve: {
        alias: {
            'ra-core': path.join(
                __dirname,
                '..',
                '..',
                'packages',
                'ra-core',
                'src'
            ),
            'ra-ui-materialui': path.join(
                __dirname,
                '..',
                '..',
                'packages',
                'ra-ui-materialui',
                'src'
            ),
            'react-admin': path.join(
                __dirname,
                '..',
                '..',
                'packages',
                'react-admin',
                'src'
            ),
            'ra-data-fakerest': path.join(
                __dirname,
                '..',
                '..',
                'packages',
                'ra-data-fakerest',
                'src'
            ),
            'ra-input-rich-text': path.join(
                __dirname,
                '..',
                '..',
                'packages',
                'ra-input-rich-text',
                'src'
            ),
        },
    },
};
