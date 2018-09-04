const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

module.exports = {
    devtool: 'cheap-module-source-map',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: { loader: 'babel-loader' },
            },
            {
                test: /\.html$/,
                exclude: /node_modules/,
                use: { loader: 'html-loader' },
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
        }),
        new HardSourceWebpackPlugin(),
    ],
    resolve: {
        alias: {
            'ra-core': path.join(
                __dirname,
                '..',
                '..',
                'packages',
                'ra-core',
                'lib'
            ),
            'ra-ui-materialui': path.join(
                __dirname,
                '..',
                '..',
                'packages',
                'ra-ui-materialui',
                'lib'
            ),
            'react-admin': path.join(
                __dirname,
                '..',
                '..',
                'packages',
                'react-admin',
                'lib'
            ),
            'ra-data-fakerest': path.join(
                __dirname,
                '..',
                '..',
                'packages',
                'ra-data-fakerest',
                'lib'
            ),
            'ra-input-rich-text': path.join(
                __dirname,
                '..',
                '..',
                'packages',
                'ra-input-rich-text',
                'lib'
            ),
            'ra-tree-core': path.join(
                __dirname,
                '..',
                '..',
                'packages',
                'ra-tree-core',
                'lib'
            ),
            'ra-tree-ui-materialui': path.join(
                __dirname,
                '..',
                '..',
                'packages',
                'ra-tree-ui-materialui',
                'lib'
            ),
            'ra-tree-language-english': path.join(
                __dirname,
                '..',
                '..',
                'packages',
                'ra-tree-language-english'
            ),
            'ra-tree-language-french': path.join(
                __dirname,
                '..',
                '..',
                'packages',
                'ra-tree-language-french'
            ),
        },
    },
    devServer: {
        stats: {
            children: false,
            chunks: false,
            modules: false,
        },
    },
};
