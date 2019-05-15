const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const IgnoreNotFoundExportPlugin = require('ignore-not-found-export-plugin');

module.exports = {
    devtool: 'cheap-module-source-map',
    module: {
        rules: [
            {
                test: /\.(t|j)sx?$/,
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
        // required because of https://github.com/babel/babel/issues/7640
        new IgnoreNotFoundExportPlugin([
            'CallbackSideEffect',
            'NotificationSideEffect',
            'RedirectionSideEffect',
            'RefreshSideEffect',
        ]),
    ],
    resolve: {
        extensions: ['.ts', '.js', '.tsx', '.json'],
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
            'ra-tree-core': path.join(
                __dirname,
                '..',
                '..',
                'packages',
                'ra-tree-core',
                'src'
            ),
            'ra-tree-ui-materialui': path.join(
                __dirname,
                '..',
                '..',
                'packages',
                'ra-tree-ui-materialui',
                'src'
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
