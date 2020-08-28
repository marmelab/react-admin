const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
    .BundleAnalyzerPlugin;

const packagesPath = [__dirname, '..', '..', 'packages'];

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
    ].concat(
        process.env.NODE_ENV === 'development'
            ? [new BundleAnalyzerPlugin()]
            : []
    ),
    resolve:
        process.env.USE_ALIAS === 'true'
            ? {
                  extensions: ['.ts', '.js', '.tsx', '.json'],
                  alias: {
                      'ra-core': path.join(...packagesPath, 'ra-core', 'src'),
                      'ra-language-french': path.join(
                          ...packagesPath,
                          'ra-language-french',
                          'src'
                      ),
                      'ra-language-english': path.join(
                          ...packagesPath,
                          'ra-language-english',
                          'src'
                      ),
                      'ra-ui-materialui': path.join(
                          ...packagesPath,
                          'ra-ui-materialui',
                          'src'
                      ),
                      'react-admin': path.join(
                          ...packagesPath,
                          'react-admin',
                          'src'
                      ),
                      'ra-data-fakerest': path.join(
                          ...packagesPath,
                          'ra-data-fakerest',
                          'src'
                      ),
                      'ra-i18n-polyglot': path.join(
                          ...packagesPath,
                          'ra-i18n-polyglot',
                          'src'
                      ),
                      'ra-input-rich-text': path.join(
                          ...packagesPath,
                          'ra-input-rich-text',
                          'src'
                      ),
                  },
              }
            : {},
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
