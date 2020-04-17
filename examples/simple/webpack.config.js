const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const IgnoreNotFoundExportPlugin = require('ignore-not-found-export-plugin');
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
        new HardSourceWebpackPlugin(),
        // required because of https://github.com/babel/babel/issues/7640
        new IgnoreNotFoundExportPlugin([
            'CallbackSideEffect',
            'ChoicesProps',
            'InputProps',
            'NotificationSideEffect',
            'OptionText',
            'OptionTextElement',
            'RedirectionSideEffect',
            'RefreshSideEffect',
            'AdminUIProps',
            'AdminContextProps',
            'AdminRouterProps',
            'ReferenceArrayProps',
            'ReferenceManyProps',
            'LinkToType',
            'FormContext',
            'UseReferenceProps',
            'SortProps',
            'PaginationProps',
        ]),
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
        stats: {
            children: false,
            chunks: false,
            modules: false,
        },
    },
};
