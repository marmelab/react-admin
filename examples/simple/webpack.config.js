const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
    .BundleAnalyzerPlugin;

module.exports = {
    entry: './src/index.tsx',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    devtool: 'cheap-module-source-map',
    resolve: {
        extensions: ['.ts', '.js', '.tsx', '.json'],
    },
    module: {
        rules: [
            {
                test: /\.(t|j)sx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        transpileOnly: true,
                    },
                },
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
            template: './index-webpack.html',
        }),
    ].concat(
        process.env.NODE_ENV === 'development'
            ? [new BundleAnalyzerPlugin()]
            : []
    ),
    devServer: {
        disableHostCheck: true,
        host: '127.0.0.1',
        port: 8080,
        stats: {
            children: false,
            chunks: false,
            modules: false,
        },
    },
};
